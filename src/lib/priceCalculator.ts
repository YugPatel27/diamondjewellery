import { Product, METAL_PRICE_PER_GRAM, MAKING_CHARGES_PER_GRAM } from "@/data/products";

export interface PriceBreakdownData {
  basePrice: number;
  diamondPrice: number;
  metalPrice: number;
  makingCharges: number;
  certificationCharges: number;
  total: number;
}

/**
 * Calculate pricing breakdown for a product
 * Diamond pricing: 60% of total price
 * Metal pricing: 20% of total price
 * Making charges: 15% of total price
 * Other: 5% of total price
 */
export function calculatePriceBreakdown(product: Product): PriceBreakdownData {
  const total = product.price;
  
  // If product already has breakdown details, use them
  if (product.diamondPrice && product.metalPrice && product.makingCharges) {
    return {
      basePrice: product.price,
      diamondPrice: product.diamondPrice,
      metalPrice: product.metalPrice,
      makingCharges: product.makingCharges,
      certificationCharges: product.certificationCharges || 0,
      total: product.price,
    };
  }

  // Otherwise, calculate based on percentage distribution
  const diamondPrice = Math.round(total * 0.60); // 60% - Diamond cost
  const metalPrice = Math.round(total * 0.20);   // 20% - Metal cost
  const makingCharges = Math.round(total * 0.15); // 15% - Making charges
  const certificationCharges = 0; // Free certification

  return {
    basePrice: total,
    diamondPrice,
    metalPrice,
    makingCharges,
    certificationCharges,
    total,
  };
}

/**
 * Calculate making charges based on gold weight and metal type
 */
export function calculateMakingCharges(goldWeight: number, metalType: string): number {
  const chargesPerGram = MAKING_CHARGES_PER_GRAM[metalType as keyof typeof MAKING_CHARGES_PER_GRAM] || 35;
  return Math.round(goldWeight * chargesPerGram);
}

/**
 * Calculate metal cost based on gold weight and current metal price
 */
export function calculateMetalCost(goldWeight: number, metalType: string): number {
  const pricePerGram = METAL_PRICE_PER_GRAM[metalType as keyof typeof METAL_PRICE_PER_GRAM] || 60;
  return Math.round(goldWeight * pricePerGram);
}

/**
 * Calculate total customization charges (making charges + customization premium)
 */
export function calculateCustomizationCharges(
  goldWeight: number,
  metalType: string,
  customizationPremium: number = 0
): number {
  const makingCharges = calculateMakingCharges(goldWeight, metalType);
  return makingCharges + customizationPremium;
}
