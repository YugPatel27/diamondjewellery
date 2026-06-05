import { useEffect, useRef, useState } from "react";
// HMR Refresh Trigger
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { SEOHead } from "@/components/SEOHead";
import { useProducts } from "@/hooks/useProducts";
import ExpertGuidance from "@/components/ExpertGuidance";
import { productAPI } from "@/lib/api";
import { type Product } from "@/data/products";
import { useCurrency } from "@/contexts/CurrencyContext";
import GenericFeatureGrid from "@/components/GenericFeatureGrid";
import testimonialsBg from "@/assets/testimonials-banner.png";
import consultationImg from "@/assets/consultation_banner_new.png";
import {
  Diamond,
  Gem,
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Award,
  Heart,
  Phone,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "@/components/Icons";
import heroImg from "@/assets/hero-model.jpg";
import ring1 from "@/assets/ring-1.jpg";
import ring2 from "@/assets/ring-2.jpg";
import ring3 from "@/assets/ring-3.jpg";
import ring4 from "@/assets/ring-4.jpg";
import ring5 from "@/assets/ring-5.jpg";
import ring6 from "@/assets/ring-6.jpg";
import { motion } from "framer-motion";

const DesignNarrative = () => {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2.5rem] border border-border/40 bg-card shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 items-stretch lg:min-h-[620px] lg:grid-cols-[1.08fr_0.92fr]">

            {/* Text Content */}
            <div className="order-2 p-8 sm:p-12 lg:order-1 lg:flex lg:h-full lg:flex-col lg:justify-center lg:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-7"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-[9px] font-bold uppercase tracking-[0.3em]">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  Design Narrative
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl font-light text-foreground mb-6 leading-tight"
              >
                Born from a <br />
                <span className="italic text-accent">moment of light</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-sm leading-relaxed text-muted-foreground mb-10 max-w-lg"
              >
                The Trilogy Love was inspired by the way morning light filters through the heritage windows of our London studio. Designed to capture and dance with every ray of light, this piece represents the perfect marriage of traditional artisanal techniques and modern structural elegance.
              </motion.p>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="rounded-[1.4rem] border border-border/40 bg-background/70 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-500 group hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
                >
                  <h4 className="font-heading text-sm font-medium mb-2 group-hover:text-accent transition-colors">The Inspiration</h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                    A celebration of geometric purity and organic flow, designed for the woman who finds beauty in the details of the everyday.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="rounded-[1.4rem] border border-border/40 bg-background/70 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-500 group hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
                >
                  <h4 className="font-heading text-sm font-medium mb-2 group-hover:text-accent transition-colors">The Legacy</h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                    Part of our signature Trilogy series, this piece is destined to become a cherished family heirloom, passing down stories of love and light.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Image Content */}
            <div className="order-1 h-full p-0 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-full w-full"
              >
                <div className="absolute inset-0 bg-accent/5 blur-3xl opacity-30" />
                <div className="relative h-full min-h-[320px] overflow-hidden">
                  <img
                    src={consultationImg}
                    alt="Luxury jewelry design"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    style={{ transitionDuration: "10s" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/18 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.08 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
};

const collections = [
  { label: "Engagement Rings", href: "/engagement-rings", icon: <Diamond className="w-6 h-6" />, desc: "Timeless symbols of forever love", image: ring1 },
  { label: "Wedding Rings", href: "/wedding-rings", icon: <Heart className="w-6 h-6" />, desc: "Elegant bands for every promise", image: ring2 },
  { label: "Necklaces", href: "/necklaces", icon: <Gem className="w-6 h-6" />, desc: "Minimal and refined silhouettes", image: ring3 },
  { label: "Earrings", href: "/earrings", icon: <Sparkles className="w-6 h-6" />, desc: "Brilliance with understated drama", image: ring1 },
  { label: "Diamonds", href: "/diamonds", icon: <Diamond className="w-6 h-6" />, desc: "Certified stones and expert guidance", image: ring2 },
  { label: "Bespoke", href: "/bespoke", icon: <Award className="w-6 h-6" />, desc: "Made to order, from concept to creation", image: ring3 },
];

const shopByCategories = [
  { label: "Engagement Rings", href: "/engagement-rings", image: ring1 },
  { label: "Ready to Wear", href: "/jewellery", image: ring2 },
  { label: "Eternity Rings", href: "/eternity-rings", image: ring3 },
  { label: "Earrings", href: "/earrings", image: ring4 },
  { label: "Necklaces", href: "/necklaces", image: ring5 },
  { label: "Bracelets", href: "/bracelets", image: ring6 },
  { label: "Cocktail Rings", href: "/gemstones", image: ring1 },
  { label: "Wedding Rings", href: "/wedding-rings", image: ring2 },
];

const features = [
  { icon: <Shield className="w-6 h-6" />, title: "Certified quality", desc: "Every diamond is selected for brilliance, authenticity, and trust." },
  { icon: <Clock className="w-6 h-6" />, title: "Private appointments", desc: "Book a calm one-to-one consultation in store or online." },
  { icon: <Award className="w-6 h-6" />, title: "Lifetime care", desc: "Cleaning, polishing, and resizing support after purchase." },
  { icon: <Sparkles className="w-6 h-6" />, title: "Crafted details", desc: "Precision finishing with an elevated, modern luxury feel." },
];

const showcaseRows = [
  {
    label: "Signature rings",
    title: "The engagement edit",
    desc: "A refined selection of solitaires, halo designs, trilogy styles, and bespoke settings made to feel both personal and timeless.",
    image: ring1,
    primaryLabel: "Browse rings",
    primaryHref: "/engagement-rings",
    secondaryLabel: "Design bespoke",
    secondaryHref: "/bespoke",
    icon: <Diamond className="w-5 h-5" />,
  },
  {
    label: "Couple collections",
    title: "Wedding bands with balance",
    desc: "Matching sets and individual bands designed around comfort, proportion, and the quiet confidence of a lasting piece.",
    image: ring2,
    primaryLabel: "Explore wedding",
    primaryHref: "/wedding-rings",
    secondaryLabel: "Book appointment",
    secondaryHref: "/book-appointment",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    label: "Fine jewellery",
    title: "Modern essentials",
    desc: "Necklaces, earrings, and bracelets styled with clean lines, luminous metals, and subtle editorial energy.",
    image: ring3,
    primaryLabel: "View jewellery",
    primaryHref: "/jewellery",
    secondaryLabel: "See all products",
    secondaryHref: "/products",
    icon: <Gem className="w-5 h-5" />,
  },
];

const testimonials = [
  { name: "Priya S.", city: "Mumbai", text: "The presentation felt premium and calm from the start. The ring was exactly what we hoped for.", rating: 5 },
  { name: "Arjun M.", city: "Delhi", text: "Elegant design language, very clear guidance, and a quality finish that feels genuinely special.", rating: 5 },
  { name: "Kavya R.", city: "Bangalore", text: "We loved the bespoke consultation. It made the final piece feel personal and elevated.", rating: 5 },
];

const giftEdit = [
  {
    name: "Mariner, 20mm, quartz calibre, steel case, white mother-of-pearl with 2 diamonds dial, steel cable bracelet",
    price: "Rs. 221,400.00 INR",
    image: ring4,
    href: "/product/1",
  },
  {
    name: "Mariner, 20mm, quartz calibre, steel with 12 diamonds case, white mother-of-pearl with 2 diamonds dial, steel twisted cable bracelet",
    price: "Rs. 394,500.00 INR",
    image: ring5,
    href: "/product/2",
    highlight: true,
  },
  {
    name: "Mariner, 20mm, quartz calibre, steel case, white mother-of-pearl with 2 diamonds dial, steel links bracelet",
    price: "Rs. 209,000.00 INR",
    image: ring6,
    href: "/product/3",
  },
  {
    name: "Mariner, 20mm, quartz calibre, steel case, black mother-of-pearl with 2 diamonds dial, steel cable bracelet",
    price: "Rs. 221,400.00 INR",
    image: ring1,
    href: "/product/4",
  },
];

const bangleEdit = [
  { name: "Grand Diamond Bangle", price: "From Rs. 18,000.00 INR", image: ring1, href: "/jewellery" },
  { name: "Signature Elite Bangle", price: "From Rs. 18,000.00 INR", image: ring2, href: "/jewellery" },
  { name: "Diamond Twist Bangle", price: "From Rs. 18,000.00 INR", image: ring3, href: "/jewellery" },
  { name: "Forever Aura Bangle", price: "From Rs. 20,500.00 INR", image: ring4, href: "/jewellery" },
];

const collectionCards = [
  { title: "Solitaire Elite", label: "Collection", image: ring4, href: "/wedding-rings" },
  { title: "Royal Essence", label: "Collection", image: ring5, href: "/necklaces" },
  { title: "For Her", label: "Collection", image: heroImg, href: "/jewellery" },
  { title: "For Him", label: "Collection", image: ring6, href: "/mens-bands" },
];

const Index = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as any;
  const { products, filters, setFilters, sort, setSort, loading } = useProducts(categoryParam);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { formatPrice } = useCurrency();
  const categoryScrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = categoryScrollerRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 8);
  };

  const scrollCategories = (direction: "left" | "right") => {
    const el = categoryScrollerRef.current;
    if (!el) return;
    const amount = Math.max(320, el.clientWidth * 0.78);
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };


  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productAPI.getAll();
        if (response.success && response.products) {
          setFeaturedProducts(response.products.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = categoryScrollerRef.current;
    if (!el) return;

    const onScroll = () => updateScrollState();
    const onResize = () => updateScrollState();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);


  useEffect(() => {
    if (categoryParam && categoryParam !== filters.category) {
      setFilters({ category: categoryParam });
    }
  }, [categoryParam, filters.category, setFilters]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Diamond Jewels - Luxury Diamond Rings and Fine Jewellery"
        description="Discover premium diamond engagement rings, wedding bands, necklaces, earrings, and bespoke jewellery. Clean luxury design with expert guidance."
        keywords={["diamond rings", "engagement rings", "fine jewellery", "wedding rings", "certified diamonds", "luxury jewellery", "London jewellery"]}
        canonical="https://diamondjewels.com"
      />
      <AnimatedBackground type="diamond" />
      <Header onSearchChange={(q) => setFilters({ search: q })} searchValue={filters.search} />

      <main className="relative z-10">
        <section className="relative w-full overflow-hidden h-[75vh] sm:h-[85vh]">
          <div className="absolute inset-0">
            <motion.img
              src={heroImg}
              alt="Luxury jewellery"
              className="h-full w-full object-cover transition-transform duration-&lsqb;12000ms&rsqb ease-out"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 12, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-16 lg:px-24">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8 inline-flex items-center gap-4 text-accent"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 backdrop-blur-md shadow-[0_0_30px_rgba(212,155,23,0.3)]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/90">
                  Refined jewellery, modern presentation
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-heading text-4xl sm:text-7xl xl:text-8xl mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.1] text-white font-light tracking-tight"
              >
                Elegant pieces
                <br />
                <span className="italic text-accent gold-glow">designed to last</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-12 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
              >
                Explore a luxury-led collection of rings, diamonds, and bespoke jewellery with a cleaner visual language by Diamond Jewels.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-6"
              >
                <Link
                  to="/engagement-rings"
                  className="btn-gold !px-12 !py-5 shadow-2xl shadow-accent/20 text-xs font-bold tracking-[0.3em]"
                >
                  Shop rings
                </Link>
                <Link
                  to="/bespoke"
                  className="group flex items-center gap-3 px-10 py-5 border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/60 rounded-full transition-all duration-500 text-[11px] font-bold tracking-[0.3em] uppercase text-white backdrop-blur-md"
                >
                  Design bespoke
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <div className="mt-16 flex flex-wrap gap-10">
                {["GIA / IGI certified", "BIS hallmarked", "Lifetime care"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <DesignNarrative />

        <ScrollReveal>
          <section className="px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[1.5rem] border border-border/40 bg-card">
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="grid grid-cols-2 gap-0">
                  <div className="overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={heroImg}
                      alt="Mother and daughter jewellery campaign"
                      className="h-full w-full object-cover aspect-[1/1]"
                      loading="lazy"
                    />
                  </div>
                  <div className="overflow-hidden border-l border-border/40">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={ring2}
                      alt="Mother and daughter close-up jewellery"
                      className="h-full w-full object-cover aspect-[1/1]"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-12">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Mother's Day gifts</p>
                  <h2 className="mt-3 font-heading text-2xl font-light text-foreground sm:text-4xl">
                    A thoughtful edit for every story
                  </h2>
                  <p className="mt-4 max-w-xl text-xs leading-relaxed text-foreground/70 sm:text-sm sm:leading-7">
                    Celebrate with elegant watches and jewellery gifts. This section adds the image-first campaign layout you shared, with product cards below the hero.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/jewellery" className="btn-gold">
                      Shop Mother&apos;s Day gifts
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40 px-5 py-6 sm:px-8 sm:py-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {featuredProducts.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="group rounded-2xl border border-transparent p-3 transition-all hover:border-accent/30 hover:bg-accent/5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
                    >
                      <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white p-3">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.name}
                          className="h-36 w-full object-contain transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-sm">
                          View details
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-3 text-center text-[11px] leading-5 text-foreground/75 font-semibold">
                        {item.name}
                      </p>
                      <p className="mt-2 text-center text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
                        {formatPrice(item.price)}
                      </p>

                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-secondary/40 via-background to-secondary/20 dark:from-secondary/10 dark:via-card dark:to-background shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
              <motion.div
                className="relative overflow-hidden"
                whileHover="hover"
                initial="initial"
              >
                <motion.img
                  src={heroImg}
                  alt="Best bangle hero"
                  className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[400px]"
                  loading="lazy"
                  variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.05 }
                  }}
                  transition={{ duration: 5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-12">
                  <div className="max-w-3xl text-white">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] backdrop-blur-md">
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      Diamond Jewels&apos; finest
                    </div>
                    <h2 className="font-heading text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
                      Diamond Jewels Signature Bangle
                    </h2>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-white/90 sm:text-base">
                      A cleaner, more premium bangle presentation with sculpted spacing, elevated imagery, and a modern luxury finish.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredProducts.slice(4, 8).map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="group relative rounded-[2rem] border border-border/40 bg-card p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-accent/30"
                    >
                      <div className="relative overflow-hidden rounded-[1.5rem] bg-secondary/30 dark:bg-background/40 p-6 flex items-center justify-center">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.name}
                          className="h-40 w-full object-contain transition-transform duration-700 group-hover:scale-110 sm:h-36 lg:h-40"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="mt-5 text-center">
                        <p className="text-[11px] sm:text-[12px] leading-relaxed text-foreground font-semibold line-clamp-1">
                          {item.name}
                        </p>
                        <p className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-accent font-bold">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>


                <div className="mt-8 flex justify-center">
                  <Link
                    to="/jewellery"
                    className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-background shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
                  >
                    Shop Signature Bangles
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-5xl">
              <div className="mb-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent">Collections</p>
                <h2 className="mt-2 font-heading text-3xl font-light text-foreground sm:text-4xl">
                  Image-led collection display
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2">
                {collectionCards.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group relative overflow-hidden rounded-xl sm:rounded-[1.5rem] border border-border/40 bg-card min-h-[140px] sm:min-h-[260px]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute left-0 top-0 z-10 px-5 py-4 text-white">
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/80">
                        {item.label}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white">
                      <h3 className="font-heading text-2xl font-light sm:text-3xl">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {showcaseRows.map((row, index) => {
          const reverse = index % 2 === 1;
          return (
            <ScrollReveal key={row.title}>
              <section className="px-4 py-3 mt-7 sm:px-6">
                <article className={`mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-[1.5rem] border border-border/40 bg-card lg:grid-cols-[1fr_1fr] ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <motion.div
                    className="relative min-h-[300px] overflow-hidden lg:min-h-[420px]"
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.img
                      src={row.image}
                      alt={row.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.08, filter: "brightness(1.1)" }
                      }}
                      transition={{ duration: 5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </motion.div>

                  <div className="flex items-center bg-gradient-to-br from-secondary/40 to-background px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                    <div className="max-w-lg">
                      <p className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] text-accent">
                        {row.icon}
                        {row.label}
                      </p>
                      <h3 className="mt-3 font-heading text-3xl font-light leading-tight text-foreground sm:text-4xl">
                        {row.title}
                      </h3>
                      <div className="mt-4 h-px w-12 bg-accent" />
                      <p className="mt-5 text-sm leading-relaxed text-foreground/72">
                        {row.desc}
                      </p>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <Link to={row.primaryHref} className="btn-gold !px-6 !py-3 !text-[9px]">
                          {row.primaryLabel}
                        </Link>
                        <Link to={row.secondaryHref} className="btn-ghost !px-6 !py-3 !text-[9px]">
                          {row.secondaryLabel}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            </ScrollReveal>
          );
        })}


        <ScrollReveal>
          <section className="px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Collections</p>
                  <h2 className="mt-3 font-heading text-3xl font-light text-foreground sm:text-4xl">
                    Shop by Category
                  </h2>
                </div>
                <Link
                  to="/jewellery"
                  className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity"
                >
                  View All Collections <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
                {shopByCategories.map((category, idx) => (
                  <Link
                    key={idx}
                    to={category.href}
                    className="group relative aspect-[3/4] overflow-hidden rounded-[1.25rem] border border-border/40 shadow-sm"
                  >
                    <motion.img
                      src={category.image}
                      alt={category.label}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Floating Label */}
                    <div className="absolute bottom-5 left-5 right-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore</p>
                      <h3 className="font-heading text-xl font-light text-white sm:text-2xl">
                        {category.label}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to="/jewellery"
                className="mt-8 flex sm:hidden items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent"
              >
                View All Collections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </ScrollReveal>


        {/* ── SHOP BY CATEGORY ─────────────────────────────── */}
        <ScrollReveal>
          <section className="px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-12">
                <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-accent mb-3">Collections</p>
                <h2 className="font-heading text-3xl sm:text-4xl font-light text-foreground">Shop by Category</h2>
              </div>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background via-background/70 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background via-background/70 to-transparent" />

                <div className="absolute -top-16 right-0 z-20 flex items-center gap-3">
                  <motion.button
                    type="button"
                    onClick={() => scrollCategories("left")}
                    disabled={!canScrollLeft}
                    whileTap={{ scale: 0.94 }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/95 text-foreground shadow-lg transition-all duration-300 hover:border-accent/40 hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    aria-label="Scroll categories left"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => scrollCategories("right")}
                    disabled={!canScrollRight}
                    whileTap={{ scale: 0.94 }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/95 text-foreground shadow-lg transition-all duration-300 hover:border-accent/40 hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    aria-label="Scroll categories right"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>

                <div
                  ref={categoryScrollerRef}
                  className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-6 pr-2 snap-x snap-mandatory"
                >
                  {shopByCategories.map((cat, idx) => (
                    <motion.div
                      key={`${cat.label}-${idx}`}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[24%]"
                    >
                      <Link to={cat.href} className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-border/40 bg-secondary/20 shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-700 group-hover:-translate-y-2 group-hover:border-accent/50 group-hover:shadow-[0_24px_50px_rgba(212,155,23,0.16)]">
                          <motion.img
                            src={cat.image}
                            alt={cat.label}
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                            initial={{ scale: 1.04 }}
                            whileHover={{ scale: 1.12 }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,155,23,0.2),transparent_55%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                          <div className="absolute inset-x-0 bottom-0 p-5">
                            <div className="flex items-end justify-between gap-3">
                              <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                  Explore
                                </p>
                                <h3 className="font-heading text-lg font-light text-white transition-colors duration-500 group-hover:text-accent sm:text-xl">
                                  {cat.label}
                                </h3>
                              </div>
                              <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                whileHover={{ opacity: 1, x: 0 }}
                                className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-md sm:inline-flex"
                              >
                                View
                              </motion.span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* View All CTA */}
              <div className="mt-12 flex justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-border/40 bg-card hover:bg-accent hover:text-white hover:border-accent transition-all duration-500 text-[10px] font-bold tracking-[0.35em] uppercase text-foreground group"
                >
                  View All Collections <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="px-4 py-16 sm:px-6 sm:py-24 relative overflow-hidden group">
            {/* Background Lifestyle Image */}
            <div className="absolute inset-0 z-0">
              <motion.img
                src={testimonialsBg}
                alt="Testimonials background"
                className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
            </div>

            <div className="mx-auto max-w-5xl rounded-[2rem] border border-border/40 bg-card/40 dark:bg-card/20 px-5 py-12 sm:px-10 sm:py-16 backdrop-blur-xl relative z-10 shadow-2xl">
              <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
                  <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Kind words</span>
                </div>
                <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight">
                  Stories that feel <span className="italic">personal</span>
                </h2>
                <div className="mt-8 flex items-center justify-center gap-4 opacity-50">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
                  <Sparkles className="w-4 h-4 text-accent" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8 }}
                    className="group relative rounded-[1.75rem] border border-border/60 bg-background/50 p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 hover:border-accent/40"
                  >
                    {/* Quotation mark decorative icon */}
                    <div className="absolute top-6 right-6 text-accent/10 group-hover:text-accent/20 transition-colors">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3601 6 13.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12C3.017 12.5523 2.56928 13 2.017 13H0.017C-0.53528 13 -1.017 12.5523 -1.017 12V9C-1.017 7.34315 0.326142 6 2.017 6H8.017C9.67386 6 11.017 7.34315 11.017 9V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z" />
                      </svg>
                    </div>

                    <div className="mb-6 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                    </div>

                    <p className="text-[14px] sm:text-base leading-relaxed text-foreground/80 italic font-light mb-8">
                      "{t.text}"
                    </p>

                    <div className="flex items-center gap-3 border-t border-border/40 pt-6 mt-auto">
                      <div>
                        <p className="font-heading text-base text-foreground font-medium">{t.name}</p>
                        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] text-accent mt-0.5">{t.city}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <FilterBar
          currentFilters={filters}
          onFiltersChange={setFilters}
          resultCount={products.length}
          sort={sort}
          onSortChange={setSort}
          pageType="all"
        />

        <ScrollReveal>
          <ProductGrid products={products} loading={loading} />
        </ScrollReveal>

        <ScrollReveal>
          <ExpertGuidance />
        </ScrollReveal>

      </main>
      <Footer />
    </div>
  );
};

export default Index;
