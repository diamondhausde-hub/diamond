"use client";

import { AppLink } from "@/components/ui/AppLink";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/components/LocaleProvider";

export function SiteFooter() {
  const { locale, messages } = useLocale();

  const explore = [
    { href: `/${locale}`, label: messages.nav.home },
    { href: `/${locale}/products`, label: messages.nav.products },
    { href: `/${locale}/glass-lab`, label: messages.nav.glassLab },
    { href: `/${locale}/wholesale`, label: messages.nav.wholesale },
  ];

  const company = [
    { href: `/${locale}/about`, label: messages.nav.about },
    { href: `/${locale}/contact`, label: messages.nav.contact },
    { href: `/${locale}/catalog`, label: messages.nav.catalog },
  ];

  return (
    <footer className="site-footer bg-navy text-white">
      <div className="shell pb-10 pt-16 lg:pb-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo variant="white" width={168} />
            <p className="brand-tagline mt-6 text-[10px] uppercase tracking-[0.3em] text-white/45">
              {messages.meta.slogan}
            </p>
            <p className="mt-6 max-w-[340px] text-[13px] leading-relaxed text-white/55">
              {messages.footer.description}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                {messages.footer.language}
              </span>
              <LocaleSwitcher dark />
            </div>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              {messages.footer.explore}
            </h2>
            <ul className="mt-5 space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    className="text-[13px] text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-3">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              {messages.footer.company}
            </h2>
            <ul className="mt-5 space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    className="text-[13px] text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} DIAMOND. {messages.footer.rights}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 text-[11px] text-white/40 transition-colors hover:text-white"
          >
            {messages.common.backToTop}
            <ArrowUp aria-hidden="true" size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
