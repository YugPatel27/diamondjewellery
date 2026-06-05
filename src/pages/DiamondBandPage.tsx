import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Gem, Sparkles, Shield, Heart, ArrowRight } from "@/components/Icons";
import ring4 from "@/assets/ring-4.jpg";
import { Link } from "react-router-dom";
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

const DiamondBandPage = () => {
  const features = [
    { icon: <Sparkles className="w-5 h-5" />, title: "Continuous Glow", desc: "Seamless rows of brilliant-cut diamonds for infinite sparkle and fire." },
    { icon: <Gem className="w-5 h-5" />, title: "Versatile Settings", desc: "Available in claw, grain, and channel settings in 18K gold or platinum." },
    { icon: <Heart className="w-5 h-5" />, title: "Perfect Stacking", desc: "Designed with a low profile to sit flush with your engagement ring." },
    { icon: <Shield className="w-5 h-5" />, title: "Lifetime Assurance", desc: "Complimentary cleaning and inspection for a lifetime of brilliance." },
  ];

  return (
    <CategoryPageTemplate
      category="Rings"
      pageType="rings"
      style="Diamond Band"
      icon={<Gem className="w-8 h-8" />}
      title="Diamond Bands"
      description="An eternity of brilliance — featuring full and half eternity bands meticulously set with hand-selected diamonds. Perfect as engagement rings, anniversary milestones, or refined stackable statements."
      image={ring4}
      canonicalPath="/diamond-band"
      breadcrumbs={[
        { label: "Engagement Rings", href: "/engagement-rings" },
        { label: "Diamond Bands", href: "/diamond-band" },
      ]}
      features={features}
    >
      <ScrollReveal>
        <section className="bg-secondary/20 border-y border-border/30 px-4 sm:px-6 py-16 sm:py-24 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent rounded-full blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Style Guide</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-light text-foreground mb-12 tracking-tight">
              Choosing your <span className="italic">Eternity Band</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div className="group bg-background/60 backdrop-blur-md rounded-[2rem] p-8 sm:p-10 border border-border/40 hover:border-accent/40 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-4 text-foreground">Full Eternity</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Diamonds set all the way around the band — the ultimate symbol of infinite love. These pieces offer a continuous glow from every angle.
                  <span className="block mt-3 text-[11px] font-bold text-accent/80">* Note: Full eternity bands cannot be resized.</span>
                </p>
              </div>

              <div className="group bg-background/60 backdrop-blur-md rounded-[2rem] p-8 sm:p-10 border border-border/40 hover:border-accent/40 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-4 text-foreground">Half Eternity</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Diamonds on the top half of the band — practical, popular, and comfortable for everyday wear. These are ideal for stacking.
                  <span className="block mt-3 text-[11px] font-bold text-accent/80">* Advantage: Half eternity bands can be resized if needed.</span>
                </p>
              </div>
            </div>

            <Link to="/bespoke" className="btn-gold px-12 py-4 text-[11px] font-bold tracking-widest uppercase">
              DESIGN YOUR CUSTOM BAND <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </CategoryPageTemplate>
  );
};

export default DiamondBandPage;
