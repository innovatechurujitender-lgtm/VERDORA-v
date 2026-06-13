import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, TrendingUp, Wallet, Settings,
  PlusCircle, Leaf, Apple, ShoppingBag, ArrowRight,
  BarChart3, ClipboardList, Bell, User, LogOut, ChevronDown,
  Upload, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";

import { useAuth } from "@/hooks/useAuth";

const categoryRows = [
  { label: "Vegetables", icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Fruits", icon: Apple, color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Bulk Packs", icon: Package, color: "text-primary", bg: "bg-primary/10" },
];

const statCards = [
  { label: "Total Revenue", value: "₹0", sub: "All time", icon: Wallet, highlight: true },
  { label: "Orders Completed", value: "0", sub: "All time", icon: ClipboardList, highlight: false },
  { label: "Products Listed", value: "0", sub: "Active listings", icon: Package, highlight: false },
  { label: "This Month", value: "₹0", sub: "Current month", icon: TrendingUp, highlight: false },
];

const navItems = [
  { icon: LayoutDashboard, label: "Overview", tab: "overview" },
  { icon: Apple, label: "Upload Fruits", tab: "upload-fruits" },
  { icon: Leaf, label: "Upload Vegetables", tab: "upload-vegetables" },
  { icon: Wallet, label: "Earnings", tab: "payments" },
  { icon: Star, label: "Upload Premium", tab: "upload-premium" },
  { icon: Package, label: "My Products", tab: "products" },
];

