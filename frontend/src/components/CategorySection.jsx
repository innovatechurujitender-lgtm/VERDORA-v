import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const filters = ["Trending Vegetables", "Trending Fruits"];

const categories = [
  { name: "Organic Vegetables", href: "/vegetables", color: "bg-emerald-100", iconColor: "text-emerald-600" },
  { name: "Seasonal Fruits", href: "/fruits", color: "bg-orange-100", iconColor: "text-orange-600" },
  { name: "Premium Grade", href: "/premium", color: "bg-amber-100", iconColor: "text-amber-600" },
  { name: "Bulk Supplies", href: "/bulk-orders", color: "bg-blue-100", iconColor: "text-blue-600" },
];

const filterRoutes = {
  "Trending Vegetables": "/vegetables",
  "Trending Fruits": "/fruits",
};

export default function CategorySection() {
  return (
    <section className="py-16 border-b border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="flex flex-col gap-6 items-center justify-between mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {filters.map((filter) => (
              <Link key={filter} href={filterRoutes[filter] ?? "/"}>
                <button className="whitespace-nowrap px-4 py-2 rounded-full border border-border bg-card/50 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                  {filter}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 scrollbar-hide">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className="shrink-0"
            >
              <Link href={cat.href}>
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-card border border-border flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer hover:border-primary transition-all group relative overflow-hidden">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${cat.color} ${cat.iconColor} relative`}>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-current rounded-full" />
                  </div>

                  <div className="text-center relative z-10">
                    <h3 className="font-bold text-xs sm:text-sm text-foreground">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
