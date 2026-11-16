export const locales = ["en", "ar", "de", "fr", "it", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export type Direction = "ltr" | "rtl";

export const localeMeta: Record<
  Locale,
  { nativeLabel: string; englishLabel: string; dir: Direction; htmlLang: string }
> = {
  en: { nativeLabel: "English", englishLabel: "English", dir: "ltr", htmlLang: "en" },
  ar: { nativeLabel: "العربية", englishLabel: "Arabic", dir: "rtl", htmlLang: "ar" },
  de: { nativeLabel: "Deutsch", englishLabel: "German", dir: "ltr", htmlLang: "de" },
  fr: { nativeLabel: "Français", englishLabel: "French", dir: "ltr", htmlLang: "fr" },
  it: { nativeLabel: "Italiano", englishLabel: "Italian", dir: "ltr", htmlLang: "it" },
  zh: { nativeLabel: "中文", englishLabel: "Chinese", dir: "ltr", htmlLang: "zh-Hans" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): Direction {
  return localeMeta[locale].dir;
}
