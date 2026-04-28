import type { CartLine } from "@/lib/stores/cart-store";

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  address1: string;
  postcode: string;
  comment: string;
};

export type CreateOrderPayload = {
  customer: CheckoutCustomer;
  lines: CartLine[];
};

export type CheckoutOrderErrors = Partial<
  Record<
    "firstName" | "lastName" | "phone" | "email" | "city" | "address1" | "postcode" | "lines",
    string
  >
>;

const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasValue(value: string, min = 2): boolean {
  return value.trim().length >= min;
}

export function validateCreateOrderPayload(payload: CreateOrderPayload): CheckoutOrderErrors {
  const errors: CheckoutOrderErrors = {};
  const c = payload.customer;

  if (!hasValue(c.firstName)) errors.firstName = "Укажите имя";
  if (!hasValue(c.lastName)) errors.lastName = "Укажите фамилию";
  if (!phoneRegex.test(c.phone.trim())) errors.phone = "Введите корректный телефон";
  if (!emailRegex.test(c.email.trim())) errors.email = "Введите корректный email";
  if (!hasValue(c.city)) errors.city = "Укажите город";
  if (!hasValue(c.address1, 4)) errors.address1 = "Укажите адрес доставки";
  if (!hasValue(c.postcode, 3)) errors.postcode = "Укажите индекс";

  if (!Array.isArray(payload.lines) || payload.lines.length === 0) {
    errors.lines = "Корзина пуста";
  }

  return errors;
}

export function hasCheckoutOrderErrors(errors: CheckoutOrderErrors): boolean {
  return Object.keys(errors).length > 0;
}
