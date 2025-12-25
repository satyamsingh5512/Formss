"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    ],
    cta: "Get Started",
    href: "/auth/signin",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹10",
    period: "/form",
    description: "Best for individual forms",
    features: [
      "Unlimited responses",
      "Advanced analytics",
      "Custom branding",
      "Conditional logic",
      "Priority support",
    ],
    cta: "Upgrade Form",
    href: "/pricing",
    highlighted: true,
  },
  {
    name: "Organization",
    price: "₹300",
    period: "/month",
    description: "Unlimited forms for teams",
    features: [
      "Everything in Pro",
      "Unlimited forms",
      "Team collaboration",
      "Custom domain",
      "API access",
    ],
    cta: "Start Trial",
    href: "/pricing",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-[#0B0C10] border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, transparency pricing.
          </h2>
          <p className="text-zinc-400">
            No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${plan.highlighted
                  ? "bg-white/10 border-white/20"
                  : "bg-transparent border-white/5"
                }`}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-zinc-400 mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white max-w-[150px] truncate">{plan.price}</span>
                {plan.period && <span className="text-zinc-500">{plan.period}</span>}
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check size={16} className="mt-0.5 text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={plan.href} className="block">
                <Button
                  className={`w-full ${plan.highlighted
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-white/5 text-white hover:bg-white/10 border-white/10"
                    }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
