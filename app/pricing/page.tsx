import { PremiumNavbar } from "@/components/landing/PremiumNavbar";
import { Check, Mail, Phone, ArrowRight, Crown, Sparkles, Building } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <PremiumNavbar />

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo-sm mb-8">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-sm">Simple Pricing</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        Pay only for what you need
                    </h1>
                    <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        No monthly subscriptions. No hidden fees. Just simple, transparent pricing.
                    </p>
                </section>

                {/* Pricing Cards */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

                        {/* Free Plan */}
                        <div className="neo-card border-2 border-black dark:border-white/20 p-8 flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">Free</h3>
                                <p className="text-zinc-500 text-sm">Perfect for getting started</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-black">₹0</span>
                                <span className="text-zinc-500"> forever</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {[
                                    "Up to 3 forms",
                                    "100 responses/month",
                                    "Basic analytics",
                                    "Formlytic branding",
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/dashboard">
                                <button className="w-full py-3 border-2 border-black dark:border-white/20 rounded-xl font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                    Get Started
                                </button>
                            </Link>
                        </div>

                        {/* Per Form Plan - Highlighted */}
                        <div className="neo-card border-4 border-yellow-400 dark:border-yellow-500 bg-zinc-900 dark:bg-zinc-800 text-white p-8 flex flex-col relative transform md:-translate-y-4 shadow-neo-lg">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full border-2 border-black">
                                MOST POPULAR
                            </div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2 text-white">Per Form</h3>
                                <p className="text-zinc-300 text-sm">Remove branding on each form</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-black text-white">₹10</span>
                                <span className="text-zinc-300"> / form</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {[
                                    "Unlimited responses",
                                    "Remove Formlytic branding",
                                    "Add your own logo",
                                    "Full analytics",
                                    "Priority support",
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-white">
                                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/dashboard">
                                <button className="w-full py-3 bg-yellow-400 text-black border-2 border-yellow-400 rounded-xl font-bold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2">
                                    <Crown className="h-4 w-4" />
                                    Upgrade Form
                                </button>
                            </Link>
                        </div>

                        {/* Bundle Plan */}
                        <div className="neo-card border-2 border-indigo-500 dark:border-indigo-400 p-8 flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold">Bundle</h3>
                                    <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs font-bold rounded-full">SAVE 50%</span>
                                </div>
                                <p className="text-zinc-500 text-sm">Best value for power users</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">₹499</span>
                                <span className="text-zinc-500"> / month</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {[
                                    "100 branded forms",
                                    "Unlimited responses",
                                    "Remove all branding",
                                    "Custom logos",
                                    "Full analytics suite",
                                    "Priority support",
                                    "Valid for 1 month",
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/dashboard">
                                <button className="w-full py-3 bg-indigo-600 text-white border-2 border-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                    Get Bundle
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Enterprise/Contact Section */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="neo-card bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-white/20 p-8 md:p-12 max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold mb-4">
                                    <Building className="h-4 w-4" />
                                    Enterprise
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                    Need more? Contact Sales
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                    For custom requirements, volume discounts, or enterprise features, reach out to us directly.
                                </p>
                                <a
                                    href="mailto:satyamsinghpx@gmail.com"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                                >
                                    <Mail className="h-5 w-5" />
                                    satyamsinghpx@gmail.com
                                </a>
                            </div>
                            <div className="flex-shrink-0">
                                <Link href="/">
                                    <div className="w-32 h-32 bg-white dark:bg-black rounded-2xl border-2 border-black dark:border-white/20 flex items-center justify-center shadow-neo-lg hover:scale-105 transition-transform cursor-pointer">
                                        <Logo width={100} height={80} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {[
                            {
                                q: "What do I get with the Per Form plan?",
                                a: "For ₹10 per form, you can remove Formlytic branding and add your own logo. The form gets unlimited responses and full analytics."
                            },
                            {
                                q: "How does the Bundle plan work?",
                                a: "Pay ₹499 once and get 100 branded forms for 1 month. This is perfect if you run campaigns or need many forms quickly."
                            },
                            {
                                q: "Can I upgrade a form later?",
                                a: "Yes! You can upgrade any free form to a branded form at any time from your dashboard."
                            },
                            {
                                q: "Is there a refund policy?",
                                a: "Yes, if you're not satisfied within 7 days, contact us for a full refund. No questions asked."
                            },
                        ].map((faq, i) => (
                            <div key={i} className="neo-card p-6">
                                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* Footer with Logo */}
            <footer className="py-12 border-t-2 border-black dark:border-white/20 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <Logo width={120} height={32} />
                        </Link>
                        <p className="font-bold text-sm text-zinc-600 dark:text-zinc-400">
                            © 2024 Formlytic. Built with ❤️ for builders everywhere.
                        </p>
                        <a
                            href="mailto:satyamsinghpx@gmail.com"
                            className="text-sm font-bold hover:underline"
                        >
                            Contact: satyamsinghpx@gmail.com
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
