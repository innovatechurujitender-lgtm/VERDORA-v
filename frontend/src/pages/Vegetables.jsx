import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Leaf, MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { safeFetch } from "@/lib/safeFetch";

const subcategories = ["All", "Fresh"];

export default function Vegetables() {
  const { cartCount, addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");
  const [allVegetables, setAllVegetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    safeFetch("/api/marketplace/products?category=Vegetables")
      .then(({ data }) => { if (data) setAllVegetables(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All"
    ? allVegetables
    : allVegetables.filter((v) => v.freshness === activeFilter);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar cartCount={cartCount} />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Fresh Vegetables</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              Fresh <span className="bg-linear-to-br from-primary to-emerald-300 bg-clip-text text-transparent">Vegetables</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Farm-fresh vegetables delivered to your business</p>
          </motion.div>

          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            {subcategories.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(50,205,50,0.3)]"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
            >
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 border-2 shadow-lg bg-card border-border"
                >
                  <div className="w-full h-36 sm:h-52 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop'; }}
                    />
                    {product.freshness && (
                      <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {product.freshness}
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-base mb-0.5 leading-tight line-clamp-1 text-foreground">
                      {product.name}
                    </h3>
                    {product.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3" /> {product.location}
                      </p>
                    )}
                    <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
                      <span className="text-base sm:text-lg font-black text-primary">₹{product.price_per_kg}</span>
                      <span className="text-xs text-muted-foreground">/ {product.unit || 'kg'}</span>
                    </div>
                    <Button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: `₹${product.price_per_kg}`,
                          unit: product.unit || 'kg',
                          image: product.image,
                          category: "Vegetables",
                        })
                      }
                      size="sm"
                      className="w-full font-bold transition-all text-xs sm:text-sm h-8 sm:h-10 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
