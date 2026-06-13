import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCart, Bell, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar({ cartCount }) {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSupplier = user && (user.role === "supplier" || user.role === "admin");
  const isAdmin = user?.role === "admin";

  return (
    <>
      <header
  className={`fixed top-0 w-full z-150 transition-all duration-500 ${
    scrolled
  ? "bg-green-100 text-white shadow-lg py-2"
  : "bg-green-300 text-white py-4"
  }`}
>
      
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-4 relative">
          {/* Logo Group - Left */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <img
                src={logoPath}
                alt="VERDORA"
                className="h-8 w-8 sm:h-12 sm:w-12 object-contain"
              />
              <span className="text-lg sm:text-2xl font-black tracking-tight bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                VERDORA
              </span>
            </Link>
          </div>

          {/* Search Bar - Center (Desktop Only) */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Right Actions & Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {isAdmin && (
              <Link href="/admin" className="hidden md:block">
                <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 text-sm px-4 h-9">
                  Admin Panel
                </Button>
              </Link>
            )}
            {isSupplier && (
              <Link href="/seller/dashboard" className="hidden md:block">
                <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 text-sm px-4 h-9">
                  Seller Panel
                </Button>
              </Link>
            )}
            
            <div className="flex items-center gap-2 sm:gap-3 border-l border-border pl-2 sm:pl-3">
              <button className="text-muted-foreground hover:text-foreground transition-colors relative p-1 sm:p-2">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              
              <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors relative p-1 sm:p-2">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold min-w-4 h-4 flex items-center justify-center rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link href="/login" className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-primary transition-colors overflow-hidden">
                <User className="w-4 h-4 text-muted-foreground" />
              </Link>

              {/* Sidebar Toggle - Now on the right */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 ml-1 rounded-full hover:bg-primary/10 text-foreground transition-colors group"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6 group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        cartCount={cartCount} 
      />
    </>
  );
}
