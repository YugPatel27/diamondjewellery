import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, Shield, Clock, Award } from "@/components/Icons";
import ring4 from "@/assets/ring-4.jpg";

const TrilogyRingsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "GIA Certified", desc: "All diamonds graded & certified" },
    { icon: <Clock className="w-5 h-5" />, title: "Lifetime Care", desc: "Free cleaning & maintenance" },
    { icon: <Award className="w-5 h-5" />, title: "Premium Metals", desc: "Gold, platinum, white gold" },
  ];

  return (
    <CategoryPageTemplate
      category="Rings"
      pageType="rings"
      style="Trilogy"
      icon={<Diamond className="w-8 h-8" />}
      title="Trilogy Engagement Rings"
      description="Three-stone engagement rings symbolizing past, present, and future. These stunning designs feature a centre diamond flanked by two complementary side stones for enhanced elegance and timeless beauty."
      image={ring4}
      canonicalPath="/trilogy-rings"
      breadcrumbs={[
        { label: "Engagement Rings", href: "/engagement-rings" },
        { label: "Trilogy Rings", href: "/trilogy-rings" },
      ]}
      features={features}
    />
  );
};

export default TrilogyRingsPage;
