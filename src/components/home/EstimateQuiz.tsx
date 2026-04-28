"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatRub } from "@/lib/format";
import {
  ESTIMATE_LIMITS,
  calculateEstimate,
  objectTypes,
  validateCity,
  validateContact,
  validateVolume,
} from "@/lib/estimate";

type FormState = {
  objectType: string;
  volume: string;
  city: string;
  contact: string;
};

export function EstimateQuiz() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    objectType: objectTypes[0],
    volume: "",
    city: "Москва",
    contact: "",
  });

  const progress = useMemo(() => Math.round(((step + 1) / 4) * 100), [step]);
  const isVolumeValid = validateVolume(form.volume);
  const isCityValid = validateCity(form.city);
  const isContactValid = validateContact(form.contact);
  const estimate = useMemo(() => calculateEstimate(form), [form]);

  const validateStep = (stepToValidate: number) => {
    if (stepToValidate === 1 && !isVolumeValid) {
      return `Введите объём от ${ESTIMATE_LIMITS.minVolume} до ${ESTIMATE_LIMITS.maxVolume} м³`;
    }
    if (stepToValidate === 2 && !isCityValid) {
      return "Укажите город или регион";
    }
    if (stepToValidate === 3 && !isContactValid) {
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
    setStep((s) => Math.min(s + 1, 3));
  };

  const prev = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <div className="rounded-[8px] border border-brand-border bg-white p-6 shadow-card md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-accent">
        Экспресс-расчёт
      </p>
      <h3 className="mt-3 font-heading text-2xl font-bold text-brand-primary">
        Узнайте бюджет проекта за 2 минуты
      </h3>
      <div className="mt-5 h-2 overflow-hidden rounded bg-brand-surface">
        <div className="h-full bg-brand-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 min-h-[150px]">
        {step === 0 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">Тип объекта</label>
            <select
              value={form.objectType}
              onChange={(e) => setForm((v) => ({ ...v, objectType: e.target.value }))}
              className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3"
            >
              {objectTypes.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">Объём воды, м³</label>
            <input
              value={form.volume}
              onChange={(e) => {
                setError("");
                setForm((v) => ({ ...v, volume: e.target.value }));
              }}
              placeholder="Например, 45"
              className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3"
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">Город / регион</label>
            <input
              value={form.city}
              onChange={(e) => {
                setError("");
                setForm((v) => ({ ...v, city: e.target.value }));
              }}
              className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3"
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <label className="text-sm font-medium text-brand-text">Телефон или email</label>
            <input
              value={form.contact}
              onChange={(e) => {
                setError("");
                setForm((v) => ({ ...v, contact: e.target.value }));
              }}
              placeholder="+7 ... или mail@example.com"
              className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3"
            />
            {estimate ? (
              <div className="mt-4 rounded-[6px] bg-brand-surface p-4">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">
                  Примерный бюджет
                </p>
                <p className="mt-1 text-lg font-semibold text-brand-primary">
                  {formatRub(estimate.min)} - {formatRub(estimate.max)}
                </p>
                <p className="mt-1 text-xs text-brand-muted">
                  Точная смета зависит от оборудования, отделки и инженерных условий на объекте.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-[#cb2d2d]">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="ghost" onClick={prev} className="min-w-[130px]">
          Назад
        </Button>
        {step < 3 ? (
          <Button variant="secondary" onClick={next} className="min-w-[180px]">
            Следующий шаг
          </Button>
        ) : (
          <Button
            href={isContactValid ? "/contacts" : undefined}
            onClick={isContactValid ? undefined : next}
            variant="primary"
            className="min-w-[220px]"
          >
            Получить расчёт у инженера
          </Button>
        )}
      </div>
    </div>
  );
}
