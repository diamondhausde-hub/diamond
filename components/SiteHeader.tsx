"use client";

import { useEffect, useState } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { MobilePreview } from "@/components/MobilePreview";
import { useLocale } from "@/components/LocaleProvider";

export function SiteHeader() {
  const { locale, messages } = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rest = (pathname || `/${locale}`).split("/").filter(Boolean).slice(1).join("/");
  const paths = {
    home: `/${locale}`,
    products: `/${locale}/products`,
    glassLab: `/${locale}/glass-lab`,
    about: `/${locale}/about`,
  };
  const items: { key: keyof typeof paths; label: string; active: boolean }[] = [
    { key: "home", label: messages.nav.home, active: rest === "" },
    {
      key: "products",
      label: messages.nav.products,
      active: rest === "products" || rest.startsWith("products/"),
    },
    {
      key: "glassLab",
      label: messages.nav.glassLab,
      active: rest === "glass-lab" || rest.startsWith("glass-lab/"),
    },
    { key: "about", label: messages.nav.about, active: rest === "about" || rest.startsWith("about/") },
  ];

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <AppLink href={paths.home} aria-label={messages.nav.home} className="shrink-0">
          <Logo width={150} priority variant="navy" />
        </AppLink>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {items.map((item) => (
              <li key={item.key}>
                <AppLink
                  href={paths[item.key]}
                  aria-current={item.active ? "page" : undefined}
                  className={`relative inline-flex h-[var(--header-h)] items-center text-[13px] font-medium transition-colors hover:text-emerald ${
                    item.active ? "text-navy" : "text-muted"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 bg-emerald transition-opacity ${
                      item.active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <MobilePreview variant="header" />
          </div>
          <LocaleSwitcher />
          <AppLink
            href={`/${locale}/wholesale`}
            className="btn btn-navy btn-sm hidden xl:inline-flex"
          >
            {messages.nav.wholesale}
          </AppLink>
        </div>
      </div>
    </header>
  );
}
