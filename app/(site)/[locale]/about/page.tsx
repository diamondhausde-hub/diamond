import type { Metadata } from "next";
import { AppLink } from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/i18n/messages";
import { isLocale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/Logo";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildPageMetadata(locale, "about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);

  return (
    <>
      <PageHeader
        eyebrow={messages.about.eyebrow}
        title={messages.about.title}
        description={messages.about.subtitle}
      />

      <section className="shell pb-14 lg:pb-20">
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="t-eyebrow">{messages.about.focusEyebrow}</p>
            <ul className="mt-5 space-y-3">
              {messages.about.focus.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-navy">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="max-w-[64ch] space-y-6 lg:col-span-8 lg:col-start-5">
            {messages.about.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-[17px] leading-[1.8] text-ink">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-ice">
        <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-4">
            <h2 className="t-heading max-w-[16ch] text-navy">{messages.about.whyTitle}</h2>
          </div>
          <div className="lg:col-span-8">
            <div>
              {messages.about.why.map((entry, index) => (
                <Reveal key={entry.title} delay={index * 0.07}>
                  <article className="grid gap-3 border-t border-line-strong/70 py-7 first:border-t-0 first:pt-0 sm:grid-cols-12 sm:gap-6">
                    <span className="text-[10px] tabular-nums tracking-[0.1em] text-muted sm:col-span-2 sm:pt-1">
                      0{index + 1}
                    </span>
                    <div className="sm:col-span-10">
                      <h3 className="text-[16px] font-medium text-navy">{entry.title}</h3>
                      <p className="t-body mt-2 max-w-[58ch]">{entry.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="shell py-16 lg:py-24">
          <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="t-eyebrow text-white/40">{messages.about.closingLabel}</p>
              <p className="t-title mt-5 max-w-[18ch] text-white">{messages.about.closing}</p>
            </div>
            <AppLink href={`/${locale}/products`} className="btn btn-light">
              {messages.about.cta}
              <ArrowRight aria-hidden="true" className="arrow-icon" size={16} />
            </AppLink>
          </div>
          <div className="mt-14 border-t border-white/10 pt-8">
            <Logo variant="white" width={148} />
          </div>
        </div>
      </section>
    </>
  );
}
