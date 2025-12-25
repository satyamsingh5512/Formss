import { PremiumNavbar } from "@/components/landing/PremiumNavbar";
import { Footer } from "@/components/landing/Footer"; // Assuming Footer exists based on previous file lists or logic
import { ArrowRight, Check } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <PremiumNavbar />

            <main className="pt-32 pb-20">
                {/* Header Section */}
                <section className="container mx-auto px-6 mb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo-sm mb-8">
                        <span className="font-bold text-sm">Our Mission</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        Empowering <span className="italic font-serif">builders</span> <br /> to create better forms.
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        We believe that data collection shouldn't be boring. Formlytic brings style, power, and simplicity together in one cohesive platform.
                    </p>
                </section>

                {/* Values Section */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Design First", desc: "Aesthetics aren't just an afterthought. They are the core of user engagement." },
                            { title: "Developer Friendly", desc: "Built by developers, for developers. Clean code, fast exports, api-ready." },
                            { title: "Privacy Focused", desc: "Your data is yours. We prioritize security and privacy above all else." }
                        ].map((item, i) => (
                            <div key={i} className="neo-card hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                                <div className="w-12 h-12 bg-black dark:bg-white rounded-lg mb-6 flex items-center justify-center">
                                    <span className="text-white dark:text-black font-bold text-xl">{i + 1}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Story Section */}
                <section className="container mx-auto px-6">
                    <div className="neo-card bg-zinc-100 dark:bg-zinc-900 border-2 border-black p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <h2 className="text-4xl font-bold">The Story</h2>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Formlytic started as a simple idea: why do most forms look the same? We wanted to break the mold of generic, corporate data collection and replace it with something bold, expressive, and fun.
                                </p>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Today, we help thousands of creators and businesses build forms that people actually enjoy filling out.
                                </p>
                            </div>
                            <div className="flex-1 w-full relative h-[400px] border-2 border-black rounded-xl overflow-hidden bg-white dark:bg-black">
                                {/* Placeholder for team or office image - using abstract pattern */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                                    {[...Array(36)].map((_, i) => (
                                        <div key={i} className={`border-r border-b border-black/10 dark:border-white/10 ${i % 7 === 0 ? 'bg-black/5 dark:bg-white/5' : ''}`} />
                                    ))}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-9xl font-black opacity-10 rotate-12">F</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Assuming Footer reuse or simple footer */}
            <footer className="py-12 border-t-2 border-black dark:border-white/20 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6 text-center">
                    <p className="font-bold">© 2024 Formlytic. Built for builders.</p>
                </div>
            </footer>
        </div>
    );
}
