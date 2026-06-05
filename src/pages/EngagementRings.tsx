import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, Heart, Sparkles, Award, Shield } from "@/components/Icons";
import ring1 from "@/assets/ring-1.jpg";
import ring2 from "@/assets/ring-2.jpg";
import ring3 from "@/assets/ring-3.jpg";
import ring5 from "@/assets/ring-5.jpg";
import conciergeBg from "@/assets/concierge_engagement_1778657204860.png";
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

const EngagementRings = () => {
  const features = [
    { icon: <Diamond className="w-5 h-5" />, title: "Certified diamonds", desc: "Every stone is selected for quality and brilliance." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Refined settings", desc: "Solitaires, halos, and trilogy designs with clean lines." },
    { icon: <Award className="w-5 h-5" />, title: "Premium metals", desc: "18K gold and platinum with balanced proportions." },
    { icon: <Heart className="w-5 h-5" />, title: "Bespoke options", desc: "Personalise the ring to match your story." },
  ];

  return (
    <>
      <CategoryPageTemplate
        category="Rings"
        pageType="rings"
        icon={<Diamond className="w-8 h-8" />}
        title="Diamond Engagement Rings"
        description="A curated engagement ring collection with a cleaner, more luxurious presentation by Diamond Jewels. Explore solitaire, halo, vintage, trilogy, and diamond band designs."
        image={ring1}
        canonicalPath="/engagement-rings"
        breadcrumbs={[
          { label: "Jewellery", href: "/jewellery" },
          { label: "Engagement Rings", href: "/engagement-rings" },
        ]}
        features={features}
        expertGuidanceBg={conciergeBg}
      >
        {/* Diamond Quality Guide Section */}
        <section className="py-24 sm:py-32 bg-secondary/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Educational Guide</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground mb-8">Understanding the <span className="italic">Standard of Brilliance</span></h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                  Every Diamond Jewels engagement ring is set with a stone that meets our rigorous criteria for brilliance. We go beyond the traditional 4Cs to ensure your diamond possesses exceptional fire and life.
                </p>
                
                <div className="space-y-6">
                  {[
                    { title: "Cut", desc: "The most important factor, determining how much light the diamond reflects." },
                    { title: "Colour", desc: "We focus on the D-G range for a bright, white appearance." },
                    { title: "Clarity", desc: "Eye-clean stones that ensure no visible inclusions mar the beauty." },
                    { title: "Carat", desc: "Expertly cut to maximize visual size without compromising sparkle." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-border/40 bg-background/50 hover:border-accent/30 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">{idx + 1}</div>
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
              
              <ScrollReveal className="relative lg:order-last order-first">
                <div className="aspect-square rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
                  <img src={ring5} alt="Diamond quality detail" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-6 -left-6 bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-accent/20 shadow-xl">
                  <Award className="w-8 h-8 text-accent mb-2" />
                  <p className="text-[10px] font-bold tracking-widest uppercase">GIA Certified</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* The Bespoke Journey Section */}
        <section className="py-24 sm:py-32 bg-background border-y border-border/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-20">
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">The Custom Process</p>
              <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-6">The Bespoke <span className="italic">Journey</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">From initial sketch to final polish, collaborate with our designers to create a ring that is uniquely yours.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8">
              {[
                { step: "01", title: "Consultation", desc: "Meet with our designers to discuss your vision, diamond preferences, and budget.", image: ring2 },
                { step: "02", title: "Design & CAD", desc: "We create 3D renderings and sketches, refining every detail until it's perfect.", image: ring3 },
                { step: "03", title: "Craftsmanship", desc: "Our master jewellers hand-set your stone into a setting forged just for you.", image: ring1 },
              ].map((item, idx) => (
                <ScrollReveal key={idx} className="group">
                  <div className="relative mb-8 rounded-[2rem] overflow-hidden aspect-[4/5] border border-border/40">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-6 left-6 w-12 h-12 bg-accent text-white flex items-center justify-center font-heading text-xl rounded-full shadow-lg">{item.step}</div>
                  </div>
                  <h3 className="font-heading text-2xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </ScrollReveal>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/bespoke" className="btn-gold px-12 py-5 text-[11px] font-bold tracking-[0.3em]">START YOUR DESIGN</Link>
            </div>
          </div>
        </section>
      </CategoryPageTemplate>

      <ScrollReveal>
        <section className="px-4 sm:px-6 pb-20 -mt-10 relative z-20">
          <div className="max-w-7xl mx-auto rounded-[3rem] border border-border/40 bg-background overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0">
              <motion.img
                src={ring1}
                alt="Engagement Excellence"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            </div>

            <div className="relative z-10 px-8 py-16 sm:px-20 sm:py-24 text-left max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">The Engagement Promise</span>
              </div>
              <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8 tracking-tight leading-tight">
                Designed for a <span className="italic">lifetime of love</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mb-12 leading-relaxed">
                Finding the perfect engagement ring is a journey of discovery. Our experts guide you through every detail, from selecting the finest ethically sourced diamonds to choosing a setting that reflects your unique style and commitment.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link to="/education" className="btn-gold px-10 py-4 text-[10px] font-bold tracking-widest uppercase">
                  ENGAGEMENT GUIDE
                </Link>
                <Link to="/bespoke" className="btn-outline px-10 py-4 text-[10px] font-bold tracking-widest uppercase bg-background/50 backdrop-blur-sm">
                  DESIGN YOUR OWN
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
};

export default EngagementRings;
