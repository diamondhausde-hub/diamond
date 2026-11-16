"use client";

import { AppLink } from "@/components/ui/AppLink";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { ProductVisual } from "@/components/products/ProductVisual";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  onOpen?: () => void;
};

export function ProductCard({ product, onOpen }: Props) {
  const { locale, messages } = useLocale();
  const item = messages.products.items[product.id];
  const category = messages.categories[product.category];
  const keySpec = item.specs[0];
  const href = `/${locale}/products?product=${product.id}`;

  const inner = (
    <>
      <div className="product-tile__media">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <ProductVisual variant={product.visual} className="p-2" />
        )}
        <span className="absolute start-4 top-4 inline-flex items-center gap-2 bg-white/85 px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-navy backdrop-blur-sm">
          {category}
        </span>
      </div>
      <div className="product-tile__body flex flex-1 flex-col">
        <h3 className="product-tile__name">{item.name}</h3>
        <p className="t-small mt-2 line-clamp-2">{item.short}</p>
        {keySpec ? (
          <p className="mt-4 inline-flex items-center gap-2 text-[11px] text-muted">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
            {keySpec.value}
          </p>
        ) : null}
        <span className="link-quiet product-tile__cta mt-5 self-start">
          {messages.common.viewDetails}
          <ArrowRight aria-hidden="true" className="arrow-icon" size={15} />
        </span>
      </div>
    </>
  );

  if (onOpen) {
    return (
      <button type="button" onClick={onOpen} className="product-tile w-full text-start">
        {inner}
      </button>
    );
  }

  return (
    <AppLink href={href} className="product-tile">
      {inner}
    </AppLink>
  );
}
