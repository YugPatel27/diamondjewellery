import { useState, useEffect, useRef } from "react";
// Refresh Home import
import type { ReactNode } from "react";
import {
  Phone, ShoppingBag, Calendar, ChevronDown, Menu, X,
  Search, Heart, Diamond, Gem, Palette, Sparkles, User,
  LogOut, Shield, ArrowRight, Star, Settings, Home
} from "@/components/Icons";
import ring1 from "@/assets/ring-1.jpg";
import ring2 from "@/assets/ring-2.jpg";
import ring3 from "@/assets/ring-3.jpg";
import ring4 from "@/assets/ring-4.jpg";
import ring5 from "@/assets/ring-5.jpg";
import ring6 from "@/assets/ring-6.jpg";
import heroImg from "@/assets/hero-model.jpg";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import ThemeToggle from "@/components/ThemeToggle";
import { DiamondLogo } from "@/components/DiamondLogo";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BRAND_CONFIG from "@/config/brand";
import { productAPI } from "@/lib/api";

// ─── 77Diamonds-style mega nav types ───────────────────────────────────────
type MegaLink = { label: string; href: string; icon?: ReactNode; badge?: string; metalColor?: string; isNew?: boolean; isAccent?: boolean };
type MegaSection = { heading: string; links: MegaLink[]; twoColumn?: boolean; headingAccent?: boolean; extraLinks?: MegaLink[] };
type MegaCard = { title?: string; text: string; href?: string; links?: MegaLink[] };
type MegaImage = { src: string; label: string; sub?: string; href: string };

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  dropdown?: {
    sections: MegaSection[];
    card?: MegaCard;
    image?: MegaImage;
  };
};

