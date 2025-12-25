"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
    return (
        <footer className="border-t-2 border-black dark:border-white/20 bg-white dark:bg-zinc-950 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Logo width={40} height={40} />
                            <span className="text-xl font-bold">Formlytic</span>
                        </Link>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">
                            The modern form builder for creators who care about design and experience.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Product</h4>
                        <ul className="space-y-4">
                            {["Features", "Pricing", "About", "Changelog"].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase()}`} className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:underline decoration-2 underline-offset-4">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Legal</h4>
                        <ul className="space-y-4">
                            {["Privacy", "Terms", "Security"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:underline decoration-2 underline-offset-4">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/10 dark:border-white/10">
                    <p className="text-zinc-500 font-medium">© 2024 Formlytic. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        {/* Socials placeholders */}
                        <a href="#" className="font-bold hover:underline">Twitter</a>
                        <a href="#" className="font-bold hover:underline">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
