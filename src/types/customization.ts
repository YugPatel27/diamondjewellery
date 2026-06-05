// Customization types for jewelry products
export interface RingSize {
  size: string;
  diameter: string;
  circumference: string;
}

export interface EngraverSymbol {
  id: string;
  symbol: string;
  name: string;
}

export interface EngraverFont {
  id: string;
  name: string;
  displayName: string;
}

export interface DiamondOption {
  id: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  price: number;
  image: string;
  code: string;
}

export interface PriceBreakdown {
  basePrice: number;           // Product base price
  diamondPrice?: number;       // Diamond stone cost (for customized diamonds)
  goldPrice?: number;          // Gold/metal cost (for metal selection)
  makingCharges?: number;      // Manufacturing charges
  certificationCharges?: number; // Certification charges
  customizationCharges?: number; // Additional customization charges
  total: number;
}

export interface MetalDetails {
  purity: string;              // e.g., "18K", "14K"
  weight: number;              // In grams
  type: string;                // e.g., "Gold", "Platinum"
  composition: string;         // e.g., "White Gold", "Yellow Gold"
}

export interface GoldDetails {
  caratage: string;            // e.g., "18K"
  weight: number;              // Weight in grams
  makingChargesPerGram: number; // Per gram charge
  totalMakingCharges: number;  // Total making charges
}

export interface DiamondDetails {
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  shape: string;
  certificateNumber?: string;
  type: "natural" | "lab";
}

export interface ProductCustomization {
  ringSize?: string;
  engravingText?: string;
  engravingFont?: string;
  engravingSymbols?: string[];
  selectedDiamond?: DiamondOption;
  selectedStones?: DiamondOption[];
  customizationPrice?: number;
  metalDetails?: MetalDetails;
  goldDetails?: GoldDetails;
  diamondDetails?: DiamondDetails;
  priceBreakdown?: PriceBreakdown;
}

export interface CustomizedCartItem {
  product: any; // Will be Product type
  quantity: number;
  customization?: ProductCustomization;
}
