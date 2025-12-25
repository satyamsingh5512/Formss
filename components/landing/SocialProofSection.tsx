"use client";

import { motion } from "framer-motion";

const companies = [
  "Acme Corp",
  "Global Tech",
  "Nebula",
  "Vertex",
  "Horizon",
  "Equinox",
];

const stats = [
  { label: "Active Users", value: "10,000+" },
  { label: "Forms Created", value: "50,000+" },
  { label: "Completion Rate", value: "89%" },
];

export function SocialProofSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#0B0C10] border-t border-zinc-200 dark:border-white/5">
      <div className="container mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 border-b border-zinc-200 dark:border-white/5 pb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Logos */}
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-8">
            Trusted by innovative teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            {companies.map((company) => (
              <span
                key={company}
                className="text-xl font-bold text-zinc-400 dark:text-white"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
