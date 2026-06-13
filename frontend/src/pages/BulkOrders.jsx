import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const benefits = [
  { icon: Package, title: "Minimum Order 50kg", desc: "Bulk pricing starts at 50kg per item" },
  { icon: Truck, title: "Free Bulk Delivery", desc: "No delivery charge on orders above ₹5,000" },
  { icon: CheckCircle2, title: "Quality Assured", desc: "Every bulk order quality-checked before dispatch" },
];

export default function BulkOrders() {
  const [cartCount] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar cartCount={cartCount} />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Bulk Orders</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 lg:mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              Bulk <span className="bg-linear-to-r from-primary to-emerald-300 bg-clip-text text-transparent">Orders</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Best rates for restaurants, hotels, caterers, and food businesses.
            </p>
          </motion.div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-0.5">{b.title}</h3>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-dashed border-border rounded-2xl sm:rounded-3xl py-12 sm:py-24 px-6 sm:px-8 text-center bg-card/20"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">No bulk packs listed yet</h3>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
              Bulk listings will appear here once suppliers join the platform. You can also request a custom quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold shadow-[0_0_16px_rgba(50,205,50,0.2)]">
                  Become a Supplier <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/farmers">
                <Button variant="outline" className="border-border hover:border-primary hover:text-primary px-8">
                  Find Farmers
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Custom order CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 lg:mt-10 bg-linear-to-r from-primary/10 to-emerald-500/5 border border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center"
          >
            <h3 className="text-2xl font-black mb-2 text-foreground">Need a Custom Bulk Order?</h3>
            <p className="text-muted-foreground mb-6">Contact our team to get the best rates for large requirements</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 font-bold shadow-[0_0_20px_rgba(50,205,50,0.25)]">
              Talk to Sales <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
