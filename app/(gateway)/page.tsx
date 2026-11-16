"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { isLocale, localeMeta, type Locale } from "@/i18n/config";
import { siteConfig } from "@/config/site";
import { LanguageSelect } from "@/components/LanguageSelect";
import { Logo } from "@/components/Logo";

const COPY = {
  welcome: {
    en: "Welcome to DIAMOND",
    ar: "مرحباً بك في DIAMOND",
    de: "Willkommen bei DIAMOND",
    fr: "Bienvenue chez DIAMOND",
    it: "Benvenuti in DIAMOND",
    zh: "欢迎来到 DIAMOND",
  },
  select: {
    en: "Select your preferred language to continue.",
    ar: "اختر لغتك المفضلة للمتابعة.",
    de: "Wählen Sie Ihre Sprache, um fortzufahren.",
    fr: "Choisissez votre langue pour continuer.",
    it: "Seleziona la tua lingua preferita per continuare.",
    zh: "请选择您的首选语言以继续。",
  },
  language: {
    en: "Language",
    ar: "اللغة",
    de: "Sprache",
    fr: "Langue",
    it: "Lingua",
    zh: "语言",
  },
  continue: {
    en: "Continue",
    ar: "متابعة",
    de: "Weiter",
    fr: "Continuer",
    it: "Continua",
    zh: "继续",
  },
  footnote: {
    en: "You can change the language at any time.",
    ar: "يمكنك تغيير اللغة في أي وقت.",
    de: "Sie können die Sprache jederzeit ändern.",
    fr: "Vous pouvez changer de langue à tout moment.",
    it: "Puoi cambiare lingua in qualsiasi momento.",
    zh: "您可以随时更改语言。",
  },
  slogan: {
    en: "Cleanliness you can trust",
    ar: "نظافة تثق بها",
    de: "Sauberkeit, der Sie vertrauen können",
    fr: "Une propreté de confiance",
    it: "Pulizia di cui fidarsi",
    zh: "值得信赖的洁净",
  },
} as const;

function setLocalePersistence(locale: Locale) {
  try {
    window.localStorage.setItem(siteConfig.localeStorageKey, locale);
    document.cookie = `${siteConfig.localeCookie}=${locale};path=/;max-age=31536000;samesite=lax`;
  } catch {
    /* storage can be unavailable in private modes */
  }
}

export default function GatewayPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [locale, setLocale] = useState<Locale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(siteConfig.localeStorageKey);
    } catch {
      /* ignore */
    }
    const query = new URLSearchParams(window.location.search).get("lang");
    if (query && isLocale(query)) {
      setLocale(query);
      setReady(true);
      return;
    }
    if (saved && isLocale(saved)) {
      router.replace(`/${saved}/`);
      return;
    }
    setLocale("en");
    setReady(true);
  }, [router]);

  function handleContinue() {
    setLocalePersistence(locale);
    router.push(`/${locale}/`);
  }

  if (!ready) {
    return <div className="min-h-dvh bg-navy" />;
  }

  const copy = {
    welcome: COPY.welcome[locale],
    select: COPY.select[locale],
    language: COPY.language[locale],
    continue: COPY.continue[locale],
    footnote: COPY.footnote[locale],
    slogan: COPY.slogan[locale],
  };

  const enter = (delay: number) =>
    reduceMotion
      ? { initial: false, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <main
      className="relative flex min-h-dvh flex-col overflow-hidden bg-navy text-white"
      dir={localeMeta[locale].dir}
      lang={localeMeta[locale].htmlLang}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-[420px] flex-col items-center text-center">
          <motion.div {...enter(0)}>
            <Logo variant="white" width={228} priority />
          </motion.div>

          <motion.p
            {...enter(0.1)}
            className="brand-tagline mt-7 text-[10px] uppercase tracking-[0.34em] text-white/55"
          >
            {copy.slogan}
          </motion.p>

          <motion.div {...enter(0.2)} className="mt-11 w-full">
            <p className="text-[15px] font-medium text-white">{copy.welcome}</p>
            <p className="mx-auto mt-2 max-w-[300px] text-[13px] leading-relaxed text-white/55">
              {copy.select}
            </p>
          </motion.div>

          <motion.div {...enter(0.3)} className="mt-9 flex w-full max-w-[260px] flex-col gap-2 text-start">
            <label
              htmlFor="gateway-language"
              className="text-[10px] uppercase tracking-[0.2em] text-white/45"
            >
              {copy.language}
            </label>
            <LanguageSelect
              id="gateway-language"
              value={locale}
              onChange={setLocale}
              label={copy.language}
              dark
            />
          </motion.div>

          <motion.div {...enter(0.4)} className="mt-7 w-full max-w-[260px]">
            <button type="button" onClick={handleContinue} className="btn btn-primary w-full">
              {copy.continue}
              <ArrowRight aria-hidden="true" className="arrow-icon" />
            </button>
          </motion.div>
        </div>
      </div>

      <motion.footer
        {...enter(0.5)}
        className="px-6 pb-8 text-center text-[11px] tracking-wide text-white/35"
      >
        {copy.footnote}
      </motion.footer>
    </main>
  );
}
