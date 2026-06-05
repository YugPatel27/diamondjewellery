import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be within LanguageProvider");
  return ctx;
};

// Translation strings
const translations: Record<Language, Record<string, string>> = {
  en: {
    "header.engagement_rings": "Engagement Rings",
    "header.wedding_rings": "Wedding Rings",
    "header.jewellery": "Jewellery",
    "header.diamonds": "Diamonds",
    "header.gemstones": "Gemstones",
    "header.bespoke": "Bespoke",
    "header.solitaire": "Solitaire Rings",
    "header.halo": "Halo Rings",
    "header.vintage": "Vintage Rings",
    "header.trilogy": "Trilogy Rings",
    "header.diamond_band": "Diamond Band",
    "header.all_rings": "All Rings",
    "header.mens_bands": "Men's Bands",
    "header.womens_bands": "Women's Bands",
    "header.matching_sets": "Matching Sets",
    "header.necklaces": "Necklaces",
    "header.earrings": "Earrings",
    "header.bracelets": "Bracelets",
    "header.all_jewellery": "All Jewellery",
    "header.natural_diamonds": "Natural Diamonds",
    "header.lab_grown": "Lab Grown",
    "header.all_diamonds": "All Diamonds",
    "header.needHelp": "Need Help?",
    "header.appointment": "Appointment",
    "header.my_orders": "My Orders",
    "header.wishlist": "Wishlist",
    "header.admin_panel": "Admin Panel",
    "header.logout": "Logout",
    "header.login": "Login / Register",
    "header.hallmarked": "BIS Hallmarked · GIA Certified",
    "header.book_consultation": "Book Free Consultation →",
    "header.search_placeholder": "Search rings, necklaces, diamonds…",
    
    "footer.service": "Service",
    "footer.contact": "Contact Us",
    "footer.faqs": "FAQs",
    "footer.delivery": "Delivery",
    "footer.size_guide": "Size Guide",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.shop": "Shop",
    "footer.rings": "Rings",
    "footer.necklaces": "Necklaces",
    "footer.earrings": "Earrings",
    "footer.diamonds": "Diamonds",
    "footer.bespoke": "Bespoke",
    "footer.book": "Book",
    "footer.education": "Education",
    "footer.diamond_guide": "Diamond Guide",
    "footer.lab_vs_natural": "Lab Grown vs Natural",
    "footer.engagement_guide": "Engagement Ring Guide",
    "footer.metal_guide": "Metal Guide",
    "footer.all": "All →",
    "footer.store_location": "Store Location",
    "footer.prototype_warning": "⚠️ PROTOTYPE WEBSITE — This is a prototype website for demonstration purposes only. Not for personal or commercial use. The code and design are private and proprietary. All images are AI-generated.",
    
    "diamonds.title": "Understanding Diamonds - The 4 C's",
    "diamonds.hero_title": "Diamond Collection",
    "diamonds.hero_desc": "Explore our hand-selected diamond collection. Every stone is certified and chosen for quality, brilliance, and value.",
    "diamonds.browse": "BROWSE DIAMONDS",
    "diamonds.cut": "Cut",
    "diamonds.clarity": "Clarity",
    "diamonds.color": "Color",
    "diamonds.carat": "Carat",
    "diamonds.natural": "Natural Diamonds",
    "diamonds.lab": "Lab Grown",
    "diamonds.all": "All Diamonds",
    
    "products.add_to_cart": "Add to Cart",
    "products.add_to_wishlist": "Add to Wishlist",
    "products.remove_from_wishlist": "Remove from Wishlist",
    "products.loading": "Loading products...",
    "products.no_results": "No products found",
    
    "common.price": "Price",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.style": "Style",
    "common.metal": "Metal",
    "common.shape": "Shape",
    "common.carat": "Carat",
    "common.color": "Color",
    "common.clarity": "Clarity",
    "common.natural": "Natural",
    "common.lab": "Lab",
    "common.new": "New",
    "common.sale": "Sale",
    "common.free_shipping": "Free Shipping",
  },
  de: {
    "header.engagement_rings": "Verlobungsringe",
    "header.wedding_rings": "Trauringe",
    "header.jewellery": "Schmuck",
    "header.diamonds": "Diamanten",
    "header.gemstones": "Edelsteine",
    "header.bespoke": "Maßgefertigt",
    "header.solitaire": "Solitärringe",
    "header.halo": "Halo-Ringe",
    "header.vintage": "Vintage-Ringe",
    "header.trilogy": "Trilogie-Ringe",
    "header.diamond_band": "Diamantband",
    "header.all_rings": "Alle Ringe",
    "header.mens_bands": "Herrenbänder",
    "header.womens_bands": "Damenbänder",
    "header.matching_sets": "Passende Sets",
    "header.necklaces": "Halsketten",
    "header.earrings": "Ohrringe",
    "header.bracelets": "Armbänder",
    "header.all_jewellery": "Gesamter Schmuck",
    "header.natural_diamonds": "Natürliche Diamanten",
    "header.lab_grown": "Im Labor gezüchtet",
    "header.all_diamonds": "Alle Diamanten",
    "header.needHelp": "Benötigen Sie Hilfe?",
    "header.appointment": "Termin",
    "header.my_orders": "Meine Bestellungen",
    "header.wishlist": "Wunschliste",
    "header.admin_panel": "Admin-Panel",
    "header.logout": "Abmelden",
    "header.login": "Anmelden / Registrieren",
    "header.free_delivery": "✨ Kostenloser versicherter Versand bei Bestellungen über ₹50.000",
    "header.hallmarked": "BIS Hallmarked · GIA Zertifiziert",
    "header.book_consultation": "Kostenlose Beratung buchen →",
    "header.search_placeholder": "Ringe, Halsketten, Diamanten durchsuchen…",
    
    "footer.service": "Service",
    "footer.contact": "Kontaktieren Sie uns",
    "footer.faqs": "FAQs",
    "footer.delivery": "Lieferung",
    "footer.size_guide": "Größenführer",
    "footer.privacy": "Datenschutz",
    "footer.terms": "Bedingungen",
    "footer.shop": "Shop",
    "footer.rings": "Ringe",
    "footer.necklaces": "Halsketten",
    "footer.earrings": "Ohrringe",
    "footer.diamonds": "Diamanten",
    "footer.bespoke": "Maßgefertigt",
    "footer.book": "Buchen",
    "footer.education": "Bildung",
    "footer.diamond_guide": "Diamantenleitfaden",
    "footer.lab_vs_natural": "Im Labor gezüchtet gegen Natürlich",
    "footer.engagement_guide": "Verlobungsring-Leitfaden",
    "footer.metal_guide": "Metallführer",
    "footer.all": "Alle →",
    "footer.store_location": "Ladenort",
    "footer.prototype_warning": "⚠️ PROTOTYPE-WEBSITE — Dies ist eine Prototype-Website nur zu Demonstrationszwecken. Nicht für den persönlichen oder gewerblichen Gebrauch bestimmt. Der Code und das Design sind privat und proprietär. Alle Bilder werden von KI generiert.",
    
    "diamonds.title": "Diamanten verstehen - Die 4 C",
    "diamonds.hero_title": "Diamantkollektion",
    "diamonds.hero_desc": "Erkunden Sie unsere handverlesene Diamantkollektion. Jeder Stein ist zertifiziert und wurde wegen Qualität, Brillanz und Wert ausgewählt.",
    "diamonds.browse": "DIAMANTEN DURCHSUCHEN",
    "diamonds.cut": "Schnitt",
    "diamonds.clarity": "Klarheit",
    "diamonds.color": "Farbe",
    "diamonds.carat": "Karat",
    "diamonds.natural": "Natürliche Diamanten",
    "diamonds.lab": "Im Labor gezüchtet",
    "diamonds.all": "Alle Diamanten",
    
    "products.add_to_cart": "In den Warenkorb",
    "products.add_to_wishlist": "Zur Wunschliste hinzufügen",
    "products.remove_from_wishlist": "Aus Wunschliste entfernen",
    "products.loading": "Produkte werden geladen...",
    "products.no_results": "Keine Produkte gefunden",
    
    "common.price": "Preis",
    "common.filter": "Filtern",
    "common.sort": "Sortieren",
    "common.style": "Stil",
    "common.metal": "Metall",
    "common.shape": "Form",
    "common.carat": "Karat",
    "common.color": "Farbe",
    "common.clarity": "Klarheit",
    "common.natural": "Natürlich",
    "common.lab": "Labor",
    "common.new": "Neu",
    "common.sale": "Verkauf",
    "common.free_shipping": "Versandkostenfrei",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageStat] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved && ["en", "de"].includes(saved)) {
      setLanguageStat(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageStat(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
