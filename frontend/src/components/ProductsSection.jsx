import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { safeFetch } from "@/lib/safeFetch";

const categoryRoute = {
  Fruits: "/fruits",
  Vegetables: "/vegetables",
};

export default function ProductsSection() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    safeFetch("/api/marketplace/products")
      .then(({ data }) => {
        if (data) {
          const sorted = [...data].sort((a, b) => (a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1)).slice(0, 8);
          setProducts(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 relative bg-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center py-12">
            <span className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-end mb-8 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Featured Products</h2>
            <p className="text-base text-muted-foreground">Top quality produce direct from verified farmers</p>
          </div>
          <Link href="/vegetables">
            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="group rounded-2xl overflow-hidden transition-all duration-300 border-2 shadow-lg bg-card border-border"
            >
              <div className="w-full h-36 sm:h-52 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop'; }}
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                  <div className="bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </div>
                  {product.freshness && (
                    <div className="bg-white/90 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {product.freshness}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-2.5 sm:p-5">
                <h3 className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 leading-tight line-clamp-1 text-foreground">
                  {product.name}
                </h3>
                {product.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" /> {product.location}
                  </p>
                )}
                <div className="flex items-baseline gap-1 mb-2 sm:mb-4">
                  <span className="text-base sm:text-xl font-black text-primary">₹{product.price_per_kg}</span>
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
                      category: product.category,
                    })
                  }
                  size="sm"
                  className="w-full font-bold transition-all text-xs sm:text-sm h-8 sm:h-10 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground"
                >
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
