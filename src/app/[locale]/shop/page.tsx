import {ProductGrid} from '@/components/Catalog'; export default function Shop({params}:{params:{locale:string}}){return <ProductGrid locale={params.locale as 'de'|'en'}/>}
