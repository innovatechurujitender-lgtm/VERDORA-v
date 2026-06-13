import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Apple, Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const subcategories = ["All", "Fresh", "Seasonal", "Organic", "Premium", "Bulk"];

const allFruits = [
  { id: 101, name: "Alphonso Mango", subcategory: "Seasonal", price: "₹120", unit: "1 kg", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 102, name: "Kesar Mango", subcategory: "Premium", price: "₹140", unit: "1 kg", image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 103, name: "Fresh Nagpur Oranges", subcategory: "Fresh", price: "₹100", unit: "1 kg", image: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=400&auto=format&fit=crop" },
  { id: 104, name: "Dragon Fruit", subcategory: "Organic", price: "₹180", unit: "1 kg", image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=400&auto=format&fit=crop" },
  { id: 105, name: "Sweet Pomegranate", subcategory: "Fresh", price: "₹90", unit: "1 kg", image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?q=80&w=400&auto=format&fit=crop" },
  { id: 106, name: "Himalayan Strawberries", subcategory: "Seasonal", price: "₹160", unit: "500 g", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 107, name: "Organic Papaya", subcategory: "Organic", price: "₹60", unit: "1 kg", image: "https://images.unsplash.com/photo-1526641569467-0572c9a4c7e4?q=80&w=400&auto=format&fit=crop" },
  { id: 108, name: "Fresh Guava", subcategory: "Fresh", price: "₹50", unit: "1 kg", image: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?q=80&w=400&auto=format&fit=crop" },
];

export default function Fruits() {
  const { cartCount, addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? allFruits
    : allFruits.filter((f) => f.subcategory === activeFilter);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar cartCount={cartCount} />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Fruits</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              Fresh <span className="bg-linear-to-br from-primary to-emerald-300 bg-clip-text text-transparent">Fruits</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Premium quality fruits sourced from the best orchards across India</p>
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
                    ? "bg-linear-to-br from-yellow-400 via-amber-400 to-amber-500 border-yellow-500 shadow-amber-400/40"
                    : "bg-card border-border shadow-sm hover:shadow-xl"
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
                    <div className="absolute top-2 left-2 bg-white/90 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
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
                        category: "Fruits",
                      })
                    }
                    size="sm"
                    className={`w-full font-bold transition-all text-xs sm:text-sm h-8 sm:h-10 ${product.premium
                        ? "bg-yellow-100 text-yellow-300 hover:bg-yellow-600 hover:text-yellow-200 border-0"
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
