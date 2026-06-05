import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Gem, Shield, Clock, Award, Sparkles, Heart } from "@/components/Icons";
import necklaceHero from "@/assets/ring-5.jpg";
import conciergeBg from "@/assets/concierge_necklaces_luxury_1778657969335.png";
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

const NecklacesPage = () => {
  const features = [
    { icon: <Sparkles className="w-5 h-5" />, title: "Radiant Pendants", desc: "Hand-selected solitaire diamonds and brilliant halo frames that command attention." },
    { icon: <Shield className="w-5 h-5" />, title: "Secure Settings", desc: "Expertly engineered claw and bezel settings ensuring ultimate stone protection." },
    { icon: <Award className="w-5 h-5" />, title: "Adjustable Chains", desc: "Highly robust platinum and gold chains featuring multiple secure jump rings." },
    { icon: <Clock className="w-5 h-5" />, title: "Concierge Care", desc: "Lifetime complimentary professional ultrasonic cleaning and prong check-ups." },
  ];

  return (
    <CategoryPageTemplate
      category="Necklaces"
      pageType="necklaces"
      icon={<Gem className="w-8 h-8" />}
      title="Diamond Necklaces"
      description="Exquisite diamond necklaces designed to lay perfectly and command attention. Discover our GIA certified solitaires, glowing halo pendants, and breathtaking bespoke statement pieces."
      image={necklaceHero}
      canonicalPath="/necklaces"
      breadcrumbs={[
        { label: "Jewellery", href: "/jewellery" },
        { label: "Necklaces", href: "/necklaces" },
      ]}
      features={features}
      expertGuidanceBg={conciergeBg}
    >
      {/* Editorial Guide to Pendants */}
      <section className="py-24 sm:py-32 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">The Style Guide</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8">
              Pendant Styles and <span className="italic">Proportions</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From subtle everyday sophistication to spectacular red-carpet statements, the right pendant showcases a diamond's ultimate fire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <ScrollReveal className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Anatomy of the Pendant</span>
              </div>
              <h3 className="font-heading text-3xl font-light">Precision alignment and balance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A diamond pendant requires perfect balance. The stone must hang perfectly straight, resting flat against the collarbone without twisting or turning as you move.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                At Diamond Jewels, we pay special attention to the bail (the link through which the chain passes) and the distribution of weight in the setting. By balancing the depth of the basket with the bail's pivot point, our pendants stay perfectly forward-facing, maintaining optimal light capture and visual alignment throughout the day.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  "Classic 4-prong and bezel solitaire pendants",
                  "Luminous halo surrounds with micro-pave diamonds",
                  "Adjustable 16 to 18-inch signature link chains",
                  "Hypoallergenic nickel-free gold and platinum structures"
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
                <img src={ring1} alt="Exquisite diamond pendant necklace" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background/90 backdrop-blur-md p-6 rounded-2xl border border-accent/20 shadow-xl">
                <Sparkles className="w-6 h-6 text-accent mb-2" />
                <p className="text-[10px] font-bold tracking-widest uppercase">GIA Certified Pendants</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Necklace Length Guidelines */}
      <section className="py-24 sm:py-32 bg-background border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring2} alt="Necklace length guidelines" className="w-full h-full object-cover" />
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Length Selection</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8 leading-tight">
                Selecting the perfect <span className="italic">chain length</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                The length of your necklace defines where the pendant rests, dramatically influencing how it complements your outfits, face shape, and other jewellery layers.
              </p>
              <div className="space-y-4">
                {[
                  { title: "16-inch (choker height)", desc: "Sits gracefully above the collarbone. Perfect for open necklines, crew necks, and delicate layering styling." },
                  { title: "18-inch (princess height)", desc: "The most popular, traditional size. Rests exactly on the collarbone, offering optimal versatility for both casual and formal wear." },
                  { title: "Bespoke adjustable jump rings", desc: "Every Diamond Jewels chain includes double jump rings, allowing you to easily adjust the chain between 16 and 18 inches at home." }
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-secondary/20 hover:border-accent/30 transition-colors">
                    <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
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
                  TALK TO CONCIERGE
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </CategoryPageTemplate>
  );
};

export default NecklacesPage;
