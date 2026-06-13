import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <Navbar cartCount={cartCount} />

      <main>
        <HeroSection />
        <CategorySection />
        <ProductsSection />
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
