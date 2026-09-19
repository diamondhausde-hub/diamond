import InfoPage from '@/components/InfoPage';
import de from '@/data/de.json'; import en from '@/data/en.json';

export function generateStaticParams() { return ['de','en'].map(locale => ({locale})); }

export default function About({params}:{params:{locale:string}}) {
  const t = params.locale==='de'?de:en;
  return (
    <InfoPage title={t.pages.aboutTitle}>
      <p className="text-xl leading-9 text-slate-600">{t.pages.aboutBody}</p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {['01 · Klarheit','02 · Haltbarkeit','03 · Verantwortung'].map((x,i)=>(
          <div key={x} className="border p-6">
            <span className="text-xs font-bold text-diamond">{x}</span>
            <p className="mt-8 text-sm leading-6 text-slate-600">
              {['Jede Funktion ist sichtbar, jede Angabe nachvollziehbar.','Entwickelt für wiederholte Anwendung und einfache Pflege.','Verpackung und Produktwahl mit Blick auf den Alltag.'][i]}
            </p>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}