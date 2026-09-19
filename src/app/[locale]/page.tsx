import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import products from '@/data/products.json';
import de from '@/data/de.json';
import en from '@/data/en.json';
import {categories} from '@/lib/config';

export function generateStaticParams() {
  return ['de','en'].map(locale => ({locale}));
}

export default function Home({params}:{params:{locale:string}}) {
  const locale = params.locale as 'de'|'en';
  const t = locale==='de'?de:en;
  const best = products.filter(p=>p.badges.includes('Bestseller')).slice(0,4);
  return (
    <>
      <section className="border-b bg-slate-50">
        <div className="container grid min-h-[560px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-[.2em] text-diamond">{t.home.eyebrow}</p>
            <h1 className="display max-w-3xl text-6xl font-bold leading-[.94] md:text-8xl">{t.home.title}</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{t.home.body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/${locale}/shop`} className="focus-ring inline-flex items-center gap-3 bg-diamond px-6 py-4 text-sm font-bold text-white hover:bg-blue-900">
                {t.home.cta}<ArrowRight size={17}/>
              </Link>
              <Link href={`/${locale}/about`} className="focus-ring inline-flex items-center border border-slate-300 px-6 py-4 text-sm font-bold hover:border-diamond hover:text-diamond">
                {t.home.secondary}
              </Link>
            </div>
          </div>
          <div className="relative aspect-square max-w-xl justify-self-end">
            <div className="absolute inset-8 rotate-3 border-2 border-diamond/20"></div>
            <div className="absolute inset-16 -rotate-6 border border-signal"></div>
            <Image src="/products/p10.svg" alt="DIAMOND Bodenwischer Produkt" fill className="object-contain p-8" priority/>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="display text-4xl font-bold">{t.home.categories}</h2>
          <Link href={`/${locale}/shop`} className="text-sm font-bold text-diamond">{t.common.viewAll} →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c,i)=>(
            <Link key={c.slug} href={`/${locale}/category/${c.slug}`} className="group border border-slate-200 p-6 transition hover:border-diamond">
              <span className="text-xs font-bold text-slate-400">0{i+1}</span>
              <h3 className="mt-10 text-xl font-bold group-hover:text-diamond">{c[locale]}</h3>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
