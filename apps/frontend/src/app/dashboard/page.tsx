"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import {
  Link2,
  Globe,
  Smartphone,
  ExternalLink,
  Search,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Loader2,
  QrCode,
  Layers,
  Settings,
  HelpCircle,
  Menu,
  X,
  Plus
} from "lucide-react";
import {
  useAnalyticsOverview,
  useAnalyticsClicks,
  useAnalyticsDevices,
  useAnalyticsCountries,
  useAllLinks
} from "../../lib/api";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeQrCode, setActiveQrCode] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TanStack Queries for real-time live data
  const { data: overview, isLoading: loadOverview, refetch: refetchOverview, error: errOverview } = useAnalyticsOverview();
  const { data: clickSeries, isLoading: loadClicks, refetch: refetchClicks } = useAnalyticsClicks();
  const { data: devices, isLoading: loadDevices, refetch: refetchDevices } = useAnalyticsDevices();
  const { data: countries, isLoading: loadGeo, refetch: refetchGeo } = useAnalyticsCountries();
  const { data: links, isLoading: loadLinks, refetch: refetchLinks } = useAllLinks();

  const filteredLinks = (links || []).filter(
    (l) =>
      l.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const triggerRefresh = () => {
    setRefreshing(true);
    Promise.all([
      refetchOverview(),
      refetchClicks(),
      refetchDevices(),
      refetchGeo(),
      refetchLinks()
    ]).finally(() => setRefreshing(false));
  };

  const copyLink = async (url: string, code: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const topCountry = countries ? Object.entries(countries).sort((a,b) => b[1] - a[1])[0] : null;
  const countryName = topCountry ? topCountry[0] : "None";
  const countryClicksCount = topCountry ? topCountry[1] : 0;

  const isGlobalLoading = loadOverview || loadClicks || loadDevices || loadGeo || loadLinks;

  return (
    <div className="min-h-screen flex bg-[#0B1020] text-slate-100 font-sans">
      
      {/* Sidebar Navigation - Vercel / Dub.co inspired */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/60 border-r border-white/[0.02] backdrop-blur-xl transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <Link href="/" className="text-md font-black tracking-tighter bg-gradient-to-r from-slate-100 via-indigo-300 to-slate-100 bg-clip-text text-transparent flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white">L</span>
                </div>
                <span>Lnk.CX Console</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1.5 flex flex-col font-semibold text-xs tracking-wider uppercase text-slate-400">
              <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-slate-100 transition">
                <Layers className="h-4 w-4 text-indigo-400" />
                <span>My Links</span>
              </Link>
              <Link href="/analytics" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-900/40 hover:text-slate-200 transition">
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
              <Link href="/product" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-900/40 hover:text-slate-200 transition">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Link href="/resources" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:text-slate-300 transition">
              <HelpCircle className="h-4 w-4" />
              <span>Help Center</span>
            </Link>
            <div className="border-t border-white/[0.02] pt-4 flex items-center gap-2.5 px-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">A</div>
              <span className="truncate">ankitkumar1995</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative z-10">
        
        {/* Dynamic header navbar */}
        <header className="w-full bg-slate-900/30 border-b border-white/[0.02] backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400">
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-md font-black tracking-tight text-slate-200 uppercase">My Links Directory</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerRefresh}
              className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl hover:bg-slate-900 transition text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
              <span>Sync</span>
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="p-6 md:p-8 flex-1 space-y-8 max-w-7xl w-full mx-auto">

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Total Clicks Resolved",
                value: overview ? overview.totalClicks.toLocaleString() : "0",
                icon: TrendingUp,
                color: "text-indigo-400",
                bgColor: "bg-indigo-500/10",
                borderColor: "border-indigo-500/20",
              },
              {
                label: "Short Links Created",
                value: overview ? overview.activeLinks.toLocaleString() : "0",
                icon: Link2,
                color: "text-indigo-400",
                bgColor: "bg-indigo-500/10",
                borderColor: "border-indigo-500/20",
              },
              {
                label: "Average Redirect Speed",
                value: overview ? overview.avgLatencyMs : "12 ms",
                icon: Zap,
                color: "text-indigo-400",
                bgColor: "bg-indigo-500/10",
                borderColor: "border-indigo-500/20",
              },
            ].map((stat) => (
              <motion.div
                whileHover={{ y: -1 }}
                key={stat.label}
                className="glass-card p-6 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 shadow-lg border border-white/[0.03]"
              >
                {isGlobalLoading ? (
                  <div className="space-y-2 animate-pulse w-full">
                    <div className="h-2 w-28 bg-slate-800 rounded" />
                    <div className="h-6 w-16 bg-slate-800 rounded" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">{stat.label}</span>
                    <p className="text-2xl font-black text-slate-100">{stat.value}</p>
                  </div>
                )}
                <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </motion.div>
            ))}
          </div>

          {errOverview && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Offline Fallback Active. Redirect dynamic links to populate overview analytics in real time.</span>
            </div>
          )}

          {/* Dynamic Area Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-6 flex flex-col justify-between border border-white/[0.03]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Click Distribution</h2>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Real-time click tracking data</span>
                </div>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  <span>Live Clicks</span>
                </span>
              </div>
              
              <div className="h-56 w-full pt-4 flex items-center justify-center">
                {loadClicks ? (
                  <div className="flex flex-col items-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                    <span>Loading statistics...</span>
                  </div>
                ) : clickSeries && clickSeries.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={clickSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "#64748B", fontSize: 9, fontWeight: 700 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 9, fontWeight: 700 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0B1020",
                          borderColor: "rgba(255,255,255,0.05)",
                          borderRadius: "12px",
                          color: "#F9FAFB",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#6366F1"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center">
                    Share links to map real-time click distributions!
                  </div>
                )}
              </div>
            </div>

            {/* Demographics splitting */}
            <div className="glass-card p-6 rounded-2xl space-y-6 flex flex-col justify-between border border-white/[0.03]">
              <div>
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Platform & Geography</h2>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Top visitor segmentations</span>
              </div>
              
              <div className="h-28 w-full flex items-center justify-center">
                {loadDevices ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                ) : devices && devices.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={devices} layout="vertical" barCategoryGap="20%">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0B1020",
                          borderColor: "rgba(255,255,255,0.05)",
                          borderRadius: "12px",
                          fontSize: "10px",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs text-slate-600 font-bold uppercase tracking-wide">Waiting for visitor logs</span>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="h-4 w-4 text-indigo-400" />
                      <span>Mobile Visitors</span>
                    </span>
                    <span>{devices && devices.find(d => d.name === "Mobile")?.percentage || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${devices && devices.find(d => d.name === "Mobile")?.percentage || 0}%` }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-indigo-400" />
                      <span>Top Country: {countryName}</span>
                    </span>
                    <span>{countryClicksCount} clicks</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-indigo-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Directory Listings */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Branded Short Links Directory</h2>
              
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search short code or URL..."
                  className="block w-full pl-9 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl focus:border-indigo-500 text-xs font-medium text-slate-300 placeholder-slate-650 focus:outline-none transition duration-200"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.02] bg-slate-900/10 overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="divide-y divide-white/[0.03]">
                {loadLinks ? (
                  <div className="p-12 flex flex-col items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                    <span>Syncing short link directory...</span>
                  </div>
                ) : filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <div key={link.shortCode} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-white/[0.01] transition duration-200">
                      <div className="space-y-2 overflow-hidden flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-md font-black text-indigo-300 tracking-tight">{link.shortUrl}</span>
                          <a href={link.shortUrl} target="_blank" rel="noreferrer" className="p-1 hover:bg-slate-900 rounded-md text-slate-500 hover:text-slate-300 transition">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-xl">
                          Target: <span className="text-slate-400 font-normal">{link.originalUrl}</span>
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                            <Calendar className="h-3.5 w-3.5 text-slate-600" />
                            <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                          </span>
                          {link.expiresAt ? (
                            <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1.5 uppercase tracking-wider">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-500/75" />
                              <span>Expires {new Date(link.expiresAt).toLocaleDateString()}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-white/[0.03]">
                        <div className="text-left md:text-right">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Clicks Resolved</span>
                          <span className="text-md font-black text-slate-200">{link.clicks.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Copy trigger */}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyLink(link.shortUrl, link.shortCode)}
                            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 hover:text-indigo-400 transition text-slate-400 cursor-pointer"
                          >
                            {copiedCode === link.shortCode ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </motion.button>
                          
                          {/* QR Trigger */}
                          <button
                            onClick={() => setActiveQrCode(activeQrCode === link.shortCode ? null : link.shortCode)}
                            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 hover:text-indigo-400 transition text-slate-400 cursor-pointer"
                            aria-label="Toggle QR code preview"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                          </button>

                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${link.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800/40 text-slate-500 border-slate-800"}`}>
                            {link.isActive ? "Active" : "Paused"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Dynamic QR Preview drawer */}
                      <AnimatePresence>
                        {activeQrCode === link.shortCode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full flex justify-center py-4 bg-slate-950/40 rounded-xl border border-white/[0.02] mt-2"
                          >
                            <div className="flex flex-col items-center gap-3 p-4 bg-slate-950 rounded-xl border border-slate-900 text-center">
                              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                <QrCode className="h-28 w-28 text-indigo-400 animate-pulse" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">Scan to browse short link</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-500 font-medium uppercase tracking-wider text-xs">
                    No links found matching your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
