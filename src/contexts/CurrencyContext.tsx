import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { getCachedRate } from "@/lib/currencyConverter";

export type CurrencyCode = "INR" | "EUR";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amountINR: number) => string;
  lang: "en" | "de";
  t: (key: string) => string;
  exchangeRate: number;
}

// Start with predefined static exchange rate
let EUR_RATE = getCachedRate();

const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.needHelp": "Need Help?",
    "nav.bookAppointment": "Book an Appointment",
    "nav.wishlist": "Wishlist",
    "nav.cart": "Cart",
    "nav.login": "Login",
    "hero.title": "Diamond Engagement Rings",
    "hero.desc": "Discover our exquisite collection of natural and lab-grown diamond engagement rings, necklaces, and earrings. Every piece is GIA/IGI certified, BIS hallmarked, and crafted to perfection.",
    "hero.cta": "Shop Rings",
    "delivery.text": "Free & insured delivery across India",
    "filter.clearAll": "Clear All",
    "product.addToCart": "Add to Cart",
    "product.new": "New",
    "cart.empty": "Your cart is empty",
    "cart.checkout": "Checkout",
    "footer.rights": "© 2026 DiamondJewels Pvt. Ltd. All rights reserved.",
    "sale.title": "Spring Sale Ending Soon",
    "footer.customerService": "Customer Service",
    "footer.shop": "Shop",
    "footer.education": "Education",
    "footer.company": "Company",
    "footer.contactUs": "Contact Us",
    "footer.faq": "FAQ",
    "footer.shipping": "Shipping & Delivery",
    "footer.returns": "Return Policy",
    "footer.rings": "Engagement Rings",
    "footer.necklaces": "Necklaces",
    "footer.earrings": "Earrings",
    "footer.diamonds": "Diamonds",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.sitemap": "Sitemap",
    "index.naturalTitle": "Natural Diamonds",
    "index.naturalDesc": "Billions of years in the making. Earth-mined and GIA certified.",
    "index.labTitle": "Lab Grown Diamonds",
    "index.labDesc": "Identical to natural. 30-50% more affordable. IGI certified.",
    "index.chooseType": "Choose Your Diamond Type",
    "index.newCollection": "New Collection — Latest Additions First",
    "index.certifiedTitle": "Certified & Hallmarked",
    "index.certifiedDesc": "Every piece is BIS Hallmarked gold with GIA/IGI certified diamonds. GST inclusive pricing.",
    "index.deliveryTitle": "Insured Delivery",
    "index.deliveryDesc": "All shipments fully insured. Delivery charges informed by store employee. Strict no-return policy.",
    "index.serviceTitle": "Customer Service",
    "index.serviceDesc": "Mon-Sat 10AM-8PM. Call, email, or visit our London store for personalised assistance.",
    "cart.total": "Total",
    "checkout.placeOrder": "Place Order",
    "checkout.continueShop": "Continue Shopping",
    "account.logout": "Logout",
    "account.myOrders": "My Orders",
    "account.admin": "Admin Panel",
    "order.status": "Status",
    "order.items": "Items",
    "order.date": "Date",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
  },
  de: {
    "nav.needHelp": "Brauchen Sie Hilfe?",
    "nav.bookAppointment": "Termin buchen",
    "nav.wishlist": "Wunschliste",
    "nav.cart": "Warenkorb",
    "nav.login": "Anmelden",
    "hero.title": "Diamant-Verlobungsringe",
    "hero.desc": "Entdecken Sie unsere exquisite Kollektion natürlicher und im Labor gezüchteter Diamant-Verlobungsringe, Halsketten und Ohrringe. Jedes Stück ist GIA/IGI-zertifiziert, BIS-geprägt und perfekt gefertigt.",
    "hero.cta": "Ringe kaufen",
    "delivery.text": "Kostenlose & versicherte Lieferung in ganz Indien",
    "filter.clearAll": "Alle löschen",
    "product.addToCart": "In den Warenkorb",
    "product.new": "Neu",
    "cart.empty": "Ihr Warenkorb ist leer",
    "cart.checkout": "Zur Kasse",
    "footer.rights": "© 2026 DiamondJewels Pvt. Ltd. Alle Rechte vorbehalten.",
    "sale.title": "Frühjahrsverkauf endet bald",
    "footer.customerService": "Kundendienst",
    "footer.shop": "Einkaufen",
    "footer.education": "Bildung",
    "footer.company": "Unternehmen",
    "footer.contactUs": "Kontaktieren Sie uns",
    "footer.faq": "Häufig gestellte Fragen",
    "footer.shipping": "Versand & Lieferung",
    "footer.returns": "Rückgaberecht",
    "footer.rings": "Verlobungsringe",
    "footer.necklaces": "Halsketten",
    "footer.earrings": "Ohrringe",
    "footer.diamonds": "Diamanten",
    "footer.privacyPolicy": "Datenschutzrichtlinie",
    "footer.termsOfService": "Nutzungsbedingungen",
    "footer.sitemap": "Seitenübersicht",
    "index.naturalTitle": "Natürliche Diamanten",
    "index.naturalDesc": "Milliarden Jahre in der Entstehung. Aus der Erde abgebaut und GIA-zertifiziert.",
    "index.labTitle": "Im Labor gezüchtete Diamanten",
    "index.labDesc": "Identisch mit natürlichen. 30-50% günstiger. IGI-zertifiziert.",
    "index.chooseType": "Wählen Sie Ihren Diamanttyp",
    "index.newCollection": "Neue Kollektion — Neueste Ergänzungen zuerst",
    "index.certifiedTitle": "Zertifiziert & Gestempelt",
    "index.certifiedDesc": "Jedes Stück ist BIS-geprägtes Gold mit GIA/IGI-zertifizierten Diamanten. GST-inklusive Preise.",
    "index.deliveryTitle": "Versicherte Lieferung",
    "index.deliveryDesc": "Alle Sendungen vollständig versichert. Lieferkosten werden vom Mitarbeiter mitgeteilt. Strenge Rückgaberichtlinie.",
    "index.serviceTitle": "Kundendienst",
    "index.serviceDesc": "Mo-Sa 10-20 Uhr. Rufen Sie an, schreiben Sie eine E-Mail oder besuchen Sie unser Geschäft in London.",
    "cart.total": "Gesamt",
    "checkout.placeOrder": "Bestellung aufgeben",
    "checkout.continueShop": "Weiter einkaufen",
    "account.logout": "Abmelden",
    "account.myOrders": "Meine Bestellungen",
    "account.admin": "Admin-Panel",
    "order.status": "Status",
    "order.items": "Artikel",
    "order.date": "Datum",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.close": "Schließen",
    "common.loading": "Wird geladen...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
  },
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be within CurrencyProvider");
  return ctx;
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem("currency");
    return saved === "EUR" ? "EUR" : "INR";
  });
  const [exchangeRate] = useState<number>(EUR_RATE);
  const lang = currency === "EUR" ? "de" : "en";

  const setCurrency = useCallback((c: CurrencyCode) => setCurrencyState(c), []);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const formatPrice = useCallback(
    (amountINR: number) => {
      if (currency === "EUR") {
        const eur = amountINR * exchangeRate;
        return "€" + eur.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      }
      return "₹" + amountINR.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    },
    [currency, exchangeRate]
  );

  const t = useCallback(
    (key: string) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, lang, t, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};
