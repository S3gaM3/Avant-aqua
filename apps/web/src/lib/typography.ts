import { normalizeCmsHtml } from "./normalize-cms-html";

/** Неразрывный пробел (U+00A0). */
const NBSP = "\u00A0";

const SHORT_WORDS =
  "в|к|с|у|о|и|а|из|от|до|за|на|по|под|над|об|без|для|при|про|со|во|ко|же|ли|бы|ль|б|ж|не|ни";

const RE_PREP = new RegExp(
  `(^|[\\s(«"—–\\-/])(${SHORT_WORDS})(?!${NBSP})\\s+(?=[\\p{L}\\d«])(?![т]\\.)`,
  "giu",
);

const RE_ABBR_G = /(^|[\s(«"—–\-/,;:])(г\.)(?!\u00A0)\s+(?=\p{L})/giu;
const RE_ABBR_D = /(^|[\s(«"—–\-/,;:])(д\.)(?!\u00A0)\s+(?=\d)/giu;
const RE_OFFICE = /(офис)(?!\u00A0)\s+(?=\d)/giu;
const RE_RUB = /(\d)(?!\u00A0)\s+(₽)/g;
const RE_PERCENT = /(\d)(?!\u00A0)\s+(%)/g;
const RE_NUMERO = /(№)(?!\u00A0)\s+/g;

const RE_ELLIPSIS = /\.{3}/g;

const RE_STRAIGHT_DOUBLE_QUOTES = /"([^"]+)"/g;
const RE_STRAIGHT_SINGLE_QUOTES = /'([^']+)'/g;

const RE_YEAR_RANGE = /(\d{4})-(?!\u00A0)(\d{4})\b/g;
const RE_NUMERIC_RANGE = /(\d+)-(?!–)(\d+)/g;

const RE_EM_DASH = /(?<=[\p{L}])\s+-\s+(?=[\p{L}])/gu;

const RE_THOUSANDS = /\b(\d{4,})\b/g;

const RE_ABBR_TD = /(?<!\u00A0)т\.\s*д\./gi;
const RE_ABBR_TE = /(?<!\u00A0)т\.\s*е\./gi;
const RE_ABBR_I_TD = /и\s+т\.\s*д\./gi;
const RE_VSEY_ROSSII = /всей(?!\u00A0)\s+России/giu;

const SKIP_TAG_OPEN = /<(script|style|code)\b/i;
const SKIP_TAG_CLOSE = /<\/(script|style|code)\s*>/i;

export type SkipEnrichment = "verbatim" | "productName" | "sku" | "brand";

export type EnrichTextOptions = {
  skipEnrichment?: SkipEnrichment;
};

function isProtectedQuotedContent(inner: string): boolean {
  if (/^https?:\/\//i.test(inner)) return true;
  if (/^[\w.+-]+@[\w.-]+\.\w{2,}$/i.test(inner)) return true;
  if (!/[\u0400-\u04FF]/.test(inner)) return true;
  return false;
}

function applyNbspRules(text: string): string {
  return text
    .replace(RE_PREP, (_, before, word) => `${before}${word}${NBSP}`)
    .replace(RE_ABBR_G, (_, before, abbr) => `${before}${abbr}${NBSP}`)
    .replace(RE_ABBR_D, (_, before, abbr) => `${before}${abbr}${NBSP}`)
    .replace(RE_OFFICE, (_, word) => `${word}${NBSP}`)
    .replace(RE_NUMERO, (_, sign) => `${sign}${NBSP}`)
    .replace(RE_RUB, (_, digit, sign) => `${digit}${NBSP}${sign}`)
    .replace(RE_PERCENT, (_, digit, sign) => `${digit}${NBSP}${sign}`)
    .replace(RE_VSEY_ROSSII, `всей${NBSP}России`);
}

function applySafeNbspOnly(text: string): string {
  if (!/[\u0400-\u04FF]/.test(text)) return text;
  return applyNbspRules(text);
}

function normalizeEllipsis(text: string): string {
  return text.replace(RE_ELLIPSIS, "…");
}

function normalizeQuotes(text: string): string {
  let result = text.replace(RE_STRAIGHT_DOUBLE_QUOTES, (match, inner: string) => {
    if (isProtectedQuotedContent(inner)) return match;
    return `«${inner}»`;
  });
  result = result.replace(RE_STRAIGHT_SINGLE_QUOTES, (match, inner: string) => {
    if (isProtectedQuotedContent(inner)) return match;
    return `«${inner}»`;
  });
  return result;
}

function normalizeRanges(text: string): string {
  return text
    .replace(RE_YEAR_RANGE, "$1–$2")
    .replace(RE_NUMERIC_RANGE, "$1–$2");
}

function normalizeEmDash(text: string): string {
  return text.replace(RE_EM_DASH, " — ");
}

function normalizeThousands(text: string): string {
  return text.replace(RE_THOUSANDS, (match) => {
    if (/[\s\u00A0\u202F]/.test(match)) return match;
    if (match.length === 4 && /^(?:19|20)\d{2}$/.test(match)) return match;
    return Number(match).toLocaleString("ru-RU");
  });
}

function normalizeAbbreviations(text: string): string {
  return text
    .replace(RE_ABBR_I_TD, `и т.${NBSP}д.`)
    .replace(RE_ABBR_TD, `т.${NBSP}д.`)
    .replace(RE_ABBR_TE, `т.${NBSP}е.`);
}

function normalizeInitials(text: string): string {
  return text
    .replace(/([А-ЯЁA-Z]\.)(?!\u00A0)\s+(?=[А-ЯЁA-Z]\.)/gu, `$1${NBSP}`)
    .replace(/([А-ЯЁA-Z]\.)(?!\u00A0)\s+(?=[А-ЯЁ][а-яё])/gu, `$1${NBSP}`);
}

/**
 * Полный пайплайн экранной типографики (§62): NBSP, «ёлочки», тире, многоточие,
 * разряды, сокращения, диапазоны, инициалы, №.
 */
export function enrichText(text: string, options?: EnrichTextOptions): string {
  const s = typeof text === "string" ? text : String(text ?? "");
  if (!s) return s;

  const mode = options?.skipEnrichment;
  if (mode === "verbatim") return s;
  if (mode === "productName" || mode === "sku" || mode === "brand") {
    return applySafeNbspOnly(s);
  }

  return applyNbspRules(
    normalizeInitials(
      normalizeAbbreviations(
        normalizeThousands(
          normalizeEmDash(
            normalizeRanges(
              normalizeQuotes(normalizeEllipsis(s)),
            ),
          ),
        ),
      ),
    ),
  );
}

/** Обогащает только текстовые узлы HTML; теги и script/style/code не трогает. */
export function enrichHtml(html: string): string {
  if (!html) return html;

  const normalized = normalizeCmsHtml(html);
  const parts = normalized.split(/(<[^>]+>)/g);

  let skipDepth = 0;

  return parts
    .map((part) => {
      if (part.startsWith("<")) {
        if (SKIP_TAG_OPEN.test(part) && !part.startsWith("</")) {
          skipDepth += 1;
        } else if (SKIP_TAG_CLOSE.test(part)) {
          skipDepth = Math.max(0, skipDepth - 1);
        }
        return part;
      }
      if (skipDepth > 0) return part;
      return enrichText(part);
    })
    .join("");
}

/** @deprecated Используйте enrichText; псевдоним для обратной совместимости. */
export const typo = enrichText;

/** Хелпер контент-слоя: сырой текст → обогащённый. */
export function t(raw: string): string {
  return enrichText(raw);
}

/** Цена в рублях с неразрывным пробелом перед знаком. */
export function formatPriceRub(amount: number): string {
  return enrichText(`${amount.toLocaleString("ru-RU")} ₽`);
}

/** Цена для карточек: целые рубли — меньше визуального шума. */
export function formatPriceRubCompact(amount: number): string {
  if (!Number.isFinite(amount)) return formatPriceRub(0);
  return formatPriceRub(Math.round(amount));
}

/** Телефон для отображения (href остаётся без пробелов). */
export function formatPhoneDisplay(): string {
  return ["+7", "(919)", "105-38-53"].join(NBSP);
}

/** Адрес офиса для подвала и контактов. */
export function formatOfficeAddress(): string {
  return enrichText("125424, г. Москва, Волоколамское шоссе д. 73, офис 518");
}

/** Адрес с подписью для страницы контактов. */
export function formatOfficeAddressLine(): string {
  return enrichText(`Адрес: ${formatOfficeAddress()}`);
}

/** Склейка фрагментов неразрывным пробелом (например «Оплата/» + «доставка»). */
export function nbspJoin(...parts: string[]): string {
  return parts.join(NBSP);
}
