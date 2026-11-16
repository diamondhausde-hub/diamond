import type { Metadata } from "next";
import { AppLink } from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/i18n/messages";
import { isLocale } from "@/i18n/config";
import { products } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { CompareSlider } from "@/components/glass-lab/CompareSlider";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildPageMetadata(locale, "glassLab");
}

export default async function GlassLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);
  const glassProducts = products.filter((product) => product.category === "glass");

  return (
    <>
      <PageHeader
        eyebrow={messages.glassLab.eyebrow}
        title={messages.glassLab.title}
        description={messages.glassLab.description}
      />

      <section className="shell pb-10">
        <CompareSlider className="aspect-[4/3] sm:aspect-[16/9]" />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <p className="text-[11px] text-navy">{messages.glassLab.instruction}</p>
          <p className="max-w-[52ch] text-[10px] leading-relaxed text-muted">
            {messages.glassLab.disclaimer}
          </p>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <p className="t-eyebrow">{messages.glassLab.stepsEyebrow}</p>
            <h2 className="t-heading mt-4 max-w-[16ch] text-navy">
              {messages.glassLab.stepsTitle}
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {messages.glassLab.steps.map((step, index) => (
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
      </section>

      <section className="border-y border-line bg-ice">
        <div className="shell py-14 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-eyebrow">{messages.glassLab.relatedEyebrow}</p>
              <h2 className="t-heading mt-4 max-w-[22ch] text-navy">
                {messages.glassLab.relatedTitle}
              </h2>
            </div>
            <AppLink href={`/${locale}/products?category=glass`} className="link-quiet">
              {messages.glassLab.relatedCta}
              <ArrowRight aria-hidden="true" className="arrow-icon" size={14} />
            </AppLink>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:max-w-[66%] lg:gap-x-8">
            {glassProducts.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
