import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function SupplierRegister() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const canvasRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    location: "",
    pincode: "",
    captchaInput: "",
  });

  useEffect(() => {
    drawCaptcha();
  }, [captcha]);

  function drawCaptcha() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 140;
    canvas.height = 50;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(50, 205, 50, ${0.2 + Math.random() * 0.3})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.stroke();
    }

    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < captcha.length; i++) {
      const angle = (Math.random() - 0.5) * 0.4;
      const colors = ["#32cd32", "#ffd700", "#ff6347", "#00ced1", "#ff69b4"];
      ctx.fillStyle = colors[i % colors.length];
      ctx.save();
      ctx.translate(20 + i * 24, 28);
      ctx.rotate(angle);
      ctx.fillText(captcha[i], 0, 0);
      ctx.restore();
    }
  }

  function refreshCaptcha() {
    setCaptcha(generateCaptcha());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.captchaInput !== captcha) {
      alert("Captcha does not match. Please try again.");
      refreshCaptcha();
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/register-supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          mobile: form.mobile,
          location: form.location,
          pincode: form.pincode
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(50,205,50,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(50,205,50,0.06),transparent_45%)]" />

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <img src={logoPath} alt="verdora" className="h-10 w-10 sm:h-14 sm:w-14 object-contain" />
              <span className="text-lg sm:text-xl font-black tracking-tight bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                VERDORA
              </span>
            </Link>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-center text-foreground mb-1">Create Supplier Account</h1>
          <p className="text-center text-muted-foreground text-xs sm:text-sm mb-6">
            Register as a Farmer / Trader / Wholesaler
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
                className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Mobile Number</label>
              <div className="flex gap-2">
                <span className="flex items-center justify-center px-3 bg-secondary/50 border border-border rounded-xl text-sm text-muted-foreground min-w-12.5">+91</span>
                <input
                  type="tel"
                  required
                  value={form.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                  placeholder="10-digit mobile number"
                  className="flex-1 bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Location</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="City / District"
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Pin Code</label>
                <input
                  type="text"
                  required
                  value={form.pincode}
                  onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 pr-11 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Re-enter password"
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 pr-11 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Enter Captcha</label>
              <div className="flex items-center gap-3 mb-2">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg border border-border"
                  width="140"
                  height="50"
                />
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-primary transition-colors"
                  title="Refresh captcha"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                required
                value={form.captchaInput}
                onChange={e => setForm(f => ({ ...f, captchaInput: e.target.value }))}
                placeholder="Enter the code above"
                className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(50,205,50,0.25)] mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : "Create Supplier Account"}
            </Button>
            {message && (
              <div className="mt-3 p-3 rounded-xl text-sm bg-primary/10 border border-primary/20 text-foreground text-center">
                {message}
              </div>
            )}
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-emerald-400 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Want to buy?{" "}
              <Link href="/register" className="text-primary hover:text-emerald-400 font-semibold transition-colors">
                Create Buyer Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
