const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const { supabase } = require("./lib/supabase");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: [
    "https://frontend-gamma-sandy-72.vercel.app",
    /\.vercel\.app$/,
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "userid", "seller_id"],
}));

const PUBLIC_DIR = path.join(__dirname, "public");
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
}

const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const PORT = process.env.PORT || 5000;

/* ==================== EMAIL OTP (Supabase DB) ==================== */

async function sendEmailViaBrevo({ to, subject, html }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Verdora", email: "verdora30@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

/* ========================= HEALTH ========================= */

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Verdora Server is running", database: "supabase" });
});

/* ========================= AUTH ========================= */

app.post("/api/auth/register", async (req, res) => {
  const { firebase_uid, name, phone, business, location } = req.body;
  if (!firebase_uid || !name || !phone) return res.status(400).json({ error: "Missing required fields" });

  try {
    const { data: existing } = await supabase.from("users").select("id").eq("firebase_uid", firebase_uid).maybeSingle();
    if (existing) return res.status(409).json({ error: "An account with this phone already exists" });

    const { data: adminCheck } = await supabase.from("users").select("id").eq("role", "admin").limit(1).maybeSingle();
    const role = adminCheck ? "buyer" : "admin";

    const { data, error } = await supabase.from("users").insert({
      firebase_uid, name, phone,
      role, status: "approved",
      business: business || "", location: location || "",
      profile_picture: "",
    }).select().single();

    if (error) throw error;
    const msg = role === "admin" ? "Admin account created! You are the first admin." : "Account created successfully! You can now log in.";
    res.json({ message: msg, userId: data.id });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/register-supplier", async (req, res) => {
  const { firebase_uid, name, mobile, location, pincode } = req.body;
  if (!firebase_uid || !name || !mobile) return res.status(400).json({ error: "Missing required fields" });

  try {
    const { data: existing } = await supabase.from("users").select("id").eq("firebase_uid", firebase_uid).maybeSingle();
    if (existing) return res.status(409).json({ error: "An account with this phone already exists" });

    const { data, error } = await supabase.from("users").insert({
      firebase_uid, name, mobile,
      role: "seller", status: "pending",
      location: location || "", pincode: pincode || "",
    }).select().single();

    if (error) throw error;
    res.json({ message: "Registration submitted. Your account is pending admin approval.", userId: data.id });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { firebase_uid } = req.body;
  if (!firebase_uid) return res.status(400).json({ error: "Missing firebase_uid" });

  try {
    const { data: userData, error } = await supabase.from("users").select("*").eq("firebase_uid", firebase_uid).maybeSingle();
    if (error || !userData) return res.status(404).json({ error: "User not found. Please register first." });

    if (userData.status === "pending") return res.status(403).json({ error: "Your account is pending admin approval.", status: "pending" });
    if (userData.status === "rejected") return res.status(403).json({ error: "Your registration was rejected. Please contact support.", status: "rejected" });
    if (userData.status === "banned") return res.status(403).json({ error: "Your account has been banned. Contact support.", status: "banned" });

    res.json({
      id: userData.id, firebase_uid: userData.firebase_uid,
      name: userData.name, phone: userData.phone || userData.mobile,
      email: userData.email || "", role: userData.role,
      status: userData.status, profile_picture: userData.profile_picture || "",
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* ===================== EMAIL AUTH ===================== */

app.post("/api/auth/email/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  try {
    const { data: existing } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase.from("email_otps").delete().eq("email", email);
    const { error: insertError } = await supabase.from("email_otps").insert({
      email, otp, is_verified: false, expires_at: expiresAt
    });
    if (insertError) throw insertError;

    await sendEmailViaBrevo({
      to: email,
      subject: "Your VERDORA verification code",
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;background:#ffffff;border:1px solid #e0e0e0;border-radius:12px">
        <div style="text-align:center;margin-bottom:20px">
          <span style="font-size:24px;font-weight:900;color:#2ecc71">VERDORA</span>
          <p style="color:#666;font-size:12px;margin:4px 0 0">Email Verification</p>
        </div>
        <p style="color:#333;font-size:14px">Use this code to verify your email address:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#2ecc71;text-align:center;padding:24px;background:#f0fdf4;border-radius:8px;margin:16px 0;font-family:monospace">${otp}</div>
        <p style="color:#888;font-size:12px;text-align:center">This code expires in 10 minutes.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
        <p style="color:#aaa;font-size:11px;text-align:center">Verdora — India's fresh B2B marketplace</p>
      </div>`,
    });
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP error:", err.message);
    res.status(500).json({ error: "Failed to send email. Check Brevo configuration." });
  }
});

app.post("/api/auth/email/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  try {
    const { data: stored, error: fetchError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .eq("is_verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !stored) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date(stored.expires_at) < new Date()) {
      await supabase.from("email_otps").delete().eq("id", stored.id);
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    await supabase.from("email_otps").update({ is_verified: true }).eq("id", stored.id);
    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.post("/api/auth/email/create-seller-account", async (req, res) => {
  const { email, password, name, location, pincode } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: "All fields required" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

  try {
    const { data: otpRecord } = await supabase
      .from("email_otps")
      .select("id")
      .eq("email", email)
      .eq("is_verified", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpRecord) return res.status(400).json({ error: "Please verify OTP first" });

    const { data: existing } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from("users").insert({
      email, name, password_hash: hashedPassword,
      role: "seller", status: "pending",
      mobile: "", location: location || "", pincode: pincode || "",
      profile_picture: "",
    }).select().single();

    if (error) throw error;
    await supabase.from("email_otps").delete().eq("email", email);
    res.json({ message: "Registration submitted. Your account is pending admin approval.", userId: data.id });
  } catch (err) {
    res.status(500).json({ error: "Account creation failed" });
  }
});

app.post("/api/auth/email/create-account", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: "All fields required" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

  try {
    const { data: otpRecord } = await supabase
      .from("email_otps")
      .select("id")
      .eq("email", email)
      .eq("is_verified", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpRecord) return res.status(400).json({ error: "Please verify OTP first" });

    const { data: existing } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const { data: adminCheck } = await supabase.from("users").select("id").eq("role", "admin").limit(1).maybeSingle();
    const role = adminCheck ? "buyer" : "admin";

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from("users").insert({
      email, name, password_hash: hashedPassword,
      role, status: "approved",
      phone: "", profile_picture: "",
    }).select().single();

    if (error) throw error;
    await supabase.from("email_otps").delete().eq("email", email);
    res.json({ message: "Account created! You can now login.", userId: data.id });
  } catch (err) {
    res.status(500).json({ error: "Account creation failed" });
  }
});

app.post("/api/auth/email/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const { data: userData, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
    if (error || !userData) return res.status(404).json({ error: "No account with this email" });

    if (!userData.password_hash) return res.status(400).json({ error: "This account uses phone login. Use phone OTP instead." });

    const valid = await bcrypt.compare(password, userData.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    if (userData.status === "pending") return res.status(403).json({ error: "Account pending admin approval." });
    if (userData.status === "rejected") return res.status(403).json({ error: "Registration was rejected." });
    if (userData.status === "banned") return res.status(403).json({ error: "Your account has been banned. Contact support." });

    res.json({
      id: userData.id, email: userData.email,
      name: userData.name, role: userData.role,
      status: userData.status, profile_picture: userData.profile_picture || "",
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* ========================= ADMIN ========================= */

async function verifyAdmin(userid) {
  if (!userid) return false;
  try {
    const { data } = await supabase.from("users").select("role").eq("id", userid).maybeSingle();
    return data?.role === "admin";
  } catch {
    return false;
  }
}

app.get("/api/admin/users", async (req, res) => {
  const { userid } = req.headers;
  if (!(await verifyAdmin(userid))) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/admin/users/:id/approve", async (req, res) => {
  const { userid } = req.headers;
  if (!(await verifyAdmin(userid))) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { error } = await supabase.from("users").update({ status: "approved" }).eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "User approved successfully" });
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/admin/users/:id/reject", async (req, res) => {
  const { userid } = req.headers;
  if (!(await verifyAdmin(userid))) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { error } = await supabase.from("users").update({ status: "rejected" }).eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "User rejected" });
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/admin/users/:id/ban", async (req, res) => {
  const { userid } = req.headers;
  if (!(await verifyAdmin(userid))) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { error } = await supabase.from("users").update({ status: "banned" }).eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "User banned" });
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/admin/users/:id/unban", async (req, res) => {
  const { userid } = req.headers;
  if (!(await verifyAdmin(userid))) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { error } = await supabase.from("users").update({ status: "approved" }).eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "User unbanned" });
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

/* ======================= PROFILE ======================= */

app.get("/api/profile", async (req, res) => {
  const { userid } = req.headers;
  if (!userid) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userid).maybeSingle();
    if (error || !data) return res.status(404).json({ error: "User not found" });
    res.json({ id: data.id, ...data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.post("/api/profile/update", async (req, res) => {
  const { userid, name, phone, address, location } = req.body;
  if (!userid) return res.status(401).json({ error: "Unauthorized" });

  try {
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (location) updates.location = location;

    const { error } = await supabase.from("users").update(updates).eq("id", userid);
    if (error) throw error;

    const { data } = await supabase.from("users").select("*").eq("id", userid).single();
    res.json({ id: data.id, ...data });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.post("/api/profile/photo", upload.single("photo"), async (req, res) => {
  const { userid } = req.body;
  if (!userid || !req.file) return res.status(400).json({ error: "Missing userid or file" });

  try {
    const photoUrl = `/uploads/${req.file.filename}`;
    const { error } = await supabase.from("users").update({ profile_picture: photoUrl }).eq("id", userid);
    if (error) throw error;
    res.json({ id: userid, profile_picture: photoUrl });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ===================== SELLER PRODUCTS ===================== */

app.post("/api/seller/products", upload.single("image"), async (req, res) => {
  const { seller_id, name, description, price_per_kg, location, latitude, longitude, daily_stock, category, contact_phone, freshness } = req.body;
  if (!seller_id || !name || !price_per_kg) return res.status(400).json({ error: "seller_id, name, and price_per_kg are required" });

  try {
    const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || "");
    const { data, error } = await supabase.from("seller_products").insert({
      seller_id, name, description: description || "",
      price_per_kg: parseFloat(price_per_kg), image,
      location: location || "", latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      daily_stock: parseInt(daily_stock) || 0,
      category: category || "Vegetables", contact_phone: contact_phone || "",
      freshness: freshness || "Fresh", status: "active",
    }).select().single();

    if (error) throw error;
    res.json({ message: "Product listed successfully!", productId: data.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create product", details: err.message });
  }
});

app.get("/api/seller/products", async (req, res) => {
  const { seller_id } = req.query;
  if (!seller_id) return res.status(400).json({ error: "seller_id required" });

  try {
    const { data, error } = await supabase.from("seller_products").select("*").eq("seller_id", seller_id).order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.delete("/api/seller/products/:id", async (req, res) => {
  const { seller_id } = req.headers;
  if (!seller_id) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data: product } = await supabase.from("seller_products").select("seller_id").eq("id", req.params.id).maybeSingle();
    if (!product || product.seller_id !== seller_id) return res.status(404).json({ error: "Product not found" });

    const { error } = await supabase.from("seller_products").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.put("/api/seller/products/:id", upload.single("image"), async (req, res) => {
  const { seller_id, name, description, price_per_kg, location, latitude, longitude, daily_stock, category, contact_phone, freshness } = req.body;
  if (!seller_id) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data: existing } = await supabase.from("seller_products").select("seller_id").eq("id", req.params.id).maybeSingle();
    if (!existing || existing.seller_id !== seller_id) return res.status(404).json({ error: "Product not found" });

    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price_per_kg) updates.price_per_kg = parseFloat(price_per_kg);
    if (location !== undefined) updates.location = location;
    if (latitude) updates.latitude = parseFloat(latitude);
    if (longitude) updates.longitude = parseFloat(longitude);
    if (daily_stock !== undefined) updates.daily_stock = parseInt(daily_stock);
    if (category) updates.category = category;
    if (contact_phone !== undefined) updates.contact_phone = contact_phone;
    if (freshness) updates.freshness = freshness;
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const { data, error } = await supabase.from("seller_products").update(updates).eq("id", req.params.id).select().single();
    if (error) throw error;
    res.json({ message: "Product updated!", product: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
});

app.get("/api/marketplace/products", async (req, res) => {
  const { category } = req.query;

  try {
    let query = supabase.from("seller_products").select("*, users!seller_id(name, location, profile_picture)").eq("status", "active");
    if (category && category !== "All") query = query.eq("category", category);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    const list = (data || []).map(p => ({
      ...p,
      seller: p.users ? { name: p.users.name, location: p.users.location, profile_picture: p.users.profile_picture } : null,
      users: undefined,
    }));
    res.json(list);
  } catch (err) {
    console.error("Marketplace products error:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/marketplace/products/:id", async (req, res) => {
  try {
    const { data, error } = await supabase.from("seller_products").select("*, users!seller_id(name, location, profile_picture, phone, mobile)").eq("id", req.params.id).maybeSingle();
    if (error || !data) return res.status(404).json({ error: "Product not found" });

    res.json({
      id: data.id,
      ...data,
      seller: data.users ? { name: data.users.name, location: data.users.location, profile_picture: data.users.profile_picture, phone: data.users.phone, mobile: data.users.mobile } : null,
      users: undefined,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/* ===================== ORDERS & PAYMENT ===================== */

app.get("/api/payment/upi-info", async (req, res) => {
  const { amount, name } = req.query;
  let UPI_ID = process.env.UPI_ID || "jitender@upi";
  UPI_ID = UPI_ID.replace(/^\/+/, "").replace(/^\\+/, "");
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Verdora&am=${amount || "0"}&cu=INR&tn=${encodeURIComponent("Payment to Verdora" + (name ? " - " + name : ""))}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(upiLink, {
      width: 300,
      margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
      errorCorrectionLevel: "M"
    });
    res.json({ upi_id: UPI_ID, upi_link: upiLink, qr_url: qrDataUrl });
  } catch (err) {
    res.json({ upi_id: UPI_ID, upi_link: upiLink, qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}` });
  }
});

app.post("/api/orders/create", async (req, res) => {
  const { user_id, items, total, name, phone, location, payment_method, payment_status, upi_ref } = req.body;
  if (!user_id || !items || !total || !name) return res.status(400).json({ error: "Missing required fields" });

  try {
    const { data, error } = await supabase.from("orders").insert({
      user_id, items: JSON.stringify(items), total: parseFloat(total),
      name, phone: phone || "", location: location || "",
      payment_method: payment_method || "UPI",
      payment_status: payment_status || "pending",
      status: "confirmed",
      transaction_id: upi_ref || "",
    }).select().single();

    if (error) throw error;

    for (const item of items) {
      if (item.id && item.quantity) {
        const { data: product } = await supabase.from("seller_products").select("daily_stock").eq("id", item.id).maybeSingle();
        if (product) {
          const newStock = Math.max(product.daily_stock - item.quantity, 0);
          await supabase.from("seller_products").update({ daily_stock: newStock }).eq("id", item.id);
        }
      }
    }

    res.json({ message: "Order placed successfully!", orderId: data.id });
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.get("/api/orders/user", async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "user_id required" });

  try {
    const { data, error } = await supabase.from("orders").select("*").eq("user_id", user_id).order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("*", (req, res) => {
  const indexPath = path.join(PUBLIC_DIR, "index.html");
  if (fs.existsSync(indexPath) && !req.path.startsWith("/api")) res.sendFile(indexPath);
  else if (!req.path.startsWith("/api")) res.status(200).json({ message: "Verdora API is running. Frontend not built yet." });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(` Verdora Server running on port ${PORT}`));
}

module.exports = app;
