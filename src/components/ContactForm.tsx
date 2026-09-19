'use client';
import {useState} from 'react';
import de from '@/data/de.json';
import en from '@/data/en.json';
import InfoPage from '@/components/InfoPage';

export default function ContactForm({locale}:{locale:'de'|'en'}) {
  const t = locale==='de'?de:en;
  const [sent,setSent] = useState(false);
  return (
    <InfoPage title={t.pages.contactTitle}>
      <p className="text-lg leading-8 text-slate-600">{t.pages.contactBody}</p>
      {sent ? (
        <div className="mt-8 border-l-4 border-diamond bg-slate-50 p-5 font-bold">{t.common.success}</div>
      ) : (
        <form onSubmit={e=>{e.preventDefault();setSent(true)}} className="mt-10 grid gap-5 md:grid-cols-2">
          <input required placeholder="Name *" className="border p-4"/>
          <input required type="email" placeholder="E-Mail *" className="border p-4"/>
          <input placeholder="Unternehmen" className="border p-4"/>
          <input placeholder="Telefon" className="border p-4"/>
          <textarea required placeholder="Ihre Nachricht *" rows={6} className="border p-4 md:col-span-2"/>
          <button className="w-fit bg-diamond px-6 py-4 text-sm font-bold text-white">{t.common.send}</button>
        </form>
      )}
    </InfoPage>
  );
}
