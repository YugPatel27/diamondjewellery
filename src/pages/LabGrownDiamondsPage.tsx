import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Gem, Shield, Sparkles, Award, Diamond } from "@/components/Icons";
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

const LabGrownDiamondsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "GIA / IGI Certified", desc: "Lab grown diamonds graded to the same rigorous standards as natural stones." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Identical Brilliance", desc: "Chemically, physically and optically identical to natural diamonds." },
    { icon: <Award className="w-5 h-5" />, title: "More Carat for Value", desc: "Exceptional size and sparkle for a fraction of the natural diamond price." },
    { icon: <Gem className="w-5 h-5" />, title: "Ethical Choice", desc: "Traceable, conflict-free, with a significantly reduced environmental footprint." },
  ];

  const comparison = [
    { feature: "Chemical composition", natural: "Carbon (crystalline)", lab: "Carbon (crystalline)" },
    { feature: "Hardness (Mohs)", natural: "10 — hardest known", lab: "10 — hardest known" },
    { feature: "Refractive index", natural: "2.417", lab: "2.417" },
    { feature: "GIA / IGI certified", natural: "✓ Yes", lab: "✓ Yes" },
    { feature: "Formation time", natural: "Billions of years", lab: "6 – 10 weeks" },
    { feature: "Origin traceability", natural: "Variable", lab: "Fully traceable" },
    { feature: "Price per carat", natural: "Higher", lab: "30–50% less" },
  ];

  return (
    <CategoryPageTemplate
      category={null}
      pageType="diamonds"
      type="lab"
      icon={<Gem className="w-8 h-8" />}
      title="Lab Grown Diamonds"
      description="Explore lab grown diamonds that deliver the same beauty, chemistry and brilliance as natural stones — certified by GIA and IGI — with exceptional value and a traceable, ethical origin."
      image={ring1}
      canonicalPath="/lab-grown-diamonds"
      breadcrumbs={[
        { label: "Diamonds", href: "/diamonds" },
        { label: "Lab Grown Diamonds", href: "/lab-grown-diamonds" },
      ]}
      features={features}
    >
      {/* Science section */}
      <section className="py-24 sm:py-32 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">The Science</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8 leading-tight">
                Real diamonds. <span className="italic">Different origin.</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Lab grown diamonds are not simulants — they are genuine diamonds in every scientific sense. Created using two advanced processes, HPHT (High Pressure High Temperature) and CVD (Chemical Vapour Deposition), they replicate the exact conditions deep within the Earth that form natural diamonds.
              </p>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                The result is a stone with identical optical, chemical, thermal and physical properties to a mined diamond. The only difference is that it takes weeks in a laboratory rather than billions of years underground.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every lab grown diamond at Diamond Jewels is independently certified by GIA or IGI and graded on the same 4Cs scale — Cut, Colour, Clarity and Carat — giving you complete confidence in your purchase.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring2} alt="Lab grown diamond detail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-accent">CVD & HPHT Technology</p>
                  <p className="text-sm font-light">Grown under precise conditions that mirror nature's process.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 sm:py-32 bg-background border-t border-border/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">Side by Side</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-light text-foreground">
              Lab Grown vs <span className="italic">Natural Diamonds</span>
            </h2>
          </div>

          <ScrollReveal>
            <div className="overflow-hidden rounded-[2rem] border border-border/40">
              <div className="grid grid-cols-3 bg-accent/5 border-b border-border/40">
                <div className="p-5 text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Feature</div>
                <div className="p-5 text-[10px] font-bold tracking-widest uppercase text-foreground border-l border-border/40">Natural Diamond</div>
                <div className="p-5 text-[10px] font-bold tracking-widest uppercase text-accent border-l border-border/40">Lab Grown Diamond</div>
              </div>
              {comparison.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-border/30 ${i % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                  <div className="p-5 text-sm text-muted-foreground">{row.feature}</div>
                  <div className="p-5 text-sm border-l border-border/30">{row.natural}</div>
                  <div className="p-5 text-sm border-l border-border/30 text-accent font-medium">{row.lab}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="mt-12 text-center">
            <Link to="/education" className="btn-gold px-12 py-4 text-[10px] font-bold tracking-widest uppercase">
              FULL DIAMOND EDUCATION GUIDE
            </Link>
          </div>
        </div>
      </section>

      {/* Environmental section */}
      <section className="py-24 sm:py-32 bg-secondary/10 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring3} alt="Ethical diamonds" className="w-full h-full object-cover" />
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Ethical Credentials</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8 leading-tight">
                A diamond you can feel <span className="italic">proud to wear</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Lab grown diamonds require no mining, no displacement of soil, and no associated humanitarian concerns. They are 100% conflict-free, traceable from creation to setting, and carry full certification.
              </p>
              <div className="space-y-4">
                {[
                  { title: "No mining required", desc: "Zero land disruption or ecosystem damage from extraction." },
                  { title: "Fully conflict-free", desc: "Complete chain of custody traceability from laboratory to your finger." },
                  { title: "Same resale value dynamics", desc: "Priced transparently based on the 4Cs, just like natural diamonds." },
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-background/50 hover:border-accent/30 transition-colors">
                    <Diamond className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </CategoryPageTemplate>
  );
};

export default LabGrownDiamondsPage;
