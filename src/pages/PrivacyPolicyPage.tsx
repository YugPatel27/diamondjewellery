import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Shield, Sparkles, Diamond, Lock, Eye, Trash2, Download, FileText } from "@/components/Icons";
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
  { title: "1. Information We Collect", text: "We collect personal information such as name, email, phone number, shipping address, and payment details when you make a purchase or create an account. We also collect browsing behaviour, device information, hashed IP address fingerprints, activity timestamps, cookie preferences, and session data through cookies and session management tools. All data collection is subject to your explicit consent." },
  { title: "2. How We Use Your Information", text: "Your data is used to: process orders and generate GST-compliant invoices; provide customer service and appointment management; send order updates and appointment reminders; maintain hashed activity logs for security and audit purposes; improve our services through anonymized analytics; comply with legal obligations under PMLA, IT Act, GDPR, and Consumer Protection Act. We never sell your personal data to third parties." },
  { title: "3. Lawful Basis for Processing (GDPR Art. 6)", text: "We process your personal data under the following lawful bases: (a) Consent — for marketing communications, analytics cookies, and optional data processing; (b) Contract — for order processing, delivery, and account management; (c) Legal Obligation — for tax records, PMLA compliance, and fraud prevention; (d) Legitimate Interest — for security monitoring, service improvement, and fraud detection. You may withdraw consent at any time without affecting the lawfulness of prior processing." },
  { title: "4. Your Rights Under GDPR & Data Protection Laws", text: "You have the following rights: Right of Access (Art. 15) — view what data we hold; Right to Rectification (Art. 16) — correct inaccurate data; Right to Erasure (Art. 17) — request complete account and data deletion; Right to Data Portability (Art. 20) — export your data in JSON format; Right to Restrict Processing (Art. 18); Right to Object (Art. 21) — object to marketing and profiling; Right to Withdraw Consent (Art. 7) — withdraw at any time via your account settings or by contacting our DPO." },
  { title: "5. Data Security & Encryption", text: "Diamond Jewels implements enterprise-grade security measures: passwords hashed with bcrypt (12 salt rounds); all IP addresses anonymized via HMAC-SHA256 before storage; JWT tokens with enforced strong secrets; Content Security Policy (CSP) headers; rate limiting on all authentication endpoints; input sanitization on all API routes; HTTPS/TLS 1.3 encryption in transit; regular security audits and penetration testing." },
  { title: "6. Cookies & Consent Management", text: "Diamond Jewels uses three categories of cookies: (a) Essential cookies — required for authentication, cart, and sessions (always active); (b) Analytics cookies — anonymized usage data to improve our services (opt-in); (c) Marketing cookies — personalized recommendations (opt-in). You can manage cookie preferences at any time through our cookie settings panel. Consent is recorded with version tracking and timestamps." },
  { title: "7. Data Retention & Minimization", text: "We retain personal data only as long as necessary: Activity logs are automatically deleted after 30 days; Order records are retained for 5 years (tax/legal compliance); Account data is deleted upon account deletion request; Inactive accounts are flagged after 24 months; IP addresses are never stored in plain text — only HMAC hashes are retained. We follow the principle of data minimization (GDPR Art. 5(1)(c))." },
  { title: "8. International Data Transfers", text: "Your data is processed primarily in India. If data is transferred internationally (e.g., cloud hosting), we ensure adequate safeguards through Standard Contractual Clauses (SCCs) or equivalent mechanisms as required by GDPR Art. 46. Our hosting providers maintain SOC 2 Type II and ISO 27001 certifications." },
  { title: "9. Data Protection Officer (DPO)", text: "For any data protection inquiries, requests for data export or deletion, or to exercise any of your GDPR rights, contact our Data Protection Officer: Email: privacy@diamondjewels.com | Response time: within 30 days as required by GDPR Art. 12(3). You also have the right to lodge a complaint with a supervisory authority." },
  { title: "10. BIS Hallmarking & Diamond Certification", text: "All gold jewellery carries BIS Hallmark certification with unique HUID numbers. Every diamond comes with GIA, IGI, or SGL certification. Lab-grown diamonds are clearly disclosed with separate grading reports." },
  { title: "11. Prevention of Money Laundering Act (PMLA)", text: "Diamond Jewels complies with PMLA, 2002. For transactions exceeding ₹10,00,000 (Ten Lakhs), KYC verification is mandatory. Valid government-issued ID and address proof are required. Transaction records are maintained for a minimum of 5 years." },
  { title: "12. Changes to This Policy", text: "We may update this Privacy Policy from time to time. When we do, we will revise the 'Effective Date' and, for significant changes, notify you via email or a prominent notice on our site. Continued use after changes constitutes acceptance. Cookie consent preferences will be re-requested when the consent version changes." },
];

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Privacy Policy & GDPR Compliance | Diamond Jewels" description="Learn about how we protect your data, your GDPR rights, and our commitment to transparency, encryption, and legal compliance." />
    <Header />
    
    <nav className="breadcrumb">
      <Link to="/">Home</Link>
      <span className="mx-2">/</span>
      <span className="text-foreground font-medium">Privacy & Legal</span>
    </nav>

    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <ScrollReveal className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
          <Shield className="w-5 h-5" /> Data Sovereignty & GDPR Compliance
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-light tracking-tight mb-6">Privacy <span className="italic text-accent">Policy</span></h1>
        <div className="gold-divider mx-auto mb-8 w-24" />
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Effective May 18, 2026 · Consent Version 2.0.0</p>
      </ScrollReveal>

      {/* GDPR Rights Quick Access */}
      <ScrollReveal>
        <div className="mb-16 p-8 rounded-[2.5rem] border border-accent/20 bg-accent/5">
          <h2 className="font-heading text-lg font-medium text-accent mb-6 text-center uppercase tracking-widest">Your Data Rights at a Glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Eye, label: "Access Data", desc: "View your data" },
              { icon: Download, label: "Export Data", desc: "Download as JSON" },
              { icon: Trash2, label: "Delete Account", desc: "Full data erasure" },
              { icon: Lock, label: "Withdraw Consent", desc: "Opt-out anytime" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/50">
                <item.icon className="w-5 h-5 text-accent mb-2" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                <span className="text-[10px] text-muted-foreground mt-1">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {sections.map((s, idx) => (
          <ScrollReveal key={s.title}>
            <div className="p-10 rounded-[2.5rem] border border-border/40 bg-card/10 hover:border-accent/30 transition-all duration-500">
              <h2 className="font-heading text-xl font-medium mb-4 text-accent">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-20 p-12 rounded-[3rem] bg-secondary/30 border border-border/40 text-center">
          <Sparkles className="w-8 h-8 text-accent mx-auto mb-6" />
          <h2 className="font-heading text-2xl font-light mb-4">Integrity in Every Facet</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed mb-8">
            Diamond Jewels is committed to the highest standards of data protection, GDPR compliance, and ethical business practices. 
            To exercise any of your data rights or for privacy inquiries, contact our Data Protection Officer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/customer-service" className="btn-gold px-12 py-4">CONTACT DPO</Link>
            <Link to="/terms-of-service" className="btn-outline px-12 py-4">TERMS OF SERVICE</Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicyPage;
