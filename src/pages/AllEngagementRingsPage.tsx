import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Diamond, ArrowRight } from "@/components/Icons";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useProducts } from "@/hooks/useProducts";
import ring1 from "@/assets/ring-1.jpg";

const SR = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return <div ref={ref} className={`transition-all duration-700 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>{children}</div>;
};

const AllEngagementRingsPage = () => {
  const { products, filters, setFilters, sort, setSort, loading } = useProducts("Rings");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="All Engagement Rings | DiamondJewels" description="Browse our complete collection of engagement rings. Solitaire, halo, vintage and custom designs." keywords={["engagement rings", "diamond rings", "all rings"]} canonical="https://diamondjewels.com/all-engagement-rings" />
      <Header onSearchChange={(q) => setFilters({ search: q })} searchValue={filters.search} />
      <nav className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/engagement-rings">Engagement Rings</Link><span>/</span><span className="text-foreground font-medium">View All</span></nav>

      <section className="page-hero-grid">
        <div className="page-hero-image">
          <img src={ring1} alt="All engagement rings" className="img-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
        </div>
        <div className="page-hero-content">
          <div className="flex items-center gap-3 mb-4"><Diamond className="w-6 h-6 text-accent" /><span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">Complete Collection</span></div>
          <h1 className="font-heading text-4xl sm:text-5xl font-light mb-4">All Engagement Rings</h1>
          <div className="gold-divider mx-0 mb-4" />
          <p className="text-base text-foreground/90 font-medium leading-relaxed mb-7 max-w-lg">
            Discover our entire collection of exquisite engagement rings. From classic solitaires to intricate vintage designs, find the perfect symbol of your love.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#filters" className="btn-gold text-xs"><Diamond className="w-4 h-4" /> View Collection</a>
            <Link to="/bespoke" className="btn-ghost text-xs"><ArrowRight className="w-4 h-4" /> Design Bespoke</Link>
          </div>
        </div>
      </section>

      <FilterBar currentFilters={filters} onFiltersChange={setFilters} resultCount={products.length} sort={sort} onSortChange={setSort} pageType="rings" />
      <SR><ProductGrid products={products} loading={loading} /></SR>
      <Footer />
    </div>
  );
};

export default AllEngagementRingsPage;
