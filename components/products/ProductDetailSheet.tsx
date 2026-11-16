"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { useMediaQuery } from "@/components/useMediaQuery";
import { useWholesale } from "@/components/wholesale/WholesaleProvider";
import { ProductVisual } from "@/components/products/ProductVisual";
import { getProduct, type ProductId } from "@/data/products";
import { withBasePath } from "@/lib/paths";
import { getDirection } from "@/i18n/config";

type Props = {
  productId: ProductId | null;
  onClose: () => void;
};

export function ProductDetailSheet({ productId, onClose }: Props) {
  const { locale, messages } = useLocale();
  const { addItem, openDrawer } = useWholesale();
  const product = productId ? getProduct(productId) : undefined;
  const item = productId ? messages.products.items[productId] : undefined;
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  const [size, setSize] = useState<string | null>(null);

  useEffect(() => {
    if (product?.sizes?.length) setSize(product.sizes[0]);
    else setSize(null);
  }, [product]);

  const rtl = getDirection(locale) === "rtl";
  const offscreen = isDesktop
    ? { x: rtl ? "-100%" : "100%" }
    : { y: "100%" };

  function handleAdd() {
    if (!product) return;
    addItem(product.id, size);
    openDrawer();
    onClose();
  }

  return (
    <Dialog.Root
      open={Boolean(product)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {product && item ? (
            <>
              <Dialog.Overlay asChild forceMount key="overlay">
                <motion.div
                  className="drawer-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount key="content" aria-describedby={undefined}>
                <motion.div
                  className="drawer-content"
                  data-variant="sheet"
                  initial={reduceMotion ? false : offscreen}
                  animate={{ x: 0, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : offscreen}
                  transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.9 }}
                  drag={isDesktop || reduceMotion ? false : "y"}
                  dragListener={false}
                  dragControls={dragControls}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.5 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 110 || info.velocity.y > 700) onClose();
                  }}
                >
                  <div className="drawer-scroll flex-1">
                    <div className="relative bg-ice">
                      <div
                        aria-hidden="true"
                        className="absolute left-1/2 top-3 z-10 h-[4px] w-10 -translate-x-1/2 rounded-full bg-navy/15 lg:hidden"
                        onPointerDown={(event) => {
                          if (!isDesktop) dragControls.start(event);
                        }}
                      />
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          aria-label={messages.product.close}
                          className="absolute end-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy shadow-sm backdrop-blur transition-colors hover:bg-white"
                        >
                          <X aria-hidden="true" size={16} />
                        </button>
                      </Dialog.Close>
                      <div className="mx-auto w-full max-w-[320px] px-3 pb-3 pt-10">
                        <div className="aspect-[4/5] w-full">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={withBasePath(product.image)}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ProductVisual variant={product.visual} />
                          )}
                        </div>
                        {product.gallery.length > 0 ? (
                          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                            {product.gallery.map((src) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={src}
                                src={withBasePath(src)}
                                alt={item.name}
                                className="h-16 w-16 shrink-0 border border-line object-cover"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="px-6 pb-8 pt-7 lg:px-9">
                      <p className="t-eyebrow">{messages.categories[product.category]}</p>
                      <Dialog.Title className="mt-3 text-[1.6rem] font-medium leading-[1.15] tracking-[-0.02em] text-navy">
                        {item.name}
                      </Dialog.Title>
                      <p className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-emerald">
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
                        {item.highlight}
                      </p>

                      <p className="t-body mt-5">{item.detail}</p>

                      {product.sizes.length > 0 ? (
                        <div className="mt-7">
                          <p className="field-label">{messages.product.availableSizes}</p>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setSize(option)}
                                aria-pressed={size === option}
                                className={`min-w-[4.5rem] border px-3.5 py-2.5 text-[12px] font-medium transition-colors ${
                                  size === option
                                    ? "border-navy bg-navy text-white"
                                    : "border-line-strong bg-white text-navy hover:border-navy"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-8">
                        <p className="field-label">{messages.product.specifications}</p>
                        <dl className="text-[13px]">
                          {item.specs.map((spec) => (
                            <div
                              key={spec.label}
                              className="flex items-start justify-between gap-6 border-b border-line py-3 last:border-b-0"
                            >
                              <dt className="text-muted">{spec.label}</dt>
                              <dd className="text-end font-medium text-ink">{spec.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-line bg-white px-6 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-4 lg:px-9">
                    <button type="button" onClick={handleAdd} className="btn btn-primary w-full">
                      {messages.product.addToWholesale}
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          ) : null}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
