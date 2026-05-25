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
  Loader2
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

  // Consume live API streams via TanStack Query!
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

  // Geo Data Parsing helper
  const topCountry = countries ? Object.entries(countries).sort((a,b) => b[1] - a[1])[0] : null;
  const countryName = topCountry ? topCountry[0] : "None";
  const countryClicksCount = topCountry ? topCountry[1] : 0;

  const isGlobalLoading = loadOverview || loadClicks || loadDevices || loadGeo || loadLinks;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B1020] bg-grid-pattern text-slate-100">
      
      {/* Dynamic Header */}
      <header className="w-full bg-slate-900/40 border-b border-white/[0.03] backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-400 hover:text-slate-200 transition"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-200 uppercase">Management Dashboard</h1>
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Lnk.CX Live telemetry</span>
            </div>
          </div>
          <button
            onClick={triggerRefresh}
            className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl hover:bg-slate-900 transition text-slate-400 hover:text-accent flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-accent" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* Grid Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8 relative z-10">
        
        {/* Core telemetry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Live Database Clicks",
              value: overview ? overview.totalClicks.toLocaleString() : "0",
              icon: TrendingUp,
              color: "text-indigo-400",
              bgColor: "bg-indigo-500/10",
              borderColor: "border-indigo-500/20",
            },
            {
              label: "Active Short Link Codes",
              value: overview ? overview.activeLinks.toLocaleString() : "0",
              icon: Link2,
              color: "text-accent",
              bgColor: "bg-accent/10",
              borderColor: "border-accent/20",
            },
            {
              label: "OLAP Aggregations Latency",
              value: overview ? overview.avgLatencyMs : "12 ms",
              icon: Zap,
              color: "text-cyan-accent",
              bgColor: "bg-cyan-accent/10",
              borderColor: "border-cyan-accent/20",
            },
          ].map((stat) => (
            <motion.div
              whileHover={{ y: -1 }}
              key={stat.label}
              className="glass-card p-6 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300"
            >
              {isGlobalLoading ? (
                <div className="space-y-2 animate-pulse w-full">
                  <div className="h-2 w-28 bg-slate-800 rounded" />
                  <div className="h-6 w-16 bg-slate-800 rounded" />
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">{stat.label}</span>
                  <p className="text-3xl font-black text-slate-100">{stat.value}</p>
                </div>
              )}
              <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </motion.div>
          ))}
        </div>

        {errOverview && (
          <div className="p-4 bg-danger-rose/10 border border-danger-rose/20 rounded-xl text-danger-rose text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Connection error with local PostgreSQL/Redis servers. Showing cached fallback metrics.</span>
          </div>
        )}

        {/* Analytics Visualization Panel with Recharts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Area Chart Card */}
          <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Live Ingested Clicks Time-Series</h2>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Dynamic SQL aggregate logs</span>
              </div>
              <span className="text-[9px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>Live stream</span>
              </span>
            </div>
            
            {/* Area chart mapping real-time logs */}
            <div className="h-56 w-full pt-4 flex items-center justify-center">
              {loadClicks ? (
                <div className="flex flex-col items-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-wider">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  <span>Loading Chart stream...</span>
                </div>
              ) : clickSeries && clickSeries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clickSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
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
                      stroke="#7C3AED"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorClicks)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center">
                  No clicks resolved yet. Redirect a link to populate chart telemetries!
                </div>
              )}
            </div>
          </div>

          {/* Demographics Circular/Bar Mix */}
          <div className="glass-card p-6 rounded-2xl space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Platform Demographics</h2>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Grouped DB device splits</span>
            </div>
            
            {/* Visual Mini Chart */}
            <div className="h-28 w-full flex items-center justify-center">
              {loadDevices ? (
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
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
                <span className="text-xs text-slate-600 font-bold uppercase tracking-wide">Waiting for device logs</span>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-accent" />
                    <span>Mobile Platform</span>
                  </span>
                  <span>{devices && devices.find(d => d.name === "Mobile")?.percentage || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${devices && devices.find(d => d.name === "Mobile")?.percentage || 0}%` }}
                    className="h-full bg-accent rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-cyan-accent" />
                    <span>Geo: {countryName}</span>
                  </span>
                  <span>{countryClicksCount} clicks</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-cyan-accent rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Search & Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <h2 className="text-md font-bold text-slate-200 uppercase tracking-widest">Active Short Links Directory</h2>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search link codes or URLs..."
                className="block w-full pl-9 pr-4 py-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl focus:border-accent text-xs font-medium text-slate-300 placeholder-slate-600 focus:outline-none transition duration-200"
              />
            </div>
          </div>

          {/* Links Directory list */}
          <div className="rounded-2xl border border-white/[0.03] bg-slate-900/10 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="divide-y divide-white/[0.03]">
              {loadLinks ? (
                <div className="p-12 flex flex-col items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  <span>Syncing link directory...</span>
                </div>
              ) : filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <div key={link.shortCode} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-white/[0.01] transition duration-200">
                    <div className="space-y-2.5 overflow-hidden flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-md font-black text-indigo-300 tracking-tight">{link.shortUrl}</span>
                        <a href={link.shortUrl} target="_blank" rel="noreferrer" className="p-1 hover:bg-slate-900 rounded-md text-slate-500 hover:text-slate-300 transition">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate max-w-xl">
                        Destination: <span className="text-slate-400 font-normal">{link.originalUrl}</span>
                      </p>
                      
                      {/* Timeline Metadata tags */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <Calendar className="h-3.5 w-3.5 text-slate-600" />
                          <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                        </span>
                        {link.expiresAt ? (
                          <span className="text-[10px] font-bold text-danger-rose flex items-center gap-1.5 uppercase tracking-wider">
                            <AlertCircle className="h-3.5 w-3.5 text-danger-rose/75" />
                            <span>Expires {new Date(link.expiresAt).toLocaleDateString()}</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Operational Details */}
                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-white/[0.03]">
                      <div className="text-left md:text-right">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Total Clicks</span>
                        <span className="text-lg font-black text-slate-200">{link.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyLink(link.shortUrl, link.shortCode)}
                          className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl hover:bg-slate-850 hover:text-accent transition text-slate-400 cursor-pointer"
                        >
                          {copiedCode === link.shortCode ? (
                            <Check className="h-3.5 w-3.5 text-success-green" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </motion.button>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${link.isActive ? "bg-success-green/10 text-success-green border-success-green/20" : "bg-slate-800/40 text-slate-500 border-slate-800"}`}>
                          {link.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500 font-medium uppercase tracking-wider text-xs">
                  No short links matched your search filters.
                </div>
              )}
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
