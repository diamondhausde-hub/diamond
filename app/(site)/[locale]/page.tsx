import type { Metadata } from "next";
import { AppLink } from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/i18n/messages";
import { isLocale, locales } from "@/i18n/config";
import { products } from "@/data/products";
import { siteConfig } from "@/config/site";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { ProductVisual } from "@/components/products/ProductVisual";
import { ProductCard } from "@/components/products/ProductCard";
import { CompareSlider } from "@/components/glass-lab/CompareSlider";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/Logo";
import { JsonLd } from "@/components/JsonLd";
import { WholesaleCta } from "@/components/wholesale/WholesaleCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildPageMetadata(locale, "home");
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);
  const featured = products.filter((product) => product.featured);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DIAMOND",
    url: siteConfig.url,
    logo: absoluteUrl("/brand/logo.svg"),
    slogan: messages.meta.slogan,
    description: messages.meta.pages.home.description,
  };

  return (
    <>
      <JsonLd data={organization} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="shell grid items-center gap-10 pb-12 pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-16">
          <div className="lg:col-span-6">
            <p className="t-eyebrow animate-rise">{messages.home.hero.eyebrow}</p>
            <h1
              className="t-display animate-rise mt-5 whitespace-pre-line text-navy"
              style={{ animationDelay: "0.08s" }}
            >
              {messages.home.hero.title}
            </h1>
            <p
              className="t-lead animate-rise mt-7 max-w-[44ch]"
              style={{ animationDelay: "0.16s" }}
            >
              {messages.home.hero.description}
            </p>
            <div
              className="animate-rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "0.24s" }}
            >
              <AppLink href={`/${locale}/products`} className="btn btn-primary">
                {messages.home.hero.primary}
                <ArrowRight aria-hidden="true" className="arrow-icon" size={16} />
              </AppLink>
              <AppLink href={`/${locale}/about`} className="btn btn-outline">
                {messages.home.hero.secondary}
              </AppLink>
            </div>
          </div>

          <div className="animate-wipe lg:col-span-6">
            <figure className="relative overflow-hidden bg-ice">
              <div className="relative flex aspect-[5/4] items-center justify-center sm:aspect-[4/3] lg:aspect-[5/4] xl:aspect-[4/3]">
                <div className="mx-auto h-full w-full max-w-[560px] px-3 pb-14 pt-3 lg:px-6">
                  <ProductVisual variant="glassCloth" />
                </div>
                <span aria-hidden="true" className="absolute start-0 top-0 h-16 w-[2px] bg-gold" />
                <span className="absolute start-5 top-5 text-[9px] uppercase tracking-[0.2em] text-navy/45">
                  {messages.home.hero.visualEyebrow}
                </span>
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 border-t border-white/70 bg-white/85 px-5 py-4 backdrop-blur-sm">
                <div>
                  <p className="text-[13px] font-medium leading-snug text-navy">
                    {messages.home.hero.visualName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">{messages.home.hero.visualNote}</p>
                </div>
                <p className="shrink-0 text-end text-[10px] font-medium uppercase tracking-[0.1em] text-navy">
                  {messages.home.hero.visualSpec}
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-t border-line">
        <div className="shell py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <p className="t-eyebrow">{messages.home.highlights.eyebrow}</p>
              <h2 className="t-heading mt-4 max-w-[20ch] text-navy">
                {messages.home.highlights.title}
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-10">
              {messages.home.highlights.items.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08}>
                  <div className="border-t border-line pt-5">
                    <span className="text-[10px] tabular-nums tracking-[0.1em] text-muted">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 text-[15px] font-medium text-navy">{item.title}</h3>
                    <p className="t-small mt-2 max-w-[26ch]">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="shell py-14 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-eyebrow">{messages.home.featured.eyebrow}</p>
            <h2 className="t-heading mt-4 max-w-[22ch] text-navy">
              {messages.home.featured.title}
            </h2>
          </div>
          <AppLink href={`/${locale}/products`} className="link-quiet">
            {messages.home.featured.cta}
            <ArrowRight aria-hidden="true" className="arrow-icon" size={14} />
          </AppLink>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Glass lab teaser */}
      <section className="bg-navy text-white">
        <div className="shell grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="lg:col-span-5">
            <p className="t-eyebrow text-white/45">{messages.home.lab.eyebrow}</p>
            <h2 className="t-title mt-4 max-w-[16ch] text-white">{messages.home.lab.title}</h2>
            <p className="t-lead mt-6 max-w-[42ch] text-white/60">{messages.home.lab.description}</p>
            <AppLink href={`/${locale}/glass-lab`} className="btn btn-light mt-8">
              {messages.home.lab.cta}
              <ArrowRight aria-hidden="true" className="arrow-icon" size={16} />
            </AppLink>
          </div>
          <div className="lg:col-span-7">
            <CompareSlider className="aspect-[4/3] sm:aspect-[16/10]" compact />
            <p className="mt-3 text-[11px] text-white/40">{messages.glassLab.instruction}</p>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="shell py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="t-eyebrow">{messages.home.about.eyebrow}</p>
            <h2 className="t-title mt-5 max-w-[12ch] text-navy">{messages.home.about.title}</h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-[17px] leading-[1.7] text-ink">{messages.home.about.description}</p>
            <AppLink href={`/${locale}/about`} className="link-quiet mt-8">
              {messages.home.about.cta}
              <ArrowRight aria-hidden="true" className="arrow-icon" size={14} />
            </AppLink>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-line pt-8 lg:mt-20">
          <Logo width={132} />
          <span aria-hidden="true" className="hidden h-8 w-px bg-line sm:block" />
          <p className="brand-tagline text-[10px] uppercase tracking-[0.28em] text-muted">
            {messages.meta.slogan}
          </p>
        </div>
      </section>

      {/* Wholesale */}
      <section className="border-y border-line bg-ice">
        <div className="shell grid items-center gap-8 py-12 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-7">
            <p className="t-eyebrow">{messages.home.wholesale.eyebrow}</p>
            <h2 className="t-heading mt-4 max-w-[20ch] text-navy">
              {messages.home.wholesale.title}
            </h2>
            <p className="t-body mt-4 max-w-[54ch]">{messages.home.wholesale.description}</p>
          </div>
          <div className="lg:col-span-5 lg:text-end">
            <WholesaleCta label={messages.home.wholesale.cta} />
          </div>
        </div>
      </section>
    </>
  );
}
