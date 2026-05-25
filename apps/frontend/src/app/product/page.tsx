"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Sparkles,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function ProductPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#0B1020] bg-grid-pattern text-slate-100 font-sans">
      
      {/* Background soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.02] relative z-30">
        <Link href="/" className="text-lg font-black tracking-tighter bg-gradient-to-r from-slate-100 via-indigo-300 to-slate-100 bg-clip-text text-transparent flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-white">L</span>
          </div>
          <span>Lnk.CX</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Product", "Features", "Pricing", "Analytics", "Resources"].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className={`text-xs font-semibold uppercase tracking-wider transition ${
                link === "Product" ? "text-indigo-400" : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {link}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in" className="text-xs font-bold text-slate-400 hover:text-slate-100 transition">
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            <span>Start Free</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-200"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-slate-950 border-b border-slate-900 px-6 py-6 absolute top-[68px] left-0 z-20 space-y-6 flex flex-col"
          >
            {["Product", "Features", "Pricing", "Analytics", "Resources"].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold uppercase tracking-wider ${
                  link === "Product" ? "text-indigo-400" : "text-slate-300 hover:text-white"
                }`}
              >
                {link}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-900 flex flex-col gap-4">
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-slate-400 text-center py-2">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold py-3 rounded-xl text-center shadow-lg"
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Hero */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 space-y-20">
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider"
          >
            <Sparkles className="h-3 w-3" />
            <span>Introducing Custom Domain Integrations</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-slate-100 uppercase"
          >
            The Ultimate Link <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
              Sharing Platform
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-md text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Build trust with custom branded links, monitor performance using elegant real-time graphs, and optimize campaigns with our high-performance routing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex items-center justify-center gap-4"
          >
            <Link
              href="/sign-up"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/10 flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </section>

        {/* Dynamic Showcase Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Link2,
              title: "Branded Short Domains",
              desc: "Deploy custom alias URLs that reflect your business name, reinforcing trust and boosting organic clicks."
            },
            {
              icon: Zap,
              title: "Sub-Millisecond Redirects",
              desc: "Experience ultra-fast global link forwarding that delivers visitors to destination pages instantly."
            },
            {
              icon: Globe,
              title: "Geographic Routing",
              desc: "Intelligently redirect customers to region-specific marketing pages based on visitor country origins."
            },
            {
              icon: Lock,
              title: "Secure Encrypted Links",
              desc: "Prevent link spoofing and malicious domain redirects with automatic security checks on every link."
            }
          ].map((feature, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              key={feature.title}
              className="p-6 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition duration-200"
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl w-fit">
                  <feature.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.02] bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase text-slate-400 block tracking-widest">Product</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
              <Link href="/product" className="text-indigo-400">Overview</Link>
              <Link href="/features" className="hover:text-slate-400">Features</Link>
              <Link href="/pricing" className="hover:text-slate-400">Pricing</Link>
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-xs font-black uppercase text-slate-400 block tracking-widest">Analytics</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
              <Link href="/analytics" className="hover:text-slate-400">Real-Time Charts</Link>
              <Link href="/resources" className="hover:text-slate-400">Geo Analytics</Link>
              <Link href="/dashboard" className="hover:text-slate-400">Console</Link>
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-xs font-black uppercase text-slate-400 block tracking-widest">Resources</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
              <Link href="/resources" className="hover:text-slate-400">FAQ Help</Link>
              <Link href="/resources" className="hover:text-slate-400">API Documentation</Link>
              <Link href="/resources" className="hover:text-slate-400">Support Center</Link>
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-xs font-black uppercase text-slate-400 block tracking-widest">Auth Gateway</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
              <Link href="/sign-in" className="hover:text-slate-400">Account login</Link>
              <Link href="/sign-up" className="hover:text-slate-400">Account Register</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-white/[0.02] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] font-bold text-slate-600 tracking-wider">
          <span>&copy; {new Date().getFullYear()} LNKCX CORPORATION. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6 uppercase">
            <Link href="/" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-400">DPA Regulations</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
