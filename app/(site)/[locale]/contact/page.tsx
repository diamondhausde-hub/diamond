import { AppLink } from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { getDictionary } from "@/i18n/messages";
import { isLocale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/config/site";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);
  const { email, phone, address } = siteConfig.contact;
  const hasDirect = Boolean(email || phone || address);

  return (
    <>
      <PageHeader
        eyebrow={messages.contact.eyebrow}
        title={messages.contact.title}
        description={messages.contact.description}
      />

      <section className="shell pb-20 lg:pb-28">
        <div className="grid gap-12 border-t border-line pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            {hasDirect ? (
              <div className="border-t border-line pt-6">
                <h2 className="t-eyebrow">{messages.contact.directTitle}</h2>
                <ul className="mt-5 space-y-4 text-[13px] text-navy">
                  {email ? (
                    <li>
                      <a href={`mailto:${email}`} className="inline-flex items-center gap-3 hover:text-emerald">
                        <Mail aria-hidden="true" size={15} className="text-muted" />
                        {email}
                      </a>
                    </li>
                  ) : null}
                  {phone ? (
                    <li>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-3 hover:text-emerald"
                      >
                        <Phone aria-hidden="true" size={15} className="text-muted" />
                        <span dir="ltr">{phone}</span>
                      </a>
                    </li>
                  ) : null}
                  {address ? (
                    <li className="flex items-start gap-3">
                      <MapPin aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-muted" />
                      <span className="text-muted">{address}</span>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            <div className={`${hasDirect ? "mt-10" : ""} border-t border-line pt-6`}>
              <h2 className="t-eyebrow">{messages.nav.wholesale}</h2>
              <p className="t-small mt-3 max-w-[34ch]">{messages.wholesale.descriptionSecondary}</p>
              <AppLink href={`/${locale}/wholesale`} className="link-quiet mt-5">
                {messages.nav.wholesale}
                <ArrowRight aria-hidden="true" className="arrow-icon" size={14} />
              </AppLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
