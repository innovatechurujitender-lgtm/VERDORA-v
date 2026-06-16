import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { emailLogin, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState(() => localStorage.getItem("verdora_email") || "");
  const [password, setPassword] = useState(() => localStorage.getItem("verdora_password") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirect = user.role === "admin" ? "/admin" : user.role === "seller" ? "/seller/dashboard" : "/";
      setLocation(redirect);
    }
  }, [isAuthenticated, user, setLocation]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError("Enter email and password"); return; }
    setLoading(true);
    setError("");
    try {
      const userData = await emailLogin(email, password);
      const redirect = userData.role === "admin" ? "/admin" : userData.role === "seller" ? "/seller/dashboard" : "/";
      setLocation(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="flex gap-2">
                <Mail className="w-5 h-5 text-muted-foreground mt-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="flex gap-2">
                <Lock className="w-5 h-5 text-muted-foreground mt-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-3 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(50,205,50,0.25)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-emerald-400 font-semibold transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
