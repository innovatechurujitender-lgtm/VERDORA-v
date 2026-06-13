import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";

export default function Register() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      setTimeout(() => setLocation("/login"), 1500);
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

          <h1 className="text-xl sm:text-2xl font-black text-center text-foreground mb-1">Create Buyer Account</h1>
          <p className="text-center text-muted-foreground text-xs sm:text-sm mb-6">
            Join India's freshest B2B marketplace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  data-testid="input-name"
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Business Name</label>
                <input
                  type="text"
                  required
                  value={form.business}
                  onChange={e => setForm(f => ({ ...f, business: e.target.value }))}
                  placeholder="Company / Farm"
                  data-testid="input-business"
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
                data-testid="input-email"
                className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center justify-center px-3 bg-secondary/50 border border-border rounded-xl text-sm text-muted-foreground min-w-12.5">+91</span>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="10-digit mobile number"
                  data-testid="input-phone"
                  className="flex-1 bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  data-testid="input-password"
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

            <Button
              type="submit"
              disabled={loading}
              data-testid="button-register"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(50,205,50,0.25)] mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : "Create Buyer Account"}
            </Button>
            {message && (
              <div className="mt-3 p-3 rounded-xl text-sm bg-primary/10 border border-primary/20 text-foreground text-center">
                {message}
              </div>
            )}
          </form>

          <div className="mt-5 pt-5 border-t border-border space-y-3 text-center">
            <Link href="/supplier-register">
              <Button
                variant="outline"
                className="w-full gap-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground h-11 rounded-xl"
              >
                <User className="w-4 h-4" />
                Register as Supplier
              </Button>
            </Link>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-emerald-400 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
