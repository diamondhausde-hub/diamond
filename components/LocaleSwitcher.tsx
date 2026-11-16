"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { LanguageSelect } from "@/components/LanguageSelect";
import { localeMeta, type Locale } from "@/i18n/config";
import { siteConfig } from "@/config/site";

export function LocaleSwitcher({ dark, className }: { dark?: boolean; className?: string }) {
  const { locale, messages } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(next: Locale) {
    const segments = (pathname || "/").split("/").filter(Boolean);
    const rest = segments.slice(1).join("/");
    const nextPath = `/${next}/${rest ? `${rest}/` : ""}`;

    const meta = localeMeta[next];
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dir = meta.dir;
    try {
      window.localStorage.setItem(siteConfig.localeStorageKey, next);
      document.cookie = `${siteConfig.localeCookie}=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* ignore */
    }

    router.push(nextPath);
  }

  return (
    <div className={className}>
      <LanguageSelect
        value={locale}
        onChange={handleChange}
        label={messages.nav.language}
        dark={dark}
      />
    </div>
  );
}
