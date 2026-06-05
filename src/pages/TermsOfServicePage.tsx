import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { FileText, Sparkles, Diamond, ShieldCheck } from "@/components/Icons";
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

const sections = [
  { title: "1. Acceptance of Terms", text: "By accessing and using Diamond Jewels, you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Diamond Jewels Pvt. Ltd. If you do not agree to these terms, you must not use our services." },
  { title: "2. Eligibility", text: "You must be at least 18 years of age to make a purchase. By using this website, you represent that you meet this requirement and have the legal capacity to enter into binding agreements under the Indian Contract Act, 1872." },
  { title: "3. Product Information & Pricing", text: "All diamond specifications are certified by GIA, IGI, or SGL. Prices are in Indian Rupees (₹) and include GST at 3% on gold and diamond jewellery. We reserve the right to correct pricing errors. All gold is BIS Hallmarked for guaranteed purity." },
  { title: "4. User Accounts, Data Consent & Privacy", text: "By creating an account, you explicitly consent to the collection, storage, and processing of your personal data as described in our Privacy Policy. This includes: name, email, phone number, hashed IP fingerprints, and purchase history. You may exercise your GDPR rights (access, portability, erasure, consent withdrawal) at any time via your account settings or by contacting our DPO at privacy@diamondjewels.com." },
  { title: "5. Data Security Commitment", text: "We implement enterprise-grade security measures: bcrypt password hashing (12 salt rounds), HMAC-SHA256 IP anonymization, JWT authentication with strong secrets, Content Security Policy headers, rate limiting on all critical endpoints, and input sanitization. All data in transit is protected by TLS 1.3 encryption." },
  { title: "6. Orders & Payment", text: "All orders are subject to acceptance and availability. Payment must be made in full at the time of purchase. We accept major credit/debit cards, UPI, and net banking. All invoices are GST-compliant with tax breakdowns. Payment data is processed through PCI-DSS compliant payment gateways — we never store your card details." },
  { title: "7. Delivery Policy", text: "Delivery charges will be communicated by our store employee based on your location and order value. All deliveries are insured. Estimated delivery: 7-15 business days for standard orders, 4-8 weeks for bespoke/custom pieces." },
  { title: "8. Strict No Return Policy", text: "Due to the bespoke nature of diamond jewellery, a STRICT NO RETURN POLICY is followed without exception. Exchange may be considered within 7 days of delivery ONLY for manufacturing defects, subject to inspection." },
  { title: "9. Intellectual Property", text: "All content including designs, images, and text are the intellectual property of Diamond Jewels Pvt. Ltd. protected under the Copyright Act, 1957. Unauthorised use is strictly prohibited." },
  { title: "10. Data Breach Notification", text: "In the event of a personal data breach likely to result in a risk to your rights, we will notify you and the relevant supervisory authority within 72 hours as required by GDPR Art. 33-34. Notification will include the nature of the breach, likely consequences, and measures taken." },
  { title: "11. Dispute Resolution", text: "Any disputes arising from these terms shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in London, Greater London." },
  { title: "12. Governing Law", text: "These Terms shall be governed by and construed in accordance with the laws of India, with supplementary compliance with EU GDPR where applicable. Any legal proceedings shall be subject to the exclusive jurisdiction of the courts in London, Greater London." },
];

const TermsOfServicePage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Terms of Service | Diamond Jewels" description="The legal framework governing your relationship with Diamond Jewels, including data protection, security, and GDPR compliance." />
    <Header />
    
    <nav className="breadcrumb">
      <Link to="/">Home</Link>
      <span className="mx-2">/</span>
      <span className="text-foreground font-medium">Terms of Service</span>
    </nav>

    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <ScrollReveal className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
          <FileText className="w-5 h-5" /> Operational Framework
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-light tracking-tight mb-6">Terms of <span className="italic text-accent">Service</span></h1>
        <div className="gold-divider mx-auto mb-8 w-24" />
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Effective May 2026</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {sections.map((s, idx) => (
          <ScrollReveal key={s.title}>
            <div className="p-10 rounded-[2.5rem] border border-border/40 bg-card/10 hover:border-accent/30 transition-all duration-500">
              <h2 className="font-heading text-xl font-medium mb-4 text-accent">{s.title}</h2>
              <p className="text-sm text-foreground/60 leading-relaxed">{s.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-20 p-12 rounded-[3rem] bg-foreground text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-5">
             <Diamond className="w-64 h-64 absolute -top-10 -left-10 text-white" />
          </div>
          <div className="relative z-10">
            <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-6" />
            <h2 className="font-heading text-2xl font-light mb-4 text-background">Trust, Transparency & Security</h2>
            <p className="text-background/50 max-w-2xl mx-auto text-sm leading-relaxed mb-8">
              At Diamond Jewels, we value the trust you place in us. Our terms are designed to ensure a secure, GDPR-compliant, and exceptional experience for every acquisition.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Link to="/customer-service" className="btn-gold px-12 py-4">GO TO SUPPORT</Link>
               <Link to="/privacy-policy" className="btn-outline border-white/20 text-white hover:bg-white hover:text-foreground px-12 py-4">PRIVACY POLICY</Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </main>
    <Footer />
  </div>
);

export default TermsOfServicePage;
