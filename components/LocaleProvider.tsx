"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/messages";
import { siteConfig } from "@/config/site";

type LocaleContextValue = {
  locale: Locale;
  messages: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: LocaleContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);

  useEffect(() => {
    const meta = localeMeta[locale];
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dir = meta.dir;
    try {
      window.localStorage.setItem(siteConfig.localeStorageKey, locale);
      document.cookie = `${siteConfig.localeCookie}=${locale};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* storage can be unavailable in private modes */
    }
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}

export function useMessages() {
  return useLocale().messages;
}
