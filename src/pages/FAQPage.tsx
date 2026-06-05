import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { 
  HelpCircle, ChevronDown, Sparkles, Diamond, 
  Truck, Shield, RefreshCw, CreditCard, User, Search
} from "@/components/Icons";
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

const faqCategories = [
  {
    id: "orders",
    title: "Orders & Shipping",
    icon: <Truck className="w-6 h-6" />,
    items: [
      { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days within India. For bespoke pieces, please allow 14-21 days for craftsmanship and delivery." },
      { q: "Is shipping insured?", a: "Yes, every single parcel from Diamond Jewels is fully insured from our vault to your doorstep. A signature is required upon delivery." },
      { q: "Can I change my delivery address?", a: "For security reasons, we can only change the delivery address if the order hasn't been dispatched. Please contact our concierge immediately." }
    ]
  },
  {
    id: "products",
    title: "Product & Quality",
    icon: <Diamond className="w-6 h-6" />,
    items: [
      { q: "Are all your diamonds certified?", a: "Yes, we only curate diamonds certified by GIA, IGI, or SGL. This ensures you receive the exact quality promised." },
      { q: "Do you offer resizing?", a: "We offer one complimentary resizing for most rings within 30 days of purchase. Some eternity bands and intricate designs may not be resizable." },
      { q: "What is your warranty?", a: "We provide a lifetime warranty against manufacturing defects and offer complimentary professional cleaning for all our pieces." }
    ]
  },
  {
    id: "payments",
    title: "Payments & Tax",
    icon: <CreditCard className="w-6 h-6" />,
    items: [
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, Net Banking, and Bank Transfers. Cash on Delivery is available for orders up to ₹50,000." },
      { q: "Is GST included in the price?", a: "Yes, all our prices are inclusive of 3% GST. You will receive a formal tax invoice with every purchase." },
      { q: "Do you offer EMI?", a: "Yes, we have tie-ups with leading banks to offer flexible EMI options at the time of checkout." }
    ]
  }
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Frequently Asked Questions | Diamond Jewels" 
        description="Find answers to common questions about shipping, diamond quality, payments, and our bespoke jewellery services."
        faqItems={faqCategories.flatMap(cat => cat.items)}
      />
      <Header />
      
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">FAQ</span>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <ScrollReveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="w-8 h-8 text-accent" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">Knowledge Base</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-light tracking-tight mb-6">Common <span className="italic text-accent">Inquiries</span></h1>
          <div className="gold-divider mx-auto mb-8 w-24" />
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about your Diamond Jewels experience, curated by our concierge team.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Category Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenItem(null); }}
                className={`w-full flex items-center gap-4 p-6 rounded-3xl border transition-all duration-300 ${
                  activeCategory === cat.id 
                  ? "border-accent bg-accent/5 text-foreground shadow-lg shadow-accent/5" 
                  : "border-border/40 hover:border-accent/30 text-muted-foreground"
                }`}
              >
                <div className={`${activeCategory === cat.id ? "text-accent" : "text-muted-foreground"}`}>
                  {cat.icon}
                </div>
                <span className="font-heading text-lg font-medium">{cat.title}</span>
              </button>
            ))}
            
            <div className="mt-12 p-8 rounded-3xl bg-secondary/30 border border-border/20">
              <h3 className="font-heading text-xl font-light mb-4 text-accent">Still have questions?</h3>
              <p className="text-xs text-foreground/50 mb-6 leading-relaxed">Our concierge is available for one-on-one assistance via phone or email.</p>
              <Link to="/customer-service" className="text-xs font-bold tracking-widest uppercase text-foreground hover:text-accent transition-colors flex items-center gap-2">
                CONTACT CONCIERGE <Sparkles className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="lg:col-span-8 space-y-4">
            {faqCategories.find(c => c.id === activeCategory)?.items.map((item, i) => {
              const itemId = `${activeCategory}-${i}`;
              const isOpen = openItem === itemId;
              return (
                <ScrollReveal key={itemId}>
                  <div className={`rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                    isOpen ? "border-accent/40 bg-card/40 shadow-xl shadow-black/5" : "border-border/40 bg-card/10 hover:border-accent/20"
                  }`}>
                    <button
                      onClick={() => setOpenItem(isOpen ? null : itemId)}
                      className="w-full flex items-center justify-between px-8 py-7 text-left"
                    >
                      <span className={`font-heading text-lg sm:text-xl font-light ${isOpen ? "text-accent" : ""}`}>{item.q}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isOpen ? "rotate-180 text-accent" : "text-muted-foreground"}`} />
                    </button>
                    <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className="px-8 pb-8 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/10 pt-6">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
