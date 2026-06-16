import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Star, Package, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const categories = ["All", "Vegetables", "Fruits"];

export default function Marketplace() {
  const { cartCount, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchProducts(); }, [category]);

  async function fetchProducts() {
    setLoading(true);
    const url = category === "All" ? "/api/marketplace/products" : `/api/marketplace/products?category=${category}`;
    const res = await fetch(url);
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar cartCount={cartCount} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Farmers Market</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2">Farmers <span className="bg-linear-to-br from-primary to-emerald-300 bg-clip-text text-transparent">Market</span></h1>
              <p className="text-sm text-muted-foreground">Fresh produce directly from local farmers</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${category === c ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card/50 text-muted-foreground hover:border-primary hover:text-primary"}`}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><span className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No products found. Check back later!</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map(product => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                  onClick={() => setSelected(product)}
                >
                  <div className="w-full h-36 sm:h-48 relative overflow-hidden">
                    <img src={product.image || "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop"}
                      alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => { e.target.src = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop"; }} />
                    {product.freshness && (
                      <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">{product.freshness}</span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-base truncate">{product.name}</h3>
                    <p className="text-primary font-black text-base sm:text-lg mt-1">₹{product.price_per_kg}/kg</p>
                    {product.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {product.location}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-muted-foreground">{product.daily_stock > 0 ? `${product.daily_stock} kg left` : "Out of stock"}</span>
                      <Button size="sm" className="text-xs h-7 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20"
                        onClick={e => { e.stopPropagation(); addToCart({ id: product.id, name: product.name, price: `₹${product.price_per_kg}`, unit: "1 kg", image: product.image, category: product.category, seller: true }); }}>
                        Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.image || "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop"} alt={selected.name} className="w-full h-48 sm:h-64 object-cover rounded-t-2xl" />
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-black">{selected.name}</h2>
                <p className="text-2xl font-black text-primary mt-1">₹{selected.price_per_kg}/kg</p>
              </div>
              {selected.description && <p className="text-sm text-muted-foreground">{selected.description}</p>}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.location && <div className="bg-secondary/50 rounded-xl p-3"><span className="text-muted-foreground text-xs block">Location</span><span className="font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> {selected.location}</span></div>}
                {selected.latitude && selected.longitude && (
                  <div className="bg-secondary/50 rounded-xl p-3">
                    <span className="text-muted-foreground text-xs block">Live Location</span>
                    <a href={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> View on Map
                    </a>
                  </div>
                )}
                <div className="bg-secondary/50 rounded-xl p-3"><span className="text-muted-foreground text-xs block">Daily Stock</span><span className="font-medium">{selected.daily_stock || 0} kg</span></div>
                <div className="bg-secondary/50 rounded-xl p-3"><span className="text-muted-foreground text-xs block">Category</span><span className="font-medium">{selected.category}</span></div>
                {selected.users?.name && <div className="bg-secondary/50 rounded-xl p-3"><span className="text-muted-foreground text-xs block">Seller</span><span className="font-medium">{selected.users.name}</span></div>}
                {selected.contact_phone && <div className="bg-secondary/50 rounded-xl p-3"><span className="text-muted-foreground text-xs block">Contact</span><span className="font-medium">{selected.contact_phone}</span></div>}
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base"
                onClick={() => { addToCart({ id: selected.id, name: selected.name, price: `₹${selected.price_per_kg}`, unit: "1 kg", image: selected.image, category: selected.category, seller: true }); setSelected(null); }}>
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
