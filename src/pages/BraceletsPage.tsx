import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Gem, Shield, Clock, Award, Sparkles, Heart } from "@/components/Icons";
import braceletHero from "@/assets/ring-4.jpg";
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

const BraceletsPage = () => {
  const features = [
    { icon: <Sparkles className="w-5 h-5" />, title: "Tennis Classics", desc: "Seamless rows of brilliant-cut diamonds matched perfectly for color and clarity." },
    { icon: <Shield className="w-5 h-5" />, title: "Secure Clasps", desc: "Double-locking safety mechanisms engineered for reliable daily luxury." },
    { icon: <Award className="w-5 h-5" />, title: "Fluid Drape", desc: "Expertly linked segments crafted in 18K gold and platinum to rest perfectly." },
    { icon: <Clock className="w-5 h-5" />, title: "Bespoke Sizing", desc: "Complimentary size adjustments and lifetime secure inspection service." },
  ];

  return (
    <CategoryPageTemplate
      category="Bracelets"
      pageType="bracelets"
      icon={<Gem className="w-8 h-8" />}
      title="Diamond Bracelets"
      description="Indulge in our exquisite collection of premium diamond bracelets, meticulously handcrafted to exhibit seamless rows of brilliant GIA-certified stones. From timeless tennis bracelets to modern structured bangles."
      image={braceletHero}
      canonicalPath="/bracelets"
      breadcrumbs={[
        { label: "Jewellery", href: "/jewellery" },
        { label: "Bracelets", href: "/bracelets" },
      ]}
      features={features}
    >
      {/* Editorial Guide to Tennis Bracelets */}
      <section className="py-24 sm:py-32 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">The Collection Guide</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8">
              The Art of the <span className="italic">Tennis Bracelet</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Named after the famous 1987 US Open incident, the tennis bracelet is a fundamental cornerstone of any modern high-end jewellery portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <ScrollReveal className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Craftsmanship Standards</span>
              </div>
              <h3 className="font-heading text-3xl font-light">Meticulously matched diamonds</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The beauty of a diamond tennis bracelet lies in its absolute consistency. Unlike single-stone rings, a classic tennis bracelet consists of anywhere between 45 and 60 individual brilliant-cut diamonds.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our master artisans spend hours hand-selecting and grading every individual stone, matching them to exact parameters of color, clarity, and dimensions. This ensures a fluid, contiguous ribbon of white fire that wraps seamlessly around your wrist without dark spots or mismatched stones.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  "Individually hand-matched GIA/IGI certified stones",
                  "Solid 18K white, yellow, rose gold, and 950 platinum settings",
                  "Double-locking safety clasp for active security",
                  "Complimentary custom link adjustment for the perfect snug drape"
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
                <img src={ring1} alt="Seamless luxury diamond bracelet" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background/90 backdrop-blur-md p-6 rounded-2xl border border-accent/20 shadow-xl">
                <Sparkles className="w-6 h-6 text-accent mb-2" />
                <p className="text-[10px] font-bold tracking-widest uppercase">GIA Certified Sparkle</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Sizing & Styling Guide */}
      <section className="py-24 sm:py-32 bg-background border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-border/40 shadow-2xl">
                <img src={ring2} alt="Bracelet sizing styling" className="w-full h-full object-cover" />
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Concierge Advice</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8 leading-tight">
                How to select <span className="italic">the perfect fit</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Finding the ideal size for a diamond bracelet ensures comfortable wear and secure daily movement. The classic fit rules dictate that you should be able to slip one finger comfortably between the bracelet and your wrist.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Active drape fit", desc: "A slightly loose drape that glides smoothly along the lower wrist — popular for evening styling." },
                  { title: "Bespoke contour styling", desc: "A close-to-skin snug fit ensuring the bracelet stays firmly above the wrist joint, limiting movement — highly recommended for daily wear." },
                  { title: "Complimentary size adjustments", desc: "We offer complimentary length removal and addition at the time of purchase to guarantee absolute satisfaction." }
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

export default BraceletsPage;
