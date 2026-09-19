'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, ShoppingBasket, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import de from '@/data/de.json';
import en from '@/data/en.json';

export default function Header() {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'de';
  const t = locale === 'de' ? de : en;
  const [open, setOpen] = useState(false);
  const route = (path: string) => `/${locale}${path}`;
  const switchLocale = (next: 'de' | 'en') => `/${next}${pathname.replace(/^\/(de|en)/, '') || '/'}`;

  return <header className="border-b line bg-white">
    <div className="container flex h-20 items-center justify-between gap-4">
      <Link href={route('/')} aria-label="DIAMOND" className="focus-ring shrink-0"><Image src="/diamond-logo.svg" alt="DIAMOND" width={190} height={42} priority /></Link>
      <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
        <Link className="hover:text-diamond" href={route('/shop')}>{t.nav.shop}</Link>
        <Link className="hover:text-diamond" href={route('/about')}>{t.nav.about}</Link>
        <Link className="hover:text-diamond" href={route('/contact')}>{t.nav.contact}</Link>
        <Link className="hover:text-diamond" href={route('/faq')}>{t.nav.faq}</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Link href={route('/shop')} aria-label={t.shop.search} className="focus-ring p-2 hover:text-diamond"><Search size={19} /></Link>
        <div className="hidden items-center border-l pl-3 text-xs font-bold sm:flex">
          <Link className={locale === 'de' ? 'text-diamond' : 'hover:text-diamond'} href={switchLocale('de')}>DE</Link>
          <span className="px-1 text-slate-300">|</span>
          <Link className={locale === 'en' ? 'text-diamond' : 'hover:text-diamond'} href={switchLocale('en')}>EN</Link>
        </div>
        <Link href={route('/cart')} className="focus-ring flex items-center gap-2 border border-slate-300 px-3 py-2 text-xs font-bold hover:border-diamond hover:text-diamond"><ShoppingBasket size={17} /><span className="hidden sm:inline">{t.nav.cart}</span></Link>
        <button type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? t.common.close : t.nav.menu} onClick={() => setOpen(!open)} className="focus-ring p-2 lg:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="border-t bg-white px-6 py-5 lg:hidden">
      <div className="container grid gap-4 text-sm font-semibold">
        <Link onClick={() => setOpen(false)} href={route('/shop')}>{t.nav.shop}</Link>
        <Link onClick={() => setOpen(false)} href={route('/about')}>{t.nav.about}</Link>
        <Link onClick={() => setOpen(false)} href={route('/contact')}>{t.nav.contact}</Link>
        <Link onClick={() => setOpen(false)} href={route('/faq')}>{t.nav.faq}</Link>
        <div className="flex gap-3 border-t pt-4 text-xs"><Link href={switchLocale('de')}>DE</Link><span>|</span><Link href={switchLocale('en')}>EN</Link></div>
      </div>
    </nav>}
  </header>;
}
