import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, Shield, Clock, Award } from "@/components/Icons";
import ring6 from "@/assets/ring-6.jpg";

const LooseDiamondsPage = () => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "Certified Stones", desc: "Browse loose diamonds with confidence" },
    { icon: <Clock className="w-5 h-5" />, title: "Flexible Selection", desc: "Choose the stone before setting it" },
    { icon: <Award className="w-5 h-5" />, title: "Custom Ready", desc: "Perfect for bespoke rings and designs" },
  ];

  return (
    <CategoryPageTemplate
      category={null}
      pageType="diamonds"
      type="loose"
      icon={<Diamond className="w-8 h-8" />}
      title="Loose Diamonds"
      description="Browse loose diamonds across our full collection. Ideal for bespoke projects, custom settings and shoppers who want to choose the stone first."
      image={ring6}
      canonicalPath="/loose-diamonds"
      breadcrumbs={[
        { label: "Diamonds", href: "/diamonds" },
        { label: "Loose Diamonds", href: "/loose-diamonds" },
      ]}
      features={features}
    />
  );
};

export default LooseDiamondsPage;
