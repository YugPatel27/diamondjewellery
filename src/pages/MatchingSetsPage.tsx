import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Heart, Shield, Clock, Award } from "@/components/Icons";
import ring6 from "@/assets/ring-6.jpg";

const MatchingSetsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "GIA Certified", desc: "All diamonds graded & certified" },
    { icon: <Clock className="w-5 h-5" />, title: "Lifetime Care", desc: "Free cleaning & maintenance" },
    { icon: <Award className="w-5 h-5" />, title: "Premium Metals", desc: "Gold, platinum, white gold" },
  ];

  return (
    <CategoryPageTemplate
      category="Rings"
      pageType="rings"
      style="Diamond Band"
      icon={<Heart className="w-8 h-8" />}
      title="Matching Wedding Sets"
      description="Coordinated engagement ring and wedding band sets designed to complement each other perfectly. Unified in style, metal, and stone for a cohesive, sophisticated look that tells your unique love story."
      image={ring6}
      canonicalPath="/matching-sets"
      breadcrumbs={[
        { label: "Wedding Bands", href: "/wedding-bands" },
        { label: "Matching Sets", href: "/matching-sets" },
      ]}
      features={features}
    />
  );
};

export default MatchingSetsPage;
