"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

export function PremiumNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const navbarBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(15, 23, 42, 0.8)"]
  );
  
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.2]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "#comparison", label: "Compare" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <motion.nav
      style={{
        backgroundColor: navbarBackground,
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg"
    >
      <motion.div
        style={{
          borderBottomColor: useTransform(
            borderOpacity,
            (value) => `rgba(6, 182, 212, ${value})`
          ),
        }}
        className="border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#06B6D4] rounded-xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-white hidden sm:block">
                FormSS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#94A3B8] hover:text-[#06B6D4] transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/builder">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white border-0 shadow-lg hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] transition-all duration-300"
                  >
                    Start Free
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden overflow-hidden bg-[#0F172A]/95 backdrop-blur-lg border-b border-[#06B6D4]/20"
      >
        <div className="container mx-auto px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[#94A3B8] hover:text-[#06B6D4] transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            <Link href="/auth/signin" className="block">
              <Button
                variant="outline"
                className="w-full border-[#06B6D4]/30 text-white hover:bg-white/5"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/builder" className="block">
              <Button className="w-full bg-gradient-to-r from-[#6366F1] to-[#06B6D4]">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
