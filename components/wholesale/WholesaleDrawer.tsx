"use client";

import { useState, type FormEvent } from "react";
import { AppLink } from "@/components/ui/AppLink";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail, MessageCircle, Minus, Plus, Trash2, X } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { useWholesale } from "@/components/wholesale/WholesaleProvider";
import { hasContactChannel, siteConfig } from "@/config/site";
import { getProduct } from "@/data/products";
import { getDirection } from "@/i18n/config";

type Field = "name" | "company" | "phone" | "email" | "businessType" | "country";
type Errors = Partial<Record<Field, string>>;
type Status = { tone: "info" | "error"; message: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.\-/]{6,}$/;

export function WholesaleDrawer() {
  const { locale, messages } = useLocale();
  const { items, count, removeItem, setQuantity, isOpen, closeDrawer } = useWholesale();
  const [fields, setFields] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    businessType: "",
    country: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();
  const rtl = getDirection(locale) === "rtl";
  const copy = messages.wholesale.form;

  function update(field: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function validate() {
    const next: Errors = {};
    if (!fields.name.trim()) next.name = copy.validation.required;
    if (!fields.company.trim()) next.company = copy.validation.required;
    if (!fields.phone.trim()) next.phone = copy.validation.required;
    else if (!PHONE_RE.test(fields.phone.trim())) next.phone = copy.validation.phone;
    if (!fields.email.trim()) next.email = copy.validation.required;
    else if (!EMAIL_RE.test(fields.email.trim())) next.email = copy.validation.email;
    if (!fields.businessType) next.businessType = copy.validation.required;
    if (!fields.country.trim()) next.country = copy.validation.required;
    setErrors(next);

    const noProducts = items.length === 0;
    setProductsError(noProducts ? copy.validation.products : null);

    return Object.keys(next).length === 0 && !noProducts;
  }

  function buildMessage() {
    const lines: string[] = [];
    lines.push(`DIAMOND — ${copy.title}`);
    lines.push("");
    lines.push(`${copy.name}: ${fields.name.trim()}`);
    lines.push(`${copy.company}: ${fields.company.trim()}`);
    lines.push(`${copy.phone}: ${fields.phone.trim()}`);
    lines.push(`${copy.email}: ${fields.email.trim()}`);
    lines.push(
      `${copy.businessType}: ${copy.businessTypes[fields.businessType as keyof typeof copy.businessTypes] ?? fields.businessType}`,
    );
    lines.push(`${copy.country}: ${fields.country.trim()}`);
    lines.push("");
    lines.push(`${copy.products}:`);
    items.forEach((line, index) => {
      const product = getProduct(line.id);
      const item = messages.products.items[line.id];
      const size = line.size ? ` — ${messages.product.size}: ${line.size}` : "";
      lines.push(
        `${index + 1}. ${product ? item.name : line.id}${size} — ${copy.productQuantity}: ${line.quantity}`,
      );
    });
    if (fields.message.trim()) {
      lines.push("");
      lines.push(`${copy.message}:`);
      lines.push(fields.message.trim());
    }
    return lines.join("\n");
  }

  function submit(channel: "whatsapp" | "email") {
    setStatus(null);
    if (!validate()) return;

    if (!hasContactChannel(channel)) {
      setStatus({ tone: "error", message: copy.unavailable });
      return;
    }

    setLoading(true);
    const body = buildMessage();
    const subject = `${copy.title} — DIAMOND`;

    try {
      if (channel === "whatsapp") {
        const digits = siteConfig.contact.whatsapp.replace(/[^\d]/g, "");
        const url = `https://wa.me/${digits}?text=${encodeURIComponent(body)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setStatus({ tone: "info", message: copy.whatsappOpened });
      } else {
        const url = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
        setStatus({ tone: "info", message: copy.emailOpened });
      }
    } finally {
      window.setTimeout(() => setLoading(false), 600);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    submit("email");
  }

  const offscreen = { x: rtl ? "-100%" : "100%" };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDrawer();
          setStatus(null);
        }
      }}
    >
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {isOpen ? (
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
              <Dialog.Content asChild forceMount key="content" aria-describedby="wholesale-intro">
                <motion.div
                  className="drawer-content"
                  data-variant="panel"
                  initial={reduceMotion ? false : offscreen}
                  animate={{ x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : offscreen}
                  transition={{ type: "spring", stiffness: 300, damping: 33, mass: 0.9 }}
                >
                  <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-4 lg:px-8">
                    <div>
                      <p className="t-eyebrow">{messages.wholesale.eyebrow}</p>
                      <Dialog.Title className="mt-2 text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-navy">
                        {copy.title}
                      </Dialog.Title>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label={messages.common.close}
                        className="mt-1 grid h-9 w-9 shrink-0 place-items-center border border-line text-navy transition-colors hover:border-navy"
                      >
                        <X aria-hidden="true" size={16} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="drawer-scroll flex-1 px-5 py-6 lg:px-8 lg:py-7">
                      <p id="wholesale-intro" className="t-small max-w-[52ch]">
                        {copy.intro}
                      </p>

                      <div className="mt-7 grid gap-x-4 gap-y-5 sm:grid-cols-2">
                        <Field
                          id="wholesale-name"
                          label={copy.name}
                          value={fields.name}
                          onChange={(value) => update("name", value)}
                          error={errors.name}
                          required
                        />
                        <Field
                          id="wholesale-company"
                          label={copy.company}
                          value={fields.company}
                          onChange={(value) => update("company", value)}
                          error={errors.company}
                          required
                        />
                        <Field
                          id="wholesale-phone"
                          label={copy.phone}
                          value={fields.phone}
                          onChange={(value) => update("phone", value)}
                          error={errors.phone}
                          type="tel"
                          autoComplete="tel"
                          required
                        />
                        <Field
                          id="wholesale-email"
                          label={copy.email}
                          value={fields.email}
                          onChange={(value) => update("email", value)}
                          error={errors.email}
                          type="email"
                          autoComplete="email"
                          required
                        />
                        <div>
                          <label htmlFor="wholesale-business" className="field-label">
                            {copy.businessType}
                          </label>
                          <select
                            id="wholesale-business"
                            className="field"
                            value={fields.businessType}
                            onChange={(event) => update("businessType", event.target.value)}
                            aria-invalid={Boolean(errors.businessType)}
                            required
                          >
                            <option value="">—</option>
                            <option value="distributor">{copy.businessTypes.distributor}</option>
                            <option value="supermarket">{copy.businessTypes.supermarket}</option>
                            <option value="retailer">{copy.businessTypes.retailer}</option>
                            <option value="cleaningCompany">
                              {copy.businessTypes.cleaningCompany}
                            </option>
                            <option value="other">{copy.businessTypes.other}</option>
                          </select>
                          {errors.businessType ? (
                            <p className="field-error">{errors.businessType}</p>
                          ) : null}
                        </div>
                        <Field
                          id="wholesale-country"
                          label={copy.country}
                          value={fields.country}
                          onChange={(value) => update("country", value)}
                          error={errors.country}
                          autoComplete="country-name"
                          required
                        />
                      </div>

                      <div className="mt-9">
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="field-label mb-0">{copy.products}</p>
                          <p className="text-[11px] text-muted">
                            <span className="tabular-nums text-navy">{count}</span> {copy.total}
                          </p>
                        </div>

                        {items.length === 0 ? (
                          <div className="mt-3 border border-dashed border-line-strong px-5 py-8 text-center">
                            <p className="text-[13px] font-medium text-navy">{copy.empty}</p>
                            <p className="t-small mx-auto mt-1.5 max-w-[34ch]">{copy.emptyHint}</p>
                            <AppLink
                              href={`/${locale}/products`}
                              onClick={closeDrawer}
                              className="link-quiet mt-4"
                            >
                              {copy.browse}
                            </AppLink>
                          </div>
                        ) : (
                          <ul className="mt-2">
                            {items.map((line) => {
                              const item = messages.products.items[line.id];
                              return (
                                <li
                                  key={`${line.id}-${line.size ?? ""}`}
                                  className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-medium leading-snug text-navy">
                                      {item.name}
                                    </p>
                                    <p className="mt-1 text-[11px] text-muted">
                                      {line.size
                                        ? `${messages.product.size}: ${line.size}`
                                        : messages.categories[getProduct(line.id)!.category]}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="stepper">
                                      <button
                                        type="button"
                                        aria-label={messages.common.decrease}
                                        onClick={() =>
                                          setQuantity(line.id, line.size, line.quantity - 1)
                                        }
                                      >
                                        <Minus aria-hidden="true" size={13} />
                                      </button>
                                      <input
                                        type="number"
                                        min={1}
                                        value={line.quantity}
                                        aria-label={`${messages.common.quantity} — ${item.name}`}
                                        onChange={(event) =>
                                          setQuantity(
                                            line.id,
                                            line.size,
                                            Number(event.target.value),
                                          )
                                        }
                                      />
                                      <button
                                        type="button"
                                        aria-label={messages.common.increase}
                                        onClick={() =>
                                          setQuantity(line.id, line.size, line.quantity + 1)
                                        }
                                      >
                                        <Plus aria-hidden="true" size={13} />
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeItem(line.id, line.size)}
                                      aria-label={`${copy.removeProduct} — ${item.name}`}
                                      className="grid h-9 w-8 place-items-center text-muted transition-colors hover:text-[#b42318]"
                                    >
                                      <Trash2 aria-hidden="true" size={15} />
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        {productsError ? <p className="field-error">{productsError}</p> : null}
                        <p className="t-small mt-3">{copy.notes}</p>
                      </div>

                      <div className="mt-8">
                        <label htmlFor="wholesale-message" className="field-label">
                          {copy.message}{" "}
                          <span className="font-normal text-muted">({messages.common.optional})</span>
                        </label>
                        <textarea
                          id="wholesale-message"
                          className="field"
                          value={fields.message}
                          onChange={(event) => update("message", event.target.value)}
                          placeholder={copy.messagePlaceholder}
                        />
                      </div>

                      {status ? (
                        <p
                          role="status"
                          className={`mt-5 border-s-2 px-3 py-2 text-[12px] leading-relaxed ${
                            status.tone === "error"
                              ? "border-[#b42318] bg-[#fdf2f0] text-[#8f1d14]"
                              : "border-emerald bg-[#f0f8f3] text-[#14663a]"
                          }`}
                        >
                          {status.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="border-t border-line bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-4 lg:px-8">
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => submit("whatsapp")}
                          disabled={loading}
                          className="btn btn-primary w-full"
                        >
                          <MessageCircle aria-hidden="true" size={16} />
                          {copy.sendWhatsApp}
                        </button>
                        <button type="submit" disabled={loading} className="btn btn-outline w-full">
                          <Mail aria-hidden="true" size={16} />
                          {loading ? copy.sending : copy.sendEmail}
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              </Dialog.Content>
            </>
          ) : null}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
};

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  required,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        autoComplete={autoComplete}
        required={required}
      />
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
