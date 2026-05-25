import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, BarChart3, Globe, Smartphone, Monitor } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

// 1. Dynamic Metadata Generation for SEO/AEO/Search Optimization
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

  // Mock server lookup (in production, queries Postgres/ClickHouse)
  const clickCount = 45320;

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Navigation */}
      <header className="w-full bg-slate-900/40 border-b border-slate-900 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">Telemetry Details</h1>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-xl font-semibold">
            /{shortCode}
          </span>
        </div>
      </header>

      {/* Main telemetry cards */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Clicks Tracked</span>
            <h2 className="text-4xl font-black text-slate-100">{clickCount.toLocaleString()}</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl font-medium">
            Click data is dynamically synchronized across multi-region edge nodes and batched into the ClickHouse OLAP cluster for instant search-engine aggregation.
          </p>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Countries card */}
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-6">
            <h3 className="text-md font-bold text-slate-200 flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-400" />
              <span>Geographic Mix</span>
            </h3>
            <div className="space-y-4">
              {[
                { name: "United States", pct: 62 },
                { name: "India", pct: 21 },
                { name: "United Kingdom", pct: 10 },
              ].map((geo) => (
                <div key={geo.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{geo.name}</span>
                    <span>{geo.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div style={{ width: `${geo.pct}%` }} className="h-full bg-indigo-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Agents */}
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-6">
            <h3 className="text-md font-bold text-slate-200 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-violet-400" />
              <span>Device Profile</span>
            </h3>
            <div className="space-y-4">
              {[
                { name: "Mobile App Browsers", pct: 75, icon: Smartphone },
                { name: "Desktop Chrome/Safari", pct: 25, icon: Monitor },
              ].map((device) => (
                <div key={device.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <device.icon className="h-3.5 w-3.5 text-violet-400" />
                      <span>{device.name}</span>
                    </span>
                    <span>{device.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div style={{ width: `${device.pct}%` }} className="h-full bg-violet-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
