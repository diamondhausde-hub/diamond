import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/messages";
import { getDirection, isLocale, locales, type Locale } from "@/i18n/config";
import { siteConfig } from "@/config/site";
import { cairo, inter } from "@/lib/fonts";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BottomNav } from "@/components/BottomNav";
import { WholesaleProvider } from "@/components/wholesale/WholesaleProvider";
import "../../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: "DIAMOND",
  icons: { icon: "/icon.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2545",
  colorScheme: "light",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const messages = getDictionary(locale);
  const dir = getDirection(locale);

  return (
    <html
      lang={locale === "zh" ? "zh-Hans" : locale}
      dir={dir}
      className={`${inter.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LocaleProvider locale={locale} messages={messages}>
          <WholesaleProvider>
            <a href="#main" className="skip-link">
              {messages.nav.skipToContent}
            </a>
            <SiteHeader />
            <div className="min-h-dvh pb-[calc(var(--nav-h)+env(safe-area-inset-bottom,0px))] lg:pb-0">
              <main id="main">{children}</main>
            </div>
            <SiteFooter />
            <BottomNav />
          </WholesaleProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
