import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Leaf, Star, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const subcategories = ["All", "Leafy", "Root", "Exotic", "Organic", "Local", "Bulk"];

const allVegetables = [
  { id: 201, name: "Hydroponic Spinach", subcategory: "Leafy", price: "₹80", unit: "1 kg", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 202, name: "Baby Broccoli", subcategory: "Exotic", price: "₹90", unit: "500 g", image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 203, name: "Organic Red Carrots", subcategory: "Root", price: "₹60", unit: "1 kg", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&auto=format&fit=crop" },
  { id: 204, name: "Cherry Tomatoes", subcategory: "Local", price: "₹70", unit: "500 g", image: "https://images.unsplash.com/photo-1594995846645-cd45e2727b0e?q=80&w=400&auto=format&fit=crop" },
  { id: 205, name: "French Beans", subcategory: "Organic", price: "₹55", unit: "500 g", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=400&auto=format&fit=crop" },
  { id: 206, name: "Purple Cauliflower", subcategory: "Exotic", price: "₹110", unit: "1 piece", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 207, name: "Desi Onions (Bulk)", subcategory: "Bulk", price: "₹40", unit: "5 kg", image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop" },
  { id: 208, name: "Fresh Coriander", subcategory: "Leafy", price: "₹20", unit: "250 g", image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=400&auto=format&fit=crop" },
];

export default function Vegetables() {
  const { cartCount, addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? allVegetables
    : allVegetables.filter((v) => v.subcategory === activeFilter);

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

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            {subcategories.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(50,205,50,0.3)]"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Products Grid */}
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
                className={`group rounded-2xl overflow-hidden transition-all duration-300 border-2 shadow-lg ${product.premium
                   ? "bg-linear-to-br from-amber-100 via-yellow-50 to-amber-200 border-amber-500"
    : "bg-card border-border"
                  }`}
              >
                {/* Image — uniform height */}
                <div className="w-full h-36 sm:h-52 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop'; }}
                  />
                  {product.premium && (
                    <div className="absolute inset-0 bg-linear-to-br from-amber-500/30 via-transparent to-transparent pointer-events-none" />
                  )}
                  {product.premium && (
                    <div className="absolute top-2 left-2 bg-gold-500 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Premium
                    </div>
                  )}
                </div>
                <div className="p-2.5 sm:p-4">
                  <h3 className={`font-bold text-sm sm:text-base mb-0.5 leading-tight line-clamp-1 ${product.premium ? "text-amber-950" : "text-foreground"}`}>
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
                    <span className={`text-base sm:text-lg font-black ${product.premium ? "text-amber-900" : "text-primary"}`}>{product.price}</span>
                    <span className={`text-xs ${product.premium ? "text-amber-800" : "text-muted-foreground"}`}>/ {product.unit}</span>
                  </div>
                  <Button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        unit: product.unit,
                        image: product.image,
                        category: "Vegetables",
                      })
                    }
                    size="sm"
                    className={`w-full font-bold transition-all text-xs sm:text-sm h-8 sm:h-10 ${product.premium
                         ? "bg-yellow-100 text-green-900 hover:bg-green-600 hover:text-white border-2 border-yellow-500"
                      : "bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground"
                      }`}
                  >
                    {product.premium ? " Add to Cart" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
