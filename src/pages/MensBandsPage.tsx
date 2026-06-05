import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Sparkles, Shield, Clock, Award } from "@/components/Icons";
import ring4 from "@/assets/ring-4.jpg";
import conciergeBg from "@/assets/concierge_general_luxury_1778657530137.png";

const MensBandsPage = () => {
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
      icon={<Sparkles className="w-8 h-8" />}
      title="Men's Wedding Bands"
      description="Sophisticated men's wedding bands crafted in premium metals. From classic designs to modern styles, find the perfect band to complement your engagement ring and celebrate your eternal commitment."
      image={ring4}
      canonicalPath="/mens-bands"
      breadcrumbs={[
        { label: "Wedding Bands", href: "/wedding-bands" },
        { label: "Men's Bands", href: "/mens-bands" },
      ]}
      features={features}
      expertGuidanceBg={conciergeBg}
    />
  );
};

export default MensBandsPage;
