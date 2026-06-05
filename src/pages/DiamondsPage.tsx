import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, ShieldCheck, Award, Sparkles, Gem } from "@/components/Icons";
import diamondHero from "@/assets/ring-6.jpg";
import conciergeBg from "@/assets/education_diamonds_1778657341173.png";

const DiamondsPage = () => {
  const features = [
    { icon: <ShieldCheck className="w-5 h-5" />, title: "GIA & IGI Certified", desc: "Every diamond in our collection is independently certified for quality assurance." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Exceptional Brilliance", desc: "We hand-select stones with superior cut grades to ensure maximum light performance." },
    { icon: <Award className="w-5 h-5" />, title: "Ethical Sourcing", desc: "Our diamonds are conflict-free and sourced through strictly vetted channels." },
    { icon: <Gem className="w-5 h-5" />, title: "Expert Guidance", desc: "Consult with our master gemologists to find the perfect stone for your needs." },
  ];

  return (
    <CategoryPageTemplate
      category="all"
      pageType="diamonds"
      type="loose"
      icon={<Diamond className="w-8 h-8" />}
      title="Certified Diamonds"
      description="Explore our curated collection of certified loose diamonds. From classic rounds to fancy shapes, discover stones of exceptional quality, brilliance, and value."
      image={diamondHero}
      canonicalPath="/diamonds"
      breadcrumbs={[
        { label: "Jewellery", href: "/jewellery" },
        { label: "Diamonds", href: "/diamonds" },
      ]}
      features={features}
      expertGuidanceBg={conciergeBg}
    />
  );
};

export default DiamondsPage;
