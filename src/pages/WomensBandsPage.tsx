import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Heart, Shield, Clock, Award } from "@/components/Icons";
import ring5 from "@/assets/ring-5.jpg";

const WomensBandsPage = () => {
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
      title="Women's Wedding Bands"
      description="Elegant women's wedding bands adorned with diamonds and precious gemstones. Perfectly designed to stack beautifully with your engagement ring, creating a stunning unified look."
      image={ring5}
      canonicalPath="/womens-bands"
      breadcrumbs={[
        { label: "Wedding Bands", href: "/wedding-bands" },
        { label: "Women's Bands", href: "/womens-bands" },
      ]}
      features={features}
    />
  );
};

export default WomensBandsPage;
