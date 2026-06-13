import { Link } from "wouter";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";
import { useAuth } from "@/hooks/useAuth";

export default function Footer() {
  const { user } = useAuth();
  const isSupplier = user?.role === "supplier" || user?.role === "admin";

  return (
    <footer className="bg-green-700 text-green-400 border-t-2 border-primary pt-16 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Col */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src={logoPath} alt="VERDORA" className="h-16 w-16 object-contain" />
              <span className="text-2xl font-black tracking-tighter bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              VERDORA
              </span>
            </Link>
            <p className="text-white font-black mb-6 text-sm leading-relaxed">
              India's smartest B2B marketplace for fresh agricultural produce. Connecting farmers directly with businesses for better pricing and faster delivery.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/verdoraofficial-jitender-7b3957413" className="transition-all hover:scale-110">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <FaLinkedin size={46} className="text-[#0A66C2]" />
                </div>
              </a>

              <a href="https://www.instagram.com/verdora.official?igsh=MXFudzFiODU1OTYxaA==" className="transition-all hover:scale-110">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <FaInstagram size={46} className="text-[#E4405F]" />
                </div>
              </a>

              <a href="#" className="transition-all hover:scale-110">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <FaYoutube size={46} className="text-[#FF0000]" />
                </div>
              </a>
            </div>
          </div>

          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white font-medium">
              <li><Link href="/vegetables" className="hover:text-primary transition-colors">Fresh Vegetables</Link></li>
              <li><Link href="/fruits" className="hover:text-primary transition-colors">Fruits</Link></li>
              {isSupplier && <li><Link href="/bulk-orders" className="hover:text-primary transition-colors">Bulk Orders</Link></li>}
              <li><Link href="/farmers" className="hover:text-primary transition-colors">Our Top Farmers</Link></li>
              <li><Link href="/offers" className="hover:text-primary transition-colors">Today's Offers</Link></li>
              {!isSupplier && <li><Link href="/register" className="hover:text-primary transition-colors">Become a Supplier</Link></li>}
            </ul>
          </div>

        
          <div className="hidden md:block">
            <h4 className="font-bold text-lg mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li>
                <span className=" text-white/60 block font-bold mb-1">Email:</span>
                <p className="text-white">verdora777@gmail.com</p>
              </li>
              <li>
                <span className="text-white/60 block font-bold mb-1">Support:</span>
                <p className="text-white">Available via customer service number and email</p>
              </li>
              <li>
                <span className="text-white/60 block font-bold  mb-1">Hours:</span>
                <p className="text-white">24 / 7 support for all your needs</p>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="hidden md:block">
            <h4 className="font-bold text-lg mb-6 text-white">Market Updates</h4>
            <p className="text-white/80 mb-4 text-sm">
              Subscribe to get daily wholesale price alerts and market trends.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white w-full text-sm text-white placeholder:text-white/50"
              />
              <Button className="w-full bg-white hover:bg-white/90 text-green-700 font-bold">
                Subscribe
              </Button>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60 text-center md:text-left">
          <p className="font-bold text-white">VERDORA - JITENDER , YUVRAJ</p>
          <div className="flex gap-6">
            <button className="font-bold text-white/80 hover:text-black transition-colors">Privacy Policy</button>
            <button className="font-bold text-white/80 hover:text-black transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
