import { PremiumNavbar } from "@/components/landing/PremiumNavbar";
import {
    FileText,
    BarChart3,
    Brain,
    Palette,
    Zap,
    Shield,
    Share2,
    Timer,
    CheckCircle2,
    Layers,
    Download,
    Lock,
    Smartphone,
    Globe,
    Sparkles,
    Users
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Beautiful Forms",
        description: "Create stunning forms with our Neo-Brutalist design system. Stand out from boring, generic form builders.",
        color: "bg-indigo-500",
    },
    {
        icon: Brain,
        title: "Smart Quizzes (Quizo)",
        description: "Build interactive quizzes with timers, scoring, and instant results. Perfect for education and assessments.",
        color: "bg-purple-500",
    },
    {
        icon: BarChart3,
        title: "Real-Time Analytics",
        description: "Track responses, view trends, and analyze your data with beautiful, actionable charts.",
        color: "bg-emerald-500",
    },
    {
        icon: Palette,
        title: "Custom Branding",
        description: "Add your logo, colors, and organization name. Make every form feel uniquely yours.",
        color: "bg-pink-500",
    },
    {
        icon: Timer,
        title: "Timed Assessments",
        description: "Set quiz-level or per-question timers. Auto-submit when time runs out.",
        color: "bg-orange-500",
    },
    {
        icon: Lock,
        title: "Require Sign-In",
        description: "Control who can respond. Require authentication for sensitive data collection.",
        color: "bg-red-500",
    },
    {
        icon: Share2,
        title: "Easy Sharing",
        description: "Share forms with a simple link. Copy to clipboard in one click.",
        color: "bg-blue-500",
    },
    {
        icon: Smartphone,
        title: "Fully Responsive",
        description: "Works beautifully on mobile, tablet, and desktop. No compromises.",
        color: "bg-cyan-500",
    },
    {
        icon: Download,
        title: "Export Data",
        description: "Download responses as CSV or JSON. Your data, your way.",
        color: "bg-teal-500",
    },
    {
        icon: Shield,
        title: "Privacy First",
        description: "We never sell your data. Your responses are encrypted and secure.",
        color: "bg-green-500",
    },
    {
        icon: Layers,
        title: "Multiple Question Types",
        description: "Short text, long text, multiple choice, checkboxes, dropdowns, file uploads, and more.",
        color: "bg-violet-500",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Optimized for speed. Forms load instantly, responses save in milliseconds.",
        color: "bg-yellow-500",
    },
];

const comparisonFeatures = [
    "Unlimited forms",
    "Unlimited responses",
    "Beautiful Neo-Brutalist design",
    "Quiz & assessment mode",
    "Real-time analytics",
    "Custom branding",
    "CSV/JSON export",
    "Mobile responsive",
    "No watermarks",
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <PremiumNavbar />

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo-sm mb-8">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-sm">Features</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
                        Everything you need<br />
                        <span className="italic font-serif">to collect data beautifully</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                        From simple contact forms to complex quizzes, Formlytic has all the features you need—and none of the bloat you don't.
                    </p>
                </section>

                {/* Features Grid */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="neo-card hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
                            >
                                <div className={`w-12 h-12 ${feature.color} rounded-xl mb-4 flex items-center justify-center shadow-lg`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="neo-card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-black dark:border-white/20 p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    More features, less cost
                                </h2>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Other form builders charge premium prices for basic features. Formlytic gives you everything you need to succeed—without breaking the bank.
                                </p>
                                <a
                                    href="/dashboard"
                                    className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl border-2 border-black dark:border-white hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-colors"
                                >
                                    Start Building Free →
                                </a>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="neo-card bg-white dark:bg-zinc-900 p-6">
                                    <h3 className="font-bold mb-4 text-lg">What's Included</h3>
                                    <div className="space-y-3">
                                        {comparisonFeatures.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span className="text-sm font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-6 text-center">
                    <div className="neo-card bg-black dark:bg-white text-white dark:text-black p-12 border-2 border-black dark:border-white">
                        <Users className="h-12 w-12 mx-auto mb-6 opacity-50" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join thousands of happy users</h2>
                        <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                            Start creating beautiful forms and quizzes in minutes. No credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/dashboard"
                                className="inline-block px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-bold rounded-xl border-2 border-white dark:border-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            >
                                Get Started Free
                            </a>
                            <a
                                href="/about"
                                className="inline-block px-8 py-4 bg-transparent text-white dark:text-black font-bold rounded-xl border-2 border-white/30 dark:border-black/30 hover:border-white dark:hover:border-black transition-colors"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="py-12 border-t-2 border-black dark:border-white/20 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6 text-center">
                    <p className="font-bold">© 2024 Formlytic. Built with ❤️ for builders everywhere.</p>
                </div>
            </footer>
        </div>
    );
}
