"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export function PremiumNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/quizo", label: "Quizzes" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 dark:bg-zinc-950/95 border-b-2 border-black dark:border-white/20 backdrop-blur-md"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Logo width={180} height={50} className="group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-bold text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white hover:underline decoration-2 underline-offset-4 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href="/auth/signin">
            <button className="px-5 py-2 font-bold text-black dark:text-white transition-colors hover:text-black/70 dark:hover:text-white/80 border-2 border-transparent hover:border-black dark:hover:border-white/20 rounded-lg">
              Sign In
            </button>
          </Link>
          <Link href="/builder">
            <button className="neo-button-primary rounded-lg transition-transform active:scale-95">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            className="text-black dark:text-white p-2 border-2 border-black dark:border-white/20 rounded shadow-neo-sm dark:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-zinc-950 border-b-2 border-black dark:border-white/20 p-6 space-y-6 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-xl font-bold text-black dark:text-white hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 flex flex-col gap-4">
            <Link href="/auth/signin" className="w-full">
              <button className="w-full py-3 neo-button rounded-xl">
                Sign In
              </button>
            </Link>
            <Link href="/builder" className="w-full">
              <button className="w-full py-3 neo-button-primary rounded-xl">
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
