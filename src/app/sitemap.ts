import type {MetadataRoute} from 'next'; 
const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://diamond-cleaning.example'; 
export default function sitemap():MetadataRoute.Sitemap{return ['de','en'].flatMap(l=>['','shop','about','contact','faq','cart'].map(p=>({url:`${base}/${l}/${p}`,lastModified:new Date()})))}