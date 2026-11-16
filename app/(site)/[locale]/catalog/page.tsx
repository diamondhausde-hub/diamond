import type { Metadata } from "next";
import { AppLink } from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/i18n/messages";
import { isLocale } from "@/i18n/config";
import { products } from "@/data/products";
import { Logo } from "@/components/Logo";
import { ProductVisual } from "@/components/products/ProductVisual";
import { CatalogueActions } from "@/components/catalogue/CatalogueActions";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildPageMetadata(locale, "catalog");
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);

  return (
    <article className="shell print-page py-10 lg:py-14">
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <AppLink href={`/${locale}/products`} className="link-quiet">
          <ArrowLeft aria-hidden="true" className="arrow-icon" size={14} />
          {messages.catalogue.back}
        </AppLink>
        <CatalogueActions />
      </div>

      <header className="mt-10 border-t border-line pt-10 lg:mt-14 lg:pt-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo width={210} />
            <p className="t-eyebrow mt-8">{messages.catalogue.eyebrow}</p>
            <h1 className="t-title mt-3 text-navy">{messages.catalogue.title}</h1>
            <p className="t-body mt-4 max-w-[52ch]">{messages.catalogue.description}</p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            {new Date().getFullYear()}
          </p>
        </div>
        <p className="mt-8 text-[11px] text-muted no-print">{messages.catalogue.printHint}</p>
      </header>

      <div className="mt-10 border-t border-line-strong">
        {products.map((product, index) => {
          const item = messages.products.items[product.id];
          return (
            <section
              key={product.id}
              className="print-break grid gap-6 border-b border-line py-10 sm:grid-cols-12 sm:gap-8"
            >
              <div className="sm:col-span-3">
                <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-ice">
                  <ProductVisual variant={product.visual} className="p-3" />
                </div>
              </div>
              <div className="sm:col-span-9">
                <p className="t-eyebrow">
                  <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span> —{" "}
                  {messages.categories[product.category]}
                </p>
                <h2 className="t-heading mt-2 text-navy">{item.name}</h2>
                <p className="t-body mt-2 max-w-[62ch]">{item.detail}</p>

                <div className="mt-6 grid gap-8 lg:grid-cols-2">
                  <div>
                    <p className="field-label">{messages.product.specifications}</p>
                    <dl className="text-[12px]">
                      {item.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex items-start justify-between gap-6 border-b border-line py-2.5 last:border-b-0"
                        >
                          <dt className="text-muted">{spec.label}</dt>
                          <dd className="text-end font-medium text-ink">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    {item.sizes.length > 0 ? (
                      <>
                        <p className="field-label">{messages.product.availableSizes}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.sizes.map((size) => (
                            <span
                              key={size}
                              className="border border-line-strong px-3 py-1.5 text-[11px] font-medium text-navy"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : null}
                    <p className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-emerald">
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
                      {item.highlight}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Logo width={140} />
        <p className="max-w-[52ch] text-[10px] leading-relaxed text-muted">
          {messages.catalogue.note}
        </p>
      </footer>
    </article>
  );
}
