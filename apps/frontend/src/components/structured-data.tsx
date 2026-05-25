import React from "react";

interface StructuredDataProps {
  type: "WebSite" | "SoftwareApplication" | "FAQPage";
  data: Record<string, any>;
}

/**
 * Enterprise SEO & AEO Structured Data Generator.
 * Emits standard JSON-LD schemas to maximize crawl value for search engines
 * and AI index engines (ChatGPT search, Perplexity, Gemini).
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Standard Blueprint Schema for URL Shortener landing page
export const defaultSoftwareSchema = {
  name: "LnkCX URL Shortener",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  description: "Enterprise-grade, secure, dynamic URL Shortening infrastructure and dynamic analytics tracking.",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD",
  },
  featureList: [
    "Dynamic Link Shortening",
    "Real-Time Telemetry Analytics",
    "Base62 Distributed Encoding",
    "Secure Expiration Dates",
    "Sliding Window Rate Limiting",
    "Custom Brand Aliases",
  ],
};
