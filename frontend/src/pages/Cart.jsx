import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { cartCount, cartItems, addToCart, decreaseQty, clearCart } = useCart();

  // Compute total
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("₹", ""));
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar cartCount={cartCount} />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Cart</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-10">Your Cart</h1>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 sm:py-20 px-6 bg-card border border-dashed border-border rounded-2xl sm:rounded-3xl"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8">
                Browse fresh vegetables, fruits, and bulk packs to get started
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/vegetables" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold">
                    Shop Vegetables
                  </Button>
                </Link>
                <Link href="/fruits" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-border hover:border-primary hover:text-primary px-8">
                    Shop Fruits
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm sm:text-base leading-tight truncate ${item.category === "Premium Fruits" || item.category === "Premium Vegetables" ? "text-amber-500" : "text-foreground"}`}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.category} · {item.unit}</p>
                    <p className="text-primary font-black text-sm sm:text-base mt-1">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart({ ...item })}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Cart Summary */}
              <div className="bg-card border border-border rounded-2xl p-5 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground text-sm">Subtotal ({cartCount} items)</span>
                  <span className="font-black text-lg text-primary">₹{total.toFixed(0)}</span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base">
                  Proceed to Checkout
                </Button>
                <button
                  onClick={clearCart}
                  className="w-full mt-3 text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear Cart
                </button>
              </div>

              <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-1">
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </motion.div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
