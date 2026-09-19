import {ProductGrid} from '@/components/Catalog';

export async function generateStaticParams() {
  return [{locale: 'de'}, {locale: 'en'}];
}

export default function Shop({params}: {params: {locale: string}}) {
  return <ProductGrid locale={params.locale as 'de'|'en'}/>;
}
