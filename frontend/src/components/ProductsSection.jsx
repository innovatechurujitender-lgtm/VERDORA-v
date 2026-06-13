import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const products = [
  { id: 1, name: "Alphonso Mango", category: "Fruits", price: "₹120", unit: "1 kg", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 2, name: "Hydroponic Spinach", category: "Vegetables", price: "₹80", unit: "1 kg", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 3, name: "Organic Red Carrots", category: "Vegetables", price: "₹60", unit: "1 kg", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Fresh Nagpur Oranges", category: "Fruits", price: "₹100", unit: "1 kg", image: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=400&auto=format&fit=crop" },
  { id: 5, name: "Kesar Mango", category: "Fruits", price: "₹140", unit: "1 kg", image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 6, name: "Baby Broccoli", category: "Vegetables", price: "₹90", unit: "500 g", image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=400&auto=format&fit=crop", premium: true },
  { id: 7, name: "Dragon Fruit", category: "Fruits", price: "₹180", unit: "1 kg", image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=400&auto=format&fit=crop" },
  { id: 8, name: "Cherry Tomatoes", category: "Vegetables", price: "₹70", unit: "500 g", image: "https://images.unsplash.com/photo-1594995846645-cd45e2727b0e?q=80&w=400&auto=format&fit=crop" },
];

// Map category to route
const categoryRoute = {
  Fruits: "/fruits",
  Vegetables: "/vegetables",
};

export default function ProductsSection() {
  const { addToCart } = useCart();

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
             className={`group rounded-2xl overflow-hidden transition-all duration-300 border-2 shadow-lg ${
  product.premium
   ? "bg-linear-to-br from-amber-100 via-yellow-50 to-amber-200 border-amber-500"
    : "bg-card border-border"
}`}
            >
              {/* Image Container */}
              <div className="w-full h-36 sm:h-52 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400&auto=format&fit=crop'; }}
                />
                {/* Overlay shimmer for premium */}
                {product.premium && (
                  <div className="absolute inset-0 bg-linear-to-br from-amber-500/30 via-transparent to-transparent pointer-events-none" />
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                  <div className="hidden lg:flex bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </div>
                  {product.premium && (
                    <div className="bg-white/90 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Premium
                    </div>
                  )}
                </div>
              </div>

              <div className="p-2.5 sm:p-5">
                <h3
                  className={`font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 leading-tight line-clamp-1 ${product.premium
                      ? "text-amber-950"
                      : "text-foreground"
                    }`}
                >
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2 sm:mb-4">
                  <span className={`text-base sm:text-xl font-black ${product.premium ? "text-[#000000]" : "text-primary"}`}>{product.price}</span>
                  <span className={`text-xs ${product.premium ? "text-green-800 font-bold" : "text-muted-foreground"}`}>/ {product.unit}</span>
                </div>
                <Button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      unit: product.unit,
                      image: product.image,
                      category: product.category,
                    })
                  }
                  size="sm"
                  className={`w-full font-bold transition-all text-xs sm:text-sm h-8 sm:h-10 ${product.premium
                      ? "bg-yellow-100 text-green-900 hover:bg-green-600 hover:text-white border-2 border-yellow-500"
                      : "bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground"
                    }`}
                >
                  {product.premium ? "Add to Cart" : "Add to Cart"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
