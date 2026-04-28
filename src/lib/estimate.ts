export const objectTypes = [
  "Частный бассейн",
  "Коммерческий бассейн",
  "СПА-зона",
  "Сервис и модернизация",
] as const;

export type ObjectType = (typeof objectTypes)[number];

export type EstimateInput = {
  objectType: string;
  volume: string;
  city: string;
};

export type EstimateResult = {
  min: number;
  max: number;
};

const objectTypeFactor: Record<ObjectType, number> = {
  "Частный бассейн": 1,
  "Коммерческий бассейн": 1.45,
  "СПА-зона": 1.25,
  "Сервис и модернизация": 0.55,
};

const cityFactorByKeyword: Array<{ keyword: string; factor: number }> = [
  { keyword: "москва", factor: 1.2 },
  { keyword: "санкт", factor: 1.16 },
  { keyword: "петербург", factor: 1.16 },
  { keyword: "казань", factor: 1.08 },
  { keyword: "сочи", factor: 1.12 },
  { keyword: "екатеринбург", factor: 1.07 },
];

export const ESTIMATE_LIMITS = {
  minVolume: 8,
  maxVolume: 5000,
  baseCostPerM3: 120000,
} as const;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;

export function parseVolume(value: string): number {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return Number.NaN;
  return Number.parseFloat(normalized);
}

export function validateVolume(volume: string): boolean {
  const value = parseVolume(volume);
  return (
    Number.isFinite(value) &&
    value >= ESTIMATE_LIMITS.minVolume &&
    value <= ESTIMATE_LIMITS.maxVolume
  );
}

export function validateCity(city: string): boolean {
  return city.trim().length >= 2;
}

export function validateContact(contact: string): boolean {
  const value = contact.trim();
  return emailRegex.test(value) || phoneRegex.test(value);
}

function getObjectTypeFactor(objectType: string): number {
  if (objectType in objectTypeFactor) {
    return objectTypeFactor[objectType as ObjectType];
  }
  return objectTypeFactor["Частный бассейн"];
}

function getCityFactor(city: string): number {
  const normalized = city.toLowerCase();
  const matched = cityFactorByKeyword.find((item) => normalized.includes(item.keyword));
  return matched?.factor ?? 1;
}

export function calculateEstimate(input: EstimateInput): EstimateResult | null {
  if (!validateVolume(input.volume) || !validateCity(input.city)) {
    return null;
  }

  const volume = parseVolume(input.volume);
  const typeFactor = getObjectTypeFactor(input.objectType);
  const cityFactor = getCityFactor(input.city);
  const base = volume * ESTIMATE_LIMITS.baseCostPerM3 * typeFactor * cityFactor;

  return {
    min: Math.round(base * 0.9),
    max: Math.round(base * 1.15),
  };
}
