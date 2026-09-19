import InfoPage from '@/components/InfoPage';
import de from '@/data/de.json'; import en from '@/data/en.json';

export function generateStaticParams() { return ['de','en'].map(locale => ({locale})); }

export default function Contact({params}:{params:{locale:string}}) {
  const t = params.locale==='de'?de:en;
  return (
    <InfoPage title={t.pages.contactTitle}>
      <p className="text-lg leading-8 text-slate-600">{t.pages.contactBody}</p>
      <div className="mt-8 border-l-4 border-diamond bg-slate-50 p-5 font-bold">{t.common.success}</div>
    </InfoPage>
  );
}