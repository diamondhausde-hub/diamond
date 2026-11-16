"use client";

import { ChevronDown } from "lucide-react";
import { localeMeta, locales, type Locale } from "@/i18n/config";

type Props = {
  value: Locale;
  onChange: (locale: Locale) => void;
  label: string;
  dark?: boolean;
  id?: string;
};

export function LanguageSelect({ value, onChange, label, dark, id }: Props) {
  return (
    <span className={`language-control${dark ? " language-control--dark" : ""}`}>
      <span className="language-control__label" aria-hidden="true">
        {localeMeta[value].nativeLabel}
      </span>
      <select
        id={id}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value as Locale)}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} lang={localeMeta[locale].htmlLang}>
            {localeMeta[locale].nativeLabel}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="chevron" />
    </span>
  );
}
