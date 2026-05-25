"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  QrCode,
  Users,
  Compass,
  DollarSign,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import ShortenerForm from "../components/shortener-form";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is a branded short link?",
      a: "A branded short link is a shortened URL that incorporates your own custom domain name (e.g., brand.co/deal). This builds brand recognition and increases click-through rates by up to 34% compared to generic short links.",
    },
    {
      q: "How accurate are the click analytics?",
      a: "Our platform tracks clicks in real time with edge-compatible database indexing. We capture country origin, device profile, web browser, and referring websites while maintaining absolute user privacy compliance.",
    },
    {
      q: "Can I generate QR codes for my links?",
      a: "Yes! Every short link you create automatically compiles a matching high-quality vector QR code. You can download and print these QR codes for marketing pamphlets, packaging, or store signs.",
    },
    {
      q: "Is there a limit to how many links I can shorten?",
      a: "Our Free Tier allows you to shorten up to 100 links per month. Our Pro and Enterprise tiers offer unlimited dynamic shortenings, custom domain attachments, and advanced team seats.",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#0B1020] bg-grid-pattern text-slate-100 font-sans">
      
      {/* Background radial soft light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* 1. Header & Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.02] relative z-30">
        <Link href="/" className="text-lg font-black tracking-tighter bg-gradient-to-r from-slate-100 via-indigo-300 to-slate-100 bg-clip-text text-transparent flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-white">L</span>
          </div>
          <span>Lnk.CX</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Product", "Features", "Pricing", "Analytics", "Resources"].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-xs font-semibold text-slate-400 hover:text-slate-100 transition uppercase tracking-wider"
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Auth triggers */}
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

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-200"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Navbar Drawer */}
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
                className="text-sm font-bold text-slate-300 hover:text-white uppercase tracking-wider"
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
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold py-3 rounded-xl text-center shadow-lg cursor-pointer"
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full relative z-10">

        {/* 2. Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center space-y-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider"
            >
              <Zap className="h-3 w-3" />
              <span>Scale your link sharing instantly</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none text-slate-100"
            >
              Shorten, Track & <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
                Share Links Smarter
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-md text-slate-400 font-medium max-w-xl mx-auto leading-relaxed"
            >
              Create branded short links, track click performance in real time, and grow your audience with beautiful, user-friendly analytics dashboards.
            </motion.p>
          </div>

          {/* Quick interactive Shortener form */}
          <ShortenerForm />
        </section>

        {/* 3. Trusted By Companies */}
        <section className="max-w-7xl mx-auto px-6 py-8 border-y border-white/[0.02] text-center space-y-4">
          <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest block">Trusted by creators and modern teams globally</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale contrast-150">
            {["Vercel", "Stripe", "Linear", "Supabase", "Notion"].map((logo) => (
              <span key={logo} className="text-sm font-black tracking-tighter text-slate-300">{logo}</span>
            ))}
          </div>
        </section>

        {/* 4. Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-black text-slate-100 uppercase tracking-tight">Everything you need to share smarter</h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
              We provide powerful link building tools in a simple, beautiful interface. Skip the complex infrastructure and start optimizing links instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Custom Branded Links",
                desc: "Increase user trust and recognition by attaching your own branded custom domain name to short URLs.",
              },
              {
                icon: BarChart3,
                title: "Real-Time Tracking",
                desc: "Monitor your clicks instantly. Get dynamic graphs and aggregates representing user country origins and devices.",
              },
              {
                icon: QrCode,
                title: "Dynamic QR Codes",
                desc: "Generate print-ready vector QR codes matching every shortened link automatically on creation.",
              },
            ].map((card, i) => (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={card.title}
                className="p-6 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex flex-col justify-between hover:border-slate-800/80 transition duration-200"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl w-fit">
                    <card.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">{card.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. Analytics Preview Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Real-Time Audience Analytics</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-100 leading-none uppercase">Understand Who Clicks Your Links</h2>
            <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
              Track conversion funnels easily. Get detailed insights on top performing campaigns, country demographics, devices mix, browser types, and web referrers.
            </p>
            <div className="space-y-3 font-semibold text-xs text-slate-300">
              {["Daily Click-tracking graphs", "Country and Geographic splits", "Device and OS analytics"].map((feat) => (
                <div key={feat} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.02] bg-slate-900/30 p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 mb-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <span>Traffic Performance</span>
              <span className="text-indigo-400">Live updating</span>
            </div>
            {/* Click bar chart preview */}
            <div className="h-32 flex items-end justify-between gap-1 pt-4 border-b border-slate-900">
              {[20, 45, 30, 60, 50, 75, 70, 90, 85, 100, 90, 110].map((val, i) => (
                <div key={i} className="flex-1 h-full flex flex-col justify-end group/bar">
                  <div
                    style={{ height: `${(val / 110) * 100}%` }}
                    className="w-full bg-indigo-600/30 group-hover/bar:bg-indigo-500/80 rounded-t-sm transition duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. QR Code Feature */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="p-6 rounded-2xl border border-white/[0.02] bg-slate-900/30 flex items-center justify-center min-h-[250px] relative order-last lg:order-first shadow-2xl">
            <div className="p-8 bg-slate-950 border border-slate-900 rounded-2xl shadow-xl flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <QrCode className="h-16 w-16 text-indigo-400" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Lnk.CX Code</span>
                <span className="text-sm font-black text-slate-200">brand.co/spring-promo</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              <QrCode className="h-3.5 w-3.5" />
              <span>Offline and Print Marketing</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-100 leading-none uppercase">Generate Instant QR Codes</h2>
            <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
              Bridge the gap between offline physical media and digital web assets. Download vectorized QR code image files for printed flyers, pamphlets, or product boxes.
            </p>
          </div>
        </section>

        {/* 7. Link Management Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-slate-100 leading-none uppercase">Robust Link Management</h2>
              <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
                Stay fully in control. Edit destination URLs dynamically even after publication without altering the shortened link. Set link expiration schedules or delete links to revoke immediately.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/[0.02] bg-slate-900/30 p-6 space-y-4 shadow-2xl">
              {[
                { title: "Dynamic Redirects", desc: "Update link targets anytime" },
                { title: "Expiration Schedulers", desc: "Auto-disable links after dates" },
                { title: "Link Deactivation", desc: "Soft-delete or revoke links instantly" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-900 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Team Collaboration */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="p-6 rounded-2xl border border-white/[0.02] bg-slate-900/30 flex flex-col justify-center min-h-[250px] relative order-last shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-950/80 border border-slate-900 rounded-xl">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-200">Marketing Team Seat</p>
                    <span className="text-[10px] text-slate-500">Collaborator access granted</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-950/80 border border-slate-900 rounded-xl opacity-60">
                  <Users className="h-4 w-4 text-slate-500" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-400">Developer Seat</p>
                    <span className="text-[10px] text-slate-600">Pending invitation accept</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                <Users className="h-3.5 w-3.5" />
                <span>Enterprise Seats Workspace</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-100 leading-none uppercase">Grow Together with Team Workspaces</h2>
              <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
                Connect your organization. Create shared workspaces, delegate creation controls, invite collaborators, and analyze link directories together.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Pricing Preview */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-black text-slate-100 uppercase tracking-tight">Flexible SaaS Pricing Plans</h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
              Start shortening for free and expand as your traffic grows. Select a plan tailored to your team seat size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "0", feat: ["100 links / mo", "Standard Analytics", "1 Custom Domain", "1 Team Seat"] },
              { name: "Professional", price: "29", feat: ["Unlimited links", "Real-Time Demographics", "3 Custom Domains", "5 Team Seats"], active: true },
              { name: "Enterprise", price: "99", feat: ["Unlimited links", "Real-Time Telemetries", "10 Custom Domains", "Unlimited Seats"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl border flex flex-col justify-between gap-6 ${plan.active ? "bg-indigo-950/20 border-indigo-500/50 shadow-lg shadow-indigo-600/5" : "bg-slate-900/20 border-slate-900/60"}`}
              >
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{plan.name}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-100">${plan.price}</span>
                    <span className="text-xs font-bold text-slate-500">/ month</span>
                  </div>
                  <div className="border-t border-slate-900 pt-4 space-y-2.5 text-xs text-slate-400 font-medium">
                    {plan.feat.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-center border uppercase tracking-wider block transition ${plan.active ? "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-slate-100" : "bg-slate-950 border-slate-900 hover:bg-slate-900 text-slate-300"}`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Testimonials */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16 border-t border-white/[0.02]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "LnkCX has completely overrode our SMS campaigns. Branded domains helped grow click conversions by almost 40%.",
                author: "Sarah Jenkins",
                role: "VP of Growth, Horizon Retail",
              },
              {
                q: "The real-time geographic metrics are incredibly detailed. We can dynamically route traffic in seconds.",
                author: "Alex Rivera",
                role: "Marketing Manager, StackFlow",
              },
            ].map((t, idx) => (
              <div key={idx} className="p-6 bg-slate-900/10 border border-slate-900/60 rounded-2xl space-y-4">
                <p className="text-xs text-slate-400 font-medium italic leading-relaxed">"{t.q}"</p>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{t.author}</h4>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. FAQ Section */}
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12">
          <h2 className="text-2xl md:text-3xl font-black text-center text-slate-100 uppercase tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-slate-900/60 bg-slate-900/10 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-xs text-slate-200 hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`h-4 w-4 text-slate-500 transform transition-transform ${activeFaq === idx ? "rotate-90 text-indigo-400" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-xs text-slate-500 font-medium leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 12. Footer */}
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
            <Link href="/" className="hover:text-slate-400">Privacy Core</Link>
            <Link href="/" className="hover:text-slate-400">DPA Regulations</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
