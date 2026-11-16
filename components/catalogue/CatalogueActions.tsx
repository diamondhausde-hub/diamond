"use client";

import { Download, Printer } from "lucide-react";
import { useMessages } from "@/components/LocaleProvider";
import { siteConfig } from "@/config/site";

export function CatalogueActions() {
  const messages = useMessages();

  if (siteConfig.cataloguePdf) {
    return (
      <a href={siteConfig.cataloguePdf} download className="btn btn-primary btn-sm">
        <Download aria-hidden="true" size={15} />
        {messages.catalogue.download}
      </a>
    );
  }

  return (
    <button type="button" onClick={() => window.print()} className="btn btn-primary btn-sm">
      <Printer aria-hidden="true" size={15} />
      {messages.common.print}
    </button>
  );
}
