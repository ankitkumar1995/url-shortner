"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Menu, X, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 0,
      annualPrice: 0,
      desc: "Perfect for personal branding and project launches.",
      features: [
        "100 shortened links / month",
        "Basic Analytics Dashboard",
        "1 Custom Domain Attachment",
        "1 Workspace Seat",
        "Standard vector QR codes"
      ]
    },
    {
      name: "Professional",
      monthlyPrice: 29,
      annualPrice: 22,
      desc: "Ideal for growth-focused marketing teams.",
      features: [
        "Unlimited short links",
        "Real-Time Audience Demographics",
        "3 Custom Domain Attachments",
        "5 Workspace Seats",
        "Dynamic Vector QR Codes",
        "Automatic link expiration scheduling",
        "Standard Support"
      ],
      active: true
    },
    {
      name: "Enterprise",
      monthlyPrice: 99,
      annualPrice: 79,
      desc: "For scaled infrastructure and security control.",
      features: [
        "Unlimited short links",
        "Advanced Analytics & Charts",
        "10 Custom Domain Attachments",
        "Unlimited Workspace Seats",
        "Rest API integration credentials",
        "Bulk link upload parser",
        "24/7 Priority Support SLA"
      ]
    }
  ];

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
                link === "Pricing" ? "text-indigo-400" : "text-slate-400 hover:text-slate-100"
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
                  link === "Pricing" ? "text-indigo-400" : "text-slate-300 hover:text-white"
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

      {/* Pricing Header */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 space-y-16">
        <section className="text-center max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
            Choose a plan tailored to your audience scale. Start shortening for free and expand as your monthly traffic grows.
          </p>

          {/* Billing cycle selector */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-indigo-400" : "text-slate-500"}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="w-10 h-6 bg-slate-950 border border-slate-800 rounded-full p-1 relative flex items-center cursor-pointer transition duration-300"
              aria-label="Toggle billing cycle"
            >
              <motion.div
                layout
                className="w-3.5 h-3.5 bg-indigo-500 rounded-full"
                animate={{ x: billingCycle === "monthly" ? 0 : 16 }}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === "annually" ? "text-indigo-400" : "text-slate-500"}`}>
              <span>Annually</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Save 20%</span>
            </span>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;

            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={plan.name}
                className={`p-6 rounded-2xl border flex flex-col justify-between gap-6 transition ${
                  plan.active
                    ? "bg-indigo-950/20 border-indigo-500/50 shadow-lg shadow-indigo-600/5"
                    : "bg-slate-900/20 border-slate-900/60"
                }`}
              >
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">{plan.name}</span>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-100">${price}</span>
                    <span className="text-xs font-bold text-slate-500">/ month</span>
                  </div>
                  <div className="border-t border-slate-900 pt-4 space-y-3 text-xs text-slate-400 font-medium">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-indigo-450 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/sign-up"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-center border uppercase tracking-wider block transition cursor-pointer ${
                    plan.active
                      ? "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-slate-100"
                      : "bg-slate-950 border-slate-900 hover:bg-slate-900 text-slate-300"
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </motion.div>
            );
          })}
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
              <Link href="/pricing" className="text-indigo-400">Pricing</Link>
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
