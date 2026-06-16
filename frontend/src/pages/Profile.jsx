import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { User, Camera, Mail, Phone, MapPin, LogOut, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { safeFetch } from "@/lib/safeFetch";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) { setLocation("/login"); return; }
    fetchProfile();
    fetchOrders();
  }, [user]);

  async function fetchProfile() {
    const { ok, data } = await safeFetch("/api/profile", { headers: { userid: user.id } });
    if (ok && data) {
      setProfile(data);
      setForm({ name: data.name, phone: data.phone || "", address: data.address || "", location: data.location || "" });
    }
  }

  async function fetchOrders() {
    const { ok, data } = await safeFetch(`/api/orders/user?user_id=${user.id}`);
    if (ok && data) setOrders(data);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const { ok, data } = await safeFetch("/api/profile/update", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: user.id, ...form }),
    });
    if (ok) {
      setMessage("Profile updated!");
      setEditing(false);
      fetchProfile();
    } else {
      setMessage("Update failed. Server may be starting up.");
    }
  }

  async function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    const fd = new FormData();
    fd.append("photo", file);
    fd.append("userid", user.id);
    const { ok, data } = await safeFetch("/api/profile/photo", { method: "POST", body: fd });
    if (ok && data) {
      setProfile(prev => ({ ...prev, profile_picture: data.profile_picture }));
      setMessage("Photo updated!");
    }
    setPhotoUploading(false);
  }

  if (!profile) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Profile</span>
        </div>

        <div className="grid gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary border-2 border-primary/30 overflow-hidden flex items-center justify-center">
                  {profile.profile_picture ? (
                    <img src={profile.profile_picture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-primary-foreground">{profile.name ? profile.name.charAt(0).toUpperCase() : "V"}</span>
                  )}
                </div>
                <button onClick={() => fileInputRef.current?.click()} disabled={photoUploading} className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                  {photoUploading ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-black">{profile.name}</h1>
                <p className="text-muted-foreground text-sm capitalize">{profile.role}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                  <span className="text-xs flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" /> {profile.email}</span>
                  {profile.phone && <span className="text-xs flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" /> {profile.phone}</span>}
                  {profile.location && <span className="text-xs flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" /> {profile.location}</span>}
                </div>
              </div>
              <Button variant="outline" onClick={() => setEditing(!editing)} className="shrink-0">{editing ? "Cancel" : "Edit Profile"}</Button>
            </div>

            {editing && (
              <form onSubmit={handleUpdate} className="mt-6 pt-6 border-t border-border space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Phone</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Location</label>
                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Address</label>
                    <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <Button type="submit" className="bg-primary text-primary-foreground font-bold">Save Changes</Button>
                {message && <p className="text-sm text-primary">{message}</p>}
              </form>
            )}
          </motion.div>

          {orders.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> My Orders</h2>
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="border border-border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"}`}>{order.payment_status}</span>
                    </div>
                    <p className="text-sm font-bold">₹{order.total}</p>
                    <p className="text-xs text-muted-foreground">{(() => { try { return JSON.parse(order.items).length; } catch { return 0; } })()} items</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex gap-3">
            <Link href="/" className="flex-1"><Button variant="outline" className="w-full border-border">Back to Store</Button></Link>
            <Button onClick={() => { logout(); setLocation("/"); }} className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
