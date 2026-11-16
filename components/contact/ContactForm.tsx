"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { hasContactChannel, siteConfig } from "@/config/site";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = { tone: "info" | "error"; message: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const { messages } = useLocale();
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>(null);

  function update(field: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus(null);
    const next: Errors = {};
    if (!fields.name.trim()) next.name = messages.contact.validation.required;
    if (!fields.email.trim()) next.email = messages.contact.validation.required;
    else if (!EMAIL_RE.test(fields.email.trim())) next.email = messages.contact.validation.email;
    if (!fields.message.trim()) next.message = messages.contact.validation.required;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!hasContactChannel("email")) {
      setStatus({ tone: "error", message: messages.contact.unavailable });
      return;
    }

    const subject = `${fields.subject.trim() || "DIAMOND"} — DIAMOND`;
    const body = [
      `${messages.contact.name}: ${fields.name.trim()}`,
      `${messages.contact.email}: ${fields.email.trim()}`,
      "",
      fields.message.trim(),
    ].join("\n");

    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setStatus({ tone: "info", message: messages.contact.emailNote });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[640px]">
      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field
          id="contact-name"
          label={messages.contact.name}
          value={fields.name}
          onChange={(value) => update("name", value)}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id="contact-email"
          label={messages.contact.email}
          value={fields.email}
          onChange={(value) => update("email", value)}
          error={errors.email}
          type="email"
          autoComplete="email"
        />
        <div className="sm:col-span-2">
          <label htmlFor="contact-subject" className="field-label">
            {messages.contact.subject}{" "}
            <span className="font-normal text-muted">({messages.common.optional})</span>
          </label>
          <input
            id="contact-subject"
            className="field"
            value={fields.subject}
            onChange={(event) => update("subject", event.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="field-label">
            {messages.contact.message}
          </label>
          <textarea
            id="contact-message"
            className="field"
            value={fields.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder={messages.contact.messagePlaceholder}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            required
          />
          {errors.message ? (
            <p id="contact-message-error" className="field-error">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary">
          {messages.contact.cta}
          <Send aria-hidden="true" size={15} />
        </button>
        <p className="max-w-[36ch] text-[11px] leading-relaxed text-muted">
          {hasContactChannel("email")
            ? messages.contact.emailNote
            : messages.contact.unavailable}
        </p>
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
    </form>
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
};

function Field({ id, label, value, onChange, error, type = "text", autoComplete }: FieldProps) {
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
        required
      />
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
