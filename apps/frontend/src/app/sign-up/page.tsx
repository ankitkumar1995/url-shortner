"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup redirect to onboarding/dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-[#0B1020] bg-grid-pattern text-slate-100 font-sans p-6">
      
      {/* Background soft glow */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent blur-[100px] pointer-events-none" />

      {/* Return Home Link */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-200 transition uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-slate-900/60 border border-white/[0.03] backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-md font-black tracking-tighter bg-gradient-to-r from-slate-100 via-indigo-300 to-slate-100 bg-clip-text text-transparent mb-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center">
                <span className="text-[10px] font-black text-white">L</span>
              </div>
              <span>Lnk.CX</span>
            </Link>
            <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight">Create Account</h2>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Get started for free in less than a minute</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-650">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Jenkins"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl focus:border-indigo-500 text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-650">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl focus:border-indigo-500 text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-650">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl focus:border-indigo-500 text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Prompt Sign-in */}
          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 underline">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
