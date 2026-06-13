import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(50,205,50,0.15),transparent_70%)] z-0" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div 
          className="bg-card border border-border shadow-lg rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />

          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-foreground relative z-10">
            Transform Your <br />
            <span className="text-primary">Fresh Supply Chain</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
            Be among the first businesses to source directly from farmers with faster delivery and better wholesale pricing.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg font-bold shadow-sm group">
              Start Buying <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary h-14 px-8 text-lg font-bold">
              Become Partner
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
