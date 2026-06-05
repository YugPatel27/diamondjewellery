import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useProducts } from "@/hooks/useProducts";
import { defaultFilters } from "@/data/products";
import { Sparkles, Diamond, ArrowRight } from "@/components/Icons";
import ExpertGuidance from "@/components/ExpertGuidance";
import { motion } from "framer-motion";
import { getProductImage, getProductPrimaryImage } from "@/lib/productImages";

interface CategoryPageTemplateProps {
  category?: string | null;
  pageType?: "rings" | "necklaces" | "earrings" | "bracelets" | "diamonds" | "all";
  style?: string;
  type?: string;
  icon: ReactNode;
  title: string;
  description: string;
  image: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  features?: Array<{ icon: ReactNode; title: string; desc: string }>;
  canonicalPath?: string;
  children?: ReactNode;
  hideExpertGuidance?: boolean;
  expertGuidanceBg?: string;
}

const ScrollReveal = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
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
      className={`transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
};

export const CategoryPageTemplate = ({
  category,
  pageType,
  style,
  type,
  icon,
  title,
  description,
  image,
  breadcrumbs,
  features,
  canonicalPath,
  children,
  hideExpertGuidance = false,
  expertGuidanceBg,
}: CategoryPageTemplateProps) => {
  const categoryFilter = category && category !== "all" ? category : undefined;
  const resolvedPageType = pageType ?? (categoryFilter === "Rings" ? "rings" : categoryFilter === "Necklaces" ? "necklaces" : categoryFilter === "Earrings" ? "earrings" : "all");
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, filters, setFilters, sort, setSort } = useProducts(categoryFilter);
  const hasInitializedFilters = useRef(false);

  useEffect(() => {
    const newFilters: Partial<typeof filters> = {};
    const urlStyle = style ?? searchParams.get("style");
    const urlType = type ?? searchParams.get("type");
    if (urlStyle) newFilters.style = urlStyle as any;
    if (urlType) newFilters.diamondType = urlType as any;

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minCaratParam = searchParams.get("minCarat");
    const maxCaratParam = searchParams.get("maxCarat");

    if (minPriceParam || maxPriceParam) {
      const minPrice = minPriceParam ? Math.max(defaultFilters.priceRange[0], Number(minPriceParam)) : defaultFilters.priceRange[0];
      const maxPrice = maxPriceParam ? Math.min(defaultFilters.priceRange[1], Number(maxPriceParam)) : defaultFilters.priceRange[1];
      newFilters.priceRange = [Math.min(minPrice, maxPrice), Math.max(minPrice, maxPrice)];
    }

    if (minCaratParam || maxCaratParam) {
      const minCarat = minCaratParam ? Math.max(defaultFilters.caratRange[0], Number(minCaratParam)) : defaultFilters.caratRange[0];
      const maxCarat = maxCaratParam ? Math.min(defaultFilters.caratRange[1], Number(maxCaratParam)) : defaultFilters.caratRange[1];
      newFilters.caratRange = [Math.min(minCarat, maxCarat), Math.max(minCarat, maxCarat)];
    }

    if (Object.keys(newFilters).length > 0 && !hasInitializedFilters.current) {
      setFilters(newFilters);
      hasInitializedFilters.current = true;
    }
  }, [style, type, searchParams, setFilters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.style) params.set("style", filters.style);
    if (filters.diamondType) params.set("type", filters.diamondType);
    if (filters.priceRange[0] > defaultFilters.priceRange[0]) params.set("minPrice", filters.priceRange[0].toString());
    if (filters.priceRange[1] < defaultFilters.priceRange[1]) params.set("maxPrice", filters.priceRange[1].toString());
    if (filters.caratRange[0] > defaultFilters.caratRange[0]) params.set("minCarat", filters.caratRange[0].toString());
    if (filters.caratRange[1] < defaultFilters.caratRange[1]) params.set("maxCarat", filters.caratRange[1].toString());
    if (filters.search) params.set("search", filters.search);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const canonical = canonicalPath ?? (categoryFilter ? `/${categoryFilter.toLowerCase()}` : "/bracelets");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${title} | Diamond Jewels`}
        description={description}
        canonical={`https://diamondjewels.com${canonical}`}
        breadcrumbs={breadcrumbs.map(b => ({
          name: b.label,
          item: `https://diamondjewels.com${b.href}`,
        }))}
      />
      <Header onSearchChange={(q) => setFilters({ search: q })} searchValue={filters.search} />

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center">
            <span className="mx-2 text-muted-foreground/50">/</span>
            {idx === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">{crumb.label}</span>
            ) : (
              <Link to={crumb.href}>{crumb.label}</Link>
            )}
          </div>
        ))}
      </nav>

      <section className="relative w-full overflow-hidden">
        <div className="relative h-[70vh] sm:h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-&lsqb;10000ms&rsqb; ease-out hover:scale-110"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background" />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6">
            <div className="max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6 inline-flex items-center gap-4 text-accent justify-center w-full"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 backdrop-blur-md shadow-[0_0_30px_rgba(212,155,23,0.3)]">
                  {icon}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/90 drop-shadow-md">Exquisite Collection</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-heading text-5xl font-light tracking-tight text-white sm:text-7xl xl:text-8xl mb-8 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto max-w-2xl text-base leading-relaxed text-white sm:text-lg sm:leading-relaxed mb-12 drop-shadow-md"
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6"
              >
                <a href="#products" className="btn-gold px-12 py-4 text-xs font-bold tracking-[0.3em] uppercase bg-accent hover:bg-accent/90 text-white border-none">
                  Explore The Edit
                </a>
                <Link to="/bespoke" className="group flex items-center gap-3 px-10 py-4 border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/60 rounded-full transition-all duration-500 text-[11px] font-bold tracking-[0.3em] uppercase text-white backdrop-blur-md">
                  <Diamond className="w-4 h-4" />
                  Custom Design
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 text-white/40">
            <span className="text-[9px] font-bold uppercase tracking-[0.5em]">Scroll to discover</span>
            <div className="h-12 w-px bg-gradient-to-b from-accent to-transparent" />
          </div>
        </div>
      </section>


      <div id="products" className="scroll-mt-24">
        <FilterBar
          currentFilters={filters}
          resultCount={products.length}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          pageType={resolvedPageType}
        />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <ScrollReveal>
            <ProductGrid products={products} loading={loading} />
          </ScrollReveal>
        </main>
      </div>

      {children}

      {!hideExpertGuidance && <ExpertGuidance backgroundImage={expertGuidanceBg} />}

      {features && features.length > 0 && (
        <section className="py-20 bg-background border-t border-border/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
              {features.map((feature, idx) => (
                <div key={idx} className="text-center group">
                  <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-accent/5 flex items-center justify-center border border-accent/10 transition-all duration-500 group-hover:bg-accent group-hover:text-white">
                    <span className="text-accent group-hover:text-white transition-colors">
                      {feature.icon}
                    </span>
                  </div>
                  <h4 className="font-heading text-xl font-light mb-4">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {!loading && products.length > 0 && (
        <section className="bg-secondary/30 py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent mb-3">Recommended for you</p>
              <h2 className="font-heading text-4xl font-light text-foreground">You May Also Like</h2>
              <div className="gold-divider mt-6" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {/* Show top 4 products or similar products */}
              {products.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-border/50 p-6 transition-all duration-500 group-hover:shadow-xl group-hover:border-accent/30 group-hover:-translate-y-2">
                    <img
                      src={getProductPrimaryImage(product)}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getProductImage(product, 1);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-5 text-center px-2">
                    <h3 className="font-heading text-sm font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{product.style}</p>
                    <p className="mt-2 text-sm font-bold text-accent">₹{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* User Trust & Benefits Section - Only show if custom features aren't provided */}
      {(!features || features.length === 0) && (
        <section className="py-20 bg-background border-t border-border/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
              <div className="text-center group">
                <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-accent/5 flex items-center justify-center border border-accent/10 transition-all duration-500 group-hover:bg-accent group-hover:text-white">
                  <Diamond className="w-8 h-8 text-accent group-hover:text-white" />
                </div>
                <h4 className="font-heading text-xl font-light mb-4">Ethically Sourced</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Every stone is conflict-free and ethically sourced, certified by international standards.</p>
              </div>
              <div className="text-center group">
                <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-accent/5 flex items-center justify-center border border-accent/10 transition-all duration-500 group-hover:bg-accent group-hover:text-white">
                  <ArrowRight className="w-8 h-8 text-accent rotate-[-45deg] group-hover:text-white" />
                </div>
                <h4 className="font-heading text-xl font-light mb-4">Secured Shipping</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Fully insured delivery to your doorstep, handled with the utmost care and security.</p>
              </div>
              <div className="text-center group">
                <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-accent/5 flex items-center justify-center border border-accent/10 transition-all duration-500 group-hover:bg-accent group-hover:text-white">
                  <Sparkles className="w-8 h-8 text-accent group-hover:text-white" />
                </div>
                <h4 className="font-heading text-xl font-light mb-4">Lifetime Warranty</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">We stand behind our craftsmanship with a lifetime guarantee and complimentary cleaning services.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};