// ─── Nav data (matches 77Diamonds reference images) ────────────────────────
const navItems: NavItem[] = [
  {
    label: "Engagement Rings", href: "/engagement-rings", icon: <Diamond className="w-4 h-4" />,
    dropdown: {
      sections: [
        {
          heading: "Create Your Own",
          links: [
            { label: "Start With A Diamond Setting", href: "/bespoke" },
            { label: "Start With A Gemstone Setting", href: "/gemstones" },
            { label: "Start With A Diamond", href: "/natural-diamonds" },
            { label: "Start With A Coloured Diamond", href: "/natural-diamonds" },
            { label: "Start With A Gemstone", href: "/gemstones" },
          ],
        },
        {
          heading: "Shop by Shape", twoColumn: true,
          links: [
            { label: "Round", href: "/engagement-rings" }, { label: "Oval", href: "/engagement-rings" },
            { label: "Emerald", href: "/engagement-rings" }, { label: "Pear", href: "/engagement-rings" },
            { label: "Radiant", href: "/engagement-rings" }, { label: "Cushion", href: "/engagement-rings" },
            { label: "Princess", href: "/engagement-rings" }, { label: "Marquise", href: "/engagement-rings" },
            { label: "Heart", href: "/engagement-rings" }, { label: "Asscher", href: "/engagement-rings" },
          ],
        },
        {
          heading: "Shop by Style",
          links: [
            { label: "Solitaire", href: "/solitaire-rings" },
            { label: "Diamond Band", href: "/diamond-band" },
            { label: "Halo", href: "/halo-rings" },
            { label: "Vintage", href: "/vintage-rings" },
            { label: "Trilogy", href: "/trilogy-rings" },
          ],
          extraLinks: [
            { label: "New Arrivals", href: "/engagement-rings", isAccent: true },
            { label: "Bespoke Design", href: "/bespoke", isAccent: true },
            { label: "Engagement Rings", href: "/engagement-rings", isAccent: true },
            { label: "Lab Grown Engagement Rings", href: "/lab-grown-diamonds", isAccent: true },
          ],
        },
        {
          heading: "Shop by Metal",
          links: [
            { label: "White Gold", href: "/engagement-rings", metalColor: "#e8e4dc" },
            { label: "Yellow Gold", href: "/engagement-rings", metalColor: "#d4a843" },
            { label: "Rose Gold", href: "/engagement-rings", metalColor: "#d08560" },
            { label: "Platinum", href: "/engagement-rings", metalColor: "#b8b8c8" },
          ],
        },
      ],
      card: { title: "Need It Sooner?", text: "Shop our Ready To Wear items for a faster delivery", href: "/jewellery" },
      image: { src: ring3, label: "Engagement Collection", sub: "Solitaire · Halo · Trilogy", href: "/engagement-rings" },
    },
  },
  {
    label: "Wedding Rings", href: "/wedding-rings", icon: <Sparkles className="w-4 h-4" />,
    dropdown: {
      sections: [
        {
          heading: "Shop by Style",
          links: [
            { label: "Claw Set", href: "/wedding-rings" },
            { label: "Channel Set", href: "/wedding-rings" },
            { label: "Designer Set", href: "/wedding-rings" },
          ],
        },
        {
          heading: "Shop by Metal",
          links: [
            { label: "White Gold", href: "/wedding-rings", metalColor: "#e8e4dc" },
            { label: "Yellow Gold", href: "/wedding-rings", metalColor: "#d4a843" },
            { label: "Rose Gold", href: "/wedding-rings", metalColor: "#d08560" },
            { label: "Platinum", href: "/wedding-rings", metalColor: "#b8b8c8" },
          ],
        },
        {
          heading: "Bespoke Design",
          links: [
            { label: "Create Your Own Wedding Ring", href: "/bespoke" },
            { label: "Matching Sets", href: "/matching-sets" },
          ],
        },
      ],
      card: { title: "Need It Sooner?", text: "Shop our Ready To Wear items for a faster delivery", href: "/jewellery" },
      image: { src: ring5, label: "Wedding Bands", sub: "Men's · Women's · Matching", href: "/wedding-rings" },
    },
  },
  {
    label: "Eternity Rings", href: "/eternity-rings", icon: <Sparkles className="w-4 h-4" />,
    dropdown: {
      sections: [
        {
          heading: "Shop by Style",
          links: [
            { label: "Claw Set", href: "/eternity-rings" },
            { label: "Channel Set", href: "/eternity-rings" },
            { label: "Designer Set", href: "/eternity-rings" },
          ],
        },
        {
          heading: "Shop by Metal",
          links: [
            { label: "White Gold", href: "/eternity-rings", metalColor: "#e8e4dc" },
            { label: "Yellow Gold", href: "/eternity-rings", metalColor: "#d4a843" },
            { label: "Rose Gold", href: "/eternity-rings", metalColor: "#d08560" },
            { label: "Platinum", href: "/eternity-rings", metalColor: "#b8b8c8" },
          ],
        },
        {
          heading: "Bespoke Design",
          links: [
            { label: "Design Your Eternity Ring", href: "/bespoke" },
            { label: "Book Private Viewing", href: "/book-appointment" },
          ],
        },
      ],
      card: { title: "Need It Sooner?", text: "Shop our Ready To Wear items for a faster delivery", href: "/jewellery" },
      image: { src: ring4, label: "Eternity Collection", sub: "Claw · Channel · Designer", href: "/eternity-rings" },
    },
  },
  {
    label: "Jewellery", href: "/jewellery", icon: <Gem className="w-4 h-4" />,
    dropdown: {
      sections: [
        {
          heading: "Create Your Own",
          links: [
            { label: "Create Your Own Earrings", href: "/bespoke" },
            { label: "Create Your Own Pendant", href: "/bespoke" },
          ],
          extraLinks: [
            { label: "Earrings", href: "/earrings", isAccent: true },
            { label: "Diamond Stud Earrings", href: "/earrings" },
            { label: "Diamond Hoop Earrings", href: "/earrings" },
            { label: "Diamond Drop Earrings", href: "/earrings" },
            { label: "Necklaces", href: "/necklaces", isAccent: true },
            { label: "Diamond Pendants", href: "/necklaces" },
            { label: "Diamond Necklaces", href: "/necklaces" },
          ],
        },
        {
          heading: "Cocktail Rings", headingAccent: true,
          links: [ { label: "All Cocktail Rings", href: "/jewellery" } ],
          extraLinks: [
            { label: "Bracelets", href: "/bracelets", isAccent: true },
            { label: "All Bracelets", href: "/bracelets" },
            { label: "Collections", href: "/jewellery", isAccent: true },
            { label: "Toi Et Moi", href: "/jewellery", isNew: true, isAccent: true },
            { label: "Starlight", href: "/jewellery", isAccent: true },
            { label: "Pearl", href: "/jewellery", isAccent: true },
            { label: "Kaleida", href: "/jewellery", isAccent: true },
            { label: "Mayfair", href: "/jewellery", isAccent: true },
            { label: "Olympia", href: "/jewellery", isAccent: true },
          ],
        },
        {
          heading: "Bespoke Design",
          links: [ { label: "Design Your Own Jewellery", href: "/bespoke" } ],
        },
      ],
      card: { title: "Need It Soon?", text: "Express delivery on selected pieces", links: [
        { label: "Diamond Earrings", href: "/earrings", isAccent: true },
        { label: "Diamond Necklaces", href: "/necklaces", isAccent: true },
        { label: "Diamond Bracelets", href: "/bracelets", isAccent: true },
      ]},
      image: { src: ring6, label: "Fine Jewellery", sub: "Earrings · Necklaces · Bracelets", href: "/jewellery" },
    },
  },
  {
    label: "Diamonds", href: "/diamonds", icon: <Diamond className="w-4 h-4" />,
    dropdown: {
      sections: [
        {
          heading: "Create Your Own",
          links: [
            { label: "Diamond Ring", href: "/natural-diamonds" },
            { label: "Diamond Earrings", href: "/earrings" },
            { label: "Diamond Necklace", href: "/necklaces" },
          ],
          extraLinks: [
            { label: "Matching Pairs", href: "/diamonds", isAccent: true },
            { label: "Coloured Diamonds", href: "/diamonds", isAccent: true },
            { label: "Lab-Grown Diamonds", href: "/lab-grown-diamonds", isAccent: true },
            { label: "Ideal Cut Collection", href: "/natural-diamonds", isAccent: true },
            { label: "Cupid's Ideal Diamonds", href: "/natural-diamonds" },
            { label: "Cupid's Ideal Lab Grown", href: "/lab-grown-diamonds", isNew: true },
          ],
        },
        {
          heading: "Loose Diamonds", twoColumn: true,
          links: [
            { label: "Round", href: "/loose-diamonds" }, { label: "Oval", href: "/loose-diamonds" },
            { label: "Emerald", href: "/loose-diamonds" }, { label: "Pear", href: "/loose-diamonds" },
            { label: "Radiant", href: "/loose-diamonds" }, { label: "Cushion", href: "/loose-diamonds" },
            { label: "Princess", href: "/loose-diamonds" }, { label: "Marquise", href: "/loose-diamonds" },
            { label: "Heart", href: "/loose-diamonds" }, { label: "Asscher", href: "/loose-diamonds" },
            { label: "Kites/Shields", href: "/loose-diamonds" }, { label: "Old Cuts", href: "/loose-diamonds" },
            { label: "Triangulars", href: "/loose-diamonds" },
          ],
        },
      ],
      card: { title: "Express Delivery", text: "Choose our quick-shipping diamonds for a faster delivery", href: "/loose-diamonds" },
      image: { src: ring1, label: "Certified Diamonds", sub: "GIA · IGI · Natural · Lab Grown", href: "/diamonds" },
    },
  },
  {
    label: "Gemstones", href: "/gemstones", icon: <Gem className="w-4 h-4" />,
    dropdown: {
      sections: [
        {
          heading: "Create Your Own",
          links: [
            { label: "Sapphire Ring", href: "/gemstones" },
            { label: "Ruby Ring", href: "/gemstones" },
            { label: "Emerald Ring", href: "/gemstones" },
            { label: "Gemstone Necklace", href: "/necklaces" },
          ],
        },
        {
          heading: "Shop by Shape", twoColumn: true,
          links: [
            { label: "Round", href: "/gemstones" }, { label: "Oval", href: "/gemstones" },
            { label: "Pear", href: "/gemstones" }, { label: "Cushion", href: "/gemstones" },
            { label: "Marquise", href: "/gemstones" }, { label: "Heart", href: "/gemstones" },
            { label: "Rectangle", href: "/gemstones" }, { label: "Square", href: "/gemstones" },
            { label: "Other", href: "/gemstones" },
          ],
        },
        {
          heading: "Gemstones",
          links: [
            { label: "Sapphire", href: "/gemstones", badge: "blue" },
            { label: "Ruby", href: "/gemstones", badge: "red" },
            { label: "Emerald", href: "/gemstones", badge: "green" },
          ],
        },
      ],
      image: { src: ring2, label: "Colour Stories", sub: "Sapphire · Ruby · Emerald", href: "/gemstones" },
    },
  },
  {
    label: "Bespoke", href: "/bespoke", icon: <Palette className="w-4 h-4" />,
    dropdown: {
      sections: [
        {
          heading: "Start Creating",
          links: [
            { label: "Design Consultation", href: "/book-appointment" },
            { label: "Bespoke Engagement Rings", href: "/bespoke" },
            { label: "Bespoke Wedding Rings", href: "/bespoke" },
            { label: "Bespoke Jewellery", href: "/bespoke" },
          ],
        },
        {
          heading: "Support",
          links: [
            { label: "Customer Service", href: "/customer-service" },
            { label: "Book Appointment", href: "/book-appointment" },
          ],
        },
      ],
      image: { src: heroImg, label: "Bespoke Design", sub: "Made to order, just for you", href: "/bespoke" },
    },
  },
  {
    label: "Education", href: "/education", icon: <Star className="w-4 h-4" />,
  },
];



