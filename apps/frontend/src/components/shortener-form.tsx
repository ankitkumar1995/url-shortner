"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Sparkles, Copy, Check, Calendar, Plus } from "lucide-react";
import { useShortenLink } from "../lib/api";

const schema = z.object({
  originalUrl: z.string().url("Please enter a valid HTTP or HTTPS URL."),
  customAlias: z
    .string()
    .max(20, "Custom alias must be 20 characters or less.")
    .regex(/^[a-zA-Z0-9-_]*$/, "Letters, numbers, hyphens, and underscores only.")
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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          {/* Main URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block">Destination URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-slate-500" />
              </div>
              <input
                {...register("originalUrl")}
                type="text"
                placeholder="https://example.com/very/long/path/to/product"
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 placeholder-slate-500 focus:outline-none transition duration-200"
              />
            </div>
            {errors.originalUrl && (
              <p className="text-xs text-rose-500 mt-1">{errors.originalUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Alias Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">Custom Alias (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Sparkles className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  {...register("customAlias")}
                  type="text"
                  placeholder="e.g. promo-code"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 text-slate-100 placeholder-slate-500 text-sm"
                />
              </div>
              {errors.customAlias && (
                <p className="text-xs text-rose-500 mt-1">{errors.customAlias.message}</p>
              )}
            </div>

            {/* Expiration Date Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">Link Expiration (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  {...register("expiresAt")}
                  type="datetime-local"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 text-slate-100 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:ring-2 focus:ring-indigo-500 text-slate-100 font-semibold rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Shorten Link</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Global Errors */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center justify-between"
          >
            <span>{error.message || "Failed to shorten link. Try again."}</span>
            <button onClick={reset} className="text-[10px] underline hover:text-rose-300">Dismiss</button>
          </motion.div>
        )}

        {/* Result View */}
        <AnimatePresence>
          {shortLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-slate-800/80 relative z-10"
            >
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 overflow-hidden">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">Short URL Generated</span>
                  <a
                    href={shortLink.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-bold text-violet-300 hover:underline block truncate"
                  >
                    {shortLink.shortUrl}
                  </a>
                </div>
                <div className="flex gap-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(shortLink.shortUrl)}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-indigo-400 transition text-slate-300"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </motion.button>
                  <button
                    onClick={() => {
                      reset();
                    }}
                    className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 border border-slate-800"
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
