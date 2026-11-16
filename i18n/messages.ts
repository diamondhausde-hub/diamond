import type { Locale } from "@/i18n/config";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import de from "@/messages/de.json";
import fr from "@/messages/fr.json";
import it from "@/messages/it.json";
import zh from "@/messages/zh.json";

/**
 * Single source of truth for every piece of interface copy.
 * Components never hard-code user-facing strings.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ar, de, fr, it, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
