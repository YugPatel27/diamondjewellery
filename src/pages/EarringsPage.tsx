import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Sparkles, Shield, Clock, Award, Diamond, Heart } from "@/components/Icons";
import earringHero from "@/assets/ring-3.jpg";
import ring1 from "@/assets/ring-1.jpg";
import ring2 from "@/assets/ring-2.jpg";
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

const EarringsPage = () => {
  const features = [
    { icon: <Diamond className="w-5 h-5" />, title: "Perfect Pairs", desc: "Carefully matched stones for identical color, clarity, dimensions, and visual fire." },
    { icon: <Shield className="w-5 h-5" />, title: "Comfort Posts", desc: "Hypoallergenic 18K gold and platinum components engineered for all-day luxury wear." },
    { icon: <Award className="w-5 h-5" />, title: "Artisanal Settings", desc: "Classic studs, halos, and dangles, hand-forged to capture light from every angle." },
    { icon: <Clock className="w-5 h-5" />, title: "Lifetime Service", desc: "Complimentary professional post checks, secure prong tightening, and ultrasonic spas." },
  ];

  return (
    <CategoryPageTemplate
      category="Earrings"
      pageType="earrings"
      icon={<Sparkles className="w-8 h-8" />}
      title="Diamond Earrings"
      description="Stunning diamond earrings crafted with absolute precision. Discover our carefully matched solitaire studs, brilliant halo dangles, and structured hoop settings, certified by GIA and IGI."
      image={earringHero}
      canonicalPath="/earrings"
      breadcrumbs={[
        { label: "Jewellery", href: "/jewellery" },
        { label: "Earrings", href: "/earrings" },
      ]}
      features={features}
    >
      {/* Editorial Guide to Diamond Studs */}
      <section className="py-24 sm:py-32 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">The Style Guide</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8">
              Choosing Your <span className="italic">Diamond Studs</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Timeless, elegant, and versatile. The perfect pair of diamond studs is the foundation of every sophisticated fine jewellery wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <ScrollReveal className="relative order-last md:order-first">
              <div className="aspect-square rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring1} alt="Brilliant pair of solitaire diamond studs" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-md p-6 rounded-2xl border border-accent/20 shadow-xl">
                <Sparkles className="w-6 h-6 text-accent mb-2" />
                <p className="text-[10px] font-bold tracking-widest uppercase">GIA Certified Pairs</p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">The Matching Process</span>
              </div>
              <h3 className="font-heading text-3xl font-light">The art of the perfect match</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Finding two identical diamonds is exponentially harder than selecting a single stone for a ring. In studs, the stones rest side by side — meaning color discrepancies, clarity differences, or cut variations are instantly visible.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                At Diamond Jewels, we employ a meticulous pairing protocol. Every pair is curated by a master gemologist, who cross-references GIA certificates to ensure they match perfectly in cut precision, visual size, facet alignment, and light return, creating a harmonious pair that radiates perfectly together.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  "Solitaire studs in 4-prong and 3-prong martinis",
                  "Luminous halo drops that cascade light downward",
                  "Scintillating huggies and structured hoop configurations",
                  "Lifetime secure screwbacks and friction posts"
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

      {/* Setting Choices Guide */}
      <section className="py-24 sm:py-32 bg-background border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Setting Styles</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground leading-tight">
                Setting options that <span className="italic">define your style</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The setting style you choose doesn't just hold the diamond in place — it influences the light return, profile, and visual weight of the earrings on your ears.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Prong martini settings", desc: "Sits flush and low in the ear canal, minimizing the gap and pointing the diamond directly forward — highly reflective." },
                  { title: "Basket settings", desc: "Features flat bottom surfaces that sit upright against the earlobe. The classic, traditional selection." },
                  { title: "Brilliant halo drops", desc: "Encircles each centre stone with small micro-pave diamonds, dramatically enlarging the visual presence." }
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
                <Link to="/customer-service" className="btn-outline px-10 py-4 text-[10px] font-bold tracking-widest uppercase bg-background/50">
                  CONSULT GIA EXPERT
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring2} alt="Setting profiles" className="w-full h-full object-cover" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </CategoryPageTemplate>
  );
};

export default EarringsPage;
