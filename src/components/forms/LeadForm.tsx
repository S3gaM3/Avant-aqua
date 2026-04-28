"use client";

import { useState } from "react";
import { hasLeadErrors, type LeadErrors, type LeadPayload, validateLeadPayload } from "@/lib/lead";

export function LeadForm({ submitLabel = "Отправить сообщение" }: { submitLabel?: string }) {
  const [form, setForm] = useState<LeadPayload>({
    name: "",
    phone: "",
    email: "",
    message: "",
    agree: false,
    website: "",
  });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const updateField = <K extends keyof LeadPayload>(field: K, value: LeadPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitState !== "idle") {
      setSubmitState("idle");
      setSubmitMessage("");
    }
  };

  const submit = async () => {
    const nextErrors = validateLeadPayload(form);
    if (hasLeadErrors(nextErrors)) {
      setErrors(nextErrors);
      setSubmitState("error");
      setSubmitMessage("Проверьте форму и исправьте ошибки.");
      return;
    }

    setSubmitState("loading");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: LeadErrors;
      };

      if (!response.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setSubmitState("error");
        setSubmitMessage(data.message ?? "Не удалось отправить форму.");
        return;
      }

      setSubmitState("success");
      setSubmitMessage("Заявка отправлена. Мы свяжемся с вами в ближайшее время.");
      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
        agree: false,
        website: "",
      });
      setErrors({});
    } catch {
      setSubmitState("error");
      setSubmitMessage("Ошибка сети. Попробуйте отправить форму ещё раз.");
    }
  };

  return (
    <form
      className="mx-auto max-w-xl space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        await submit();
      }}
      noValidate
    >
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.website ?? ""}
        onChange={(e) => updateField("website", e.target.value)}
        className="hidden"
      />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-text">
          Имя
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3 text-brand-text outline-none ring-brand-accent focus:ring-2"
        />
        {errors.name ? (
          <p id="name-error" className="mt-1 text-sm text-[#cb2d2d]">
            {errors.name}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-brand-text">
          Телефон
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3 text-brand-text outline-none ring-brand-accent focus:ring-2"
        />
        {errors.phone ? (
          <p id="phone-error" className="mt-1 text-sm text-[#cb2d2d]">
            {errors.phone}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-text">
          Электронная почта
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3 text-brand-text outline-none ring-brand-accent focus:ring-2"
        />
        {errors.email ? (
          <p id="email-error" className="mt-1 text-sm text-[#cb2d2d]">
            {errors.email}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brand-text">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3 text-brand-text outline-none ring-brand-accent focus:ring-2"
        />
        {errors.message ? (
          <p id="message-error" className="mt-1 text-sm text-[#cb2d2d]">
            {errors.message}
          </p>
        ) : null}
      </div>
      <label className="flex items-start gap-3 text-sm text-brand-muted">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => updateField("agree", e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-brand-border text-brand-accent"
        />
        <span>
          Нажимая кнопку «{submitLabel}», вы соглашаетесь на обработку персональных данных в
          соответствии с{" "}
          <a href="/privacy" className="text-brand-accent underline hover:text-brand-primary">
            политикой конфиденциальности
          </a>
          .
        </span>
      </label>
      {errors.agree ? <p className="text-sm text-[#cb2d2d]">{errors.agree}</p> : null}
      {submitMessage ? (
        <p className={`text-sm ${submitState === "success" ? "text-[#12703a]" : "text-[#cb2d2d]"}`}>
          {submitMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitState === "loading"}
        className="w-full rounded-[6px] bg-brand-accent py-4 text-base font-semibold text-white shadow-card transition-transform hover:-translate-x-1.5 hover:bg-[#d24f0a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitState === "loading" ? "Отправка..." : submitLabel}
      </button>
    </form>
  );
}
