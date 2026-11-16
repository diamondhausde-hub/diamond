import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/messages";
import { buildPageMetadata } from "@/lib/seo";
import { isLocale } from "@/i18n/config";
import { products } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { CatalogClient } from "@/components/products/CatalogClient";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildPageMetadata(locale, "products");
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);

  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: messages.meta.pages.products.title,
    itemListElement: products.map((product, index) => {
      const item = messages.products.items[product.id];
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: item.name,
          description: item.short,
          category: messages.categories[product.category],
          brand: { "@type": "Brand", name: "DIAMOND" },
          url: `${siteConfig.url}/${locale}/products?product=${product.id}`,
        },
      };
    }),
  };

  return (
    <>
      <JsonLd data={list} />
      <PageHeader
        eyebrow={messages.catalog.eyebrow}
        title={messages.catalog.title}
        description={messages.catalog.description}
      />
      <CatalogClient />
    </>
  );
}
