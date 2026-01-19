import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Roles", href: "#roles" },
  { name: "How It Works", href: "#working" },
  { name: "Privacy", href: "#privacy" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (location !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass py-4 shadow-lg shadow-black/20" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="p-2 rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">DevConnect</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">
                Log In
              </Link>
              <Link 
                href="/register" 
                className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden pt-24 px-4"
          >
            <div className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-2xl font-display font-medium text-white/80 hover:text-white"
                >
                  {link.name}
                </a>
              ))}
              <div className="w-full h-px bg-white/10 my-4" />
              <div className="flex flex-col w-full gap-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <div className="w-full py-4 rounded-xl border border-white/10 text-center font-bold hover:bg-white/5 transition-colors cursor-pointer">
                    Log In
                  </div>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <div className="w-full py-4 rounded-xl bg-primary text-white text-center font-bold shadow-lg shadow-primary/25 cursor-pointer">
                    Sign Up Now
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
