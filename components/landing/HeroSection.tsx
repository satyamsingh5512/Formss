"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Play, Sparkles } from "lucide-react";
import { staggerContainer, fadeInUp, wordReveal, bounceEntrance, float } from "@/lib/animations";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Mouse tracking for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  
  // Scroll-based fade out
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const words = ["Forms", "That", "Feel", "Human"];
  
  const trustBadges = [
    "No credit card",
    "14-day trial",
    "10k+ users",
  ];

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] pt-24 pb-20"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.1),transparent_50%)]" />
      
      {/* Mouse tracking spotlight */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: mouseXSpring,
          top: mouseYSpring,
          x: "-50%",
          y: "-50%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Main Headline */}
            <div className="space-y-4">
              <motion.div className="flex flex-wrap gap-3">
                {words.map((word, index) => (
                  <motion.h1
                    key={word}
                    custom={index}
                    variants={wordReveal}
                    className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#6366F1] bg-clip-text text-transparent tracking-tight"
                    style={{
                      backgroundSize: "200% auto",
                    }}
                  >
                    {word}
                  </motion.h1>
                ))}
              </motion.div>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-[#94A3B8] max-w-2xl leading-relaxed"
              >
                Build beautiful, conversational forms that your audience actually wants to fill
              </motion.p>
            </div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-6"
            >
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 text-[#94A3B8]"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#06B6D4]" />
                  <span className="text-sm font-medium">{badge}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4"
            >
              <Link href="/builder">
                <motion.div
                  variants={bounceEntrance}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white border-0 px-8 py-6 text-lg shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_50px_rgba(99,102,241,0.4)] transition-all duration-300 group"
                  >
                    Start Building Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="#demo">
                <motion.div
                  variants={bounceEntrance}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#06B6D4]/50 text-white hover:bg-[#06B6D4]/10 px-8 py-6 text-lg backdrop-blur-sm group"
                  >
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    See Live Demo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
            >
              {[
                { value: "10k+", label: "Active Users" },
                { value: "2M+", label: "Forms Created" },
                { value: "500M+", label: "Responses" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#94A3B8] mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Form Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <FormPreviewCard mouseX={mouseXSpring} mouseY={mouseYSpring} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#06B6D4]/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function FormPreviewCard({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const rotateX = useTransform(mouseY, [0, 600], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 800], [-10, 10]);

  return (
    <motion.div
      ref={cardRef}
      variants={float}
      initial="initial"
      animate="animate"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full aspect-[4/3] will-change-transform gpu-accelerated"
    >
      {/* Main card */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 80px rgba(99, 102, 241, 0.3)",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-[#06B6D4]/10" />
        
        {/* Form content mockup */}
        <div className="relative p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-gradient-to-r from-white/20 to-white/10 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" style={{ animationDelay: "0.2s" }} />
          </div>
          
          {/* Form fields */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              className="space-y-2"
            >
              <div className="h-4 w-32 bg-[#06B6D4]/30 rounded" />
              <div className="h-12 w-full bg-white/5 rounded-lg border border-[#06B6D4]/20" />
            </motion.div>
          ))}
          
          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="h-12 w-40 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] rounded-lg shadow-lg animate-glow"
          />
        </div>
        
        {/* Animated cursor */}
        <motion.div
          className="absolute w-6 h-6 pointer-events-none"
          initial={{ x: 100, y: 100, opacity: 0 }}
          animate={{
            x: [100, 200, 200, 300],
            y: [100, 100, 180, 180],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <Sparkles className="w-full h-full text-[#06B6D4]" />
        </motion.div>
      </motion.div>
      
      {/* Background glow layers */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#6366F1]/20 to-[#06B6D4]/20 blur-3xl -z-10 animate-pulse" />
    </motion.div>
  );
}
