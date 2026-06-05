import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Map } from "@/components/Icons";

const sitemapSections = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/" },
      { label: "Engagement Rings", href: "/engagement-rings" },
      { label: "Wedding Rings", href: "/wedding-rings" },
      { label: "Eternity Rings", href: "/eternity-rings" },
      { label: "Jewellery", href: "/jewellery" },
      { label: "Necklaces", href: "/necklaces" },
      { label: "Earrings", href: "/earrings" },
      { label: "Bracelets", href: "/bracelets" },
      { label: "Bespoke Jewellery", href: "/bespoke" },
    ],
  },
  {
    title: "Engagement Styles",
    links: [
      { label: "Solitaire Rings", href: "/solitaire-rings" },
      { label: "Halo Rings", href: "/halo-rings" },
      { label: "Vintage Rings", href: "/vintage-rings" },
      { label: "Trilogy Rings", href: "/trilogy-rings" },
      { label: "Diamond Band", href: "/diamond-band" },
    ],
  },
    {
      title: "Diamonds & Gemstones",
      links: [
        { label: "All Diamonds", href: "/diamonds" },
        { label: "Natural Diamonds", href: "/natural-diamonds" },
        { label: "Lab Grown Diamonds", href: "/lab-grown-diamonds" },
        { label: "Loose Diamonds", href: "/loose-diamonds" },
        { label: "Gemstones", href: "/gemstones" },
      ],
    },
  {
    title: "Customer Service",
    links: [
      { label: "Book Appointment", href: "/book-appointment" },
      { label: "Customer Service", href: "/customer-service" },
      { label: "FAQs", href: "/faq" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shopping Cart", href: "/cart" },
    ],
  },
  {
    title: "Education",
    links: [
      { label: "Diamond Education", href: "/education" },
    ],
  },
  {
    title: "Legal & Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Profile", href: "/profile" },
      { label: "My Orders", href: "/my-orders" },
      { label: "Admin Panel", href: "/admin" },
    ],
  },
];

const SitemapPage = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground px-4 sm:px-6 py-3">
      <Link to="/" className="hover:text-foreground">Home</Link>
      <span>/</span>
      <span className="text-foreground">Sitemap</span>
    </div>
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-10">
        <Map className="w-10 h-10 text-accent mx-auto mb-4" />
        <h1 className="font-heading text-3xl sm:text-4xl font-light">Sitemap</h1>
        <p className="text-sm text-muted-foreground mt-3">Quick access to all pages</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sitemapSections.map((s) => (
          <div key={s.title}>
            <h2 className="font-heading text-lg font-medium mb-3 border-b border-border pb-2">{s.title}</h2>
            <ul className="space-y-2">
              {s.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    → {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default SitemapPage;
