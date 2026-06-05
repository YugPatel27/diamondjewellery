import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Sparkles, Gem, Heart, Award, Shield } from "@/components/Icons";
import gemstonesHero from "@/assets/gemstones-banner.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const GemstonesPage = () => {
  const features = [
    { icon: <Sparkles className="w-5 h-5" />, title: "Vibrant Spectrum", desc: "A curated selection of sapphires, emeralds, and rubies of exceptional color grade." },
    { icon: <Gem className="w-5 h-5" />, title: "Natural Precision", desc: "Every gemstone is hand-selected and verified for its unique natural brilliance." },
    { icon: <Award className="w-5 h-5" />, title: "Ethical Origins", desc: "We source our gemstones from responsible mines committed to ethical practices." },
    { icon: <Shield className="w-5 h-5" />, title: "Lifetime Care", desc: "Professional cleaning and inspection to keep your vibrant pieces glowing." },
  ];

  return (
    <>
      <CategoryPageTemplate
        category="Gemstones"
        pageType="all"
        icon={<Gem className="w-8 h-8" />}
        title="Precious Gemstones"
        description="Illuminate your collection with the deep hues of nature's finest treasures. Featuring hand-selected sapphires, emeralds, and rubies, each set within our signature brilliant diamond surrounds."
        image={gemstonesHero}
        canonicalPath="/gemstones"
        breadcrumbs={[
          { label: "Jewellery", href: "/jewellery" },
          { label: "Gemstones", href: "/gemstones" },
        ]}
        features={features}
      />
      
      <ScrollReveal>
        <section className="px-4 sm:px-6 pb-20 -mt-10 relative z-20">
          <div className="max-w-7xl mx-auto rounded-[3rem] border border-border/40 bg-background overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0">
              <motion.img
                src={gemstonesHero}
                alt="Gemstones Promise"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            </div>

            <div className="relative z-10 px-8 py-16 sm:px-20 sm:py-24 text-left max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">The Promise</span>
              </div>
              <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8 tracking-tight leading-tight">
                Every stone <span className="italic">selected for brilliance</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mb-12 leading-relaxed">
                Every gemstone in our collection is ethically sourced and verified by international laboratories for authenticity, color grade, and origin.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link to="/education" className="btn-gold px-10 py-4 text-[10px] font-bold tracking-widest uppercase">
                  LEARN ABOUT GEMSTONES
                </Link>
                <Link to="/customer-service" className="btn-outline px-10 py-4 text-[10px] font-bold tracking-widest uppercase bg-background/50 backdrop-blur-sm">
                  CONSULT AN EXPERT
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
};

export default GemstonesPage;
