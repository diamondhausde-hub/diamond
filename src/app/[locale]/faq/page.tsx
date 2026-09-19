import FaqForm from '@/components/FaqForm';

export async function generateStaticParams() { return [{locale:'de'},{locale:'en'}]; }

export default function Faq({params}:{params:{locale:string}}) {
  return <FaqForm locale={params.locale as 'de'|'en'}/>;
}
