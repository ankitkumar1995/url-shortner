import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lnk.cx";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/admin/",
        "/settings/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
