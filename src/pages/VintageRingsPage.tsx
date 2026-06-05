import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Gem, Shield, Clock, Award } from "@/components/Icons";
import ring3 from "@/assets/ring-3.jpg";

const VintageRingsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "GIA Certified", desc: "All diamonds graded & certified" },
    { icon: <Clock className="w-5 h-5" />, title: "Lifetime Care", desc: "Free cleaning & maintenance" },
    { icon: <Award className="w-5 h-5" />, title: "Premium Metals", desc: "Gold, platinum, white gold" },
  ];

  return (
    <CategoryPageTemplate
      category="Rings"
      pageType="rings"
      style="Vintage"
      icon={<Gem className="w-8 h-8" />}
      title="Vintage Engagement Rings"
      description="Timeless vintage-inspired engagement rings with intricate detailing and classic elegance. Art Deco and Edwardian-inspired designs featuring ornate settings, filigree work, and romantic milgrain detailing."
      image={ring3}
      canonicalPath="/vintage-rings"
      breadcrumbs={[
        { label: "Engagement Rings", href: "/engagement-rings" },
        { label: "Vintage Rings", href: "/vintage-rings" },
      ]}
      features={features}
    />
  );
};

export default VintageRingsPage;
