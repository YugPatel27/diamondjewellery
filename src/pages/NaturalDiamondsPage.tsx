import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, Shield, Clock, Award } from "@/components/Icons";
import ring2 from "@/assets/ring-2.jpg";

const NaturalDiamondsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "GIA Certified", desc: "Independently certified natural stones" },
    { icon: <Clock className="w-5 h-5" />, title: "Heritage Value", desc: "Natural diamonds with timeless appeal" },
    { icon: <Award className="w-5 h-5" />, title: "Expert Sourcing", desc: "Carefully selected for quality and brilliance" },
  ];

  return (
    <CategoryPageTemplate
      category={null}
      pageType="diamonds"
      type="natural"
      icon={<Diamond className="w-8 h-8" />}
      title="Natural Diamonds"
      description="Discover earth-formed diamonds chosen for rarity, character and timeless value. Browse certified natural stones with complete confidence."
      image={ring2}
      canonicalPath="/natural-diamonds"
      breadcrumbs={[
        { label: "Diamonds", href: "/diamonds" },
        { label: "Natural Diamonds", href: "/natural-diamonds" },
      ]}
      features={features}
    />
  );
};

export default NaturalDiamondsPage;
