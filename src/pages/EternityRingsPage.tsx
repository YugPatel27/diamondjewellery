import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, Heart, Sparkles, Award, Shield } from "@/components/Icons";
import ring1 from "@/assets/ring-1.jpg";
import ring2 from "@/assets/ring-2.jpg";
import ring3 from "@/assets/ring-3.jpg";
import ring5 from "@/assets/ring-5.jpg";
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

const EternityRingsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "Certified diamonds", desc: "Full clarity and quality transparency on every stone." },
    { icon: <Diamond className="w-5 h-5" />, title: "Comfort fit", desc: "Designed for everyday wear — perfectly balanced profiles." },
    { icon: <Award className="w-5 h-5" />, title: "Bespoke options", desc: "Choose your metal, profile, and individual stone sizes." },
    { icon: <Heart className="w-5 h-5" />, title: "Lifetime care", desc: "Complimentary resizing, re-rhoduming and cleaning service." },
  ];

  return (
    <CategoryPageTemplate
      category="Rings"
      pageType="rings"
      style="Diamond Band"
      icon={<Diamond className="w-8 h-8" />}
      title="Eternity Rings"
      description="A continuous circle of diamonds symbolising everlasting love. Discover full and half eternity designs crafted in platinum, white gold, yellow gold and rose gold for a lifetime of brilliance."
      image={ring5}
      canonicalPath="/eternity-rings"
      breadcrumbs={[
        { label: "Wedding Rings", href: "/wedding-rings" },
        { label: "Eternity Rings", href: "/eternity-rings" },
      ]}
      features={features}
    >
      {/* Full vs Half Eternity Section */}
      <section className="py-24 sm:py-32 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">Style Guide</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8">
              Full or <span className="italic">Half Eternity?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Both designs are timeless — the choice depends on your lifestyle, comfort preference and the visual weight you desire on the hand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Full Eternity Ring",
                desc: "Diamonds set all the way around the band for 360° of continuous sparkle. A bold, luxurious statement that catches light from every angle — ideal for those who desire maximum brilliance.",
                pros: ["Uninterrupted diamond circle", "Maximum visual impact", "Symmetrical and balanced", "The ultimate symbol of forever"],
                image: ring1,
              },
              {
                title: "Half Eternity Ring",
                desc: "Diamonds set across the top half of the band — typically covering the front five stones. More practical for active lifestyles, and easier to resize after purchase.",
                pros: ["Easier to resize", "More comfortable for active hands", "More affordable for same carat weight", "Pairs beautifully with engagement rings"],
                image: ring2,
              },
            ].map((item) => (
              <ScrollReveal key={item.title} className="rounded-[2.5rem] border border-border/40 overflow-hidden bg-card">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="font-heading text-2xl font-light mb-4">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{item.desc}</p>
                  <ul className="space-y-2">
                    {item.pros.map(p => (
                      <li key={p} className="flex items-center gap-3 text-xs text-foreground/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Symbol of Forever editorial section */}
      <section className="py-24 sm:py-32 bg-background border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring3} alt="Eternity ring detail" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-md p-6 rounded-2xl border border-accent/20 shadow-xl">
                <Sparkles className="w-6 h-6 text-accent mb-2" />
                <p className="text-[10px] font-bold tracking-widest uppercase">Lifetime Warranty</p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">The Meaning</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8 leading-tight">
                A circle with <span className="italic">no beginning</span> and no end
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                The eternity ring is steeped in symbolism. Originally gifted to mark the birth of a first child or a milestone anniversary, today it serves as a beautiful celebration of enduring love — typically worn alongside an engagement ring and wedding band.
              </p>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                Our eternity rings are available in round brilliant, princess, cushion and emerald cuts, set in 18K white gold, yellow gold, rose gold and 950 platinum. Every stone is individually selected and matched for consistent colour, clarity and brilliance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/book-appointment" className="btn-gold px-10 py-4 text-[10px] font-bold tracking-widest uppercase">
                  BOOK A CONSULTATION
                </Link>
                <Link to="/bespoke" className="btn-outline px-10 py-4 text-[10px] font-bold tracking-widest uppercase bg-background/50">
                  DESIGN BESPOKE
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </CategoryPageTemplate>
  );
};

export default EternityRingsPage;
