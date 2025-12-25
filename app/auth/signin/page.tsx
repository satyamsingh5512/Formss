"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f0f0f0]">
      {/* Background Pattern - Dot Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />

      {/* Decorative Scribbles */}
      <div className="absolute top-20 left-20 hidden md:block opacity-60 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="stroke-black stroke-[3px]">
          <path d="M10 50 Q 50 10 90 50 T 90 90" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-20 hidden md:block opacity-60 pointer-events-none">
        <Star size={48} className="text-black fill-yellow-300" strokeWidth={2.5} />
      </div>

      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 z-20">
        <div className="flex items-center gap-2 font-bold text-black border-2 border-black bg-white px-4 py-2 rounded-lg shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all">
          <ArrowLeft size={16} strokeWidth={3} />
          Back
        </div>
      </Link>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        className="relative w-full max-w-md bg-white border-2 border-black rounded-xl p-8 md:p-10 shadow-[8px_8px_0px_0px_#000000]"
      >
        {/* Card Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-block p-3 bg-black rounded-xl mb-4 shadow-neo-sm transform -rotate-3">
            <div className="w-8 h-8 bg-white rounded-lg" />
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Ready to build something awesome?
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full relative group bg-white border-2 border-black text-black font-bold text-lg py-4 rounded-xl shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm font-semibold text-zinc-500">
          By signing in, you agree to our <br />
          <Link href="#" className="text-black underline decoration-2 underline-offset-2 hover:text-blue-600">Terms of Service</Link> and <Link href="#" className="text-black underline decoration-2 underline-offset-2 hover:text-blue-600">Privacy Policy</Link>.
        </div>

        {/* Sticker Decoration */}
        <div className="absolute -top-3 -right-3 rotate-12 bg-yellow-300 border-2 border-black px-2 py-1 text-xs font-black shadow-neo-sm">
          SECURE
        </div>
      </motion.div>
    </div>
  );
}
