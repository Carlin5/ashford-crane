import type { MetadataRoute } from "next";

const base = "https://www.ashfordcrane.example";

const routes = [
  "",
  "/about",
  "/private-banking",
  "/corporate-banking",
  "/international-payments",
  "/cards",
  "/wealth-management",
  "/security",
  "/pricing",
  "/faq",
  "/insights",
  "/contact",
  "/developers",
  "/legal",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
  "/legal/complaints",
  "/legal/regulatory",
  "/legal/aml-kyc",
  "/legal/jurisdictions",
  "/login",
  "/onboarding",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
  }));
}
