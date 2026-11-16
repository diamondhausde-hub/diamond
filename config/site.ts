/**
 * ─────────────────────────────────────────────────────────────
 *  DIAMOND — site configuration
 * ─────────────────────────────────────────────────────────────
 *  This is the only file you need to edit to go live.
 *
 *  1. Set NEXT_PUBLIC_SITE_URL in .env.local to your real domain
 *     (used for canonical URLs, hreflang and social previews).
 *  2. Fill in the contact channels you want to enable.
 *     Any channel left as an empty string stays disabled and the
 *     interface tells the visitor that online sending is not
 *     available — it never reports a fake success.
 *  3. There is no backend in this project: WhatsApp and email
 *     submissions open the visitor's own app with a prepared
 *     message. Add a real backend if you need stored enquiries.
 */
export const siteConfig = {
  name: "DIAMOND",
  slogan: {
    en: "Cleanliness you can trust",
  },
  /** Example: "https://www.your-domain.com" — no trailing slash. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  localeStorageKey: "diamond.locale",
  localeCookie: "diamond_locale",
  contact: {
    /** International format, digits only or with +. Example: "+4915112345678" */
    whatsapp: "+9647701211099",
    /** Example: "sales@your-domain.com" */
    email: "diamondhaus.de@gmail.com",
    /** Displayed only when provided. Example: "+49 151 1234 5678" */
    phone: "+964 770 121 1099",
    address: "",
  },
  /** Optional link to a pre-made PDF catalogue. Leave null to use the built-in printable catalogue. */
  cataloguePdf: null as string | null,
};

export type ContactChannel = "whatsapp" | "email";

export function hasContactChannel(channel: ContactChannel): boolean {
  if (channel === "whatsapp") return siteConfig.contact.whatsapp.trim().length > 0;
  return siteConfig.contact.email.trim().length > 0;
}

export const hasAnyContactChannel =
  hasContactChannel("whatsapp") || hasContactChannel("email");
