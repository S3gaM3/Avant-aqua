"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRub } from "@/lib/format";
import {
  ESTIMATE_LIMITS,
  calculateEstimate,
  objectTypes,
  validateCity,
  validateContact,
  validateVolume,
} from "@/lib/estimate";
import { applyRussianNbsp } from "@/lib/ru-typography";

type FormState = {
  objectType: string;
  volume: string;
  city: string;
  finishLevel: "standard" | "premium" | "exclusive";
  options: Array<"overflow" | "automation" | "spa">;
  name: string;
  contact: string;
};

const finishLevelLabel: Record<FormState["finishLevel"], string> = {
  standard: "Стандарт",
  premium: "Премиум",
  exclusive: "Эксклюзив",
};

const optionLabel: Record<FormState["options"][number], string> = {
  overflow: "Переливная система",
  automation: "Автоматизация и удалённый контроль",
  spa: "SPA-опции (гидромассаж, аттракционы)",
};

export function EstimateQuiz() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    objectType: objectTypes[0],
    volume: "",
    city: "Москва",
    finishLevel: "standard",
    options: [],
    name: "",
    contact: "",
  });

  const progress = useMemo(() => Math.round(((step + 1) / 5) * 100), [step]);
  const isVolumeValid = validateVolume(form.volume);
  const isCityValid = validateCity(form.city);
  const isContactValid = validateContact(form.contact);
  const estimate = useMemo(() => {
    const base = calculateEstimate(form);
    if (!base) return null;
    const finishFactor =
      form.finishLevel === "premium" ? 1.15 : form.finishLevel === "exclusive" ? 1.3 : 1;
    const optionsFactor = 1 + form.options.length * 0.06;
    return {
      min: Math.round(base.min * finishFactor * optionsFactor),
      max: Math.round(base.max * finishFactor * optionsFactor),
    };
  }, [form]);
  const contactLink = useMemo(() => {
    if (!estimate) return "/contacts";
    const summary = [
      "Заявка из калькулятора проекта",
      `Тип объекта: ${form.objectType}`,
      `Объём: ${form.volume} м³`,
      `Город: ${form.city}`,
      `Отделка: ${finishLevelLabel[form.finishLevel]}`,
      `Опции: ${form.options.length > 0 ? form.options.map((item) => optionLabel[item]).join(", ") : "без доп. опций"}`,
      `Ориентировочная смета: ${formatRub(estimate.min)} — ${formatRub(estimate.max)}`,
      `Контакт: ${form.contact}`,
      form.name ? `Имя: ${form.name}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return `/contacts?message=${encodeURIComponent(summary)}`;
  }, [estimate, form]);

  const validateStep = (stepToValidate: number) => {
    if (stepToValidate === 1 && !isVolumeValid) {
      return `Введите объём от ${ESTIMATE_LIMITS.minVolume} до ${ESTIMATE_LIMITS.maxVolume} м³`;
    }
    if (stepToValidate === 2 && !isCityValid) {
      return applyRussianNbsp("Укажите город или регион");
    }
    if (stepToValidate === 4 && !isContactValid) {
      return "Введите корректный телефон или email";
    }
    return "";
  };

  const next = () => {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, 4));
  };

  const prev = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <div className="rounded-[8px] border border-brand-border bg-white p-6 shadow-card md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-accent">
        Калькулятор проекта
      </p>
      <h3 className="mt-3 font-heading text-2xl font-bold text-brand-primary">
        Рассчитайте ориентировочную стоимость за 2 минуты
      </h3>
      <div className="mt-5 h-2 overflow-hidden rounded bg-brand-surface">
        <div className="h-full bg-brand-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 min-h-[210px]">
        {step === 0 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">1. Тип проекта</label>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {objectTypes.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setForm((v) => ({ ...v, objectType: o }))}
                  className={`rounded-[6px] border px-4 py-3 text-left text-sm ${
                    form.objectType === o
                      ? "border-brand-accent bg-brand-surface text-brand-primary"
                      : "border-brand-border bg-white text-brand-text"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">2. Объём воды, м³</label>
            <Input
              value={form.volume}
              onChange={(e) => {
                setError("");
                setForm((v) => ({ ...v, volume: e.target.value }));
              }}
              placeholder="Например, 45"
              className="mt-2"
            />
            <p className="mt-2 text-xs text-brand-muted">
              Диапазон: {ESTIMATE_LIMITS.minVolume}–{ESTIMATE_LIMITS.maxVolume} м³
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">
              {applyRussianNbsp("3. Город и уровень отделки")}
            </label>
            <Input
              value={form.city}
              onChange={(e) => {
                setError("");
                setForm((v) => ({ ...v, city: e.target.value }));
              }}
              className="mt-2"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                { id: "standard", label: "Стандарт" },
                { id: "premium", label: "Премиум" },
                { id: "exclusive", label: "Эксклюзив" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setForm((v) => ({ ...v, finishLevel: item.id as FormState["finishLevel"] }))
                  }
                  className={`rounded-[6px] border px-3 py-2 text-sm ${
                    form.finishLevel === item.id
                      ? "border-brand-accent bg-brand-surface text-brand-primary"
                      : "border-brand-border bg-white text-brand-text"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">4. Дополнительные опции</label>
            <div className="mt-3 space-y-2">
              {[
                { id: "overflow", label: "Переливная система" },
                { id: "automation", label: "Автоматизация и удалённый контроль" },
                { id: "spa", label: "SPA-опции (гидромассаж, аттракционы)" },
              ].map((option) => {
                const checked = form.options.includes(option.id as FormState["options"][number]);
                return (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 text-sm text-brand-text"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setForm((v) => ({
                          ...v,
                          options: e.target.checked
                            ? [...v.options, option.id as FormState["options"][number]]
                            : v.options.filter((x) => x !== option.id),
                        }));
                      }}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">5. Ваши контакты</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
              placeholder="Ваше имя (необязательно)"
              className="mt-2"
            />
            <Input
              value={form.contact}
              onChange={(e) => {
                setError("");
                setForm((v) => ({ ...v, contact: e.target.value }));
              }}
              placeholder="+7 ... или mail@example.com"
              className="mt-2"
            />
            {estimate ? (
              <div className="mt-4 rounded-[6px] bg-brand-surface p-4">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">
                  Примерный бюджет
                </p>
                <p className="mt-1 text-lg font-semibold text-brand-primary">
                  {formatRub(estimate.min)} — {formatRub(estimate.max)}
                </p>
                <p className="mt-1 text-xs text-brand-muted">
                  {applyRussianNbsp(
                    "Точная смета зависит от оборудования, отделки и инженерных условий на объекте.",
                  )}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-[#cb2d2d]">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="ghost" onClick={prev} className="w-full sm:w-auto sm:min-w-[130px]">
          Назад
        </Button>
        {step < 4 ? (
          <Button variant="secondary" onClick={next} className="w-full sm:w-auto sm:min-w-[180px]">
            Следующий шаг
          </Button>
        ) : (
          <Link
            href={isContactValid ? contactLink : "#"}
            className="w-full sm:w-auto"
            onClick={
              isContactValid
                ? undefined
                : (e) => {
                    e.preventDefault();
                    next();
                  }
            }
          >
            <Button variant="primary" className="w-full sm:w-auto sm:min-w-[220px]">
              Получить расчёт у инженера
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
