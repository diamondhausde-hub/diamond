"use client";

import { useEffect, useMemo, useState } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { ArrowRight, Search, X } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetailSheet } from "@/components/products/ProductDetailSheet";
import { categories, products, type CategoryId, type ProductId } from "@/data/products";

type Filter = "all" | CategoryId;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064b-\u0652]/g, "")
    .trim();
}

export function CatalogClient() {
  const { locale, messages } = useLocale();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<ProductId | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get("product");
    if (param && products.some((product) => product.id === param)) {
      setSelected(param as ProductId);
    }
    const category = params.get("category");
    if (category && (category === "all" || categories.some((entry) => entry.id === category))) {
      setFilter(category as Filter);
    }
  }, []);

  function changeFilter(next: Filter) {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState({}, "", url);
  }

  function openProduct(id: ProductId) {
    setSelected(id);
    const url = new URL(window.location.href);
    url.searchParams.set("product", id);
    window.history.replaceState({}, "", url);
  }

  function closeProduct() {
    setSelected(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("product");
    window.history.replaceState({}, "", url);
  }

  const filtered = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    return products.filter((product) => {
      if (filter !== "all" && product.category !== filter) return false;
      if (tokens.length === 0) return true;
      const item = messages.products.items[product.id];
      const haystack = normalize(
        [
          item.name,
          item.short,
          item.detail,
          item.highlight,
          messages.categories[product.category],
          ...item.specs.flatMap((spec) => [spec.label, spec.value]),
          ...product.sizes,
        ].join(" "),
      );
      return tokens.every((token) => haystack.includes(token));
    });
  }, [filter, messages, query]);

  return (
    <>
      <div className="shell">
        <div className="flex flex-col gap-6 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="relative w-full max-w-[340px]">
            <Search
              aria-hidden="true"
              size={16}
              className="pointer-events-none absolute start-0 top-1/2 -translate-y-1/2 text-muted"
            />
            <label htmlFor="product-search" className="sr-only">
              {messages.catalog.searchLabel}
            </label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={messages.catalog.searchPlaceholder}
              className="h-11 w-full border-0 border-b border-line-strong bg-transparent ps-7 pe-8 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-emerald"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={messages.catalog.clearSearch}
                className="absolute end-0 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-muted transition-colors hover:text-navy"
              >
                <X aria-hidden="true" size={14} />
              </button>
            ) : null}
          </div>

          <div
            className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto px-1"
            role="group"
            aria-label={messages.catalog.filtersLabel}
          >
            <button
              type="button"
              onClick={() => changeFilter("all")}
              aria-pressed={filter === "all"}
              className={`relative shrink-0 px-3 py-2 text-[12px] font-medium transition-colors ${
                filter === "all" ? "text-navy" : "text-muted hover:text-navy"
              }`}
            >
              {messages.categories.all}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 bottom-0 h-[2px] bg-emerald transition-opacity ${
                  filter === "all" ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
            {categories.map((category) => {
              const active = filter === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => changeFilter(category.id)}
                  aria-pressed={active}
                  className={`relative shrink-0 px-3 py-2 text-[12px] font-medium transition-colors ${
                    active ? "text-navy" : "text-muted hover:text-navy"
                  }`}
                >
                  {messages.categories[category.id]}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-0 h-[2px] bg-emerald transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted" aria-live="polite">
            <span className="tabular-nums text-navy">{filtered.length}</span>{" "}
            {messages.catalog.resultsLabel}
          </p>
          <AppLink href={`/${locale}/catalog`} className="link-quiet hidden sm:inline-flex">
            {messages.catalog.catalogueLink}
            <ArrowRight aria-hidden="true" className="arrow-icon" size={14} />
          </AppLink>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 pb-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => openProduct(product.id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center pb-24 pt-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-muted">
              <Search aria-hidden="true" size={18} />
            </span>
            <p className="mt-5 max-w-[34ch] text-[15px] text-navy">{messages.catalog.noResults}</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                changeFilter("all");
              }}
              className="link-quiet mt-5"
            >
              {messages.catalog.clearSearch}
            </button>
          </div>
        )}
      </div>

      <ProductDetailSheet productId={selected} onClose={closeProduct} />
    </>
  );
}
