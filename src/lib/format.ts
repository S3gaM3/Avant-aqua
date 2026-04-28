/** Формат цены в рублях для отображения (ru-text: ₽ после числа, пробел как разделитель тысяч) */
export function formatRub(amount: string | number): string {
  const n = typeof amount === "string" ? parseFloat(amount.replace(",", ".")) : amount;
  if (Number.isNaN(n)) return String(amount);
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(n);
  return `${formatted.replace(/\u00a0/g, " ")}\u00a0₽`;
}

export function hasDisplayPrice(amount: string | number): boolean {
  const n = typeof amount === "string" ? parseFloat(amount.replace(",", ".")) : amount;
  return !Number.isNaN(n) && n > 0;
}
