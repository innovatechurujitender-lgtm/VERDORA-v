import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { MapPin, User, Phone, CreditCard, ArrowLeft, ShoppingBag, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { safeFetch } from "@/lib/safeFetch";

export default function Checkout() {
  const { cartItems, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: user?.name || "", phone: "", location: "" });
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [upiInfo, setUpiInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiRef, setUpiRef] = useState("");
  const [countdown, setCountdown] = useState(0);

  const computedTotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace("₹", "") || 0);
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (paymentMethod === "UPI" && computedTotal > 0) {
      safeFetch(`/api/payment/upi-info?amount=${computedTotal}&name=${encodeURIComponent(form.name || "Verdora")}`)
        .then(({ data }) => { if (data) { setUpiInfo(data); setCountdown(30); } });
    }
  }, [paymentMethod, computedTotal, form.name]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function createOrder(paymentStatus) {
    const { ok, data } = await safeFetch("/api/orders/create", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user?.id, items: cartItems, total: computedTotal,
        name: form.name, phone: form.phone, location: form.location,
        payment_method: paymentMethod, payment_status: paymentStatus,
        upi_ref: paymentMethod === "UPI" ? upiRef : "",
      }),
    });
    if (!ok || !data) throw new Error("Server is starting up. Please try again.");
    return data;
  }

  async function handlePlaceOrder() {
    if (!form.name) { setMessage("Please enter your name"); return; }
    if (cartItems.length === 0) { setMessage("Cart is empty"); return; }
    setProcessing(true);
    setMessage("");

    try {
      if (paymentMethod === "UPI") {
        setUpiInfo(null);
        setTimeout(() => {
          safeFetch(`/api/payment/upi-info?amount=${computedTotal}&name=${encodeURIComponent(form.name)}`)
            .then(({ data }) => { if (data) setUpiInfo(data); });
        }, 100);
        setPaid(false);
        setProcessing(false);
        return;
      }

      const orderData = await createOrder("pending");
      if (orderData.error) throw new Error(orderData.error);
      setMessage(`Order placed successfully! Order #${orderData.orderId?.slice(0, 8)}`);
      clearCart();
      setTimeout(() => setLocation("/profile"), 2000);
    } catch (err) {
      setMessage(err.message || "Something went wrong");
    }
    setProcessing(false);
  }

  async function handlePaymentDone() {
    if (!upiRef.trim()) { setMessage("Enter UPI transaction reference number"); return; }
    setProcessing(true);
    const orderData = await createOrder("paid");
    if (orderData.error) { setMessage(orderData.error); setProcessing(false); return; }
    setMessage("Payment received! Order confirmed.");
    clearCart();
    setPaid(true);
    setProcessing(false);
    setTimeout(() => setLocation("/profile"), 2000);
  }

  async function handleCopyUpi() {
    if (upiInfo?.upi_id) {
      await navigator.clipboard.writeText(upiInfo.upi_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (cartItems.length === 0 && !message.includes("Order") && !message.includes("Payment")) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar cartCount={0} />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2">Cart is empty</h2>
            <Link href="/"><Button className="mt-4">Shop Now</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar cartCount={cartItems.length > 0 ? cartCount : 0} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Checkout</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mb-6">Checkout</h1>

          <div className="grid gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Delivery Details</h2>
              <div className="space-y-4">
                <div><label className="text-xs font-medium text-foreground mb-1 block">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="Your name" /></div>
                <div><label className="text-xs font-medium text-foreground mb-1 block">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="Phone number" /></div>
                <div><label className="text-xs font-medium text-foreground mb-1 block">Delivery Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="City, address" /></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Payment Method</h2>
              <div className="flex gap-3">
                {["UPI", "COD"].map(m => (
                  <button key={m} onClick={() => { setPaymentMethod(m); setUpiInfo(null); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${paymentMethod === m ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 text-muted-foreground border-border hover:border-primary"}`}>{m}</button>
                ))}
              </div>
              {paymentMethod === "UPI" && <p className="text-xs text-muted-foreground mt-2">Scan QR code and pay via any UPI app (Google Pay, PhonePe, Paytm)</p>}
            </motion.div>

            {paymentMethod === "UPI" && upiInfo && !paid && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-6 text-center">
                <h2 className="font-bold mb-4">Scan & Pay</h2>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-3 rounded-2xl border-2 border-primary/20 shadow-lg">
                    <img src={upiInfo.qr_url} alt="UPI QR Code" className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl" />
                  </div>
                </div>
                <p className="text-2xl font-black text-primary mb-1">₹{computedTotal.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground mb-4">Scan with any UPI app to pay</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm font-mono bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">{upiInfo.upi_id}</span>
                  <button onClick={handleCopyUpi} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-primary transition-colors">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <a href={upiInfo.upi_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" /> Pay via UPI App
                    </Button>
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">After payment, enter transaction reference and confirm</p>
                  <input value={upiRef} onChange={e => setUpiRef(e.target.value)} placeholder="UPI Transaction Reference ID" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary mb-3" />
                  <Button onClick={handlePaymentDone} disabled={processing || countdown > 0} variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-bold">
                    {countdown > 0 ? `Wait ${countdown}s` : processing ? "Confirming..." : "I've Paid - Confirm Order"}
                  </Button>
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-black text-primary">₹{computedTotal.toFixed(0)}</span>
              </div>
            </motion.div>

            {message && (
              <div className={`p-4 rounded-xl text-sm text-center font-medium ${message.includes("success") || message.includes("confirmed") || message.includes("received") ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                {message}
              </div>
            )}

            {paymentMethod === "COD" && (
              <Button onClick={handlePlaceOrder} disabled={processing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-lg rounded-xl shadow-[0_0_20px_rgba(50,205,50,0.25)]">
                {processing ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</span> : `Place Order (₹${computedTotal.toFixed(0)})`}
              </Button>
            )}

            <Link href="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
