"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const comparisonData = [
  { feature: "Conversational UI", us: true, google: false, typeform: true },
  { feature: "Real-time Analytics", us: true, google: "Limited", typeform: true },
  { feature: "Template Count", us: "50+", google: "8", typeform: "40+" },
  { feature: "Integrations", us: "100+", google: "12", typeform: "50+" },
  { feature: "Price (Monthly)", us: "₹300", google: "Free", typeform: "$25+" },
  { feature: "Response Limit", us: "Unlimited", google: "100/form", typeform: "Unlimited" },
  { feature: "Custom Branding", us: true, google: false, typeform: "$99+/mo" },
  { feature: "AI Features", us: "Advanced", google: "None", typeform: "Basic" },
];

export function ComparisonSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="comparison"
      className="relative py-20 md:py-32 bg-[#0F172A] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            See how we{" "}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              compare
            </span>
          </h2>
          <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
            More features, better pricing, superior experience
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto overflow-x-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="glass-dark rounded-2xl p-1 min-w-[700px]"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-[#94A3B8] font-medium">Feature</th>
                  <th className="p-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white font-bold">
                      FormSS
                    </div>
                  </th>
                  <th className="p-6 text-center text-[#94A3B8] font-medium">Google Forms</th>
                  <th className="p-6 text-center text-[#94A3B8] font-medium">Typeform</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="border-b border-white/5 hover:bg-[#06B6D4]/5 transition-colors"
                  >
                    <td className="p-6 text-white font-medium">{row.feature}</td>
                    <td className="p-6 text-center">
                      <ComparisonCell value={row.us} highlight />
                    </td>
                    <td className="p-6 text-center">
                      <ComparisonCell value={row.google} />
                    </td>
                    <td className="p-6 text-center">
                      <ComparisonCell value={row.typeform} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ComparisonCell({ value, highlight = false }: { value: boolean | string; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="inline-flex"
      >
        <Check className={`h-6 w-6 ${highlight ? "text-[#06B6D4]" : "text-green-500"}`} />
      </motion.div>
    ) : (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
        transition={{ delay: 0.1 }}
        className="inline-flex"
      >
        <X className="h-6 w-6 text-red-500/70" />
      </motion.div>
    );
  }

  return (
    <span className={highlight ? "text-[#06B6D4] font-bold" : "text-[#94A3B8]"}>
      {value}
    </span>
  );
}