interface HeaderProps {
  onSearchChange?: (q: string) => void;
  searchValue?: string;
}

const Header = ({ onSearchChange, searchValue = "" }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [internalSearchValue, setInternalSearchValue] = useState(searchValue);
  const { totalItems, wishlist } = useCart();
  const { user, openAuth, logout, isAdmin } = useAuth();
  const { currency, setCurrency, t } = useCurrency();
  const navigate = useNavigate();
  const submenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    setInternalSearchValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleMouseEnter = (label: string) => {
    if (submenuTimeout.current) {
      clearTimeout(submenuTimeout.current);
      submenuTimeout.current = null;
    }
    setActiveSubmenu(label);
  };
  
  const handleMouseLeave = () => {
    if (submenuTimeout.current) clearTimeout(submenuTimeout.current);
    submenuTimeout.current = setTimeout(() => setActiveSubmenu(null), 80);
  };

  const handleCartClick = () => {
    if (!user) { openAuth(); toast.info("Please login to view cart"); return; }
    navigate("/cart");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCurrencyChange = (c: "INR" | "EUR") => {
    setCurrency(c);
    toast.success(c === "EUR" ? "Switched to EUR" : "Switched to INR", { duration: 2000 });
  };

  const effectiveSearchValue = onSearchChange ? searchValue : internalSearchValue;

  const setSearchValue = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }
    setInternalSearchValue(value);
  };

  const submitSearch = async () => {
    const query = effectiveSearchValue.trim();
    if (!query) return;

    try {
      const response = await productAPI.search(query);
      if (response?.success && response.products?.length > 0) {
        const topResult = response.products[0];
        const targetId = topResult?.id ?? topResult?._id;
        if (targetId) {
          navigate(`/product/${targetId}`);
          setSearchOpen(false);
          return;
        }
      }
      toast.info("No matching product found");
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Unable to search right now. Please try again.");
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>

      <div className="bg-foreground text-background text-center py-2 sm:py-2.5 px-4">
        <p className="text-[10px] sm:text-xs font-medium tracking-[0.15em] sm:tracking-widest flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
          <span className="text-yellow-500 font-semibold">BIS Hallmarked · GIA Certified</span>
          <span className="hidden sm:inline text-background/30">|</span>
          <Link to="/book-appointment" className="text-accent hover:text-accent/80 font-bold transition-colors">
            Book Free Consultation →
          </Link>
        </p>
      </div>

      <div className={`bg-background border-b border-accent/30 transition-all duration-300 py-2.5 sm:py-3.5`}>
        <div className="flex items-center justify-between px-3 sm:px-6 max-w-screen-2xl mx-auto gap-2">

          <div className="flex items-center gap-2 min-w-[44px] md:min-w-[120px]">
            <button
              className="md:hidden text-foreground flex items-center justify-center p-1.5 rounded-md hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => handleCurrencyChange(currency === "INR" ? "EUR" : "INR")}
              className="md:hidden px-2 py-1 text-[8px] font-bold tracking-wider rounded border border-border/60 text-foreground/80 hover:text-accent hover:border-accent/50 transition-colors"
              aria-label="Toggle currency"
            >
              {currency}
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="flex rounded overflow-hidden border border-border/60" role="group" aria-label="Currency selector">
                <button
                  onClick={() => handleCurrencyChange("INR")}
                  aria-label="Switch to Indian Rupee"
                  className={`px-2.5 py-1.5 text-[10px] font-bold tracking-wider transition-all ${currency === "INR" ? "bg-accent text-accent-foreground" : "text-foreground/75 hover:text-accent hover:bg-secondary/50"}`}
                >INR</button>
                <button
                  onClick={() => handleCurrencyChange("EUR")}
                  aria-label="Switch to Euro"
                  className={`px-2.5 py-1.5 text-[10px] font-bold tracking-wider transition-all ${currency === "EUR" ? "bg-accent text-accent-foreground" : "text-foreground/75 hover:text-accent hover:bg-secondary/50"}`}
                >EUR</button>
              </div>
              <div className="w-px h-5 bg-border/50" />
              <ThemeToggle />
              <div className="w-px h-5 bg-border/50" />
              <Link to="/customer-service" className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-foreground/80 hover:text-accent transition-colors">
                <Phone className="w-3.5 h-3.5" /> {t("nav.needHelp")}
              </Link>
            </div>
          </div>

          <Link
            to="/"
            className="relative md:absolute md:left-1/2 md:-translate-x-1/2 text-center flex flex-col items-center group max-w-[150px] sm:max-w-none"
            aria-label={`${BRAND_CONFIG.name} — home`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <DiamondLogo size="sm" className="text-accent hidden sm:block w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-center">
                <div className="font-heading text-xl sm:text-3xl font-semibold tracking-[0.08em] sm:tracking-[0.12em] text-foreground whitespace-nowrap group-hover:text-accent transition-colors duration-300">
                  {BRAND_CONFIG.name}
                </div>
                <div className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.25em] text-accent uppercase font-bold mt-0.5">
                  {BRAND_CONFIG.store.city} · Est. 2012
                </div>
              </div>
              <DiamondLogo size="sm" className="text-accent hidden sm:block w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-2 min-w-[86px] sm:min-w-[120px] justify-end">
            <Link
              to="/book-appointment"
              className="hidden lg:flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-foreground/80 hover:text-accent transition-colors mr-2"
              aria-label="Book appointment"
            >
              <Calendar className="w-3.5 h-3.5" /> Appointment
            </Link>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-secondary/50 text-foreground hover:text-accent transition-all"
                  aria-label={`Account: ${user.name}`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-[10px] font-semibold tracking-wide">{user.name.split(" ")[0]}</span>
                </button>
                <div className={`absolute top-full right-0 mt-1 bg-card border border-border shadow-2xl rounded-lg z-50 min-w-[160px] transition-all duration-150 origin-top ${profileDropdownOpen ? "opacity-100 scale-y-100 block" : "opacity-0 scale-y-95 hidden pointer-events-none"}`}>
                  <div className="py-1.5">
                    <div className="px-4 py-2 border-b border-border/50 mb-1">
                      <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-foreground/80 hover:text-accent hover:bg-secondary/40 transition-colors min-h-[36px]">
                      <Settings className="w-3.5 h-3.5" /> My Profile
                    </Link>
                    <Link to="/my-orders" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-foreground/80 hover:text-accent hover:bg-secondary/40 transition-colors min-h-[36px]">
                      <ShoppingBag className="w-3.5 h-3.5" /> My Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-foreground/80 hover:text-accent hover:bg-secondary/40 transition-colors min-h-[36px]">
                      <Heart className="w-3.5 h-3.5" /> Wishlist ({wishlist.length})
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-accent hover:bg-secondary/40 transition-colors min-h-[36px] font-semibold">
                        <Shield className="w-3.5 h-3.5" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-border/50 mt-1 pt-1">
                      <button
                        onClick={() => {
                          handleLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors min-h-[36px]"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={openAuth}
                className="p-1 rounded-md hover:bg-secondary/50 text-foreground/80 hover:text-accent transition-all"
                aria-label="Login or register"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 rounded-md hover:bg-secondary/50 text-foreground/80 hover:text-accent transition-all"
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <Link
              to="/wishlist"
              className="relative hidden sm:inline-flex p-1.5 rounded-md hover:bg-secondary/50 text-foreground/80 hover:text-accent transition-all"
              aria-label={`Wishlist — ${wishlist.length} items`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={handleCartClick}
              className="relative p-1 rounded-md hover:bg-secondary/50 text-foreground/80 hover:text-accent transition-all"
              aria-label={`Cart — ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            <span className="hidden"><ThemeToggle /></span>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="bg-background border-b border-border/50 px-4 sm:px-6 py-2.5 animate-in slide-in-from-top-1 duration-200">
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-secondary/30 border border-border/60 rounded-lg px-3 py-2 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search rings, necklaces, diamonds…"
              value={effectiveSearchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitSearch();
                }
              }}
              className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground/60"
              aria-label="Search products"
            />
            {effectiveSearchValue && (
              <button
                onClick={() => { setSearchValue(""); }}
                className="text-[10px] font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => { setSearchValue(""); setSearchOpen(false); }}
              className="text-muted-foreground hover:text-foreground transition-colors ml-1"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <nav
        className="hidden md:block bg-background border-b border-border/30 shadow-sm"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-center max-w-screen-2xl mx-auto px-4">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={item.href}
                className={`flex items-center gap-1.5 px-4 lg:px-6 py-4 text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-150 whitespace-nowrap relative group/nav ${
                  activeSubmenu === item.label ? "text-accent" : "text-foreground/70 hover:text-accent"
                }`}
              >
                <span className={`${activeSubmenu === item.label ? "scale-110" : "group-hover/nav:scale-110"} transition-transform duration-150`}>{item.icon}</span>
                <span className="hidden lg:inline">{item.label}</span>
                {item.dropdown && (
                  <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${activeSubmenu === item.label ? "rotate-180" : ""}`} />
                )}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent transition-all duration-150 origin-left ${activeSubmenu === item.label ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"}`} />
              </Link>

              {item.dropdown && (
                <div aria-hidden="true" className="absolute left-1/2 top-full z-40 h-3 w-full -translate-x-1/2" onMouseEnter={() => handleMouseEnter(item.label)} />
              )}

              {/* ── 77Diamonds-style multi-column mega dropdown ── */}
              {item.dropdown && (
                <div
                  className={`fixed left-0 right-0 bg-background border-b border-border/40 shadow-[0_20px_60px_rgba(0,0,0,0.13)] z-50 transition-all duration-150 origin-top ${
                    activeSubmenu === item.label ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"
                  }`}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="max-w-screen-xl mx-auto px-8 py-8 flex gap-8">
                    {/* Text columns */}
                    <div
                      className="flex-1 grid gap-x-8 gap-y-10"
                      style={{ 
                        gridTemplateColumns: `repeat(${Math.min(item.dropdown.sections.length, 4)}, minmax(180px, 1fr))`,
                        maxWidth: "1000px"
                      }}
                    >
                      {item.dropdown.sections.map((section, sIdx) => (
                        <div key={section.heading} style={{ animationDelay: `${sIdx * 0.05}s` }}>
                          <p className={`text-[8px] font-bold uppercase tracking-[0.35em] mb-3 pb-2 border-b ${
                            section.headingAccent ? "text-accent border-accent/30" : "text-foreground/40 border-border/30"
                          }`}>
                            {section.heading}
                          </p>
                          {/* Main links */}
                          {section.twoColumn ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              {section.links.map((link) => (
                                <Link key={link.label} to={link.href} onClick={() => setActiveSubmenu(null)}
                                  className="py-0.5 text-[10px] text-foreground/65 hover:text-accent transition-colors">
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <ul className="space-y-1.5">
                              {section.links.map((link) => (
                                <li key={link.label}>
                                  <Link to={link.href} onClick={() => setActiveSubmenu(null)}
                                    className={`group/link flex items-center gap-2 py-0.5 text-[11px] transition-all duration-200 hover:translate-x-0.5 ${
                                      link.isAccent ? "text-accent/80 hover:text-accent" : "text-foreground/70 hover:text-accent"
                                    }`}>
                                    {link.metalColor && (
                                      <span className="w-4 h-4 rounded-sm flex-shrink-0 border border-border/40" style={{ background: link.metalColor }} />
                                    )}
                                    {link.badge && (
                                      <span className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-border/30" style={{
                                        background: link.badge === "blue" ? "#1e40af" : link.badge === "red" ? "#dc2626" : link.badge === "green" ? "#16a34a" : "#888"
                                      }} />
                                    )}
                                    <span className="font-medium leading-tight">{link.label}</span>
                                    {link.isNew && <span className="ml-1 text-[8px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-1 py-0.5 rounded">New</span>}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                          {/* Extra flat links */}
                          {section.extraLinks && section.extraLinks.length > 0 && (
                            <ul className="mt-3 space-y-1.5 pt-3 border-t border-border/20">
                              {section.extraLinks.map((link) => (
                                <li key={link.label}>
                                  <Link to={link.href} onClick={() => setActiveSubmenu(null)}
                                    className={`flex items-center gap-1.5 py-0.5 text-[10px] transition-colors ${
                                      link.isAccent ? "text-accent/80 font-semibold hover:text-accent" : "text-foreground/65 hover:text-accent"
                                    }`}>
                                    {link.label}
                                    {link.isNew && <span className="text-[8px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-1 py-0.5 rounded">New</span>}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Need It Sooner / Express Delivery card */}
                    {item.dropdown.card && (
                      <div className="w-[190px] flex-shrink-0">
                        {item.dropdown.card.title && (
                          <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-foreground/40 mb-2">{item.dropdown.card.title}</p>
                        )}
                        <div className="bg-[#f5f0e8] dark:bg-secondary/40 border border-border/30 rounded-lg p-4">
                          {item.dropdown.card.links ? (
                            <ul className="space-y-1.5">
                              {item.dropdown.card.links.map(l => (
                                <li key={l.label}>
                                  <Link to={l.href} onClick={() => setActiveSubmenu(null)}
                                    className="text-[11px] text-accent hover:underline font-medium">
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Link to={item.dropdown.card.href ?? "#"} onClick={() => setActiveSubmenu(null)}
                              className="flex items-start justify-between gap-2 group/card">
                              <p className="text-[11px] text-foreground/80 font-medium leading-snug">{item.dropdown.card.text}</p>
                              <ArrowRight className="w-4 h-4 flex-shrink-0 text-foreground/40 mt-0.5 group-hover/card:text-accent transition-colors" />
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Right image panel */}
                    {item.dropdown.image && (
                      <div className="w-[200px] flex-shrink-0">
                        <Link
                          to={item.dropdown.image.href}
                          onClick={() => setActiveSubmenu(null)}
                          className="group/img block overflow-hidden rounded-xl border border-border/40 shadow-sm hover:shadow-lg transition-all duration-500"
                        >
                          <div className="relative h-[160px] overflow-hidden">
                            <img
                              src={item.dropdown.image.src}
                              alt={item.dropdown.image.label}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <p className="text-[10px] font-bold text-white leading-snug">{item.dropdown.image.label}</p>
                              {item.dropdown.image.sub && <p className="text-[8px] text-white/70 mt-0.5">{item.dropdown.image.sub}</p>}
                            </div>
                          </div>
                          <div className="px-3 py-2 bg-card/80 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Explore</span>
                            <ArrowRight className="w-3 h-3 text-accent transition-transform group-hover/img:translate-x-1" />
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                  {/* View all footer */}
                  <div className="border-t border-border/20 bg-secondary/5 px-8 py-2.5 flex justify-end">
                    <Link
                      to={item.href}
                      onClick={() => setActiveSubmenu(null)}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/50 hover:text-accent transition-colors group/all"
                    >
                      View All {item.label}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover/all:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-0 pt-[56px] sm:pt-[64px] bg-background z-40 overflow-y-auto border-t border-border animate-in slide-in-from-left duration-250 pb-8">
          <div className="sticky top-0 bg-card border-b border-border/50 flex items-center z-10 h-[56px] sm:h-[64px]">
            <button 
              onClick={() => handleCurrencyChange(currency === "INR" ? "EUR" : "INR")} 
              className="flex-1 py-3 text-xs font-bold tracking-widest border-r border-border/30 hover:bg-secondary/20 transition-colors"
            >
              CURRENCY: <span className="text-accent">{currency}</span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-6 h-full flex items-center justify-center text-muted-foreground hover:text-accent transition-colors border-l border-border/30"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-4 border-b border-border/40 bg-secondary/20"
            aria-label={`${BRAND_CONFIG.name} home`}
          >
            <DiamondLogo size="sm" className="text-accent w-5 h-5" />
            <span className="font-heading text-base tracking-[0.15em]">{BRAND_CONFIG.name}</span>
          </Link>

          <nav className="flex flex-col bg-background" aria-label="Mobile navigation">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 text-sm font-semibold min-h-[48px] bg-card hover:bg-secondary/30 transition-colors"
            >
              <Home className="w-5 h-5 text-accent" /> 
              <span>Home</span>
            </Link>
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-border/40">
                  <div className="flex items-center min-h-[48px] bg-card hover:bg-secondary/30 transition-colors">
                    <Link
                      to={item.href}
                      onClick={() => { setMobileMenuOpen(false); setMobileSubmenu(null); }}
                      className="flex-1 px-4 py-3.5 text-sm font-semibold tracking-wide flex items-center gap-2.5 text-foreground"
                    >
                      <span className="text-accent">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                    {item.dropdown && (
                      <button
                        onClick={() => setMobileSubmenu(mobileSubmenu === item.label ? null : item.label)}
                        className="px-4 border-l border-border/40 flex items-center justify-center h-full min-h-[48px]"
                        aria-label={`Toggle ${item.label}`}
                      >
                      <ChevronDown className={`w-4.5 h-4.5 transition-transform duration-200 ${mobileSubmenu === item.label ? "rotate-180 text-accent" : "text-muted-foreground"}`} />
                      </button>
                    )}
                  </div>
                {item.dropdown && mobileSubmenu === item.label && (
                    <div className="bg-secondary/10 border-b border-border/30 animate-in slide-in-from-top-1 duration-150 px-3 py-3">
                      <button 
                        onClick={() => setMobileSubmenu(null)}
                        className="flex items-center gap-2 px-4 py-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-accent/5 rounded-lg transition-colors w-full text-left"
                      >
                        <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                        Back to main menu
                      </button>
                      {item.dropdown.sections.map((section) => (
                        <div key={section.heading} className="mb-4 last:mb-0">
                          <p className="px-4 mb-2 text-[8px] font-bold uppercase tracking-[0.2em] text-accent/70 border-b border-accent/10 pb-1">
                            {section.heading}
                          </p>
                          <div className="space-y-0.5">
                            {section.links.map((link) => (
                              <Link
                                key={link.label}
                                to={link.href}
                                onClick={() => { setMobileMenuOpen(false); setMobileSubmenu(null); }}
                                className="flex items-center gap-3 px-4 py-2.5 min-h-[44px] text-sm font-medium text-foreground/75 hover:text-accent hover:bg-accent/5 rounded-xl transition-colors"
                              >
                                {link.icon && <span className="text-accent/70">{link.icon}</span>}
                                {link.metalColor && <span className="w-3.5 h-3.5 rounded-sm border border-border/40" style={{ background: link.metalColor }} />}
                                {link.badge && <span className="w-2.5 h-2.5 rounded-full" style={{ background: link.badge === "blue" ? "#1e40af" : link.badge === "red" ? "#dc2626" : "#16a34a" }} />}
                                <span>{link.label}</span>
                                {link.isNew && <span className="ml-1 text-[8px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-1 py-0.5 rounded">New</span>}
                              </Link>
                            ))}
                            {section.extraLinks?.map((link) => (
                               <Link
                                 key={link.label}
                                 to={link.href}
                                 onClick={() => { setMobileMenuOpen(false); setMobileSubmenu(null); }}
                                 className="flex items-center gap-3 px-4 py-2 min-h-[40px] text-xs font-semibold text-accent/80 hover:bg-accent/5 rounded-lg transition-colors"
                               >
                                 <span>{link.label}</span>
                               </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                )}
              </div>
            ))}

            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 text-sm font-semibold min-h-[48px] bg-card hover:bg-secondary/30 transition-colors">
              <Heart className="w-5 h-5 text-red-500" /> 
              <span>Wishlist ({wishlist.length})</span>
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 text-sm font-semibold min-h-[48px] bg-card hover:bg-secondary/30 transition-colors">
              <ShoppingBag className="w-5 h-5 text-accent" /> 
              <span>Cart ({totalItems})</span>
            </Link>
            <Link to="/book-appointment" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 text-sm font-semibold min-h-[48px] bg-card hover:bg-secondary/30 transition-colors">
              <Calendar className="w-5 h-5 text-accent" /> 
              <span>Book Appointment</span>
            </Link>
            <Link to="/customer-service" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 text-sm font-semibold min-h-[48px] bg-card hover:bg-secondary/30 transition-colors">
              <Phone className="w-5 h-5 text-accent" /> 
              <span>Customer Service</span>
            </Link>

            {!user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); openAuth(); }}
                className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 text-sm font-semibold min-h-[48px] text-left w-full bg-card hover:bg-secondary/30 transition-colors"
              >
                <User className="w-5 h-5 text-accent" /> 
                <span>Login / Register</span>
              </button>
            ) : (
              <>
                <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 text-sm font-semibold min-h-[48px] bg-card hover:bg-secondary/30 transition-colors">
                  <ShoppingBag className="w-5 h-5 text-accent" /> 
                  <span>My Orders</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 text-sm font-semibold min-h-[48px] text-accent bg-card hover:bg-secondary/30 transition-colors">
                    <Shield className="w-5 h-5" /> 
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold min-h-[48px] text-red-500 w-full text-left bg-card hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-b border-border/40"
                >
                  <LogOut className="w-5 h-5" /> 
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
