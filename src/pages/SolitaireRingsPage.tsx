import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, Shield, Clock, Award, Sparkles, Heart } from "@/components/Icons";
import ring1 from "@/assets/ring-1.jpg";
import ring2 from "@/assets/ring-2.jpg";
import ring3 from "@/assets/ring-3.jpg";
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

const SolitaireRingsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "GIA Certified", desc: "Independently graded diamonds with laserscribes matching certificates." },
    { icon: <Clock className="w-5 h-5" />, title: "Lifetime Care", desc: "Complimentary structural integrity prongs check-up, resizing and spas." },
    { icon: <Award className="w-5 h-5" />, title: "Artisanal Forging", desc: "Tapered bands in platinum and solid gold, designed to elevate the diamond." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Pure Sparkle", desc: "Classic settings designed to let the maximum amount of light enter the stone." },
  ];

  return (
    <CategoryPageTemplate
      category="Rings"
      pageType="rings"
      style="Solitaire"
      icon={<Diamond className="w-8 h-8" />}
      title="Solitaire Engagement Rings"
      description="The purest expression of devotion. A single, breathtaking GIA-certified diamond takes center stage in platinum, white gold, yellow gold, or rose gold classic prongs settings."
      image={ring1}
      canonicalPath="/solitaire-rings"
      breadcrumbs={[
        { label: "Engagement Rings", href: "/engagement-rings" },
        { label: "Solitaire Rings", href: "/solitaire-rings" },
      ]}
      features={features}
    >
      {/* Editorial Guide to Solitaires */}
      <section className="py-24 sm:py-32 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">Design Philosophy</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8">
              The Essence of the <span className="italic">Solitaire</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Simple yet stunning, the classic solitaire engagement ring is the ultimate celebration of a single diamond's natural-born fire and brilliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <ScrollReveal className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring2} alt="Classic 4-prong solitaire diamond ring" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-md p-6 rounded-2xl border border-accent/20 shadow-xl">
                <Sparkles className="w-6 h-6 text-accent mb-2" />
                <p className="text-[10px] font-bold tracking-widest uppercase">Timeless Elegance</p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Light Return Physics</span>
              </div>
              <h3 className="font-heading text-3xl font-light">Maximized light return</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By definition, a solitaire features no side diamonds. Because there are no surrounding stones or thick metal channels, the diamond is fully exposed to incoming light from every possible angle.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Light enters through the crown (top) and table of the diamond, reflects off the internal pavilion facets, and bounces back to the eye as an explosive display of white brilliance (fire) and colored sparkles (scintillation).
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our classic solitaire settings feature tapered bands and minimalist, hand-filed prongs. This reduces the metal profile to an absolute minimum, ensuring the diamond remains the undisputed center of attention.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  "Traditional four-prong and six-prong configurations",
                  "V-prong settings for sharp corner stones like Princess cuts",
                  "Elegant tapered bands that make the diamond visually pop",
                  "Sleek comfort-fit interior profiles for seamless daily wear"
                ].map(p => (
                  <li key={p} className="flex items-center gap-3 text-xs text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Prong Configuration Guide */}
      <section className="py-24 sm:py-32 bg-background border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Expert Guidance</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8 leading-tight">
                Four prongs or <span className="italic">six prongs?</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                When designing your solitaire ring, the choice between four and six prongs affects both the stone's security and its visual shape.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Four-prong settings", desc: "Shows more of the diamond surface, letting in maximum light. Accentuates the square corners of princess or cushion shapes, and makes round stones look slightly more square." },
                  { title: "Six-prong settings", desc: "Provides ultimate stone security. The surrounding prongs accentuate the roundness of the brilliant cut, maintaining a pristine circular profile." },
                  { title: "Bezel settings", desc: "A continuous band of gold or platinum wrapping all the way around the stone. Extremely secure and offers a very sleek, modern appearance." }
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-secondary/20 hover:border-accent/30 transition-colors">
                    <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-8">
                <Link to="/book-appointment" className="btn-gold px-10 py-4 text-[10px] font-bold tracking-widest uppercase">
                  BOOK APPOINTMENT
                </Link>
                <Link to="/bespoke" className="btn-outline px-10 py-4 text-[10px] font-bold tracking-widest uppercase bg-background/50">
                  DESIGN BESPOKE SOLITAIRE
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring3} alt="Prong setting comparisons" className="w-full h-full object-cover" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </CategoryPageTemplate>
  );
};

export default SolitaireRingsPage;
