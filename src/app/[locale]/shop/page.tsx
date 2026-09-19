import {ProductGrid} from '@/components/Catalog';

export function generateStaticParams() { return ['de','en'].map(locale => ({locale})); }

export default function Shop({params}:{params:{locale:string}}) {
  return <ProductGrid locale={params.locale as 'de'|'en'}/>;
}