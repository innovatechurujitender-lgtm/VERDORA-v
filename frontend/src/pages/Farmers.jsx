import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Users, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const states = ["All States", "Maharashtra", "Punjab", "Karnataka", "Uttar Pradesh", "Rajasthan", "Gujarat"];

export default function Farmers() {
  const [cartCount] = useState(0);
  const [activeState, setActiveState] = useState("All States");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar cartCount={cartCount} />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Farmers</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              Verified <span className="bg-linear-to-r from-primary to-emerald-300 bg-clip-text text-transparent">Farmers</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Buy directly from trusted and verified farmers across India</p>
          </motion.div>

          {/* Become supplier CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-linear-to-r from-primary/10 to-emerald-500/5 border border-primary/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm sm:text-base">Are you a farmer or supplier?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Join VERDORA and reach thousands of business buyers directly</p>
              </div>
            </div>
            <Link href="/register" className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-bold whitespace-nowrap shadow-[0_0_16px_rgba(50,205,50,0.2)]">
                Become a Supplier <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* State filter */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-10">
            {states.map(s => (
              <button
                key={s}
                onClick={() => setActiveState(s)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeState === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Empty state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="border border-dashed border-border rounded-2xl sm:rounded-3xl py-12 sm:py-24 px-6 sm:px-8 text-center bg-card/20"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">No farmers listed yet</h3>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
              We're verifying and onboarding farmers across India. Farmers and suppliers will appear here once registered.
            </p>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold shadow-[0_0_16px_rgba(50,205,50,0.2)]">
                Register as Farmer <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
