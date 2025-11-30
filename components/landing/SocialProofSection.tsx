"use client";

import { motion, useAnimationFrame, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const testimonials = [
  {
    quote: "FormSS has transformed how we collect customer feedback. Response rates increased by 45%!",
    author: "Sarah Chen",
    title: "Product Manager",
    company: "TechCorp",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "The integrations are seamless. Our entire workflow is now automated and saves us 10 hours per week.",
    author: "James Rodriguez",
    title: "Marketing Director",
    company: "GrowthLabs",
    avatar: "JR",
    rating: 5,
  },
  {
    quote: "Best investment for our startup. The analytics dashboard is incredible and provides actionable insights.",
    author: "Priya Patel",
    title: "Founder",
    company: "StartupXYZ",
    avatar: "PP",
    rating: 5,
  },
  {
    quote: "Intuitive interface, powerful features. Switched from Google Forms and never looked back!",
    author: "Michael Chang",
    title: "Operations Lead",
    company: "Enterprise Co",
    avatar: "MC",
    rating: 5,
  },
];

const stats = [
  { value: 10000, suffix: "+", label: "Active Users" },
  { value: 2000000, suffix: "+", label: "Forms Created" },
  { value: 500000000, suffix: "+", label: "Responses" },
  { value: 45, suffix: "%", label: "Avg. Response Rate" },
];

export function SocialProofSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#1E293B] to-[#0F172A] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10 space-y-20">
        {/* Stats */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <AnimatedStat key={stat.label} stat={stat} delay={index * 0.1} inView={inView} />
          ))}
        </motion.div>

        {/* Testimonials Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Loved by{" "}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              thousands
            </span>
          </h2>
          <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
            Join teams from around the world who trust FormSS
          </p>
        </motion.div>

        {/* Testimonials Marquee */}
        <TestimonialsMarquee testimonials={testimonials} />
      </div>
    </section>
  );
}

function AnimatedStat({ stat, delay, inView }: { stat: typeof stats[0]; delay: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useAnimationFrame((time, delta) => {
    if (inView && !hasAnimated.current) {
      const duration = 1500;
      const progress = Math.min((time - delay * 1000) / duration, 1);
      if (progress >= 0) {
        setCount(Math.floor(stat.value * progress));
        if (progress === 1) hasAnimated.current = true;
      }
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, type: "spring" }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent mb-2">
        {formatNumber(count)}{stat.suffix}
      </div>
      <div className="text-sm text-[#94A3B8]">{stat.label}</div>
    </motion.div>
  );
}

function TestimonialsMarquee({ testimonials }: { testimonials: typeof testimonials }) {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-6"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.author}-${index}`} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>
      
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0F172A] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0F172A] to-transparent pointer-events-none" />
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="flex-shrink-0 w-[380px] p-8 rounded-2xl glass-dark cursor-pointer group"
    >
      <Quote className="h-8 w-8 text-[#06B6D4]/30 mb-4" />
      
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      
      <p className="text-[#94A3B8] italic mb-6 line-clamp-3">
        "{testimonial.quote}"
      </p>
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
          {testimonial.avatar}
        </div>
        <div>
          <div className="text-white font-semibold text-sm">{testimonial.author}</div>
          <div className="text-[#94A3B8] text-xs">{testimonial.title}</div>
        </div>
      </div>
    </motion.div>
  );
}
