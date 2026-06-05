interface ProductSettingsDisplayProps {
  category: string;
}

const ringStyles = [
  {
    name: "Traditional",
    description: "A classic court-shaped band with clean lines. The most traditional style that never goes out of fashion. Timeless elegance that suits every occasion and diamond shape."
  },
  {
    name: "Soft Court",
    description: "A contemporary take on the traditional court band. Features gentle curved edges that provide a modern, comfortable fit. Perfect for everyday wear with a contemporary aesthetic."
  },
  {
    name: "D-shape",
    description: "A sturdy and robust profile that's ideal for active lifestyles. The D-shaped cross-section offers maximum durability and strength while maintaining a sleek appearance. Excellent protection for precious stones."
  },
  {
    name: "Flat Court",
    description: "A sophisticated flat band profile that creates a minimalist look. The flat surface maximizes the visual impact of the diamond while providing a comfortable, modern fit. Great for subtle elegance."
  }
];

const earringSettings = [
  {
    name: "Stud Earrings",
    description: "Classic and versatile studs with secure backing. Perfect for everyday wear and formal occasions. Available with various diamond shapes and sizes for personalization."
  },
  {
    name: "Drop Earrings",
    description: "Elegant dangles that add movement and sophistication. The diamonds suspend below the ear, creating a distinctive silhouette. Ideal for special occasions and enhancing facial features."
  },
  {
    name: "Chandelier Earrings",
    description: "Elaborate and ornate designs featuring multiple diamonds in cascading arrangements. These statement pieces command attention and add glamour to any ensemble."
  },
  {
    name: "Halo Earrings",
    description: "A central diamond surrounded by smaller diamonds creating a luminous halo effect. Maximizes sparkle and creates incredible visual impact for formal events."
  }
];

const necklaceSettings = [
  {
    name: "Solitaire Pendant",
    description: "A single diamond suspended from an elegant chain. The epitome of sophistication and timeless beauty. Perfect for showcasing a premium diamond or creating a minimalist statement."
  },
  {
    name: "Three Stone Pendant",
    description: "A center diamond flanked by two side stones on either side. Symbolizes past, present, and future. Versatile design that complements various styles and occasions."
  },
  {
    name: "Halo Pendant",
    description: "A central diamond surrounded by smaller diamonds in a halo setting. Creates maximum sparkle and visual impact. The surrounding diamonds make the center stone appear larger and more brilliant."
  },
  {
    name: "Pendant Necklace",
    description: "Various pendant designs with different shapes and configurations. Can include geometric shapes, flowers, or intricate patterns. Express your unique style with custom designs."
  }
];

const braceletSettings = [
  {
    name: "Tennis Bracelet",
    description: "A continuous line of diamonds set closely together in a delicate band. The classic choice for elegant occasions. Each diamond is securely set for everyday wearability and durability."
  },
  {
    name: "Diamond Bangle",
    description: "A rigid bracelet featuring diamonds set in a circular band. Available in various widths and designs. Perfect for stacking or wearing as a standalone statement piece."
  },
  {
    name: "Link Bracelet",
    description: "Individual diamond-set links connected together creating a flexible, comfortable bracelet. Each link can feature different diamond shapes for a custom look. Perfect for layering."
  },
  {
    name: "Cuff Bracelet",
    description: "A structured, open-ended design that slides over the wrist. Features prominent diamond settings with architectural designs. Creates a bold, sophisticated statement."
  }
];

export const ProductSettingsDisplay = ({ category }: ProductSettingsDisplayProps) => {
  let settings = [];
  let title = "";

  switch (category) {
    case "Rings":
      settings = ringStyles;
      title = "Ring Styles & Designs";
      break;
    case "Earrings":
      settings = earringSettings;
      title = "Earring Styles & Settings";
      break;
    case "Necklaces":
      settings = necklaceSettings;
      title = "Necklace Styles & Pendant Types";
      break;
    case "Bracelets":
      settings = braceletSettings;
      title = "Bracelet Styles & Designs";
      break;
    default:
      return null;
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <h2 className="font-heading text-2xl sm:text-3xl font-light mb-3">{title}</h2>
        <div className="w-12 h-px bg-accent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {settings.map((setting, idx) => (
          <div key={idx} className="border border-border p-6 hover:shadow-md transition-shadow">
            <h3 className="font-heading text-lg font-medium mb-3">{setting.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{setting.description}</p>
            
            {/* Visual indicator for design */}
            <div className="mt-4 p-4 bg-secondary/20 rounded flex items-center justify-center min-h-[100px]">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center">
                  {idx === 0 && <span className="text-xs font-bold text-accent">◆</span>}
                  {idx === 1 && <span className="text-xs text-accent">✧</span>}
                  {idx === 2 && <span className="text-xs text-accent">✦</span>}
                  {idx === 3 && <span className="text-xs text-accent">✶</span>}
                </div>
                <p className="text-xs text-muted-foreground">{setting.name}</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Available in multiple metals
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Customizable configurations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Certified diamonds included
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Additional Information Section */}
      <div className="mt-12 border-t border-border pt-12">
        <h3 className="font-heading text-xl font-medium mb-6">Choose Your Perfect {category}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Diamond Quality</p>
            <p className="text-sm">GIA/IGI Certified</p>
            <p className="text-xs text-muted-foreground mt-1">Lab-Grown or Natural</p>
          </div>
          <div className="border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Metal Options</p>
            <p className="text-sm">White, Yellow, Rose Gold</p>
            <p className="text-xs text-muted-foreground mt-1">Platinum Available</p>
          </div>
          <div className="border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Customization</p>
            <p className="text-sm">Personalized Designs</p>
            <p className="text-xs text-muted-foreground mt-1">Expert Consultation Available</p>
          </div>
          <div className="border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Warranty</p>
            <p className="text-sm">Lifetime Warranty</p>
            <p className="text-xs text-muted-foreground mt-1">Free Maintenance</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSettingsDisplay;
