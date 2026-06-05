import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Heart, ShoppingBag, ChevronRight, ChevronLeft, Diamond, ShieldCheck, Truck, RefreshCw, Sparkles } from "@/components/Icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ProductCustomizer } from "@/components/ProductCustomizer";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { productAPI } from "@/lib/api";
import { type Product } from "@/data/products";
import { getProductImage, getProductImages, getProductPrimaryImage } from "@/lib/productImages";

import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import ExpertGuidance from "@/components/ExpertGuidance";

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [quantity, setQuantity] = useState(1);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customization, setCustomization] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { user, openAuth } = useAuth();
  const { addLog } = useActivityLog();
  const { formatPrice } = useCurrency();
  const productRef = useRef<HTMLElement>(null);

  // Fetch product and scroll to top
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setSelectedImage(0);
      setImageErrors({});
      try {
        if (!id) return;

        try {
          const response = await productAPI.getById(id);
          if (response.success && response.product) {
            setProduct(response.product);
          } else {
            setProduct(null);
          }
        } catch (apiError) {
          console.error('API fetch failed:', apiError);
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await productAPI.getAll();
        if (response.success && response.products) {
          const recs = response.products
            .filter((p: Product) => String(p.id) !== String(id))
            .slice(0, 4);
          setRecommendations(recs);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
    };

    fetchProduct();
    fetchRecommendations();


    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-40">
          <Diamond className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="font-heading text-xl text-muted-foreground animate-pulse">Revealing Brilliance...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-40">
          <p className="font-heading text-2xl text-muted-foreground mb-8">Elegance Not Found</p>
          <Link to="/" className="btn-gold text-sm">Back to Collections</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWished = wishlist.includes(product.id.toString());
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const baseGalleryImages = getProductImages(product, Math.max(3, product.images?.length || 0));
  const galleryImages = baseGalleryImages.map((img, i) => (imageErrors[i] ? getProductImage(product, i + 1) : img));
  const activeImage = galleryImages[selectedImage] ?? galleryImages[0];


  const isRing = product.category === "Rings";
  const supportsCustomization = ["Rings", "Earrings", "Necklaces"].includes(product.category);

  const handleCustomizationComplete = (customizationConfig: any) => {
    const customizationWithPrice = {
      ...customizationConfig,
      customizationPrice: customizationConfig.selectedDiamond?.price || 0,
    };
    setCustomization(customizationWithPrice);
    setShowCustomizer(false);
    toast.success("Customization applied! Ready to add to cart");
  };

  const handleAddToCart = () => {
    if (!user) { openAuth(); toast.info("Please login to add items"); return; }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, customization);
    }

    const customDetails = [];
    if (customization?.ringSize) customDetails.push(`Ring Size: ${customization.ringSize}`);
    if (customization?.categoryOption) customDetails.push(`Option: ${customization.categoryOption}`);
    if (customization?.engravingText) customDetails.push(`Engraving: ${customization.engravingText}`);
    if (customization?.selectedDiamond) customDetails.push(`Diamond: ${customization.selectedDiamond.carat}ct`);

    const detailsStr = customDetails.length > 0 ? ` (${customDetails.join(", ")})` : "";
    addLog({
      userName: user.name,
      userPhone: user.phone,
      action: "Added to Cart",
      description: `${product.name}${detailsStr} x${quantity} - ${formatPrice(product.price * quantity)}`
    });
    toast.success(`${product.name} x${quantity} added to cart!`);
    navigate('/cart');
  };

  const handleWishlist = () => {
    if (!user) {
      openAuth();
      toast.info("Please login to add items to wishlist");
      return;
    }
    toggleWishlist(product.id.toString(), true);
    toast.success(isWished ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.name} | Diamond Jewels`}
        description={product.description}
        keywords={[product.name, product.category, product.metal, "fine jewellery"]}
        ogImage={galleryImages[0]}
        ogType="product"
        canonical={`https://diamondjewels.com/product/${product.id}`}
        price={product.price}
      />
      <Header />

      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight className="w-3 h-3 mx-1" />
        <Link to={`/${product.category.toLowerCase()}`}>{product.category}</Link>
        <ChevronRight className="w-3 h-3 mx-1" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <main ref={productRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <ScrollReveal>
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm shadow-2xl shadow-black/5 flex items-center justify-center aspect-square">
                <AnimatePresence mode="popLayout" custom={slideDir}>
                  <motion.img
                    key={selectedImage}
                    src={activeImage}
                    alt={product.name}
                    custom={slideDir}
                    variants={{
                      enter: (direction: 'left' | 'right') => ({ x: direction === 'right' ? -100 : 100, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (direction: 'left' | 'right') => ({ x: direction === 'right' ? 100 : -100, opacity: 0 })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="eager"
                    onError={() => setImageErrors((prev) => ({ ...prev, [selectedImage]: true }))}
                  />
                </AnimatePresence>
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-20 pointer-events-none">
                  <span className={`pointer-events-auto px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${product.diamondType === "lab" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"}`}>
                    {product.diamondType === "lab" ? "Lab Grown" : "Natural"}
                  </span>
                  {discount > 0 && (
                    <span className="pointer-events-auto px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-sale/10 border border-sale/20 text-sale">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <button
                  onClick={handleWishlist}
                  className={`absolute top-6 right-6 z-20 p-3 rounded-full bg-background/80 backdrop-blur-md border border-border/40 shadow-lg transition-all duration-300 ${isWished ? "text-sale scale-110" : "text-muted-foreground hover:text-sale hover:scale-110"}`}
                >
                  <Heart className={`w-5 h-5 ${isWished ? "fill-current" : ""}`} />
                </button>
                {/* Gallery Navigation Cursors */}
                {galleryImages.length > 1 && (
                  <>
                    <div
                      onClick={() => { setSlideDir('right'); setSelectedImage((prev) => prev === 0 ? galleryImages.length - 1 : prev - 1); }}
                      className="absolute inset-y-0 left-0 w-1/2 z-10"
                      style={{ cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='filter: drop-shadow(0px 0px 2px rgba(0,0,0,1));'%3E%3Cpath d='M19 12H5M12 19l-7-7 7-7'/%3E%3C/svg%3E\") 16 16, w-resize" }}
                      title="Previous image"
                    />
                    <div
                      onClick={() => { setSlideDir('left'); setSelectedImage((prev) => prev === galleryImages.length - 1 ? 0 : prev + 1); }}
                      className="absolute inset-y-0 right-0 w-1/2 z-10"
                      style={{ cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='filter: drop-shadow(0px 0px 2px rgba(0,0,0,1));'%3E%3Cpath d='M5 12h14M12 5l7 7-7 7'/%3E%3C/svg%3E\") 16 16, e-resize" }}
                      title="Next image"
                    />
                  </>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSlideDir(i > selectedImage ? 'left' : 'right'); setSelectedImage(i); }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === i ? "border-accent scale-95 shadow-lg shadow-accent/20" : "border-transparent opacity-50 hover:opacity-100 hover:border-border/60"}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => setImageErrors((prev) => ({ ...prev, [i]: true }))}
                    />
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Product Info */}
          <ScrollReveal>
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                  <Sparkles className="w-4 h-4" /> {product.category} Collection
                </div>
                <h1 className="font-heading text-4xl sm:text-5xl font-light leading-tight mb-2">
                  {product.name} <span className="text-muted-foreground italic">{product.style}</span>
                </h1>
                <div className="gold-divider mx-0 mb-4" />
                <p className="text-sm text-muted-foreground tracking-wide font-medium">
                  {product.metal} · {product.shape} Cut · {product.carat}ct
                </p>
              </div>

              <div className="flex items-center gap-5 mb-8">
                <span className="text-2xl text-muted-foreground line-through font-light">{formatPrice(product.originalPrice)}</span>
                <span className="text-4xl font-heading font-medium text-sale">{formatPrice(product.price)}</span>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 block sm:inline sm:mt-0">Inclusive of GST 3%</p>
              </div>

              <p className="text-base text-foreground/70 leading-relaxed mb-10 max-w-xl">
                {product.description}
              </p>

              {/* Specification Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Cut", val: product.cut },
                  { label: "Color", val: product.color },
                  { label: "Clarity", val: product.clarity },
                  { label: "Carat", val: `${product.carat}ct` },
                ].map((spec, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-border/40 bg-card/20 text-center">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-accent mb-1">{spec.label}</p>
                    <p className="text-sm font-semibold">{spec.val}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <PriceBreakdown
                  diamondPrice={product.diamondPrice || product.price * 0.6}
                  diamondCarat={product.carat}
                  diamondColor={product.color}
                  diamondClarity={product.clarity}
                  diamondCut={product.cut}
                  goldPrice={product.metalPrice || product.price * 0.2}
                  goldWeight={product.goldWeight}
                  metalType={product.metal}
                  makingCharges={product.makingCharges || Math.floor(product.price * 0.15)}
                  certificationCharges={0}
                  total={Math.round(product.price / 1.03)}
                  gst={product.price - Math.round(product.price / 1.03)}
                  grandTotal={product.price}
                />

                {/* Customization Section */}
                {supportsCustomization && !showCustomizer && (
                  <div className="rounded-[2rem] border-2 border-accent/20 border-dashed p-8 bg-accent/5">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-5 h-5 text-accent" />
                      <h3 className="font-heading text-xl font-medium">
                        Bespoke Personalization
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/60 mb-6 leading-relaxed">
                      Make this piece truly yours. Customize the setting, select a specific diamond, or add a heartfelt engraving.
                    </p>
                    <button
                      onClick={() => setShowCustomizer(true)}
                      className="w-full py-4 bg-card border border-accent text-accent font-bold rounded-2xl hover:bg-accent hover:text-accent-foreground transition-all text-xs tracking-widest uppercase"
                    >
                      BEGIN PERSONALIZATION
                    </button>
                    {customization && (
                      <div className="mt-4 p-4 bg-card rounded-2xl text-xs space-y-2 border border-accent/20">
                        {customization.ringSize && <p className="flex justify-between"><span>Ring Size:</span> <span className="font-bold text-accent">{customization.ringSize}</span></p>}
                        {customization.categoryOption && <p className="flex justify-between"><span>Option:</span> <span className="font-bold text-accent">{customization.categoryOption}</span></p>}
                        {customization.engravingText && <p className="flex justify-between"><span>Engraving:</span> <span className="font-bold text-accent">"{customization.engravingText}"</span></p>}
                        {customization.selectedDiamond && <p className="flex justify-between"><span>Diamond:</span> <span className="font-bold text-accent">{customization.selectedDiamond.carat}ct {customization.selectedDiamond.color}/{customization.selectedDiamond.clarity}</span></p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Customizer Component */}
                {showCustomizer && supportsCustomization && (
                  <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <ProductCustomizer
                      product={product}
                      onCustomizationComplete={handleCustomizationComplete}
                      isRing={isRing}
                      isDiamond={product.carat > 0.3}
                      category={product.category}
                    />
                  </div>
                )}

                <div className="space-y-3 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-2xl border border-border/60 bg-card/20 p-1">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-lg hover:text-accent transition-colors text-foreground" aria-label="Decrease quantity">−</button>
                      <span className="w-8 text-center font-bold text-foreground">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-lg hover:text-accent transition-colors text-foreground" aria-label="Increase quantity">+</button>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">Quantity</span>
                  </div>
                  {isRing && (
                    <button onClick={() => setShowCustomizer(true)} className="w-full py-3.5 bg-card dark:bg-secondary border border-border text-foreground font-bold rounded-2xl hover:border-accent hover:text-accent transition-all text-xs tracking-widest uppercase">
                      SIZING TOOL
                    </button>
                  )}
                  <button onClick={handleAddToCart} className="btn-gold btn-slide-up w-full py-4 flex items-center justify-center gap-3 text-sm font-bold tracking-[0.2em]">
                    <ShoppingBag className="w-5 h-5" /> <span>ADD TO CART</span>
                  </button>
                  <button onClick={handleAddToCart} className="w-full py-3.5 btn-slide-up bg-accent text-accent-foreground font-bold rounded-full hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs tracking-widest uppercase">
                    <span>BUY IT NOW</span>
                  </button>
                </div>

                {/* Trust Signals */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/20">
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70">BIS Hallmarked</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Truck className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70">Insured Shipping</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <RefreshCw className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70">Lifetime Service</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Design Narrative Section */}
        <ScrollReveal className="py-24 sm:py-32 border-t border-border/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-last lg:order-first">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Design Narrative</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-light mb-8 leading-tight">Born from a <br /> <span className="italic text-accent">moment of light</span></h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-xl">
                The {product.name} was inspired by the way morning light filters through the heritage windows of our London studio. Designed to capture and dance with every ray of light, this piece represents the perfect marriage of traditional artisanal techniques and modern structural elegance.
              </p>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-border/40 bg-secondary/10">
                  <h4 className="font-heading text-lg mb-2">The Inspiration</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">A celebration of geometric purity and organic flow, designed for the woman who finds beauty in the details of the everyday.</p>
                </div>
                <div className="p-6 rounded-2xl border border-border/40 bg-secondary/10">
                  <h4 className="font-heading text-lg mb-2">The Legacy</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Part of our signature {product.style} series, this piece is destined to become a cherished family heirloom, passing down stories of love and light.</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl">
              <img
                src={galleryImages[0]}
                alt="Design detail"
                className="w-full h-full object-cover"
                onError={() => setImageErrors((prev) => ({ ...prev, 0: true }))}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Technical Specifications Grid */}
        <ScrollReveal className="py-24 sm:py-32 bg-secondary/20 rounded-[3rem] px-8 sm:px-16 mb-24">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-4">Technical Depth</p>
            <h2 className="font-heading text-3xl sm:text-5xl font-light">The Anatomy of <span className="italic">Excellence</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h4 className="font-heading text-xl mb-4 text-accent">The Setting</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex justify-between"><span>Style</span> <span className="text-foreground font-medium">{product.style}</span></li>
                <li className="flex justify-between"><span>Prongs</span> <span className="text-foreground font-medium">Eagle Claw</span></li>
                <li className="flex justify-between"><span>Height</span> <span className="text-foreground font-medium">Low Profile</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-xl mb-4 text-accent">The Stone</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex justify-between"><span>Symmetry</span> <span className="text-foreground font-medium">Excellent</span></li>
                <li className="flex justify-between"><span>Polish</span> <span className="text-foreground font-medium">Excellent</span></li>
                <li className="flex justify-between"><span>Fluorescence</span> <span className="text-foreground font-medium">None</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-xl mb-4 text-accent">The Metal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex justify-between"><span>Purity</span> <span className="text-foreground font-medium">18K / 950 Pt</span></li>
                <li className="flex justify-between"><span>Finish</span> <span className="text-foreground font-medium">High Polish</span></li>
                <li className="flex justify-between"><span>Hallmark</span> <span className="text-foreground font-medium">BIS Certified</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-xl mb-4 text-accent">Certification</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex justify-between"><span>Authority</span> <span className="text-foreground font-medium">GIA / IGI</span></li>
                <li className="flex justify-between"><span>Report No.</span> <span className="text-foreground font-medium">Verify Online</span></li>
                <li className="flex justify-between"><span>Insurance</span> <span className="text-foreground font-medium">Complimentary</span></li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        {/* Luxury Presentation Section */}
        <ScrollReveal className="py-24 sm:py-32 border-b border-border/10 mb-24">
          <div className="text-center max-w-3xl mx-auto">
            <ShoppingBag className="w-12 h-12 text-accent mx-auto mb-8" />
            <h2 className="font-heading text-3xl sm:text-5xl font-light mb-8">Unboxing <span className="italic">the Magic</span></h2>
            <p className="text-muted-foreground text-lg mb-12">
              Every Diamond Jewels creation arrives in our signature velvet-lined presentation box, accompanied by its grading certificates and a personalized care kit, all secured within a discreet, insured parcel.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {["Presentation Box", "GIA Certificate", "Cleaning Kit", "Travel Pouch"].map(item => (
                <div key={item} className="p-4 rounded-xl border border-border/40 text-[10px] font-bold tracking-widest uppercase text-accent/60">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-accent">Suggested for you</p>
                <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-light">You May Also Like</h2>
              </div>
              <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground hover:text-accent transition-colors">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {recommendations.map((item) => (

                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group overflow-hidden rounded-2xl border border-border/40 bg-card transition-all hover:border-accent/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white">
                    <img
                      src={getProductPrimaryImage(item)}
                      alt={item.name}
                      className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getProductImage(item, 1);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full border border-border/50 bg-background px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground shadow-lg">
                        + Add to cart
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 font-heading text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                      {item.name}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {item.style}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-accent">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </main>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ExpertGuidance />
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
