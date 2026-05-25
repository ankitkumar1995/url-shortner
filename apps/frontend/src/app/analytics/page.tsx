"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Globe,
  Smartphone,
  PieChart,
  Target,
  Clock,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function AnalyticsLandingPage() {
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
                link === "Analytics" ? "text-indigo-400" : "text-slate-400 hover:text-slate-100"
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
                  link === "Analytics" ? "text-indigo-400" : "text-slate-300 hover:text-white"
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

      {/* Analytics Content */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 space-y-16">
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight">
            Beautiful Real-Time Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
            Gain transparent insights into visitor engagement. Monitor click sources, track demographics, and review referrers with no latency.
          </p>
        </section>

        {/* Analytics pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: "Geographic Distribution",
              desc: "Determine which countries, states, and cities yield the highest traffic, letting you allocate local ad campaigns smartly."
            },
            {
              icon: Smartphone,
              title: "Device and Browser Mix",
              desc: "Check if visitors are interacting via mobile apps or desktop browsers. Pivot user flows to fit actual visitor usage."
            },
            {
              icon: Clock,
              title: "Hourly Traffic Trends",
              desc: "Track click spikes throughout the day to release social updates and email distributions during top-performing hours."
            },
            {
              icon: Target,
              title: "UTM Campaign Tracking",
              desc: "Add custom campaign variables to destination links and monitor performance details for specific channels in real time."
            },
            {
              icon: PieChart,
              title: "Web Referral Sources",
              desc: "Review which sites are driving the most traffic, from social channels to external blogs, in a beautifully simplified table."
            },
            {
              icon: TrendingUp,
              title: "Conversion Ratios",
              desc: "Map clicks against registrations or signups to track how effectively short links convert views into user accounts."
            }
          ].map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              key={item.title}
              className="p-6 bg-slate-900/20 border border-slate-900/60 rounded-2xl space-y-4 hover:border-slate-800 transition duration-200"
            >
              <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl w-fit text-indigo-455">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{item.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
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
              <Link href="/product" className="hover:text-slate-400">Overview</Link>
              <Link href="/features" className="hover:text-slate-400">Features</Link>
              <Link href="/pricing" className="hover:text-slate-400">Pricing</Link>
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-xs font-black uppercase text-slate-400 block tracking-widest">Analytics</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
              <Link href="/analytics" className="text-indigo-400">Real-Time Charts</Link>
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
