import type { Metadata } from "next";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/messages";
import { siteConfig } from "@/config/site";

export type PageKey = "home" | "products" | "glassLab" | "about" | "wholesale" | "contact" | "catalog";

const pagePaths: Record<PageKey, string> = {
  home: "",
  products: "/products",
  glassLab: "/glass-lab",
  about: "/about",
  wholesale: "/wholesale",
  contact: "/contact",
  catalog: "/catalog",
};

export function localePath(locale: Locale, page: PageKey): string {
  return `/${locale}${pagePaths[page]}`;
}

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

export function buildPageMetadata(locale: Locale, page: PageKey): Metadata {
  const dictionary = getDictionary(locale);
  const pageMeta = dictionary.meta.pages[page];
  const path = pagePaths[page];
  const canonical = absoluteUrl(`/${locale}${path}`);

  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[localeMeta[code].htmlLang] = absoluteUrl(`/${code}${path}`);
  }
  languages["x-default"] = absoluteUrl(`/en${path}`);

  return {
    title: pageMeta.title,
    description: pageMeta.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: pageMeta.title,
      description: pageMeta.description,
      url: canonical,
      locale: localeMeta[locale].htmlLang.replace("-", "_"),
      images: [
        {
          url: absoluteUrl("/og-diamond.png"),
          width: 2000,
          height: 428,
          alt: "DIAMOND — Cleanliness you can trust",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageMeta.title,
      description: pageMeta.description,
      images: [absoluteUrl("/og-diamond.png")],
    },
  };
}
