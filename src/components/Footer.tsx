import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import EducationModal from "@/components/EducationModal";
import { DiamondLogo } from "@/components/DiamondLogo";
import BRAND_CONFIG from "@/config/brand";
import { 
  Phone, HelpCircle, Truck, Ruler, Lock, Scale, Gem, Sparkles, 
  Diamond, Wand2, Calendar, BookOpen, MapPin, Mail, Clock, Instagram, Facebook, Twitter
} from "@/components/Icons";

const educationContent: Record<string, string[]> = {
  "Diamond Guide": [
    "Diamonds are graded based on the 4 C's: Cut, Clarity, Color, and Carat weight. Understanding these factors helps you choose the perfect diamond.",
    "Cut is the most important factor — it determines how well a diamond reflects light. An Excellent cut maximizes brilliance and fire.",
    "Clarity measures the presence of inclusions or blemishes. FL (Flawless) diamonds are the rarest, while SI grades offer great value with eye-clean appearance.",
    "Color is graded from D (colourless) to Z. D-F grades are colourless and most valuable. G-J grades appear near-colourless and offer excellent value.",
    "Carat refers to the weight of the diamond. One carat equals 200 milligrams. Larger diamonds are rarer and more valuable per carat.",
    "Always insist on certification from GIA, IGI, or SGL. DiamondJewels provides certificates with every purchase."
  ],
  "Lab Grown vs Natural": [
    "Lab-grown diamonds are chemically, physically, and optically identical to natural diamonds. The only difference is their origin.",
    "Natural diamonds form deep within the Earth's mantle over billions of years under extreme heat and pressure.",
    "Lab-grown diamonds are created in controlled environments using two methods: HPHT (High Pressure High Temperature) and CVD (Chemical Vapor Deposition).",
    "Lab-grown diamonds typically cost 30-50% less than natural diamonds of equivalent quality, making them an excellent value proposition.",
    "Both types are certified and graded using the same 4 C's criteria. Lab-grown diamonds carry the same certifications as natural diamonds.",
    "The choice between natural and lab-grown is personal. Both are real diamonds — the difference lies in origin and price point."
  ],
  "Engagement Ring Guide": [
    "Choosing an engagement ring starts with understanding your partner's style. Observe the jewellery they currently wear for clues.",
    "Solitaire settings are timeless and classic, letting the diamond take centre stage. They suit every hand shape and finger size.",
    "Halo settings surround the centre stone with smaller diamonds, creating a larger visual appearance and added sparkle.",
    "Vintage-inspired designs feature intricate details like milgrain, filigree, and hand-engraving for a romantic, antique feel.",
    "Consider the metal: White gold offers a modern look, yellow gold is traditional and warm, rose gold is romantic, and platinum is the most durable.",
    "Ring size matters! Visit a store for professional sizing or use our online ring size guide for an accurate measurement."
  ],
  "Metal Guide": [
    "White Gold (18K) is a popular choice offering a modern, silvery appearance. It's rhodium-plated for extra shine and durability.",
    "Yellow Gold (18K) is the traditional choice for Indian jewellery. Its warm tone complements all skin tones beautifully.",
    "Rose Gold (18K) has a unique pinkish hue created by copper alloy. It's romantic, trendy, and suits warm skin tones particularly well.",
    "Platinum is the most premium metal — naturally white, hypoallergenic, and extremely durable. It develops a beautiful patina over time.",
    "All DiamondJewels pieces are crafted in 18K gold or 950 Platinum, ensuring the highest quality and longevity.",
    "Gold purity: 24K is pure gold (too soft for jewellery), 22K is 91.6% pure, 18K is 75% pure (ideal for diamond settings), 14K is 58.3% pure."
  ],
};

