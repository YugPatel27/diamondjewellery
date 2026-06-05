
export type Cut = "Excellent" | "Very Good" | "Good";
export type Clarity = "FL" | "IF" | "VVS1" | "VVS2" | "VS1" | "VS2" | "SI1" | "SI2";
export type DiamondColor = "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
export type Category = "Rings" | "Necklaces" | "Earrings" | "Bracelets";
export type Style = "Solitaire" | "Vintage" | "Diamond Band" | "Halo" | "Trilogy" | "Eternity";
export type Metal = "White Gold" | "Yellow Gold" | "Rose Gold" | "Platinum";
export type Shape = "Round" | "Princess" | "Cushion" | "Oval" | "Pear" | "Emerald" | "Heart" | "Marquise";
export type SortOption = "relevant" | "newest" | "price-asc" | "price-desc" | "price-low" | "price-high";

export type DiamondType = "natural" | "lab";

export interface MetalDetails {
  purity: string;              // e.g., "18K", "14K"
  weight: number;              // In grams
  composition: string;         // e.g., "White Gold", "Yellow Gold", "Platinum"
  makingChargesPerGram: number; // Per gram charge
}

export interface Product {
  id: number;
  name: string;
  style: Style;
  metal: Metal;
  shape: Shape;
  category: Category;
  price: number;               // Total product price
  originalPrice: number;
  image: string;
  images: string[];
  isNew?: boolean;
  cut: Cut;
  clarity: Clarity;
  color: DiamondColor;
  carat: number;
  description: string;
  diamondType: DiamondType;
  
  // Pricing breakdown fields
  diamondPrice?: number;       // Cost of diamond stone
  metalPrice?: number;         // Cost of metal
  makingCharges?: number;      // Manufacturing charges
  certificationCharges?: number; // Default: free
  
  // Metal and gold details
  metalDetails?: MetalDetails;
  goldWeight?: number;         // Weight in grams (for rings)
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: any;
  customizationPrice?: number;
}

export interface Filters {
  style: Style | null;
  metal: Metal | null;
  shape: Shape | null;
  cut: Cut | null;
  clarity: Clarity | null;
  color: DiamondColor | null;
  diamondType: DiamondType | "loose" | null;
  caratRange: [number, number];
  priceRange: [number, number];
  search: string;
  category: Category | null;
  gemstone?: boolean;
}

export const defaultFilters: Filters = {
  style: null,
  metal: null,
  shape: null,
  cut: null,
  clarity: null,
  color: null,
  diamondType: null,
  caratRange: [0.5, 5.0],
  priceRange: [0, 500000],
  search: "",
  category: null,
  gemstone: false,
};

export const formatINR = (amount: number): string => {
  return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// Metal pricing configuration
export const METAL_PRICE_PER_GRAM: Record<Metal, number> = {
  "White Gold": 60,
  "Yellow Gold": 58,
  "Rose Gold": 60,
  "Platinum": 150,
};

// Making charges per gram
export const MAKING_CHARGES_PER_GRAM: Record<Metal, number> = {
  "White Gold": 35,
  "Yellow Gold": 30,
  "Rose Gold": 35,
  "Platinum": 80,
};

// Certification charges (per item)
export const CERTIFICATION_CHARGES = 0; // Free certification

export const CUTS: Cut[] = ["Excellent", "Very Good", "Good"];
export const CLARITIES: Clarity[] = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
export const COLORS: DiamondColor[] = ["D", "E", "F", "G", "H", "I", "J", "K"];
export const CATEGORIES: Category[] = ["Rings", "Necklaces", "Earrings", "Bracelets"];
export const STYLES: Style[] = ["Solitaire", "Vintage", "Diamond Band", "Halo", "Trilogy", "Eternity"];
export const METALS: Metal[] = ["White Gold", "Yellow Gold", "Rose Gold", "Platinum"];
export const SHAPES: Shape[] = ["Round", "Princess", "Cushion", "Oval", "Pear", "Emerald", "Heart", "Marquise"];

/**
 * Empty product list to ensure all data is fetched from the database only.
 */
export const products: Product[] = [];

export function sortProducts(prods: Product[], sort: SortOption): Product[] {
  const copy = [...prods];
  switch (sort) {
    case "price-asc":
    case "price-low": return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
    case "price-high": return copy.sort((a, b) => b.price - a.price);
    case "newest": return copy.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    default: return copy;
  }
}

export function filterProducts(prods: Product[], filters: Filters): Product[] {
  return prods.filter(p => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(searchLower);
      const matchesDescription = p.description.toLowerCase().includes(searchLower);
      const matchesCategory = p.category.toLowerCase().includes(searchLower);
      const matchesStyle = p.style.toLowerCase().includes(searchLower);
      const matchesMetal = p.metal.toLowerCase().includes(searchLower);
      const matchesShape = p.shape.toLowerCase().includes(searchLower);
      if (!( matchesName || matchesDescription || matchesCategory || matchesStyle || matchesMetal || matchesShape)) return false;
    }
    if (filters.category && p.category !== filters.category) return false;
    if (filters.style && p.style !== filters.style) return false;
    if (filters.metal && p.metal !== filters.metal) return false;
    if (filters.shape && p.shape !== filters.shape) return false;
    if (filters.cut && p.cut !== filters.cut) return false;
    if (filters.clarity && p.clarity !== filters.clarity) return false;
    if (filters.color && p.color !== filters.color) return false;
    if (filters.diamondType && filters.diamondType !== "loose" && p.diamondType !== filters.diamondType) return false;
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
    if (p.carat < filters.caratRange[0] || p.carat > filters.caratRange[1]) return false;
    return true;
  });
}
