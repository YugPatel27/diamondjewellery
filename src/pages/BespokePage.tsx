import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { SEOHead } from "@/components/SEOHead";
import { Palette, Diamond, Gem, Heart, ArrowRight, Sparkles, Star, ChevronRight } from "@/components/Icons";
import { Link } from "react-router-dom";
import ring3 from "@/assets/ring-3.jpg";

import { motion } from "framer-motion";

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

const steps = [
  { icon: <Diamond className="w-8 h-8" />, title: "Diamond Curation", desc: "Select from our vault of certified natural or lab-grown diamonds, hand-selected by our master gemologists for exceptional brilliance." },
  { icon: <Palette className="w-8 h-8" />, title: "Artisanal Vision", desc: "Collaborate with our designers to sketch your unique setting. We provide detailed 3D renderings to perfect every facet before crafting." },
  { icon: <Gem className="w-8 h-8" />, title: "Master Craftsmanship", desc: "Our jewellers in London hand-forge your piece with centuries of precision. A process of 4-8 weeks dedicated to excellence." },
  { icon: <Heart className="w-8 h-8" />, title: "The Unveiling", desc: "Your creation arrives in bespoke luxury packaging with full GIA/IGI certification, BIS Hallmarking, and a lifetime service guarantee." },
];

import bespokeBanner from "@/assets/bespoke-banner.png";

const BespokePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Bespoke Jewellery Design | Diamond Jewels"
        description="Create your unique custom jewellery piece. Expert designers craft bespoke rings and jewellery from concept to creation with lifetime warranty."
        keywords={["bespoke jewellery", "custom jewelry", "custom rings", "custom design", "personalized jewelry", "handcrafted jewelry", "jewellery design"]}
        canonical="https://diamondjewels.com/bespoke"
      />
      <AnimatedBackground type="bespoke" />
      <Header />

      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">Bespoke Journey</span>
      </nav>

      <section className="px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm shadow-2xl shadow-black/5">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <motion.div
              className="order-2 lg:order-1 relative min-h-[400px] sm:h-[550px] lg:h-[700px] overflow-hidden"
              whileHover="hover"
              initial="initial"
            >
              <motion.img
                src={ring3}
                alt="Bespoke Jewelry Design"
                className="w-full h-full object-cover"
                variants={{
                  initial: { scale: 1, filter: "brightness(1) contrast(1)" },
                  hover: { scale: 1.05, filter: "brightness(1.1) contrast(1.05)" }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
            </motion.div>
            <div className="order-1 lg:order-2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 sm:py-20 bg-gradient-to-br from-background via-background to-secondary/20">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-6 h-6 text-accent" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">Personalized Excellence</span>
                </div>
                <h1 className="font-heading text-4xl sm:text-6xl font-light leading-tight mb-6 tracking-tight">
                  Craft Your Forever <span className="italic text-accent">Masterpiece</span>
                </h1>
                <div className="gold-divider mx-0 mb-8 w-32" />
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
                  Transcend the ordinary. Collaborate with our master craftsmen to bring your dream jewellery to life with hand-selected stones and artisanal settings that tell your unique story.
                </p>
                <div className="flex flex-wrap gap-4 mb-12">
                  <a href="#journey" className="btn-gold px-10 py-4 text-[10px] font-bold tracking-widest uppercase">
                    START YOUR JOURNEY
                  </a>
                  <Link to="/book-appointment" className="btn-outline px-10 py-4 text-[10px] font-bold tracking-widest uppercase">
                    <Heart className="w-4 h-4" /> BOOK CONSULTATION
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {[
                    { k: "Custom", v: "1-of-1 Designs" },
                    { k: "Certified", v: "Vault Stones" },
                    { k: "Lifetime", v: "Service Care" },
                  ].map((item) => (
                    <div key={item.k} className="p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{item.k}</p>
                      <p className="text-xs font-semibold text-foreground">{item.v}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="px-6 sm:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-20">
            <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-4">The Process</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-light mb-6 tracking-tight">Your Design Odyssey</h2>
            <div className="gold-divider mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg mt-6">From initial spark to final unveil, we guide you through every facet of creation.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <ScrollReveal key={i} className="group p-10 rounded-[2.5rem] border border-border/40 bg-card/20 hover:border-accent/40 hover:bg-card/40 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 relative">
                <div className="text-accent mb-8 group-hover:scale-110 transition-transform duration-500">{s.icon}</div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/50 mb-4">Phase 0{i + 1}</p>
                <h3 className="font-heading text-2xl font-light mb-4">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && <ChevronRight className="absolute top-1/2 -right-4 w-8 h-8 text-accent/10 hidden lg:block" />}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-8 py-20 bg-secondary/30 border-y border-border/40">
        <div className="max-w-5xl mx-auto text-center">
          <ScrollReveal>
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-8" />
            <h2 className="font-heading text-4xl sm:text-5xl font-light mb-16 tracking-tight">Why Choose Bespoke?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              <div className="space-y-6">
                <Star className="w-8 h-8 text-accent mx-auto" />
                <h3 className="font-heading text-xl font-medium">True Exclusivity</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">Your design is archived in our records as a 1-of-1 piece, never to be duplicated for another soul.</p>
              </div>
              <div className="space-y-6">
                <Diamond className="w-8 h-8 text-accent mx-auto" />
                <h3 className="font-heading text-xl font-medium">Vault Access</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">Access our private vault of conflict-free diamonds and rare gemstones from ethical sources globally.</p>
              </div>
              <div className="space-y-6">
                <Heart className="w-8 h-8 text-accent mx-auto" />
                <h3 className="font-heading text-xl font-medium">Heritage Quality</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">Crafted using age-old techniques combined with modern precision to ensure a legacy for generations.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 sm:px-8 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto rounded-[3.5rem] border border-border/40 bg-background overflow-hidden shadow-2xl relative group">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <motion.img
              src={bespokeBanner}
              alt="Bespoke Design Journey"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
          </div>

          <div className="relative z-10 px-8 py-16 sm:px-20 sm:py-24 text-left max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Bespoke Design</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl font-light text-foreground mb-8 tracking-tight leading-tight">
              Ready to sculpt <span className="italic">your dream?</span>
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed">
              Book a private design consultation at our London boutique or a virtual session with our lead artisans.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-start items-center">
              <Link to="/book-appointment" className="group relative w-full sm:w-auto px-10 py-5 bg-accent text-accent-foreground font-bold tracking-[0.15em] uppercase text-[11px] rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_10px_30px_rgba(212,155,23,0.3)] hover:-translate-y-1">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  BOOK CONSULTATION <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              <Link to="/" className="btn-outline px-10 py-5 text-[11px] font-bold tracking-widest uppercase bg-background/50 backdrop-blur-sm">
                EXPLORE COLLECTIONS
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BespokePage;
