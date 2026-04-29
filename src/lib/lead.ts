import { applyRussianNbsp } from "@/lib/ru-typography";

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
  agree: boolean;
  website?: string;
};

export type LeadField = "name" | "phone" | "email" | "message" | "agree";
export type LeadErrors = Partial<Record<LeadField, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;

export function normalizeLeadPayload(payload: LeadPayload): LeadPayload {
  return {
    ...payload,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
    website: payload.website?.trim(),
  };
}

export function validateLeadPayload(rawPayload: LeadPayload): LeadErrors {
  const payload = normalizeLeadPayload(rawPayload);
  const errors: LeadErrors = {};

  if (payload.name.length < 2) {
    errors.name = applyRussianNbsp("Укажите имя (минимум 2 символа)");
  }

  if (!phoneRegex.test(payload.phone)) {
    errors.phone = applyRussianNbsp("Введите корректный телефон");
  }

  if (payload.email.length > 0 && !emailRegex.test(payload.email)) {
    errors.email = applyRussianNbsp("Введите корректный email");
  }

  if (payload.message.length > 0 && payload.message.length < 10) {
    errors.message = applyRussianNbsp("Если заполняете сообщение, укажите минимум 10 символов");
  }

  if (!payload.agree) {
    errors.agree = applyRussianNbsp("Нужно согласие на обработку персональных данных");
  }

  return errors;
}

export function hasLeadErrors(errors: LeadErrors): boolean {
  return Object.keys(errors).length > 0;
}
