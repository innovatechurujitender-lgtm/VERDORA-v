import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, MapPin, Package, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function SellerProductForm({ onSuccess, defaultCategory = "Vegetables" }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "", description: "", price_per_kg: "", location: "",
    latitude: "", longitude: "", daily_stock: "", category: defaultCategory,
    contact_phone: "", freshness: "Fresh",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price_per_kg) {
      setMessage("Product name and price are required");
      return;
    }
    setLoading(true);
    setMessage("");

    const fd = new FormData();
    fd.append("seller_id", user.id);
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price_per_kg", form.price_per_kg);
    fd.append("location", form.location);
    fd.append("latitude", form.latitude);
    fd.append("longitude", form.longitude);
    fd.append("daily_stock", form.daily_stock);
    fd.append("category", form.category);
    fd.append("contact_phone", form.contact_phone);
    fd.append("freshness", form.freshness);
    if (imageFile) fd.append("image", imageFile);

    const res = await fetch("/api/seller/products", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setMessage("Product listed successfully!");
      setForm({ name: "", description: "", price_per_kg: "", location: "", latitude: "", longitude: "", daily_stock: "", category: form.category, contact_phone: "", freshness: "Fresh" });
      setImageFile(null);
      setImagePreview("");
      if (onSuccess) onSuccess();
    } else {
      setMessage(data.error || "Failed to list product");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground mb-1.5 block">Product Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="e.g. Fresh Organic Tomatoes" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground mb-1.5 block">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="Describe your product..." />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Price per Kg (₹) *</label>
          <input type="number" step="0.01" value={form.price_per_kg} onChange={e => setForm(f => ({ ...f, price_per_kg: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="120" />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Daily Stock (kg)</label>
          <input type="number" value={form.daily_stock} onChange={e => setForm(f => ({ ...f, daily_stock: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="100" />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
            <option>Vegetables</option>
            <option>Fruits</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Freshness</label>
          <select value={form.freshness} onChange={e => setForm(f => ({ ...f, freshness: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
            <option>Fresh</option>
            <option>Very Fresh</option>
            <option>Premium</option>
            <option>Organic</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Location</label>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="City, District" />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Contact Phone</label>
          <input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="Your phone number" />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Latitude (Google Map)</label>
          <input type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="28.6139" />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Longitude (Google Map)</label>
          <input type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="77.2090" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground mb-1.5 block">Product Image</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border cursor-pointer hover:border-primary transition-colors bg-secondary/30">
              <Image className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Choose image"}</span>
              <input type="file" accept="image/*" onChange={e => {
                const f = e.target.files[0];
                if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
              }} className="hidden" />
            </label>
            {imagePreview && <img src={imagePreview} alt="" className="w-12 h-12 rounded-lg object-cover" />}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base rounded-xl">
        {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Listing...</span> : "List Product"}
      </Button>

      {message && (
        <div className={`p-3 rounded-xl text-sm text-center ${message.includes("success") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>{message}</div>
      )}
    </form>
  );
}
