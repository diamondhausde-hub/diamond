import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteConfig } from "@/config/site";
import type { PageKey } from "@/lib/seo";

export const dynamic = "force-static";

const pages: { key: PageKey; path: string }[] = [
  { key: "home", path: "" },
  { key: "products", path: "/products" },
  { key: "glassLab", path: "/glass-lab" },
  { key: "about", path: "/about" },
  { key: "wholesale", path: "/wholesale" },
  { key: "contact", path: "/contact" },
  { key: "catalog", path: "/catalog" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // The private admin panel lives in public/admin and must never be indexed.
  const excluded = ["/admin/"];

  for (const page of pages) {
    if (excluded.some((path) => page.path.includes(path))) continue;
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${siteConfig.url}/${locale}${page.path}`;
    }
    for (const locale of locales) {
      entries.push({
        url: `${siteConfig.url}/${locale}${page.path}`,
        changeFrequency: page.key === "home" ? "monthly" : "yearly",
        priority: page.key === "home" ? 1 : page.key === "products" ? 0.9 : 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
