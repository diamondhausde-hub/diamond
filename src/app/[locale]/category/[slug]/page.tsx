import {ProductGrid} from '@/components/Catalog';
import {categories} from '@/lib/config';
import {notFound} from 'next/navigation';

export async function generateStaticParams() {
  const params: {locale: string; slug: string}[] = [];
  categories.forEach((c) => {
    ['de', 'en'].forEach((locale) => {
      params.push({locale, slug: c.slug});
    });
  });
  return params;
}

export default function Category({params}: {params: {locale: string; slug: string}}) {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  return <ProductGrid locale={params.locale as 'de'|'en'} category={params.slug}/>;
}