const Footer = () => {
  const [modal, setModal] = useState<{ title: string; content: string[] } | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <footer className="relative overflow-hidden border-t border-border/40 bg-background pt-12 sm:pt-20 pb-12">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full opacity-[0.02] pointer-events-none">
          <Diamond className="w-full h-full text-accent rotate-12 scale-150" />
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand Column */}
            <div className="md:col-span-4 lg:col-span-5 space-y-8">
              <Link to="/" className="inline-block group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <DiamondLogo size="md" className="text-accent relative z-10" />
                    <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="font-heading text-2xl tracking-tighter text-foreground group-hover:text-accent transition-colors">
                    Diamond <span className="italic font-light">Jewels</span>
                  </span>
                </div>
              </Link>
              
              <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
                Crafting timeless elegance and sustainable luxury since 2026. Every piece tells a story of precision, passion, and unparalleled beauty.
              </p>

              <div className="flex items-center gap-6 pt-2">
                {[
                  { Icon: Instagram, href: BRAND_CONFIG.socials.instagram, label: "Instagram" },
                  { Icon: Facebook, href: BRAND_CONFIG.socials.facebook, label: "Facebook" },
                  { Icon: Twitter, href: "https://twitter.com/diamondjewels", label: "Twitter" }
                ].map(({ Icon, href, label }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, color: "var(--accent)" }}
                    className="text-muted-foreground transition-colors"
                    aria-label={`Follow Diamond Jewels on ${label}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links Sections */}
            <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-8">
              <motion.div variants={itemVariants} className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Service</h4>
                <ul className="space-y-4">
                  {[
                    { label: "Contact Us", icon: Phone, href: "/customer-service" },
                    { label: "FAQs", icon: HelpCircle, href: "/faq" },
                    { label: "Delivery", icon: Truck, href: "/customer-service" },
                    { label: "Size Guide", icon: Ruler, href: "/education" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 group">
                        <link.icon className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Shop</h4>
                <ul className="space-y-4">
                  {[
                    { label: "Rings", icon: Gem, href: "/engagement-rings" },
                    { label: "Necklaces", icon: Gem, href: "/necklaces" },
                    { label: "Earrings", icon: Sparkles, href: "/earrings" },
                    { label: "Diamonds", icon: Diamond, href: "/diamonds" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 group">
                        <link.icon className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="col-span-2 sm:col-span-1 space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Education</h4>
                <ul className="space-y-4">
                  {Object.keys(educationContent).map((key) => (
                    <li key={key}>
                      <button 
                        onClick={() => setModal({ title: key, content: educationContent[key] })}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 group text-left w-full"
                      >
                        <BookOpen className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
                        {key}
                      </button>
                    </li>
                  ))}
                  <li>
                    <Link to="/education" className="text-xs text-accent hover:underline flex items-center gap-2 group pt-2">
                      View all guides <Wand2 className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Location Card */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 sm:mt-20 rounded-[1.5rem] sm:rounded-[2.5rem] bg-secondary/30 border border-border/40 p-6 sm:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                  <MapPin className="w-3 h-3 text-accent" />
                  <span className="text-[9px] font-bold tracking-widest uppercase text-accent">Visit our boutique</span>
                </div>
                <h3 className="font-heading text-3xl font-light leading-tight">
                  Experience the <span className="italic">brilliance</span> in person.
                </h3>
                <div className="space-y-4 pt-2">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-background border border-border/60 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Opening Hours</p>
                      <p className="text-sm font-medium">{BRAND_CONFIG.contact.hours.weekday}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-background border border-border/60 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Us</p>
                      <p className="text-sm font-medium">{BRAND_CONFIG.contact.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-3xl bg-card border border-accent/20 p-8 shadow-2xl shadow-accent/5">
                  <h4 className="font-heading text-xl mb-4">{BRAND_CONFIG.name} Store</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {BRAND_CONFIG.store.address}, {BRAND_CONFIG.store.street}<br />
                    {BRAND_CONFIG.store.city}, {BRAND_CONFIG.store.state} {BRAND_CONFIG.store.pincode}
                  </p>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest border-t border-border/40 pt-6">
                    {BRAND_CONFIG.policies.noReturn}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-medium text-muted-foreground">
              © 2026 {BRAND_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy</Link>
              <Link to="/terms-of-service" className="hover:text-accent transition-colors">Terms</Link>
              <Link to="/sitemap" className="hover:text-accent transition-colors">Sitemap</Link>
            </div>
          </div>

          {/* Prototype Message */}
          <div className="mt-12 text-center">
            <p className="text-[9px] text-muted-foreground/50 max-w-2xl mx-auto leading-relaxed">
              ⚠️ PROTOTYPE WEBSITE — For demonstration purposes only. Not for personal or commercial use. 
              The code and design are private and proprietary. All images are AI-generated.
            </p>
          </div>
        </motion.div>
      </footer>
      <EducationModal open={!!modal} onClose={() => setModal(null)} title={modal?.title ?? ""} content={modal?.content ?? []} />
    </>
  );
};

export default Footer;

