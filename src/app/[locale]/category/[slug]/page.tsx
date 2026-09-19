import {ProductGrid} from '@/components/Catalog'; import {categories} from '@/lib/config';
export function generateStaticParams() { return categories.flatMap(c => ['de','en'].map(locale => ({locale, slug: c.slug}))); }
export default function Category({params}:{params:{locale:string;slug:string}}){return <ProductGrid locale={params.locale as 'de'|'en'} category={params.slug}/>}