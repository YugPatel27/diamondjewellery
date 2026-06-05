import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, Diamond, Shield, Sparkles, Truck, ArrowRight } from "@/components/Icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartItemCustomizationDisplay } from "@/components/CartItemCustomizationDisplay";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/SEOHead";
import { productAPI } from "@/lib/api";
import { type Product } from "@/data/products";
import { useEffect } from "react";


const FALLBACK = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=75";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { formatPrice } = useCurrency();
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await productAPI.getAll();
        if (response.success && response.products) {
          // Filter out items already in cart and take first 4
          const cartIds = new Set(items.map(i => i.product.id));
          const recs = response.products
            .filter((p: Product) => !cartIds.has(p.id))
            .slice(0, 4);
          setRecommendations(recs);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
    };
    fetchRecommendations();
  }, [items]);


  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const grandTotal = totalPrice;
  const subtotal = Math.round(grandTotal / 1.03);
  const gst = grandTotal - subtotal;



  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Your Cart | Diamond Jewels" description="View your shopping cart." />
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/5">
            <ShoppingBag className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-light mb-3 text-foreground">Your Bag is Empty</h1>
          <div className="gold-divider mb-4" />
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            It seems you haven&apos;t discovered your perfect piece yet. Explore our curated collections.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/engagement-rings" className="btn-gold px-8 py-3 text-xs">
              <Diamond className="w-3.5 h-3.5" /> Shop Engagement Rings
            </Link>
            <Link to="/jewellery" className="btn-outline px-8 py-3 text-xs">Explore All</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`Cart (${items.length}) | Diamond Jewels`} description="Review your selected items before checkout." />
      <Header />

      <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-12">
        <section className="mb-6 sm:mb-8 rounded-[2rem] border border-border/40 bg-card/80 p-5 sm:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">Your Selection</h1>
                <span className="text-[10px] font-bold text-accent uppercase tracking-[0.28em] bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                  {items.length} {items.length === 1 ? "piece" : "pieces"}
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base">
                Review your pieces, adjust quantities, and move to secure checkout when you&apos;re ready.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="btn-outline border-border/50 px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase"
              >
                Back to shop
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    openAuth();
                    return;
                  }
                  navigate("/checkout");
                }}
                className="btn-gold btn-slide-up px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase"
              >
                <span>Checkout</span>
              </button>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 xl:gap-6 items-start">
          <section className="xl:col-span-8 space-y-3">
            {items.map(({ product, quantity, customization }: any, index) => {
              const customPrice = customization?.customizationPrice || 0;
              const itemPrice = product.price + customPrice;
              const itemTotal = itemPrice * quantity;
              const imgSrc = imgErrors[product.id] ? FALLBACK : product.image;

              return (
                <article
                  key={`${product.id}-${index}`}
                  className="group rounded-[1.75rem] border border-border/40 bg-card/80 p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                  style={{ animation: `cartSlideIn 0.4s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex gap-4 sm:gap-5 lg:gap-6">
                    <Link to={`/product/${product.id}`} className="flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden bg-white border border-border/20 shadow-sm group-hover:border-accent/30 transition-colors">
                        <img
                          src={imgSrc}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                          onError={() => setImgErrors((p) => ({ ...p, [product.id]: true }))}
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-heading text-base sm:text-lg lg:text-xl font-light text-foreground hover:text-accent transition-colors leading-tight">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/65">
                            <span>{product.metal}</span>
                            <span>·</span>
                            <span>{product.carat}ct</span>
                            <span>·</span>
                            <span>{product.style}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id, customization)}
                          className="p-2 rounded-full text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                          aria-label={`Remove ${product.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Quantity</span>
                            <div className="flex items-center rounded-full border border-border/40 bg-background p-1 shadow-sm">
                              <button
                                onClick={() => {
                                  if (quantity <= 1) {
                                    removeFromCart(product.id, customization);
                                  } else {
                                    updateQuantity(product.id, quantity - 1, customization);
                                  }
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/60 hover:text-accent transition-colors text-foreground"
                                aria-label={`Decrease ${product.name} quantity`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-foreground">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1, customization)}
                                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/60 hover:text-accent transition-colors text-foreground"
                                aria-label={`Increase ${product.name} quantity`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground/75 leading-6">
                            {customization ? "Customized piece included in total." : "Standard item pricing shown below."}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Item total</p>
                          <p className="mt-1 font-heading text-xl sm:text-2xl font-semibold text-accent">{formatPrice(itemTotal)}</p>
                        </div>
                      </div>

                      {customization ? (
                        <div className="mt-4">
                          <CartItemCustomizationDisplay customization={customization} itemPrice={itemTotal} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="xl:col-span-4">
            <div className="sticky top-28 group overflow-hidden rounded-[2rem] border border-border/50 bg-card/90 p-5 sm:p-6 lg:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl animate-cart-in shine-container">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-80" />
              <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-foreground/5 blur-3xl dark:bg-white/5" />
              <div className="shine-sweep-hover" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-accent">Secure checkout</p>
                    <h2 className="mt-2 font-heading text-2xl sm:text-[2rem] font-light text-foreground">Order Summary</h2>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-foreground/65">
                      Premium review, insured delivery, and a clean path to payment.
                    </p>
                  </div>

                  <div className="shrink-0 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/75 shadow-sm">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </div>
                </div>

                <div className="mt-5 rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-background via-background to-accent/5 p-4 sm:p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Subtotal</span>
                        <p className="mt-1 text-xl font-semibold text-foreground">{formatPrice(subtotal)}</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl border border-accent/20 bg-accent/10 flex items-center justify-center text-accent shadow-inner">
                        <Diamond className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">GST (3%)</span>
                        <p className="mt-1 text-xs text-foreground/55 italic">Included in price</p>
                      </div>
                      <span className="font-semibold text-foreground">{formatPrice(gst)}</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Shipping</span>
                      <span className="inline-flex w-fit items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.24em] text-accent">
                        Given By Our Employee
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.75rem] border border-accent/20 bg-gradient-to-br from-accent/12 via-accent/8 to-transparent p-4 sm:p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Total payable</span>
                      <p className="mt-2 font-heading text-3xl sm:text-4xl font-semibold text-foreground">
                        <span className="text-gold-gradient">{formatPrice(grandTotal)}</span>
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/20 bg-background/80 text-accent shadow-lg shadow-accent/10">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => {
                      if (!user) {
                        openAuth();
                        return;
                      }
                      navigate("/checkout");
                    }}
                    className="group/cta btn-gold relative w-full overflow-hidden py-3.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.24em] shadow-lg shadow-accent/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="shine-sweep-hover" />
                    PROCEED TO SECURE CHECKOUT <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full py-3 rounded-full border border-border/60 bg-background/60 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-center block text-foreground/80 hover:text-foreground hover:border-accent/30 hover:bg-accent/5 transition-colors uppercase"
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* You May Also Like Section */}
        {recommendations.length > 0 && (
          <section className="mt-20 mb-10 mt-20">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Personal recommendations</p>
                <h2 className="mt-2 font-heading text-3xl font-light text-foreground">You May Also Like</h2>
              </div>
              <Link to="/jewellery" className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground hover:text-accent transition-colors">
                View all collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {recommendations.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-border/40 p-6 transition-all duration-500 group-hover:shadow-xl group-hover:border-accent/30 group-hover:-translate-y-2">
                    <img
                      src={product.image || product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="font-heading text-sm font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{product.style}</p>
                    <p className="mt-2 text-sm font-bold text-accent">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>


      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/30 bg-background/95 backdrop-blur-md px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Total payable</p>
            <p className="truncate font-heading text-lg font-semibold text-foreground">{formatPrice(grandTotal)}</p>
          </div>
          <button
            onClick={() => {
              if (!user) {
                openAuth();
                return;
              }
              navigate("/checkout");
            }}
            className="btn-gold flex-1 py-3 text-[10px] font-bold tracking-[0.2em] uppercase"
          >
            Checkout now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
