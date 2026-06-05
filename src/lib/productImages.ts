import type { Product } from "@/data/products";

type ProductImageLike = Partial<Product> & {
  image?: string | null;
  images?: Array<string | null | undefined> | null;
};

const CATEGORY_ACCENTS: Record<string, string> = {
  Rings: "#d49b17",
  Necklaces: "#b76e79",
  Earrings: "#7a6bd9",
  Bracelets: "#5f8a7b",
};

const STYLE_ACCENTS: Record<string, string> = {
  Solitaire: "#c7a15a",
  Vintage: "#9b7b5b",
  "Diamond Band": "#8e8a7a",
  Halo: "#caa34a",
  Trilogy: "#b98760",
  Eternity: "#7d8c9b",
};

const escapeSvgText = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const getThemeColor = (product?: ProductImageLike) => {
  const category = product?.category ? CATEGORY_ACCENTS[product.category] : undefined;
  const style = product?.style ? STYLE_ACCENTS[product.style] : undefined;
  return style || category || "#d49b17";
};

const createPlaceholderImage = (product?: ProductImageLike, label?: string) => {
  const accent = getThemeColor(product);
  const mainLabel = escapeSvgText(label || product?.name || "Diamond Jewels");
  const subLabel = escapeSvgText(product?.style || product?.category || "Fine Jewellery");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" role="img" aria-label="${mainLabel}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#faf7f1" />
          <stop offset="55%" stop-color="#f2ebe0" />
          <stop offset="100%" stop-color="#e8dcc8" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.24" />
          <stop offset="70%" stop-color="${accent}" stop-opacity="0.06" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="900" height="900" fill="url(#bg)" />
      <circle cx="450" cy="390" r="260" fill="url(#glow)" />
      <g transform="translate(450 365)">
        <circle r="132" fill="none" stroke="${accent}" stroke-width="12" opacity="0.85" />
        <circle r="90" fill="none" stroke="${accent}" stroke-width="5" opacity="0.35" />
        <path d="M0 -130 L72 -70 L0 145 L-72 -70 Z" fill="none" stroke="${accent}" stroke-width="10" stroke-linejoin="round" />
        <path d="M0 -130 L0 145" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity="0.45" />
        <path d="M-72 -70 L72 -70" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity="0.45" />
        <circle r="18" fill="${accent}" opacity="0.9" />
      </g>
      <text x="450" y="640" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="#3d342d">${mainLabel}</text>
      <text x="450" y="690" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" letter-spacing="6" fill="${accent}">${subLabel}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const normalizeProductImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }

  if (url.startsWith("//")) {
    return typeof window !== "undefined" ? `${window.location.protocol}${url}` : `https:${url}`;
  }

  if (url.startsWith("/")) {
    return typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
  }

  return url;
};

export const getProductImages = (product: ProductImageLike, minCount = 1) => {
  const images = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.image,
  ]
    .map(normalizeProductImageUrl)
    .filter((value): value is string => Boolean(value));

  const unique = Array.from(new Set(images));

  while (unique.length < minCount) {
    unique.push(createPlaceholderImage(product, unique.length === 0 ? product?.name : `${product?.name || "Diamond Jewels"} ${unique.length + 1}`));
  }

  if (unique.length === 0) {
    unique.push(createPlaceholderImage(product));
  }

  return unique;
};

export const getProductImage = (product: ProductImageLike, index = 0) => {
  return getProductImages(product, index + 1)[index] || createPlaceholderImage(product);
};

export const getProductPrimaryImage = (product: ProductImageLike) => getProductImage(product, 0);