export default function SellerDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || (user.role !== "supplier" && user.role !== "admin"))) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "supplier" && user.role !== "admin")) {
    return null;
  }

  const isSupplier = user?.role === "supplier";
  const dashboardTitle = isSupplier ? "Supplier Dashboard" : "Buyer Dashboard";
  const accountType = isSupplier ? "Seller Account" : "Buyer Account";

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-x-hidden">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300 ${sidebarOpen ? "translate-x-0 w-64 shadow-2xl md:shadow-none" : "-translate-x-full w-64 md:w-0"}`}>
        {/* Branding area */}
        <div className="h-16 flex items-center px-6 border-b border-border md:hidden">
          <img src={logoPath} alt="VERDORA" className="h-8 w-8 object-contain shrink-0" />
          <span className="ml-3 font-black text-lg bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            VERDORA
          </span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-2 hover:bg-secondary rounded-lg md:hidden"
          >
            <LogOut className="w-5 h-5 text-muted-foreground rotate-180" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] px-2 mb-1">{isSupplier ? "Seller Panel" : "Buyer Panel"}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems
            .filter(item => isSupplier || (item.tab !== "products" && item.tab !== "sales"))
            .map(({ icon: Icon, label, tab }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left w-full group ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${activeTab === tab ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="flex-1">{label}</span>
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-border/50 flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all w-full group">
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" /> Settings
          </button>
          <Link href="/">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all w-full group">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Store
            </button>
          </Link>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"}`}>

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-3 mr-2 sm:mr-4">
              <img src={logoPath} alt="VERDORA" className="h-7 w-7 sm:h-9 sm:w-9 object-contain" />
              <span className="hidden sm:block font-black text-lg sm:text-xl tracking-tight bg-linear-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                VERDORA
              </span>
            </div>

            <button
              onClick={() => setSidebarOpen(s => !s)}
              className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20"
              title={sidebarOpen ? "Collapse" : "Expand"}
            >
              <LayoutDashboard className={`w-5 h-5 transition-transform duration-500 ${sidebarOpen ? "rotate-0" : "rotate-180"}`} />
            </button>

            <div className="h-6 w-px bg-border mx-2 hidden md:block" />

            <div className="hidden sm:block">
              <h1 className="font-bold text-sm text-foreground leading-none">
                {dashboardTitle}
              </h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl relative transition-all group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 sm:pl-3 border border-border/60 hover:border-primary/30 hover:bg-secondary/50 rounded-xl sm:rounded-2xl transition-all cursor-pointer group">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] sm:text-xs font-bold text-foreground leading-none">{accountType}</span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">{user?.name}</span>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-emerald-500 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

              {/* Welcome banner */}
              <div className="bg-linear-to-r from-primary/10 to-emerald-500/5 border border-primary/20 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-lg sm:text-xl font-black text-foreground mb-1">
                    {isSupplier ? "Welcome to your Seller Dashboard" : `Welcome back, ${user?.name}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {isSupplier 
                      ? "Your sales, earnings, and inventory — all in one place." 
                      : "Track your orders, manage your profile and view your history."}
                  </p>
                </div>
                {isSupplier && (
                  <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-bold shadow-[0_0_16px_rgba(50,205,50,0.2)] whitespace-nowrap">
                    <PlusCircle className="w-4 h-4 mr-2" /> List a Product
                  </Button>
                )}
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {statCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className={`border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden ${card.highlight ? "bg-primary/5 border-primary/20" : "bg-card"}`}
                    >
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 ${card.highlight ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        <Icon className="w-4 sm:w-4.5 h-4 sm:h-4.5" />
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">{card.label}</p>
                      <p className={`text-xl sm:text-2xl font-black ${card.highlight ? "text-primary" : "text-foreground"}`}>{card.value}</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">{card.sub}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Category breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Sales by Category */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" /> Sales by Category
                    </h3>
                    <span className="text-xs text-muted-foreground">All time</span>
                  </div>
                  <div className="space-y-4">
                    {categoryRows.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <div key={cat.label} className="flex items-center gap-4">
                          <div className={`w-9 h-9 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-medium text-foreground">{cat.label}</span>
                              <span className="text-xs font-bold text-muted-foreground">₹0</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full w-0 bg-primary rounded-full transition-all duration-700" />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">0 kg / units sold</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-center py-4 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                    Sales data will appear here once you start receiving orders
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-primary" /> Recent Transactions
                    </h3>
                  </div>
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-foreground">No transactions yet</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Your payment history will appear here after your first sale
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20"
                      onClick={() => setActiveTab("products")}
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> List Your First Product
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* SALES TAB */}
          {activeTab === "sales" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-black mb-6">Sales Analytics</h2>

              {/* Chart area */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-foreground">Revenue Over Time</h3>
                  <div className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground">All Time</div>
                </div>
                <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-xl bg-background/30">
                  <div className="text-center">
                    <BarChart3 className="w-10 h-10 text-primary/30 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground mb-1">No sales data yet</p>
                    <p className="text-xs text-muted-foreground">Your revenue chart will appear here once you receive orders</p>
                  </div>
                </div>
              </div>

              {/* Category table */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-6">Breakdown by Category</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 text-xs text-muted-foreground font-medium">Category</th>
                        <th className="pb-3 text-xs text-muted-foreground font-medium">Qty Sold</th>
                        <th className="pb-3 text-xs text-muted-foreground font-medium">Orders</th>
                        <th className="pb-3 text-xs text-muted-foreground font-medium">Revenue</th>
                        <th className="pb-3 text-xs text-muted-foreground font-medium">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryRows.map(cat => {
                        const Icon = cat.icon;
                        return (
                          <tr key={cat.label} className="border-b border-border/50 last:border-0">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-medium text-foreground">{cat.label}</span>
                              </div>
                            </td>
                            <td className="py-3 text-muted-foreground">0 kg</td>
                            <td className="py-3 text-muted-foreground">0</td>
                            <td className="py-3 font-medium text-foreground">₹0</td>
                            <td className="py-3 text-muted-foreground">—</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center py-3 text-xs text-muted-foreground">
                  Data updates automatically when you receive orders
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">My Products</h2>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>

              {/* Empty state */}
              <div className="border border-dashed border-border rounded-3xl py-24 px-8 text-center bg-card/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">No products listed yet</h3>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                  Add your first vegetable or fruit listing to start receiving orders from buyers across India
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold shadow-[0_0_16px_rgba(50,205,50,0.2)]">
                    <PlusCircle className="w-4 h-4 mr-2" /> List Vegetables
                  </Button>
                  <Button variant="outline" className="border-border hover:border-primary hover:text-primary px-8">
                    <PlusCircle className="w-4 h-4 mr-2" /> List Fruits
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-black mb-6">Earnings</h2>

              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Earned", value: "₹0", sub: "All time" },
                  { label: "Pending Payout", value: "₹0", sub: "Processing" },
                  { label: "Last Payout", value: "₹0", sub: "No payouts yet" },
                ].map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                    <p className="text-3xl font-black text-foreground mb-1">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Payment history */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-6">Payment History</h3>
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Wallet className="w-7 h-7" />
                  </div>
                  <p className="font-black text-foreground text-lg">No payments yet</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Once buyers purchase your products and payments are processed, your history will appear here
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* UPLOAD FRUITS TAB */}
          {activeTab === "upload-fruits" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-black mb-6">Upload Fruits</h2>
              <div className="bg-card border border-border rounded-2xl p-8 text-center border-dashed">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Apple className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">List New Fruit Item</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">Fill in the details to add fresh fruits to the marketplace.</p>
                <Button className="font-bold">Select Fresh Fruits</Button>
              </div>
            </motion.div>
          )}

          {/* UPLOAD VEGETABLES TAB */}
          {activeTab === "upload-vegetables" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-black mb-6">Upload Vegetables</h2>
              <div className="bg-card border border-border rounded-2xl p-8 text-center border-dashed">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">List New Vegetable Item</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">Add your fresh harvest of vegetables here.</p>
                <Button className="font-bold">Select Vegetables</Button>
              </div>
            </motion.div>
          )}

          {/* UPLOAD PREMIUM TAB */}
          {activeTab === "upload-premium" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-black mb-6">Upload Premium Produce</h2>
              <div className="bg-primary/5 border-primary/20 border-2 rounded-2xl p-8 text-center border-dashed">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-primary">List Premium Quality Items</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto font-medium">Exclusively for Grade-A handpicked premium fruits and vegetables.</p>
                <Button className="font-black bg-primary">Upload Premium Stock</Button>
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}
