import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/messages";
import { isLocale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { WholesaleCta } from "@/components/wholesale/WholesaleCta";
import { Reveal } from "@/components/ui/Reveal";

export default async function WholesalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);

  return (
    <>
      <PageHeader
        eyebrow={messages.wholesale.eyebrow}
        title={messages.wholesale.title}
        description={messages.wholesale.description}
      >
        <div className="flex flex-wrap items-center gap-6">
          <WholesaleCta />
          <p className="max-w-[36ch] text-[12px] leading-relaxed text-muted">
            {messages.wholesale.descriptionSecondary}
          </p>
        </div>
      </PageHeader>

      <section className="border-t border-line">
        <div className="shell py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <p className="t-eyebrow">{messages.wholesale.processEyebrow}</p>
              <h2 className="t-heading mt-4 max-w-[16ch] text-navy">
                {messages.wholesale.processTitle}
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
              {messages.wholesale.process.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.08}>
                  <div className="border-t border-line pt-5">
                    <span className="text-[10px] tabular-nums tracking-[0.1em] text-muted">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 text-[15px] font-medium text-navy">{step.title}</h3>
                    <p className="t-small mt-2">{step.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-navy text-white">
        <div className="shell grid items-center gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <p className="t-eyebrow text-white/40">{messages.wholesale.eyebrow}</p>
            <h2 className="t-heading mt-4 max-w-[20ch] text-white">
              {messages.wholesale.title}
            </h2>
            <p className="t-body mt-4 max-w-[56ch] text-white/60">
              {messages.wholesale.descriptionSecondary}
            </p>
          </div>
          <div className="lg:col-span-5 lg:text-end">
            <WholesaleCta variant="light" />
          </div>
        </div>
      </section>

      <section className="shell py-14 lg:py-20">
        <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              messages.wholesale.form.businessTypes.distributor,
              messages.wholesale.form.businessTypes.retailer,
              messages.wholesale.form.businessTypes.supermarket,
              messages.wholesale.form.businessTypes.cleaningCompany,
            ] as string[]
          ).map((audience) => (
            <p key={audience} className="flex items-center gap-3 text-[13px] text-navy">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
              {audience}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
