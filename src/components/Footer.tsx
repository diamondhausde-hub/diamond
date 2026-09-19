'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { brand, categories } from '@/lib/config';
import de from '@/data/de.json';
import en from '@/data/en.json';

export default function Footer() {
  const locale = usePathname().startsWith('/en') ? 'en' : 'de';
  const t = locale === 'de' ? de : en;
  const route = (path: string) => `/${locale}${path}`;
  return <footer className="mt-24 border-t bg-graphite text-white">
    <div className="container grid gap-10 py-14 md:grid-cols-4">
      <div className="md:col-span-2"><Image src="/diamond-logo.svg" alt="DIAMOND" width={180} height={40} className="brightness-0 invert" /><p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">{locale === 'de' ? 'Präzise Reinigungslösungen mit klaren Daten, robusten Materialien und verlässlicher Anwendung.' : 'Precise cleaning solutions with clear data, durable materials and reliable application.'}</p></div>
      <div><h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-slate-400">{t.nav.shop}</h2><div className="grid gap-2 text-sm text-slate-200">{categories.slice(0, 5).map(c => <Link key={c.slug} href={route('/category/' + c.slug)} className="hover:text-white">{c[locale]}</Link>)}</div></div>
      <div><h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-slate-400">{locale === 'de' ? 'Service' : 'Service'}</h2><div className="grid gap-2 text-sm text-slate-200"><Link href={route('/contact')}>{t.nav.contact}</Link><Link href={route('/faq')}>{t.nav.faq}</Link><Link href={route('/legal/impressum')}>{t.pages.impressum}</Link><Link href={route('/legal/datenschutz')}>{t.pages.datenschutz}</Link></div></div>
    </div>
    <div className="container flex flex-col justify-between gap-2 border-t border-slate-700 py-5 text-xs text-slate-400 sm:flex-row"><span>© 2026 DIAMOND Cleaning Solutions</span><span>{brand.address}</span></div>
  </footer>;
}
