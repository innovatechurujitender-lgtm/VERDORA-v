import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Tag, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Offers() {
  const [cartCount] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar cartCount={cartCount} />


      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Offers</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 lg:mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Zap className="w-3.5 h-3.5" />
              Best deals updated daily
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              Today's <span className="bg-linear-to-r from-primary to-emerald-300 bg-clip-text text-transparent">Best Offers</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Fresh deals on premium produce — updated every morning</p>
          </motion.div>

          {/* Empty state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-dashed border-border rounded-2xl sm:rounded-3xl py-12 sm:py-24 px-6 sm:px-8 text-center bg-card/20"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Tag className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground mb-2">No offers available yet</h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8 max-w-sm mx-auto">
              Special deals and offers will appear here once suppliers start listing products on the platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold shadow-[0_0_16px_rgba(50,205,50,0.2)]">
                  Join VERDORA <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/vegetables" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-border hover:border-primary hover:text-primary px-8">
                  Browse Products
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Newsletter signup for offers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-10 bg-linear-to-r from-primary/10 to-emerald-500/5 border border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center"
          >
            <h3 className="text-xl sm:text-2xl font-black mb-2 text-foreground">Get notified when deals go live</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">Subscribe to receive daily price alerts and flash sale notifications</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-bold">
                Notify Me
              </Button>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
