import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, Heart, Sparkles, Award } from "@/components/Icons";
import ring1 from "@/assets/ring-1.jpg";
import ring2 from "@/assets/ring-2.jpg";
import ring3 from "@/assets/ring-3.jpg";
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

const WeddingRingsPage = () => {
  const features = [
    { icon: <Heart className="w-5 h-5" />, title: "Matching sets", desc: "Balanced pairings for couples who want a unified look." },
    { icon: <Diamond className="w-5 h-5" />, title: "Comfort fit", desc: "Designed to feel natural for everyday wear." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Custom engraving", desc: "Add a personal note to your rings." },
    { icon: <Award className="w-5 h-5" />, title: "Premium metals", desc: "From yellow gold to platinum finishes." },
  ];

  return (
    <CategoryPageTemplate
      category="Rings"
      pageType="rings"
      icon={<Heart className="w-8 h-8" />}
      title="Wedding Bands & Rings"
      description="Discover our collection of handcrafted wedding rings, from classic bands to modern designs, tailored for a lifetime of commitment."
      image={ring2}
      canonicalPath="/wedding-rings"
      breadcrumbs={[
        { label: "Jewellery", href: "/jewellery" },
        { label: "Wedding Rings", href: "/wedding-rings" },
      ]}
      features={features}
    >
      {/* The Metals Guide Section */}
      <section className="py-24 sm:py-32 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">Material Selection</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8">Choose your <span className="italic">Lustre</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">Selecting the right metal is as important as the design itself. Each of our precious metals offers unique properties of durability, colour, and feel.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Platinum", desc: "The rarest and most durable metal, naturally white and hypoallergenic.", color: "#e5e7eb" },
              { title: "White Gold", desc: "A modern classic, rhodium-plated for a brilliant, reflective finish.", color: "#f3f4f6" },
              { title: "Yellow Gold", desc: "Traditional and warm, our 18k yellow gold offers a timeless glow.", color: "#fbbf24" },
              { title: "Rose Gold", desc: "Romantic and contemporary, with a delicate pink hue from copper alloys.", color: "#fca5a5" },
            ].map((metal, idx) => (
              <ScrollReveal key={idx} className="bg-background/80 backdrop-blur-sm p-8 rounded-3xl border border-border/40 text-center hover:border-accent/40 transition-all">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 shadow-inner border border-black/5" style={{ background: metal.color }} />
                <h4 className="font-heading text-xl mb-3">{metal.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{metal.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Art of the Perfect Pair Section */}
      <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Design Synergy</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8 leading-tight">The Art of the <span className="italic">Perfect Pair</span></h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                We specialise in creating wedding bands that harmonise perfectly with your engagement ring. Whether it's a curved band that hugs a solitaire or a matching set for both partners, our designs focus on balance, proportion, and comfort.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 flex-shrink-0 bg-accent/5 rounded-2xl flex items-center justify-center text-accent"><Sparkles className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-heading text-xl mb-2">Matching Silhouettes</h4>
                    <p className="text-sm text-muted-foreground">Bands designed to sit flush against your engagement ring setting, preventing wear and ensuring a seamless look.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 flex-shrink-0 bg-accent/5 rounded-2xl flex items-center justify-center text-accent"><Award className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-heading text-xl mb-2">Couple's Coordination</h4>
                    <p className="text-sm text-muted-foreground">Complimentary designs for him and her that share a design DNA while reflecting individual personality.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border/40"><img src={ring1} alt="Wedding band detail 1" className="w-full h-full object-cover" /></div>
                <div className="aspect-square rounded-2xl overflow-hidden border border-border/40"><img src={ring2} alt="Wedding band detail 2" className="w-full h-full object-cover" /></div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-square rounded-2xl overflow-hidden border border-border/40"><img src={ring3} alt="Wedding band detail 3" className="w-full h-full object-cover" /></div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border/40"><img src={ring4} alt="Wedding band detail 4" className="w-full h-full object-cover" /></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Engraving & Personalization Section */}
      <section className="py-24 sm:py-32 bg-secondary/10 text-center border-t border-border/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <ScrollReveal>
            <Heart className="w-12 h-12 text-accent mx-auto mb-8" />
            <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8">A Message <span className="italic">Within</span></h2>
            <p className="text-muted-foreground text-lg mb-12">
              Make your rings truly timeless with our complimentary engraving service. Add a date, a name, or a secret message that only the two of you share.
            </p>
            <Link to="/bespoke" className="text-[11px] font-bold tracking-[0.3em] uppercase text-accent border-b border-accent pb-2 hover:text-accent/70 transition-colors">DISCOVER PERSONALISATION</Link>
          </ScrollReveal>
        </div>
      </section>
    </CategoryPageTemplate>
  );
};

export default WeddingRingsPage;
