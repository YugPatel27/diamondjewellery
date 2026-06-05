/**
 * Static INR to EUR currency conversion utilities.
 * Uses predefined fixed exchange rate only.
 */

const STATIC_INR_TO_EUR_RATE = 0.012;

export async function getINRtoEURRate(): Promise<number> {
  return STATIC_INR_TO_EUR_RATE;
}

export function convertINRtoEUR(amountINR: number, exchangeRate = STATIC_INR_TO_EUR_RATE): number {
  return Math.round(amountINR * exchangeRate * 100) / 100;
}

/**
 * Format currency price
 */
export function formatPrice(amount: number, currency: "INR" | "EUR" = "INR"): string {
  if (currency === "EUR") {
    return "€" + amount.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function getCachedRate(): number {
  return STATIC_INR_TO_EUR_RATE;
}

