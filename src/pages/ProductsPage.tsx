import { useParams, useSearchParams } from "react-router-dom";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { Diamond, Gem, Sparkles } from "@/components/Icons";
import ring2 from "@/assets/ring-2.jpg";

const ProductsPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");

  const title = category ? `${category[0].toUpperCase()}${category.slice(1)} Products` : "All Products";
  const description = typeFilter
    ? "Browse a curated selection with the requested filter applied."
    : "Browse the full jewellery collection in a cleaner luxury presentation.";

  const features = [
    { icon: <Diamond className="w-5 h-5" />, title: "Curated selection", desc: "A refined overview of the current collection." },
    { icon: <Gem className="w-5 h-5" />, title: "Flexible browsing", desc: "Quickly move between categories and styles." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Luxury layout", desc: "Editorial spacing with high contrast imagery." },
  ];

  return (
    <CategoryPageTemplate
      category={category ?? null}
      pageType="all"
      icon={<Diamond className="w-8 h-8" />}
      title={title}
      description={description}
      image={ring2}
      canonicalPath="/products"
      breadcrumbs={[
        { label: "Products", href: "/products" },
      ]}
      features={features}
    />
  );
};

export default ProductsPage;
