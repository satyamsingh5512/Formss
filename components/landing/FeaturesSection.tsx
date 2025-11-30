"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  BarChart3,
  Palette,
  Zap,
  GitBranch,
  Smartphone,
} from "lucide-react";
import { staggerContainer, fadeInUp, cardHover } from "@/lib/animations";

const features = [
  {
    icon: MessageSquare,
    title: "Conversational Forms",
    description:
      "AI-powered intelligent forms that adapt questions based on user responses",
    gradient: "from-[#6366F1] to-[#8B5CF6]",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Live tracking of responses, drop-off rates, and user behavior insights",
    gradient: "from-[#06B6D4] to-[#0EA5E9]",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description:
      "50+ professionally designed templates with drag-and-drop customization",
    gradient: "from-[#EC4899] to-[#F43F5E]",
  },
  {
    icon: Zap,
    title: "Smart Integrations",
    description:
      "Connect to Zapier, Slack, Google Sheets, Webhooks, and 100+ apps",
    gradient: "from-[#F59E0B] to-[#EAB308]",
  },
  {
    icon: GitBranch,
    title: "Advanced Logic",
    description:
      "Conditional fields, branching logic, and personalized user journeys",
    gradient: "from-[#10B981] to-[#14B8A6]",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "Responsive design that looks perfect on all devices and screens",
    gradient: "from-[#8B5CF6] to-[#6366F1]",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="features"
      className="relative py-20 md:py-32 bg-gradient-to-b from-[#0F172A] to-[#1E293B] overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1]/20 to-[#06B6D4]/20 border border-[#06B6D4]/30 text-[#06B6D4] text-sm font-medium">
              ✨ Powerful Features
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              collect data
            </span>
          </h2>
          
          <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
            Build forms that convert. Get insights that matter. Scale without limits.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: typeof features[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ delay: index * 0.1 }}
      whileHover="hover"
      className="group relative"
    >
      <motion.div
        variants={cardHover}
        className="relative h-full p-8 rounded-2xl overflow-hidden cursor-pointer will-change-transform"
        style={{
          background: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(6, 182, 212, 0.2)",
        }}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)`,
          }}
        />

        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #6366F1, #06B6D4)",
              padding: "2px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}
          >
            <Icon className="w-full h-full text-white" />
          </motion.div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white group-hover:text-[#06B6D4] transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Learn more link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#06B6D4] text-sm font-medium group-hover:opacity-100 opacity-0 transition-opacity duration-300"
          >
            Learn more
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        </div>

        {/* Hover gradient spot */}
        <motion.div
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${feature.gradient})`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
