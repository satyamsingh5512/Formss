import { PremiumNavbar } from "@/components/landing/PremiumNavbar";
import { Heart, Zap, Users, Target, Sparkles, Code2, Shield, Globe } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <PremiumNavbar />

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo-sm mb-8">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="font-bold text-sm">Our Mission</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
                        Built to <span className="italic font-serif text-indigo-600 dark:text-indigo-400">Serve</span>,<br />
                        Designed to <span className="italic font-serif text-emerald-600 dark:text-emerald-400">Empower</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                        At Formlytic, we believe powerful tools should be accessible to everyone. Our mission is to help creators, educators, and businesses collect data beautifully—without complexity, without compromise.
                    </p>
                </section>

                {/* Motive Section */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="neo-card bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/30 dark:to-emerald-950/30 border-2 border-black dark:border-white/20 p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold">
                                    <Target className="h-4 w-4" />
                                    Our Motive
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                    Serving the community with tools that matter
                                </h2>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    We started Formlytic with a simple belief: <strong>everyone deserves access to beautiful, functional tools</strong>. Whether you're a student conducting research, a startup gathering feedback, or an educator running quizzes—you shouldn't need to pay a fortune or settle for ugly, complicated forms.
                                </p>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Our commitment is to build with purpose, serve with passion, and always put our users first. This isn't just a product—it's our way of giving back.
                                </p>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Users, label: "Community First", color: "bg-blue-500" },
                                        { icon: Zap, label: "Fast & Reliable", color: "bg-yellow-500" },
                                        { icon: Shield, label: "Privacy Focused", color: "bg-green-500" },
                                        { icon: Globe, label: "Accessible to All", color: "bg-purple-500" },
                                    ].map((item, i) => (
                                        <div key={i} className="neo-card p-4 text-center hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                                            <div className={`w-12 h-12 ${item.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                                                <item.icon className="h-6 w-6 text-white" />
                                            </div>
                                            <span className="font-bold text-sm">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Every decision we make is guided by these core principles.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Sparkles,
                                title: "Design Excellence",
                                desc: "We believe aesthetics drive engagement. Every form should be a delight to fill out.",
                                color: "bg-pink-500"
                            },
                            {
                                icon: Code2,
                                title: "Developer Friendly",
                                desc: "Built by developers, for developers. Clean code, easy integrations, powerful APIs.",
                                color: "bg-indigo-500"
                            },
                            {
                                icon: Shield,
                                title: "Privacy First",
                                desc: "Your data belongs to you. We never sell or share your information. Period.",
                                color: "bg-emerald-500"
                            }
                        ].map((item, i) => (
                            <div key={i} className="neo-card hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                                <div className={`w-14 h-14 ${item.color} rounded-xl mb-6 flex items-center justify-center shadow-lg`}>
                                    <item.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Story Section */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="neo-card bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-white/20 p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold">The Story Behind Formlytic</h2>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Formlytic was born from frustration with existing form builders—they were either too expensive, too ugly, or too complicated. We wanted something different.
                                </p>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    We set out to build a platform that combines the power of enterprise tools with the simplicity that creators love. Today, we're proud to serve students, startups, and businesses who share our vision of making data collection beautiful.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm">
                                        🚀 Made with love
                                    </div>
                                    <div className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm">
                                        🌍 For the community
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full relative h-[350px] border-2 border-black dark:border-white/20 rounded-xl overflow-hidden bg-white dark:bg-black">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/30 via-emerald-500/10 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-8xl md:text-9xl font-black opacity-20">F</span>
                                        <p className="text-sm font-bold text-zinc-500 mt-2">Est. 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-6 text-center">
                    <div className="neo-card bg-black dark:bg-white text-white dark:text-black p-12 border-2 border-black dark:border-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Something Amazing?</h2>
                        <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                            Join thousands of creators who trust Formlytic to power their data collection.
                        </p>
                        <a href="/dashboard" className="inline-block px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-bold rounded-xl border-2 border-white dark:border-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                            Get Started — It's Free
                        </a>
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
