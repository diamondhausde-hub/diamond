"use client";

import { useWholesale } from "@/components/wholesale/WholesaleProvider";
import { useMessages } from "@/components/LocaleProvider";
import { ArrowRight } from "lucide-react";

type Props = {
  className?: string;
  label?: string;
  variant?: "primary" | "navy" | "light" | "outline";
};

export function WholesaleCta({ className, label, variant = "primary" }: Props) {
  const { openDrawer } = useWholesale();
  const messages = useMessages();

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`btn btn-${variant} ${className ?? ""}`}
    >
      {label ?? messages.wholesale.cta}
      <ArrowRight aria-hidden="true" className="arrow-icon" size={16} />
    </button>
  );
}
