"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, BarChart3, Zap, ArrowRight, Activity, Cpu, CheckCircle2, ChevronRight } from "lucide-react";
import ShortenerForm from "../components/shortener-form";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#0B1020] bg-grid-pattern">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-accent/15 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* Premium Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.03] relative z-20">
        <Link href="/" className="text-xl font-black tracking-tighter bg-gradient-to-r from-slate-100 via-indigo-300 to-slate-100 bg-clip-text text-transparent flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-accent to-accent-hover flex items-center justify-center shadow-md shadow-accent/20">
            <span className="text-[10px] font-black text-white">L</span>
          </div>
          <span>Lnk.CX</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-slate-100 transition tracking-wide uppercase">
            Product
          </Link>
          <Link href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-slate-100 transition tracking-wide uppercase">
            Security Core
          </Link>
          <Link href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-slate-100 transition tracking-wide uppercase">
            OLAP Metrics
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-slate-100 transition">
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-100 font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-black/40 cursor-pointer"
          >
            <span>Start Free</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero & Form Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full relative z-10 space-y-16">
        
        {/* Animated Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold"
          >
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span className="tracking-wide uppercase text-[10px]">Vercel Edge Redirection Resolvers Active</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-slate-100 uppercase"
          >
            Shorten Link. <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-accent via-violet-300 to-cyan-accent bg-clip-text text-transparent">
              Trace Telemetry.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-md text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Deploy dynamic short codes mapped through distributed snowflake generators. Intercept phishing domains in real-time, and aggregate click data with ClickHouse OLAP speed.
          </motion.p>
        </div>

        {/* Dynamic Core Shortener Component */}
        <ShortenerForm />

        {/* Live Analytics Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl mx-auto rounded-2xl border border-white/[0.03] bg-slate-900/30 backdrop-blur-xl p-4 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 mb-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-success-green animate-ping" />
              <span>Real-Time Stream: blackfriday redirection telemetry</span>
            </div>
            <Link href="/dashboard" className="text-accent hover:text-accent-hover transition flex items-center gap-1">
              <span>View console</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {/* Visual Mini Graph */}
          <div className="h-28 flex items-end justify-between gap-1.5 pt-4">
            {[20, 35, 25, 45, 60, 50, 75, 90, 80, 100, 95, 110].map((val, i) => (
              <div key={i} className="flex-1 h-full flex flex-col justify-end group/bar">
                <div
                  style={{ height: `${(val / 110) * 100}%` }}
                  className="w-full bg-accent/25 group-hover/bar:bg-accent/80 rounded-t-sm transition duration-200"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <div className="py-8 border-y border-white/[0.02] text-center space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest block">Trusted by developers at leading platforms</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale contrast-200">
            {["Vercel", "Stripe", "Linear", "Supabase", "Notion"].map((logo) => (
              <span key={logo} className="text-md font-black tracking-tighter text-slate-300">{logo}</span>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            {
              icon: Cpu,
              title: "Base62 Encoding Engine",
              desc: "Monotonically increasing, collision-free codes mapped through distributed snowflake generators.",
            },
            {
              icon: BarChart3,
              title: "OLAP Click Telemetry",
              desc: "Ingests click pipelines via Kafka to ClickHouse databases to serve aggregated country/device charts instantly.",
            },
            {
              icon: Shield,
              title: "Security Shield",
              desc: "Dynamic Bloom filter sanitizers block phishing websites and spam domains automatically on creation.",
            },
          ].map((card, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              key={card.title}
              className="p-6 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex flex-col justify-between hover:border-slate-800/80 transition duration-200"
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl w-fit">
                  <card.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-md font-bold text-slate-200">{card.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.02] bg-slate-950 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-600 tracking-wider">
          <span>&copy; {new Date().getFullYear()} LNKCX CORPORATION. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6 uppercase">
            <Link href="/" className="hover:text-slate-400">Terms of Use</Link>
            <Link href="/" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-400">Security Core</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
