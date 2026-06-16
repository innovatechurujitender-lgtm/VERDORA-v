import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, KeyRound, Lock, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";
import { safeFetch } from "@/lib/safeFetch";

export default function SellerRegister() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [locationText, setLocationText] = useState("");
  const [pincode, setPincode] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function sendOtp() {
    if (!email) { setMessage("Enter your email"); return; }
    setLoading(true);
    setMessage(null);
    try {
      const { ok, data } = await safeFetch("/api/auth/email/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!ok || !data) throw new Error("Server is starting up. Please try again.");
      if (data.error) throw new Error(data.error);
      setStep("otp");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp) { setMessage("Enter the OTP"); return; }
    setLoading(true);
    setMessage(null);
    try {
      const { ok, data } = await safeFetch("/api/auth/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      if (!ok || !data) throw new Error("Server is starting up. Please try again.");
      if (data.error) throw new Error(data.error);
      getLocation();
      setStep("details");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getLocation() {
    if (!navigator.geolocation) { setLocationText("Location unavailable"); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          const addr = data.address;
          const parts = [addr.city || addr.town || addr.village || addr.county, addr.state].filter(Boolean);
          setLocationText(parts.join(", "));
        } catch {
          setLocationText(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
        setLocationLoading(false);
      },
      () => { setLocationText("Location permission denied"); setLocationLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !password) { setMessage("Name and password required"); return; }
    if (password.length < 6) { setMessage("Password must be at least 6 characters"); return; }
    if (!pincode) { setMessage("Pincode required"); return; }
    setLoading(true);
    setMessage(null);
    try {
      const { ok, data } = await safeFetch("/api/auth/email/create-seller-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, location: locationText, pincode })
      });
      if (!ok || !data) throw new Error("Server is starting up. Please try again.");
      if (data.error) throw new Error(data.error);
      setMessage(data.message);
      setTimeout(() => setLocation("/login"), 2000);
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

          <h1 className="text-xl sm:text-2xl font-black text-center text-foreground mb-1">Register as Seller</h1>
          <p className="text-center text-muted-foreground text-xs sm:text-sm mb-6">
            List your farm produce on VERDORA
          </p>

          {step === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
                <div className="flex gap-2">
                  <Mail className="w-5 h-5 text-muted-foreground mt-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(50,205,50,0.25)] mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Send OTP
                  </span>
                )}
              </Button>
            </div>
          ) : step === "otp" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Enter OTP</label>
                <p className="text-xs text-muted-foreground mb-3">OTP sent to {email}</p>
                <div className="flex gap-2">
                  <KeyRound className="w-5 h-5 text-muted-foreground mt-3" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit OTP"
                    className="flex-1 bg-secondary/50 border border-border focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { setStep("email"); setOtp(""); setMessage(null); }} variant="outline" className="flex-1 h-12 rounded-xl">Change</Button>
                <Button onClick={verifyOtp} disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(50,205,50,0.25)]">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : "Verify OTP"}
                </Button>
              </div>
              <button onClick={sendOtp} className="w-full text-xs text-primary hover:text-emerald-400 mt-1 transition-colors">Resend OTP</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                <input type="email" value={email} disabled className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2.5 outline-none text-foreground text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Password (min 6 characters)</label>
                <div className="flex gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground mt-3" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="flex-1 bg-secondary/50 border border-border focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Location</label>
                <div className="flex gap-2">
                  <input type="text" value={locationText} onChange={e => setLocationText(e.target.value)} placeholder="Auto-detected location" className="flex-1 bg-secondary/50 border border-border focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm" />
                  <button type="button" onClick={getLocation} disabled={locationLoading} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary transition-colors" title="Detect location">
                    <MapPin className={`w-4 h-4 ${locationLoading ? "animate-pulse" : ""}`} />
                  </button>
                </div>
                {locationLoading && <p className="text-xs text-muted-foreground mt-1">Detecting location...</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Pincode</label>
                <input type="text" required value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit pincode" className="w-full bg-secondary/50 border border-border focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground placeholder:text-muted-foreground text-sm" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(50,205,50,0.25)] mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : "Submit for Approval"}
              </Button>
            </form>
          )}

          {message && (
            <div className="mt-4 p-3 rounded-xl text-sm bg-primary/10 border border-primary/20 text-foreground text-center">
              {message}
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              Already a buyer?{" "}
              <Link href="/register" className="text-primary hover:text-emerald-400 font-semibold transition-colors">
                Create buyer account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
