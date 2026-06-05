import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { 
  Headphones, Phone, Mail, MapPin, Clock, MessageCircle, 
  Shield, Truck, RefreshCw, ChevronDown, Sparkles, Diamond
} from "@/components/Icons";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";

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

const faqs = [
  { q: "How do I track my order?", a: "Once your order is dispatched, you will receive a tracking link via email and SMS. You can also contact our store directly for updates." },
  { q: "What is your return policy?", a: "We follow a strict no-return policy for all diamond and gold jewellery. Exchange may be considered within 7 days only for manufacturing defects, subject to quality inspection." },
  { q: "How are delivery charges calculated?", a: "Delivery charges are determined based on your location and order value. Our store employee will inform you of the exact charges before dispatch." },
  { q: "Are your diamonds certified?", a: "Yes, every diamond comes with a certificate from GIA, IGI, or SGL confirming Cut, Clarity, Color, and Carat. Lab-grown diamonds carry the same certifications as natural diamonds." },
  { q: "Do prices include GST?", a: "Yes, all displayed prices are inclusive of GST at 3% as per Indian tax regulations. A GST-compliant invoice is provided with every purchase." },
  { q: "Can I customise my jewellery?", a: "Absolutely! Visit our Bespoke page or book an appointment at our London store. Our expert designers will guide you through creating your dream piece." },
  { q: "Is KYC required?", a: "KYC verification is mandatory for transactions exceeding ₹10,00,000 as per PMLA regulations. Valid ID and address proof will be required." },
  { q: "How do I book an appointment?", a: "You can book an appointment through our website or call us directly. We recommend booking at least 2 days in advance for a personalised experience." },
];

const CustomerServicePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Message received. Our concierge will contact you shortly.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Customer Concierge | Diamond Jewels" 
        description="Exceptional service for exceptional clients. Contact our expert team for tracking, returns, and bespoke consultations."
        keywords={["customer service", "jewellery help", "diamond jewels support", "London jewellery store"]}
        canonical="https://diamondjewels.com/customer-service"
      />
      <Header />
      
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">Customer Concierge</span>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <ScrollReveal className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Headphones className="w-8 h-8 text-accent" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">Personalized Assistance</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-light tracking-tight mb-6">How May We <span className="italic text-accent">Assist You?</span></h1>
          <div className="gold-divider mx-auto mb-8 w-24" />
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From acquisition guidance to after-care services, our dedicated concierge team in London is here to ensure your experience is as brilliant as our diamonds.
          </p>
        </ScrollReveal>

        {/* Contact info cards */}
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            {[
              { icon: <Phone className="w-8 h-8" />, title: "Voice Concierge", val: "+91 79 4000 5555", sub: "Mon-Sat, 10AM-8PM IST" },
              { icon: <Mail className="w-8 h-8" />, title: "Digital Inquiry", val: "concierge@diamondjewels.in", sub: "Priority Response Suite" },
              { icon: <MapPin className="w-8 h-8" />, title: "Flagship Store", val: "C.G. Road, Navrangpura", sub: "London, Greater London" },
              { icon: <Clock className="w-8 h-8" />, title: "Salon Hours", val: "10:00 - 20:00", sub: "Appointments Recommended" },
            ].map((item, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-sm hover:border-accent/40 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 text-center">
                <div className="text-accent mb-6 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="font-heading text-xl font-light mb-4">{item.title}</h3>
                <p className="text-sm font-bold tracking-wider mb-1">{item.val}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.sub}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Service highlights */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "Unwavering Trust", desc: "Every acquisition is accompanied by independent certification and BIS Hallmarking, guaranteeing absolute purity." },
              { icon: <Truck className="w-6 h-6" />, title: "Insured Transit", desc: "Our white-glove delivery service ensures your precious cargo is fully insured and handled with the utmost care." },
              { icon: <RefreshCw className="w-6 h-6" />, title: "Lifetime Service", desc: "We provide professional cleaning, inspection, and maintenance for your Diamond Jewels pieces for a lifetime." },
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-secondary/30 border border-border/20 flex flex-col items-center text-center">
                <div className="text-accent mb-6 bg-white p-4 rounded-2xl shadow-sm">{f.icon}</div>
                <h3 className="font-heading text-2xl font-light mb-4">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* FAQs */}
          <ScrollReveal>
            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
                  <Sparkles className="w-4 h-4" /> Information Suite
                </div>
                <h2 className="font-heading text-4xl font-light mb-6">Frequently Asked</h2>
                <p className="text-muted-foreground text-base mb-10 leading-relaxed">Swift answers to common inquiries regarding acquisitions and care.</p>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className={`rounded-3xl border transition-all duration-500 overflow-hidden ${openFaq === i ? "border-accent/40 bg-card/40" : "border-border/40 bg-card/10 hover:border-accent/20"}`}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-8 py-6 text-left text-base font-medium"
                    >
                      <span className={openFaq === i ? "text-accent" : ""}>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-500 ${openFaq === i ? "rotate-180 text-accent" : ""}`} />
                    </button>
                    <div className={`grid transition-all duration-500 ease-in-out ${openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className="px-8 pb-8 text-sm text-muted-foreground leading-relaxed border-t border-border/10 pt-6">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Contact form */}
          <ScrollReveal>
            <div className="bg-card/20 backdrop-blur-md border border-border/40 rounded-[3rem] p-10 sm:p-16 shadow-2xl shadow-black/5 relative">
              <div className="absolute -top-10 -right-10 opacity-5">
                <Diamond className="w-40 h-40" />
              </div>
              <div className="text-center mb-12">
                <MessageCircle className="w-10 h-10 text-accent mx-auto mb-6" />
                <h2 className="font-heading text-3xl font-light mb-4">Direct Correspondence</h2>
                <p className="text-sm text-muted-foreground">For bespoke inquiries and private consultations.</p>
              </div>
              
              <form onSubmit={handleContactSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent ml-1">Identity</label>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={contactForm.name} 
                      onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))} 
                      className="w-full px-6 py-4 rounded-2xl border border-border/40 bg-background/50 outline-none focus:border-accent transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent ml-1">Digital Address</label>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={contactForm.email} 
                      onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))} 
                      className="w-full px-6 py-4 rounded-2xl border border-border/40 bg-background/50 outline-none focus:border-accent transition-all text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent ml-1">Subject of Inquiry</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Bespoke Consultation" 
                    value={contactForm.subject} 
                    onChange={(e) => setContactForm(f => ({ ...f, subject: e.target.value }))} 
                    className="w-full px-6 py-4 rounded-2xl border border-border/40 bg-background/50 outline-none focus:border-accent transition-all text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent ml-1">Message</label>
                  <textarea 
                    placeholder="How may we assist you today?" 
                    value={contactForm.message} 
                    onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))} 
                    rows={5} 
                    className="w-full px-6 py-4 rounded-2xl border border-border/40 bg-background/50 outline-none focus:border-accent transition-all text-sm resize-none" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-gold w-full py-5 rounded-2xl text-xs font-bold tracking-[0.3em] shadow-xl shadow-accent/20"
                >
                  SEND CORRESPONDENCE
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomerServicePage;
