"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, BarChart3, Zap, ArrowRight, Activity, Cpu } from "lucide-react";
import ShortenerForm from "../components/shortener-form";

export default function Home() {
  return (
    <div className="relative overflow-hidden flex-1 flex flex-col justify-between">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900 relative z-20">
        <Link href="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Lnk.CX
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-200 transition">
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-100 font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <span>Console</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full relative z-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold"
          >
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Next-Gen Link Analytics Infrastructure</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-none text-slate-100"
          >
            Shorten links. <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Track telemetry.
            </span> Secure edge.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 font-medium"
          >
            A high-performance URL shortener built on top of distributed Snowflake generators and Base62 encoding. Serve redirection maps under <span className="text-slate-200">15ms</span> globally.
          </motion.p>
        </div>

        {/* Shortener Container */}
        <ShortenerForm />

        {/* Values grid */}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              key={card.title}
              className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col justify-between hover:border-slate-800/80 transition duration-200"
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl w-fit">
                  <card.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">{card.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-950/50 bg-slate-950 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <span>&copy; {new Date().getFullYear()} LnkCX Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-400">Terms of Use</Link>
            <Link href="/" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-400">Security Core</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
