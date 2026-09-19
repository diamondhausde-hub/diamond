import CartForm from '@/components/CartForm';

export async function generateStaticParams() { return [{locale:'de'},{locale:'en'}]; }

export default function Cart({params}:{params:{locale:string}}) {
  return <CartForm locale={params.locale as 'de'|'en'}/>;
}
