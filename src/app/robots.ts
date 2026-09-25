import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app", "/admin", "/rm", "/api"],
    },
    sitemap: "https://www.ashfordcrane.example/sitemap.xml",
  };
}
