import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  LayoutDashboard, 
  X,
  ChevronRight,
  Search,
  Star,
  Upload,
  Wallet,
  Leaf,
  Apple,
  ShoppingCart,
  Package,
  Users,
  Tag,
  ShieldCheck,
  User,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";

import { useAuth } from "@/hooks/useAuth";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const isSeller = user && (user.role === "seller" || user.role === "admin");
  const isBuyer = user && user.role === "buyer";

  const allNavItems = [
    { name: "Home", href: "/", icon: Home },

    // Buyer Navigation
    { name: "Vegetables", href: "/vegetables", icon: Leaf, buyerOnly: true },
    { name: "Fruits", href: "/fruits", icon: Apple, buyerOnly: true },
    { name: "Farmers Market", href: "/marketplace", icon: Store, buyerOnly: true },
    { name: "Premium Vegetable", href: "/vegetables", icon: Star, buyerOnly: true },
    { name: "Premium Fruits", href: "/fruits", icon: Star, buyerOnly: true },
    { name: "My Cart", href: "/cart", icon: ShoppingCart, buyerOnly: true },
    { name: "Bulk Orders", href: "/bulk-orders", icon: Package, buyerOnly: true },
    { name: "Farmers", href: "/farmers", icon: Users, buyerOnly: true },
    { name: "Offers", href: "/offers", icon: Tag, buyerOnly: true },
    
    // Seller Specific Options
    { name: "Upload Fruits", href: "/seller/dashboard?tab=upload-fruits", icon: Upload, sellerOnly: true },
    { name: "Upload Vegetables", href: "/seller/dashboard?tab=upload-vegetables", icon: Upload, sellerOnly: true },
    { name: "Earning", href: "/seller/dashboard?tab=payments", icon: Wallet, sellerOnly: true },
    { name: "Upload Premium", href: "/seller/dashboard?tab=upload-premium", icon: Star, sellerOnly: true },
  ];

  const navItems = allNavItems.filter(item => {
    if (item.sellerOnly) return !!isSeller;
    if (item.buyerOnly) return !user || !!isBuyer;
    return true;
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-70 sm:w-[320px] bg-sidebar border-l border-sidebar-border z-70 transition-transform duration-500 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-linear-to-b from-sidebar to-background">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={onClose}>
              <img
                src={logoPath}
                alt="VERDORA"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                VERDORA
              </span>
            </Link>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Section */}
          <div className="px-4 py-4 border-b border-sidebar-border">
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-sm font-semibold text-sidebar-foreground">Search Products</h3>
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground rounded-lg px-3 py-2.5 pl-9 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {navItems.map((item) => {
              const active = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                      active 
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(50,205,50,0.1)]" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        active ? "bg-primary text-primary-foreground" : "bg-sidebar-accent group-hover:bg-sidebar-primary/20"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                      active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    }`} />
                  </a>
                </Link>
              );
            })}

          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-sidebar-border space-y-3">
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  className="w-full justify-start gap-3 border-primary/20 hover:bg-primary/10 text-primary h-11 px-4 rounded-xl group"
                >
                  <ShieldCheck className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span>Admin Panel</span>
                </Button>
              </Link>
            )}
            {!!isSeller && (
              <Link href="/seller/dashboard">
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  className="w-full justify-start gap-3 border-sidebar-border hover:bg-sidebar-accent text-sidebar-foreground h-11 px-4 rounded-xl group"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span>Seller Panel</span>
                </Button>
              </Link>
            )}
            
            {user ? (
              <div className="flex flex-col gap-2">
                <Link href="/profile">
                  <Button onClick={onClose} variant="outline" className="w-full justify-start gap-3 border-sidebar-border hover:bg-sidebar-accent text-sidebar-foreground h-11 rounded-xl group">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-primary-foreground">{user.name ? user.name.charAt(0).toUpperCase() : "V"}</span>
                      )}
                    </div>
                    <span className="font-medium truncate">{user.name || "Profile"}</span>
                  </Button>
                </Link>
                <Button onClick={() => { logout(); onClose(); }} variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button onClick={onClose} variant="ghost" className="w-full text-sidebar-foreground hover:bg-sidebar-accent rounded-xl">Login</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">Join</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
