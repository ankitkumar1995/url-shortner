"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Sparkles, Copy, Check, Calendar, Plus, ExternalLink } from "lucide-react";
import { useShortenLink } from "../lib/api";

const schema = z.object({
  originalUrl: z.string().url("Please enter a valid HTTP or HTTPS link (e.g. https://domain.com)"),
  customAlias: z
    .string()
    .max(20, "Custom alias must be 20 characters or less")
    .regex(/^[a-zA-Z0-9-_]*$/, "Letters, numbers, hyphens, and underscores only")
    .optional()
    .or(z.literal("")),
  expiresAt: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function ShortenerForm() {
  const [copied, setCopied] = useState(false);
  const { mutate: shortenUrl, data: shortLink, isPending, error, reset } = useShortenLink();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange", // Inline real-time validation feedback!
    defaultValues: {
      originalUrl: "",
      customAlias: "",
      expiresAt: "",
    },
  });

  const onSubmit = (data: FormData) => {
    shortenUrl({
      originalUrl: data.originalUrl,
      customAlias: data.customAlias || undefined,
      expiresAt: data.expiresAt || undefined,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden transition-all duration-300"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-44 h-44 bg-cyan-accent/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          
          {/* Main URL Input */}
          <div className="space-y-2">
            <label htmlFor="originalUrl" className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
              Destination Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="originalUrl"
                {...register("originalUrl")}
                type="text"
                placeholder="https://stripe.com/docs/api/payment_intents/create"
                className="block w-full pl-11 pr-4 py-4 bg-slate-950/70 border border-slate-800/80 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/30 text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200 text-sm font-medium shadow-inner"
              />
            </div>
            <AnimatePresence>
              {errors.originalUrl && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-medium text-danger-rose"
                >
                  {errors.originalUrl.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Alias Input */}
            <div className="space-y-2">
              <label htmlFor="customAlias" className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                Branded Alias <span className="text-[10px] text-slate-600 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Sparkles className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="customAlias"
                  {...register("customAlias")}
                  type="text"
                  placeholder="e.g. active-promo"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/30 text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200 text-sm font-medium shadow-inner"
                />
              </div>
              <AnimatePresence>
                {errors.customAlias && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-medium text-danger-rose"
                  >
                    {errors.customAlias.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Expiration Date Input */}
            <div className="space-y-2">
              <label htmlFor="expiresAt" className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                Link Expiry <span className="text-[10px] text-slate-600 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="expiresAt"
                  {...register("expiresAt")}
                  type="datetime-local"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent/30 text-slate-300 focus:outline-none transition duration-200 text-sm font-medium shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isPending || (isDirty && !isValid)}
            className="w-full py-4 px-4 bg-gradient-to-r from-accent to-accent-hover focus:ring-1 focus:ring-accent/50 text-slate-100 font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-accent/10 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-accent/20 cursor-pointer"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Shorten destination URL</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Global Errors */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 bg-danger-rose/10 border border-danger-rose/20 rounded-xl text-danger-rose text-xs flex items-center justify-between font-semibold"
          >
            <span>{error.message || "Domain security check failed. URL may contain phishing links."}</span>
            <button onClick={reset} className="text-[10px] underline hover:text-danger-rose/80 uppercase font-black tracking-wider">Dismiss</button>
          </motion.div>
        )}

        {/* Outcome Card */}
        <AnimatePresence>
          {shortLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-slate-800/80 relative z-10"
            >
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5 overflow-hidden">
                  <span className="text-[10px] text-cyan-accent uppercase tracking-widest font-bold">Short Link Ready</span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={shortLink.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg font-black text-slate-100 hover:text-accent-hover hover:underline truncate block"
                    >
                      {shortLink.shortUrl}
                    </a>
                    <a href={shortLink.shortUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 transition">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(shortLink.shortUrl)}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-accent transition text-slate-300 cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-success-green" /> : <Copy className="h-4 w-4" />}
                  </motion.button>
                  <button
                    onClick={reset}
                    className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 border border-slate-800 font-bold tracking-wide uppercase cursor-pointer"
                  >
                    Shorten another
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
