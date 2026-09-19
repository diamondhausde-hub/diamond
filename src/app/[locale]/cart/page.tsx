import Link from 'next/link';
import de from '@/data/de.json'; import en from '@/data/en.json';

export function generateStaticParams() { return ['de','en'].map(locale => ({locale})); }

export default function Cart({params}:{params:{locale:string}}) {
  const t = params.locale==='de'?de:en;
  return (
    <div className="container min-h-[520px] py-16">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-diamond">DIAMOND</p>
      <h1 className="display mt-4 text-6xl font-bold">{t.nav.cart}</h1>
      <div className="mt-10 max-w-xl border-l-4 border-diamond bg-slate-50 p-6">
        <p className="font-bold">{t.common.success}</p>
        <Link href={`/${params.locale}/shop`} className="mt-4 inline-block text-sm font-bold text-diamond">{t.product.back} →</Link>
      </div>
    </div>
  );
}