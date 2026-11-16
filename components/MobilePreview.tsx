"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Monitor, Smartphone, X } from "lucide-react";
import { useMessages } from "@/components/LocaleProvider";

type Props = {
  /**
   * `header` renders a compact icon button that sits in the site header.
   * The default is a labelled button.
   */
  variant?: "default" | "header";
  className?: string;
};

export function MobilePreview({ variant = "default", className = "" }: Props) {
  const messages = useMessages();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={messages.preview.open}
          title={messages.preview.open}
          className={
            variant === "header"
              ? `grid h-9 w-9 shrink-0 place-items-center border border-line text-navy transition-colors hover:border-navy hover:text-emerald ${className}`
              : `inline-flex items-center gap-2 border border-line bg-white px-3 py-2 text-[11px] font-medium text-navy transition-colors hover:border-navy ${className}`
          }
        >
          <Smartphone aria-hidden="true" size={variant === "header" ? 15 : 14} />
          <span className={variant === "header" ? "sr-only" : ""}>{messages.preview.open}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay" />
        <Dialog.Content className="fixed inset-0 z-[62] flex flex-col items-center justify-center gap-4 p-6 outline-none">
          <Dialog.Title className="sr-only">{messages.preview.title}</Dialog.Title>
          <Dialog.Description className="sr-only">{messages.preview.hint}</Dialog.Description>
          <div className="flex w-full max-w-[430px] items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
              <Monitor aria-hidden="true" size={13} />
              {messages.preview.desktop}
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={messages.preview.close}
                className="grid h-8 w-8 place-items-center border border-white/30 text-white transition-colors hover:bg-white hover:text-navy"
              >
                <X aria-hidden="true" size={15} />
              </button>
            </Dialog.Close>
          </div>
          <div className="overflow-hidden rounded-[2.6rem] border border-white/20 bg-navy p-[10px] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="relative overflow-hidden rounded-[2rem] bg-white">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-2 z-10 h-[22px] w-[108px] -translate-x-1/2 rounded-full bg-navy"
              />
              <iframe
                src={`${pathname}?preview=1`}
                title={messages.preview.title}
                className="block h-[min(800px,calc(100dvh-170px))] w-[min(370px,calc(100vw-80px))] border-0 bg-white"
              />
            </div>
          </div>
          <p className="max-w-[360px] text-center text-[10px] text-white/50">
            {messages.preview.hint}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
