import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, TrendingUp, Wallet, Settings,
  PlusCircle, Leaf, Apple, ShoppingBag,
  BarChart3, ClipboardList, Bell, User, LogOut, ChevronDown,
  Star, Trash2, MapPin, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";
import { useAuth } from "@/hooks/useAuth";
import SellerProductForm from "@/components/SellerProductForm";

const statCards = [
  { label: "Total Revenue", value: "₹0", sub: "All time", icon: Wallet, highlight: true },
  { label: "Orders Completed", value: "0", sub: "All time", icon: ClipboardList, highlight: false },
  { label: "Products Listed", value: "0", sub: "Active listings", icon: Package, highlight: false },
  { label: "This Month", value: "₹0", sub: "Current month", icon: TrendingUp, highlight: false },
];

const navItems = [
  { icon: LayoutDashboard, label: "Overview", tab: "overview" },
  { icon: Package, label: "Upload Product", tab: "upload" },
  { icon: ShoppingBag, label: "My Products", tab: "products" },
  { icon: Wallet, label: "Earnings", tab: "payments" },
];

export default function SellerDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMsg, setEditMsg] = useState("");

  useEffect(() => {
    if (!loading && (!user || (user.role !== "seller" && user.role !== "admin"))) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (user?.id) fetchProducts();
  }, [user]);

  async function fetchProducts() {
    setFetching(true);
    const res = await fetch(`/api/seller/products?seller_id=${user.id}`);
    if (res.ok) setSellerProducts(await res.json());
    setFetching(false);
  }

  async function deleteProduct(id) {
    const res = await fetch(`/api/seller/products/${id}`, {
      method: "DELETE", headers: { seller_id: user.id },
    });
    if (res.ok) fetchProducts();
  }

  function startEdit(p) {
    setEditingProduct(p);
    setEditForm({
      name: p.name, description: p.description || "", price_per_kg: p.price_per_kg,
      location: p.location || "", daily_stock: p.daily_stock, category: p.category || "Vegetables",
      contact_phone: p.contact_phone || "", freshness: p.freshness || "Fresh",
    });
    setEditMsg("");
    setActiveTab("products");
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditLoading(true);
    setEditMsg("");
    const fd = new FormData();
    fd.append("seller_id", user.id);
    Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
    const res = await fetch(`/api/seller/products/${editingProduct.id}`, { method: "PUT", body: fd });
    const data = await res.json();
    if (res.ok) {
      setEditMsg("Updated!");
      setEditingProduct(null);
      fetchProducts();
    } else {
      setEditMsg(data.error || "Update failed");
    }
    setEditLoading(false);
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="w-8 h-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin" /></div>;
  }
  if (!user || (user.role !== "seller" && user.role !== "admin")) return null;

  const productCount = sellerProducts.length;
  const updatedStats = statCards.map(s => s.label === "Products Listed" ? { ...s, value: String(productCount) } : s);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-x-hidden">
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300 ${sidebarOpen ? "translate-x-0 w-64 shadow-2xl md:shadow-none" : "-translate-x-full w-64"}`}>
        <div className="h-16 flex items-center px-6 border-b border-border md:hidden">
          <img src={logoPath} alt="VERDORA" className="h-8 w-8 object-contain shrink-0" />
          <span className="ml-3 font-black text-lg bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">VERDORA</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto p-2 hover:bg-secondary rounded-lg md:hidden"><LogOut className="w-5 h-5 rotate-180" /></button>
        </div>
        <div className="px-4 py-4 border-b border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] px-2">Seller Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, tab }) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left group ${activeTab === tab ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${activeTab === tab ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="flex-1">{label}</span>
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-border/50 flex flex-col gap-1">
          <Link href="/profile"><button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all w-full group"><Settings className="w-4 h-4" /> Profile</button></Link>
          <Link href="/"><button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all w-full group"><LogOut className="w-4 h-4" /> Back to Store</button></Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"}`}>
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-3 mr-2 sm:mr-4">
              <img src={logoPath} alt="VERDORA" className="h-7 w-7 sm:h-9 sm:w-9 object-contain" />
              <span className="hidden sm:block font-black text-lg sm:text-xl tracking-tight bg-linear-to-r from-primary to-emerald-500 bg-clip-text text-transparent">VERDORA</span>
            </div>
            <button onClick={() => setSidebarOpen(s => !s)} className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20">
              <LayoutDashboard className={`w-5 h-5 transition-transform duration-500 ${sidebarOpen ? "rotate-0" : "rotate-180"}`} />
            </button>
            <div className="h-6 w-px bg-border mx-2 hidden md:block" />
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm text-foreground leading-none">Seller Dashboard</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 sm:pl-3 border border-border/60 hover:border-primary/30 hover:bg-secondary/50 rounded-xl sm:rounded-2xl transition-all cursor-pointer group">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-bold text-foreground">Seller Account</span>
                  <span className="text-[10px] text-muted-foreground">{user?.name}</span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-emerald-500 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                  {user?.profile_picture ? <img src={user.profile_picture} alt="" className="w-full h-full rounded-lg object-cover" /> : <User className="w-4 h-4" />}
                </div>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-linear-to-r from-primary/10 to-emerald-500/5 border border-primary/20 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-lg sm:text-xl font-black text-foreground mb-1">Welcome to your Seller Dashboard</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Your sales, earnings, and inventory — all in one place.</p>
                </div>
                <Button onClick={() => setActiveTab("upload")} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-bold whitespace-nowrap">
                  <PlusCircle className="w-4 h-4 mr-2" /> List a Product
                </Button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {updatedStats.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className={`border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 ${card.highlight ? "bg-primary/5 border-primary/20" : "bg-card"}`}>
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 ${card.highlight ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        <Icon className="w-4 sm:w-4.5 h-4 sm:h-4.5" />
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">{card.label}</p>
                      <p className={`text-xl sm:text-2xl font-black ${card.highlight ? "text-primary" : "text-foreground"}`}>{card.value}</p>
                    </motion.div>
                  );
                })}
              </div>
              {productCount > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold mb-4">Your Listed Products</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sellerProducts.slice(0, 4).map(p => (
                      <div key={p.id} className="border border-border rounded-xl p-3">
                        <img src={p.image || "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop"} alt={p.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                        <p className="font-bold text-sm truncate">{p.name}</p>
                        <p className="text-primary font-black text-xs">₹{p.price_per_kg}/kg</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "upload" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black mb-6">List New Product</h2>
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                <SellerProductForm onSuccess={fetchProducts} />
              </div>
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">My Products ({productCount})</h2>
                <Button onClick={() => { setEditingProduct(null); setActiveTab("upload"); }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>
              {editingProduct && (
                <div className="bg-card border border-primary/30 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">Edit Product</h3>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium mb-1 block">Name</label>
                        <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Price/kg (₹)</label>
                        <input type="number" step="0.01" value={editForm.price_per_kg} onChange={e => setEditForm(f => ({ ...f, price_per_kg: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Stock (kg)</label>
                        <input type="number" value={editForm.daily_stock} onChange={e => setEditForm(f => ({ ...f, daily_stock: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Category</label>
                        <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
                          <option>Vegetables</option>
                          <option>Fruits</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Freshness</label>
                        <select value={editForm.freshness} onChange={e => setEditForm(f => ({ ...f, freshness: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
                          <option>Fresh</option><option>Very Fresh</option><option>Premium</option><option>Organic</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Location</label>
                        <input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Contact Phone</label>
                        <input value={editForm.contact_phone} onChange={e => setEditForm(f => ({ ...f, contact_phone: e.target.value }))} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium mb-1 block">Description</label>
                        <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>
                    </div>
                    {editMsg && <p className={`text-sm ${editMsg.includes("Updated") ? "text-emerald-500" : "text-red-500"}`}>{editMsg}</p>}
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingProduct(null)} className="flex-1">Cancel</Button>
                      <Button type="submit" disabled={editLoading} className="flex-1 bg-primary text-primary-foreground font-bold">
                        {editLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              {fetching ? (
                <div className="flex justify-center py-20"><span className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" /></div>
              ) : productCount === 0 ? (
                <div className="border border-dashed border-border rounded-3xl py-24 px-8 text-center bg-card/20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5"><ShoppingBag className="w-8 h-8" /></div>
                  <h3 className="text-xl font-black text-foreground mb-2">No products listed yet</h3>
                  <p className="text-muted-foreground text-sm mb-8">Add your first product to start selling</p>
                  <Button onClick={() => setActiveTab("upload")} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold">
                    <PlusCircle className="w-4 h-4 mr-2" /> List Your First Product
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sellerProducts.map(p => (
                    <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                      <img src={p.image || "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop"} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{p.name}</h3>
                        <p className="text-primary font-black text-sm">₹{p.price_per_kg}/kg</p>
                        {p.location && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</p>}
                        <p className="text-[10px] text-muted-foreground">Stock: {p.daily_stock} kg · {p.freshness}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => startEdit(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black mb-6">Earnings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Earned", value: "₹0", sub: "All time" },
                  { label: "Pending Payout", value: "₹0", sub: "Processing" },
                  { label: "Last Payout", value: "₹0", sub: "No payouts yet" },
                ].map((card, i) => (
                  <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6">
                    <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                    <p className="text-3xl font-black text-foreground mb-1">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.sub}</p>
                  </motion.div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold mb-6">Payment History</h3>
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Wallet className="w-7 h-7" /></div>
                  <p className="font-black text-foreground text-lg">No payments yet</p>
                  <p className="text-sm text-muted-foreground">Once buyers purchase your products, your history will appear here</p>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
