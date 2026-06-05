import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Sparkles, Shield, Clock, Award, Diamond, Heart } from "@/components/Icons";
import ring2 from "@/assets/ring-2.jpg";
import ring1 from "@/assets/ring-1.jpg";
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

const HaloRingsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "GIA Certified Center", desc: "All core diamonds independently graded for color, cut, clarity, and dimensions." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Micro-Pavé Precision", desc: "Small surrounding diamonds set under magnification for uniform visual light path." },
    { icon: <Award className="w-5 h-5" />, title: "Premium Metals", desc: "Available in platinum, white gold, yellow gold, and romantic rose gold settings." },
    { icon: <Clock className="w-5 h-5" />, title: "Lifetime Concierge", desc: "Complimentary ultrasonic cleaning, structural checkups, and sizing adjustments." },
  ];

  return (
    <CategoryPageTemplate
      category="Rings"
      pageType="rings"
      style="Halo"
      icon={<Sparkles className="w-8 h-8" />}
      title="Halo Engagement Rings"
      description="A breathtaking halo of brilliant micro-pavé diamonds surrounding a GIA-certified center stone. Designed to dramatically enhance optical sparkle and create a grand, luxurious visual presence."
      image={ring2}
      canonicalPath="/halo-rings"
      breadcrumbs={[
        { label: "Engagement Rings", href: "/engagement-rings" },
        { label: "Halo Rings", href: "/halo-rings" },
      ]}
      features={features}
    >
      {/* Editorial Guide to Halo Settings */}
      <section className="py-24 sm:py-32 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">Design Narrative</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8">
              The Power of the <span className="italic">Halo Setting</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Highly romantic and incredibly brilliant, the halo setting is a masterful demonstration of optical illusion and micro-craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <ScrollReveal className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Brilliance Amplification</span>
              </div>
              <h3 className="font-heading text-3xl font-light">Making the center stone appear larger</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A halo setting surrounds the central diamond with a delicate frame of smaller, brilliant-cut diamonds. This ring of light doesn't just add external sparkle — it tricks the eye into seeing the entire grouping as a single, massive diamond.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Typically, a well-proportioned halo can make a center stone look up to **half a carat larger** than its actual weight. The reflection from the micro-pavé stones bounces back onto the facets of the main diamond, compounding the overall fire, scintillation, and brilliance.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  "Micro-prongs set under high magnification for flawless surface feel",
                  "Perfect height alignment between the center diamond and the halo frame",
                  "Custom metal settings to either match or contrast gold colors",
                  "Available in round, cushion, oval, and pear shaped configurations"
                ].map(p => (
                  <li key={p} className="flex items-center gap-3 text-xs text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring1} alt="Exquisite round halo ring detail" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-md p-6 rounded-2xl border border-accent/20 shadow-xl">
                <Sparkles className="w-6 h-6 text-accent mb-2" />
                <p className="text-[10px] font-bold tracking-widest uppercase">Intense Scintillation</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Shapes & Metal Profiles */}
      <section className="py-24 sm:py-32 bg-background border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring3} alt="Halo ring shapes and variations" className="w-full h-full object-cover" />
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Setting Customizations</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8 leading-tight">
                Variations of the <span className="italic">classic halo</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Depending on your style, you can choose a halo setting that accentuates different aesthetic principles — from vintage romance to crisp geometric modernism.
              </p>
              <div className="space-y-4">
                {[
                  { title: "The hidden halo", desc: "A subtle ring of diamonds set right beneath the main stone's girdle, visible only from the side. Adds a charming secret sparkle." },
                  { title: "Double halo", desc: "Two concentric rings of micro-pavé diamonds wrapping the central stone. The ultimate choice for a dramatic, vintage-glamour visual size." },
                  { title: "Contrast gold options", desc: "Setting a white diamond in a pink gold halo or a yellow gold band to create striking multi-colored depth." }
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-secondary/20 hover:border-accent/30 transition-colors">
                    <Diamond className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
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
                  DESIGN BESPOKE HALO
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </CategoryPageTemplate>
  );
};

export default HaloRingsPage;
