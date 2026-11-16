/**
 * ─────────────────────────────────────────────────────────────
 *  DIAMOND — site configuration
 * ─────────────────────────────────────────────────────────────
 *  The editable values now live in config/site.json so the
 *  browser-based admin panel can change them without touching code.
 */
import siteJson from "./site.json";

export const siteConfig = {
  name: "DIAMOND",
  slogan: {
    en: "Cleanliness you can trust",
  },
  /** Comes from NEXT_PUBLIC_SITE_URL — never edited by the admin panel. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  localeStorageKey: "diamond.locale",
  localeCookie: "diamond_locale",
  contact: siteJson.contact,
  cataloguePdf: siteJson.cataloguePdf as string | null,
};

export type ContactChannel = "whatsapp" | "email";

export function hasContactChannel(channel: ContactChannel): boolean {
  if (channel === "whatsapp") return siteConfig.contact.whatsapp.trim().length > 0;
  return siteConfig.contact.email.trim().length > 0;
}

export const hasAnyContactChannel =
  hasContactChannel("whatsapp") || hasContactChannel("email");
