import { Gem, Shield, Award, Heart, Sparkles } from "@/components/Icons";
import heroImg from "@/assets/hero-model.jpg";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import conciergeBg from "@/assets/concierge_general_luxury_1778657530137.png";

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

const JewelleryPage = () => {
  const features = [
    { icon: <Award className="w-5 h-5" />, title: "Master Craftsmanship", desc: "Each piece is hand-finished by master jewellers in our London studio." },
    { icon: <Gem className="w-5 h-5" />, title: "Exquisite Stones", desc: "Hand-selected diamonds and precious gemstones of exceptional grade." },
    { icon: <Shield className="w-5 h-5" />, title: "Lifetime Guarantee", desc: "Our commitment to quality includes professional care for a lifetime." },
    { icon: <Heart className="w-5 h-5" />, title: "Bespoke Service", desc: "Collaborate with our designers to create a piece that is uniquely yours." },
  ];

  return (
    <CategoryPageTemplate
      category="all"
      pageType="all"
      icon={<Gem className="w-8 h-8" />}
      title="Luxury Fine Jewellery Collection"
      description="Explore our complete collection of exquisite fine jewellery. From breathtaking diamond classics to modern artisanal designs, discover pieces that celebrate life's most precious moments."
      image={heroImg}
      canonicalPath="/jewellery"
      breadcrumbs={[
        { label: "Jewellery", href: "/jewellery" },
      ]}
      features={features}
      hideExpertGuidance={false}
      expertGuidanceBg={conciergeBg}
    >
    </CategoryPageTemplate>
  );
};

export default JewelleryPage;
