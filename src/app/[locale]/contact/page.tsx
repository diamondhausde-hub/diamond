import ContactForm from '@/components/ContactForm';

export async function generateStaticParams() { return [{locale:'de'},{locale:'en'}]; }

export default function Contact({params}:{params:{locale:string}}) {
  return <ContactForm locale={params.locale as 'de'|'en'}/>;
}
