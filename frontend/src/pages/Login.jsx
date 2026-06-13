import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(form.email, form.password);
      const redirect = user.role === "admin" ? "/admin" : user.role === "supplier" ? "/seller/dashboard" : "/";
      setLocation(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(50,205,50,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(50,205,50,0.06),transparent_45%)]" />

      {/* Back to home */}
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
        {/* Card */}
        <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <img src={logoPath} alt="VERDORA" className="h-12 w-12 sm:h-16 sm:w-16 object-contain" />
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-linear-to-br from-primary to-emerald-400 bg-clip-text text-transparent">
                VERDORA
              </span>
            </Link>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-center text-foreground mb-1">Welcome back</h1>
          <p className="text-center text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8">
            Sign in to your VERDORA account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
                data-testid="input-email"
                className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-primary hover:text-emerald-400 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  data-testid="input-password"
                  className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-3 pr-11 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
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
              data-testid="button-login"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(50,205,50,0.25)] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </Button>
            {error && (
              <div className="mt-3 p-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-600 text-center">
                {error}
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-emerald-400 font-semibold transition-colors">
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to VERDORA's{" "}
              <span className="text-primary cursor-pointer hover:underline">Terms</span> &{" "}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
