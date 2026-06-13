import { motion } from "framer-motion";
import { Link } from "wouter";
import { Star, MessageSquarePlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const starItems = [
  { label: "Fresh Produce", value: "5.0" },
  { label: "Delivery Speed", value: "4.9" },
  { label: "Pricing", value: "4.8" },
  { label: "Support", value: "5.0" },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,205,50,0.04),transparent_60%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black mb-4">What Our Buyers Say</h2>
          <p className="text-muted-foreground">VERDORA is just getting started — be part of our founding community</p>
        </div>

        {/* Rating summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14">
          {starItems.map((item, i) => (
            <div
              key={item.label}
              className="bg-secondary border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
            >
              <div className="text-2xl sm:text-3xl font-black text-foreground mb-1">{item.value}</div>
              <div className="flex justify-center gap-0.5 text-primary mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
                ))}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>

        {/* CTA — be the first */}
        <div
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 text-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />

            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 sm:mb-6 relative z-10">
              <MessageSquarePlus className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-3 relative z-10">
              Be our first reviewer
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto relative z-10">
              Sign up, place your first order, and share your experience. Early members shape the VERDORA platform for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-11 sm:h-12 font-bold shadow-sm">
                  Start Ordering <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-border hover:border-primary hover:text-primary px-8 h-11 sm:h-12">
                  Become a Supplier
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
