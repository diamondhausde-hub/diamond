'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, Grid2X2, List, Plus, SlidersHorizontal } from 'lucide-react';
import products from '@/data/products.json';
import de from '@/data/de.json';
import en from '@/data/en.json';
import { categories } from '@/lib/config';

type Locale = 'de' | 'en';

export function ProductCard({ p, locale = 'de' }: { p: any; locale?: Locale }) {
  const [added, setAdded] = useState(false);
  const t = locale === 'de' ? de : en;
  return <article className="group border border-slate-200 bg-white">
    <Link href={`/${locale}/product/${p.slug}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50"><Image src={p.images[0]} alt={p.name[locale]} fill className="object-contain p-7 transition-transform duration-200 group-hover:scale-[1.03]" />{p.badges?.[0] && <span className="absolute left-3 top-3 bg-signal px-2 py-1 text-[10px] font-bold uppercase tracking-wider">{p.badges[0]}</span>}</div>
      <div className="p-4"><p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">{p.type}</p><h3 className="min-h-12 font-bold leading-5">{p.name[locale]}</h3><p className="mt-3 text-lg font-bold">{p.price.toFixed(2).replace('.', ',')} €</p></div>
    </Link>
    <div className="px-4 pb-4"><button type="button" onClick={() => setAdded(true)} disabled={!p.stock} className="focus-ring flex w-full items-center justify-center gap-2 border border-diamond py-2 text-xs font-bold text-diamond transition hover:bg-diamond hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400">{added ? <><Check size={15} />{t.product.added}</> : <><Plus size={15} />{t.shop.quickAdd}</>}</button></div>
  </article>;
}

export function ProductGrid({ locale = 'de', category }: { locale?: Locale; category?: string }) {
  const t = locale === 'de' ? de : en;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [cat, setCat] = useState(params.get('category') || category || '');
  const [sort, setSort] = useState(params.get('sort') || 'featured');
  const [list, setList] = useState(false);
  const [eco, setEco] = useState(params.get('eco') === '1');

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    if (cat) next.set('category', cat);
    if (sort !== 'featured') next.set('sort', sort);
    if (eco) next.set('eco', '1');
    const target = next.toString() ? `${pathname}?${next}` : pathname;
    router.replace(target, { scroll: false });
  }, [cat, eco, pathname, query, router, sort]);

  const result = useMemo(() => {
    const filtered = products.filter(p => (!cat || p.category === cat) && (!eco || p.eco) && (!query || `${p.name[locale]} ${p.description[locale]}`.toLowerCase().includes(query.toLowerCase())));
    return [...filtered].sort((a, b) => sort === 'priceLow' ? a.price - b.price : sort === 'priceHigh' ? b.price - a.price : sort === 'name' ? a.name[locale].localeCompare(b.name[locale]) : 0);
  }, [cat, eco, locale, query, sort]);

  const clear = () => { setCat(category || ''); setQuery(''); setEco(false); setSort('featured'); };
  return <div className="container py-10"><div className="mb-8 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-diamond">DIAMOND / {t.shop.results}</p><h1 className="display text-5xl font-bold">{cat ? categories.find(c => c.slug === cat)?.[locale] || t.shop.title : t.shop.title}</h1><p className="mt-3 max-w-xl text-slate-600">{t.shop.body}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => setList(false)} className={`border p-2 ${!list ? 'bg-slate-100' : ''}`} aria-label={t.shop.grid}><Grid2X2 size={17} /></button><button type="button" onClick={() => setList(true)} className={`border p-2 ${list ? 'bg-slate-100' : ''}`} aria-label={t.shop.list}><List size={17} /></button></div></div>
    <div className="grid gap-8 lg:grid-cols-[230px_1fr]"><aside className="lg:block"><div className="sticky top-6"><div className="mb-5 flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={17} />{t.shop.filters}</div><label className="mb-5 block text-xs font-bold uppercase tracking-wider">{t.shop.search}<input value={query} onChange={e => setQuery(e.target.value)} className="mt-2 w-full border p-3 text-sm font-normal" placeholder="..." /></label><label className="mb-5 block text-xs font-bold uppercase tracking-wider">{locale === 'de' ? 'Kategorie' : 'Category'}<select value={cat} onChange={e => setCat(e.target.value)} className="mt-2 w-full border bg-white p-3 text-sm font-normal"><option value="">{t.shop.all}</option>{categories.map(c => <option key={c.slug} value={c.slug}>{c[locale]}</option>)}</select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={eco} onChange={e => setEco(e.target.checked)} />{locale === 'de' ? 'Eco-freundlich' : 'Eco-friendly'}</label><button type="button" onClick={clear} className="mt-6 text-xs font-bold text-diamond underline">{t.shop.clear}</button></div></aside><section><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-slate-500"><strong className="text-ink">{result.length}</strong> {t.shop.results}</span><select aria-label={t.shop.sort} value={sort} onChange={e => setSort(e.target.value)} className="border bg-white px-3 py-2 text-xs"><option value="featured">{t.shop.featured}</option><option value="priceLow">{t.shop.priceLow}</option><option value="priceHigh">{t.shop.priceHigh}</option><option value="name">{t.shop.name}</option></select></div><div className={list ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'}>{result.map(p => <ProductCard key={p.id} p={p} locale={locale} />)}</div></section></div></div>;
}
