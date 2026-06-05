import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Diamond, Gem, Scale, Sparkles, Eye, Award, ShieldCheck, ChevronDown, Ruler, HelpCircle, ArrowRight } from "@/components/Icons";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";

// New Generated Images
import diamondsImg from "@/assets/education_diamonds_1778657341173.png";
import craftingImg from "@/assets/jewelry_crafting_macro_1778657399775.png";
import conciergeImg from "@/assets/concierge_general_luxury_1778657530137.png";

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-[0.22, 1, 0.36, 1] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`}>
      {children}
    </div>
  );
};

const guides = [
  {
    icon: <Diamond className="w-8 h-8" />, 
    title: "The Master Guide to Diamonds",
    desc: "A comprehensive journey through the 4 C's, certification, and the secrets of choosing brilliant stones.",
    image: diamondsImg,
    sections: [
      { heading: "Understanding the 4 C's", text: "Diamonds are graded on four key factors: Cut, Clarity, Color, and Carat weight. These standards were established by GIA and are used worldwide." },
      { heading: "Cut — The Soul of Brilliance", text: "Cut determines how well light is reflected. An Excellent cut grade means maximum brilliance and fire. Prioritise cut quality over carat size." },
      { heading: "Clarity — Nature's Fingerprint", text: "Clarity measures natural inclusions. VS1-VS2 grades are excellent value as inclusions are invisible to the naked eye." },
      { heading: "Color — The Spectrum of Purity", text: "Diamond color ranges from D (colourless) to Z. D-F are most valuable; G-J offer near-colourless appearance at better prices." },
    ],
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />, 
    title: "Heritage & Certification",
    desc: "Understanding the standards of authenticity: Independent labs and BIS Hallmarking.",
    image: craftingImg,
    sections: [
      { heading: "The Independent Verdict", text: "A diamond certificate from GIA or IGI is your shield against misrepresentation and guaranteed quality." },
      { heading: "BIS Hallmarking", text: "BIS Hallmark is the Indian government's guarantee of gold purity. It certifies your 18K or 22K gold exactly as promised." },
      { heading: "The Jewels Promise", text: "Every piece comes with dual-layer protection: Independent diamond certification and BIS Hallmarking. No exceptions." },
    ],
  },
  {
    icon: <Gem className="w-8 h-8" />, 
    title: "Natural vs Lab Grown",
    desc: "A modern perspective on chemically identical stones with distinct origins and exceptional value.",
    image: conciergeImg,
    sections: [
      { heading: "The Scientific Identity", text: "Lab-grown diamonds are real diamonds created in controlled environments. They are chemically, physically, and optically identical to natural diamonds." },
      { heading: "Value & Accessibility", text: "Lab-grown diamonds cost 30-50% less, allowing for larger stones or higher grades within the same investment budget." },
    ],
  },
  {
    icon: <Scale className="w-8 h-8" />, 
    title: "Engagement Selection Guide",
    desc: "Curating the perfect symbol of your legacy. Style, setting, and metal selection strategies.",
    image: conciergeImg,
    sections: [
      { heading: "Decoding Their Style", text: "Observe their current collection. Do they prefer classic elegance or avant-garde design? Minimalist lines or intricate details?" },
      { heading: "The Art of the Setting", text: "Solitaire — the timeless choice. Halo — maximizing brilliance. Trilogy — representing past, present, and future." },
    ],
  },
];

const EducationPage = () => {
  const [expandedGuide, setExpandedGuide] = useState<string | null>("The Master Guide to Diamonds");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title="Diamond Education & Buying Guide | Diamond Jewels" 
        description="Make informed decisions with our comprehensive diamond guides. Learn about the 4 C's, lab-grown vs natural, and more."
      />
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background" />
          </div>
          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8 backdrop-blur-md">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent">Brilliance through knowledge</span>
              </div>
              <h1 className="font-heading text-5xl sm:text-8xl font-light tracking-tight mb-10 leading-[1.1]">
                The Education <span className="italic text-accent gold-glow">Portfolio</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light">
                Empowering your legacy with clarity. Our master gemologists have curated these essential guides to help you navigate the world of fine jewellery with absolute confidence.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Dynamic Content Sections */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="space-y-12">
            {guides.map((g, idx) => (
              <ScrollReveal key={g.title}>
                <div className={`relative overflow-hidden rounded-[3rem] border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-700 ${
                  expandedGuide === g.title ? "ring-2 ring-accent/20 shadow-2xl shadow-black/10" : "hover:border-accent/30"
                }`}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                    {/* Text Side */}
                    <div className={`p-8 sm:p-16 flex flex-col justify-center ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20 shadow-lg">
                          {g.icon}
                        </div>
                        <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-tight">{g.title}</h2>
                      </div>
                      <p className="text-muted-foreground text-base sm:text-lg mb-10 font-light leading-relaxed">
                        {g.desc}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                        {g.sections.map((s, i) => (
                          <div key={i} className="space-y-3">
                            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-accent/80">{s.heading}</h3>
                            <p className="text-sm leading-relaxed text-foreground/70">{s.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 flex flex-wrap gap-6">
                        <button className="btn-gold !px-8 !py-3 text-[10px] tracking-widest uppercase font-bold">
                          View Full Guide
                        </button>
                        <Link to="/jewellery" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-accent transition-all">
                          Browse Collection
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>

                    {/* Image Side */}
                    <div className={`relative min-h-[400px] overflow-hidden ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                      {g.image ? (
                        <img 
                          src={g.image} 
                          alt={g.title} 
                          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background flex items-center justify-center opacity-40">
                          <Diamond className="w-40 h-40 text-accent/20 rotate-45" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden bg-card">
          <div className="absolute inset-0">
            <img 
              src={conciergeImg} 
              alt="Concierge" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
          </div>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <ScrollReveal>
               <div className="max-w-2xl">
                <Sparkles className="w-12 h-12 text-accent mb-10" />
                <h2 className="font-heading text-4xl sm:text-6xl font-light mb-8 leading-tight">
                  Tailored brilliance <br/> <span className="italic text-accent">at your service</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-12 leading-relaxed font-light">
                  Our master gemologists are available for private consultations at our London boutique or via video call to guide you through your selection in person.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/book-appointment" className="btn-gold !px-12 !py-5 shadow-2xl shadow-accent/20 text-xs tracking-widest font-bold">
                    BOOK A PRIVATE SESSION
                  </Link>
                  <Link to="/customer-service" className="group flex items-center gap-4 px-12 py-5 border border-border/60 hover:border-accent text-[11px] font-bold tracking-[0.3em] uppercase transition-all rounded-full">
                    SPEAK WITH AN EXPERT
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EducationPage;

