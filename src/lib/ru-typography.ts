const NBSP = "\u00a0";
const SERVICE_WORDS = [
  "в",
  "к",
  "с",
  "у",
  "о",
  "и",
  "а",
  "из",
  "от",
  "до",
  "за",
  "на",
  "по",
  "под",
  "над",
  "об",
  "без",
  "для",
  "при",
  "про",
  "со",
  "во",
  "ко",
  "же",
  "ли",
  "бы",
  "ль",
  "б",
  "ж",
  "не",
  "ни",
];
const SERVICE_WORDS_PATTERN = SERVICE_WORDS.join("|");

/**
 * Небольшая типографика для UI-текстов:
 * - не отрывает однобуквенные предлоги/союзы от следующего слова;
 * - не отрывает частицы "бы" и "ли";
 * - связывает число с единицей измерения/знаком процента.
 */
export function applyRussianNbsp(text: string): string {
  return text
    .replace(new RegExp(`(^|\\s)(${SERVICE_WORDS_PATTERN})\\s+`, "giu"), `$1$2${NBSP}`)
    .replace(/№\s+/gu, `№${NBSP}`)
    .replace(/(\d)\s+(%|кг|г|л|м|см|мм|м²|м³)\b/g, `$1${NBSP}$2`);
}

/**
 * Для коротких описаний:
 * - применяет типографику (NBSP);
 * - начинает каждое предложение с новой строки.
 */
export function formatShortDescription(text: string): string {
  const normalized = applyRussianNbsp(text.replace(/\s+/g, " ").trim());
  return normalized.replace(/([.!?…])\s+(?=[A-ZА-ЯЁ0-9])/gu, "$1\n");
}

/**
 * Версия для HTML-строк (краткие описания из CMS):
 * перенос предложений через <br/>.
 */
export function formatShortDescriptionHtml(html: string): string {
  const withNbsp = applyRussianNbsp(html);
  return withNbsp.replace(/([.!?…])\s+(?=[A-ZА-ЯЁ0-9])/gu, "$1<br/>");
}
