"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Link2,
  Globe,
  Smartphone,
  ExternalLink,
  Search,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  Calendar,
  AlertCircle
} from "lucide-react";

// Mock Data to make the Dashboard immediately useful and beautiful
const MOCK_LINKS = [
  {
    shortCode: "blackfriday",
    shortUrl: "https://lnk.cx/blackfriday",
    originalUrl: "https://example-store.com/campaigns/2026/black-friday-sale-portal",
    clicks: 124500,
    isActive: true,
    expiresAt: "2026-12-31T23:59:59.000Z",
    createdAt: "2026-05-24T10:15:30.000Z",
  },
  {
    shortCode: "next-gen-ai",
    shortUrl: "https://lnk.cx/next-gen-ai",
    originalUrl: "https://blog.google.com/products/workspace/next-generation-ai-tools-for-developers",
    clicks: 98200,
    isActive: true,
    expiresAt: null,
    createdAt: "2026-05-25T14:22:10.000Z",
  },
  {
    shortCode: "tw-promo",
    shortUrl: "https://lnk.cx/tw-promo",
    originalUrl: "https://x.com/marketing/promotional-tier-active-campaign-2026",
    clicks: 12430,
    isActive: false,
    expiresAt: "2026-05-20T18:00:00.000Z",
    createdAt: "2026-05-15T09:00:00.000Z",
  },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filteredLinks = MOCK_LINKS.filter(
    (l) =>
      l.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const triggerRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const totalClicks = MOCK_LINKS.reduce((acc, curr) => acc + curr.clicks, 0);

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Dynamic Header */}
      <header className="w-full bg-slate-900/40 border-b border-slate-900 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">Management Console</h1>
          </div>
          <button
            onClick={triggerRefresh}
            className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl hover:bg-slate-900 transition text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        
        {/* Core telemetry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Total Redirection Clicks",
              value: totalClicks.toLocaleString(),
              icon: TrendingUp,
              color: "text-emerald-400",
              bgColor: "bg-emerald-500/10",
              borderColor: "border-emerald-500/20",
            },
            {
              label: "Active Managed Links",
              value: MOCK_LINKS.length,
              icon: Link2,
              color: "text-indigo-400",
              bgColor: "bg-indigo-500/10",
              borderColor: "border-indigo-500/20",
            },
            {
              label: "OLAP Batch Sync Lag",
              value: "0.24 seconds",
              icon: BarChart3,
              color: "text-amber-400",
              bgColor: "bg-amber-500/10",
              borderColor: "border-amber-500/20",
            },
          ].map((stat) => (
            <motion.div
              whileHover={{ y: -2 }}
              key={stat.label}
              className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <p className="text-2xl font-black text-slate-100">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Visualization Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-bold text-slate-200">Ingested Clicks Time-Series (ClickHouse)</h2>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">Live stream</span>
            </div>
            {/* Click Time Series Mock representation bar graph */}
            <div className="h-48 flex items-end justify-between gap-1 pt-6 border-b border-slate-800/80">
              {[40, 25, 45, 60, 55, 70, 65, 80, 75, 95, 85, 100].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    style={{ height: `${val}%` }}
                    className="w-full bg-indigo-600/40 group-hover:bg-indigo-500/80 rounded-t-sm transition duration-200 cursor-pointer relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-slate-800 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                      {val * 1250} clicks
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest">{10 + idx}:00</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-6">
            <h2 className="text-md font-bold text-slate-200">Device & Geo Mix</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Mobile Platform</span>
                  </span>
                  <span>78%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-indigo-500 rounded-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-violet-400" />
                    <span>Geo: United States</span>
                  </span>
                  <span>65%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-violet-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Link Directory Search & Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <h2 className="text-lg font-bold text-slate-200">Short Links Directory</h2>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search short code or URL..."
                className="block w-full pl-9 pr-4 py-2 bg-slate-900/30 border border-slate-900 focus:border-slate-800 rounded-xl focus:outline-none transition duration-200 text-sm text-slate-300 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Links Listing */}
          <div className="rounded-2xl border border-slate-900/80 bg-slate-900/20 overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-900">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <div key={link.shortCode} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/10 transition">
                    <div className="space-y-2 overflow-hidden flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-md font-bold text-indigo-300 tracking-tight">{link.shortUrl}</span>
                        <a href={link.shortUrl} target="_blank" rel="noreferrer" className="p-1 hover:bg-slate-900 rounded-md text-slate-500 hover:text-slate-300 transition">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate max-w-xl">
                        Destination: <span className="text-slate-400 font-normal">{link.originalUrl}</span>
                      </p>
                      
                      {/* Timeline / Metadata tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                        </span>
                        {link.expiresAt ? (
                          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>Expires {new Date(link.expiresAt).toLocaleDateString()}</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Operational Details */}
                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-900">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Clicks Resolved</span>
                        <span className="text-md font-black text-slate-300">{link.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${link.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800/40 text-slate-500 border-slate-800"}`}>
                          {link.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500 font-medium">
                  No short links matched your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
