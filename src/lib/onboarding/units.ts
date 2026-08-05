/**
 * Unit conversion and display formatting.
 *
 * The flow always stores metric (cm / kg); the imperial toggle is a purely
 * presentational layer on top. Every number is rendered with Western digits
 * and an en-US date, matching the app's screens even in the Arabic UI.
 */

const KG_PER_LB = 0.45359237;
const CM_PER_INCH = 2.54;

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

/** 170 cm → "5'7"" */
export function formatFeetInches(cm: number): string {
  const totalInches = Math.round(cmToInches(cm));
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
}

/** Trims a trailing ".0" so 74.0 stays "74.0" but 74.5 never becomes "74.50". */
export function formatDecimal(value: number, digits = 1): string {
  return value.toFixed(digits);
}

export function formatInt(value: number): string {
  return String(Math.round(value));
}

/** Signed kilogram delta, e.g. "-0.3" / "+1.2" / "0". */
export function formatSignedKg(value: number, digits = 1): string {
  if (Math.abs(value) < 0.05) return "0";
  const sign = value > 0 ? "+" : "-";
  return `${sign}${Math.abs(value).toFixed(digits)}`;
}

/** "Nov 23, 2026" — the app shows an English short date even in Arabic. */
export function formatTargetDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
