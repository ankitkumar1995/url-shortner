import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Globe, Smartphone, Monitor } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const shortCode = resolvedParams.shortCode;

  return {
    title: `Analytics for /${shortCode}`,
    description: `Inspect dynamic real-time analytics, user demographics, geographic distribution, and performance data for link /${shortCode}.`,
    openGraph: {
      title: `Analytics dashboard for /${shortCode}`,
      description: `Track click conversion details for shortened URL /${shortCode} in real-time.`,
    },
  };
}

// 2. Server-Side Rendered (SSR) Dynamic Page
export default async function AnalyticsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const shortCode = resolvedParams.shortCode;

  const clickCount = 45320;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B1020] bg-grid-pattern text-slate-100">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-accent/10 via-transparent to-transparent blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full bg-slate-900/40 border-b border-white/[0.03] backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-400 hover:text-slate-200 transition"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-200 uppercase">Link Analytics</h1>
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Visitor demographics and clicks</span>
            </div>
          </div>
          <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider">
            /{shortCode}
          </span>
        </div>
      </header>

      {/* Main telemetry cards */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8 relative z-10">
        
        {/* Click Ingestion summary */}
        <div className="glass-card p-8 rounded-2xl space-y-6">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Total Clicks Resolved</span>
            <h2 className="text-4xl font-black text-slate-100">{clickCount.toLocaleString()} clicks</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl font-medium">
            Click data is tracked in real-time, helping you analyze user engagement, geographic distribution, and visitor device demographics easily.
          </p>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Countries card */}
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-widest">
              <Globe className="h-4.5 w-4.5 text-accent" />
              <span>Geographic Mix</span>
            </h3>
            <div className="space-y-4">
              {[
                { name: "United States", pct: 62 },
                { name: "India", pct: 21 },
                { name: "United Kingdom", pct: 10 },
              ].map((geo) => (
                <div key={geo.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>{geo.name}</span>
                    <span>{geo.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div style={{ width: `${geo.pct}%` }} className="h-full bg-accent rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Agents */}
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-widest">
              <Smartphone className="h-4.5 w-4.5 text-cyan-accent" />
              <span>Device Profile</span>
            </h3>
            <div className="space-y-4">
              {[
                { name: "Mobile App Browsers", pct: 75, icon: Smartphone },
                { name: "Desktop Chrome/Safari", pct: 25, icon: Monitor },
              ].map((device) => (
                <div key={device.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <device.icon className="h-3.5 w-3.5 text-cyan-accent" />
                      <span>{device.name}</span>
                    </span>
                    <span>{device.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div style={{ width: `${device.pct}%` }} className="h-full bg-cyan-accent rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.02] bg-slate-950 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-bold text-slate-600 tracking-wider">
          <span>&copy; {new Date().getFullYear()} LNKCX CORPORATION. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6 uppercase">
            <Link href="/" className="hover:text-slate-400">Terms</Link>
            <Link href="/" className="hover:text-slate-400">Privacy</Link>
            <Link href="/" className="hover:text-slate-400">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
