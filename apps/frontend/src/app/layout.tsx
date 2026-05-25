import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers";
import { StructuredData, defaultSoftwareSchema } from "../components/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lnk.cx";

// Enterprise-Grade SEO / AEO / GEO Metadata Configurations
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "LnkCX | Secure Enterprise-Grade URL Shortener & Click Analytics",
    template: "%s | LnkCX",
  },
  description:
    "Shorten, track, and secure your links globally. LnkCX provides real-time click telemetry, custom branded aliases, sliding window rate limits, and cryptographic link security.",
  keywords: [
    "URL shortener",
    "Bitly alternative",
    "secure links",
    "link analytics",
    "dynamic redirects",
    "QR code generator",
    "developer infrastructure",
  ],
  authors: [{ name: "LnkCX Tech Team" }],
  creator: "LnkCX Corporation",
  publisher: "LnkCX Inc.",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "LnkCX",
    title: "LnkCX | Enterprise-Grade URL Shortener & Analytics",
    description:
      "Deploy custom dynamic links, prevent phishing domains with bloom filter checks, and track clicks globally in real-time.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LnkCX Enterprise Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LnkCX | Dynamic Link Shortener infrastructure",
    description: "Shorten and securely track links globally with sub-15ms edge redirections.",
    creator: "@ankitkumar1995",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col`}
      >
        <Providers>
          {children}
        </Providers>

        {/* SEO / AEO JSON-LD Schema Hook */}
        <StructuredData type="SoftwareApplication" data={defaultSoftwareSchema} />
      </body>
    </html>
  );
}
