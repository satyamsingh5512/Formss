"use client";

import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Crown, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fadeInUp, cardHover } from "@/lib/animations";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "Up to 3 forms",
      "100 responses/month",
      "Basic analytics",
      "Email support",
      "Standard templates",
    ],
    cta: "Get Started",
    href: "/auth/signin",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹10",
    period: "per form",
    description: "Best for individual forms",
    features: [
      "Unlimited responses",
      "Advanced analytics",
      "Custom branding",
      "Conditional logic",
      "File uploads (10MB)",
      "Priority support",
      "All integrations",
      "Export data",
    ],
    cta: "Upgrade Form",
    href: "/pricing",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Organization",
    price: "₹300",
    period: "per month",
    description: "Unlimited forms for teams",
    features: [
      "Everything in Pro",
      "Unlimited forms",
      "Team collaboration",
      "Custom domain",
      "API access",
      "Webhooks",
      "White-label",
      "Dedicated support",
    ],
    cta: "Start Trial",
    href: "/pricing",
    highlighted: false,
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="relative py-20 md:py-32 bg-[#0F172A] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Simple,{" "}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>
          <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
            Choose the plan that's right for you. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, index, inView }: { plan: typeof plans[0]; index: number; inView: boolean }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
    >
      {plan.badge && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-bold shadow-lg">
            <Crown className="inline h-3 w-3 mr-1" />
            {plan.badge}
          </div>
        </motion.div>
      )}

      <motion.div
        style={{
          rotateX: plan.highlighted ? rotateX : 0,
          rotateY: plan.highlighted ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={plan.highlighted ? handleMouseMove : undefined}
        onMouseLeave={plan.highlighted ? handleMouseLeave : undefined}
        whileHover={{ scale: plan.highlighted ? 1.02 : 1.05 }}
        className={`relative h-full p-8 rounded-2xl cursor-pointer will-change-transform ${
          plan.highlighted
            ? "glass-dark border-2 border-[#06B6D4]/50 shadow-[0_0_80px_rgba(6,182,212,0.3)]"
            : "glass-dark"
        }`}
      >
        {/* Animated border gradient for highlighted plan */}
        {plan.highlighted && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-50"
            animate={{
              backgroundPosition: ["0% 0%", "200% 0%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background: "linear-gradient(90deg, #6366F1, #06B6D4, #6366F1)",
              backgroundSize: "200% 100%",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "2px",
            }}
          />
        )}

        <div className="relative z-10 space-y-6">
          {/* Plan name */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-[#94A3B8] text-sm">{plan.description}</p>
          </div>

          {/* Price */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-5xl font-bold ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent"
                    : "text-white"
                }`}
              >
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-[#94A3B8] text-sm">{plan.period}</span>
              )}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {plan.features.map((feature, i) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-start gap-3 text-sm"
              >
                <Check className="h-5 w-5 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                <span className="text-[#94A3B8]">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link href={plan.href} className="block">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className={`w-full py-6 text-base ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#6366F1] to-[#06B6D4] hover:shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {plan.cta}
                {plan.highlighted && <Zap className="ml-2 h-4 w-4" />}
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
