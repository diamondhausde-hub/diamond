"use client";

import { AppLink } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { Home, Package, Sparkles, Store } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

export function BottomNav() {
  const { locale, messages } = useLocale();
  const pathname = usePathname();
  const rest = (pathname || `/${locale}`).split("/").filter(Boolean).slice(1).join("/");

  const items = [
    { href: `/${locale}`, label: messages.nav.home, icon: Home, active: rest === "" },
    {
      href: `/${locale}/products`,
      label: messages.nav.products,
      icon: Package,
      active: rest === "products" || rest.startsWith("products/"),
    },
    {
      href: `/${locale}/glass-lab`,
      label: messages.nav.glassLab,
      icon: Sparkles,
      active: rest === "glass-lab" || rest.startsWith("glass-lab/"),
    },
    {
      href: `/${locale}/wholesale`,
      label: messages.nav.wholesale,
      icon: Store,
      active: rest === "wholesale" || rest.startsWith("wholesale/"),
    },
  ];

  return (
    <nav aria-label="Mobile" className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <AppLink
            key={item.href}
            href={item.href}
            data-active={item.active}
            aria-current={item.active ? "page" : undefined}
            className="bottom-nav__item"
          >
            <Icon aria-hidden="true" size={19} strokeWidth={1.6} />
            <span>{item.label}</span>
          </AppLink>
        );
      })}
    </nav>
  );
}
