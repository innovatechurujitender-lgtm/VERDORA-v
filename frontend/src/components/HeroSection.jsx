import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Tag, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const { user } = useAuth();
  return (
    <section className="relative min-h-[85vh] sm:min-h-dvh flex items-center pt-16 sm:pt-20 lg:pt-24 overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-green-50/80 via-white to-emerald-50/60 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-9 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-4" />
            Farmers' To Fresh Picks,Secure Delivered
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-4 sm:mb-6">
            Fresh Vegetables <br />
            <span className="bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Direct from Farmers
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
            Farm-fresh produce sourced directly from local farmers. Better prices, better quality, and straight to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center lg:justify-start gap-3 sm:gap-4 mb-8">
            <Link href="/vegetables" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-13 text-base shadow-sm cursor-pointer">
                Shop Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            {!user && (
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-13 text-base shadow-sm cursor-pointer">
                  Sign up <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
            <Link href="/offers" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-secondary/80 px-8 h-13 text-base cursor-pointer">
                <Tag className="w-4 h-4 mr-1.5" />
                View Offers
              </Button>
            </Link>
          </div>

          {/* Offers Badge / Trust Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Quality Guaranteed
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-primary" />
              secure Delivery
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-medium">
              <Tag className="w-3.5 h-3.5" />
              Best Offers
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-md lg:max-w-lg mx-auto">
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-emerald-200/30 blur-2xl" />

            {/* Floating offer badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -top-2 -right-2 z-20 bg-white rounded-xl shadow-lg border px-3 py-2 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Tag className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-green-700 leading-tight">Best Dealer</p>
                <p className="text-[10px] text-muted-foreground">with offers</p>
              </div>
            </motion.div>

            <img
              src="/farmer.png"
              alt="farmer verdora IMAGE"
              className="relative z-10 w-full h-auto object-contain drop-shadow-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
