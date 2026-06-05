import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Truck, Lock, CheckCircle, Package, Sparkles, Diamond, ArrowRight } from "@/components/Icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartItemCustomizationDisplay } from "@/components/CartItemCustomizationDisplay";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { orderAPI } from "@/lib/api";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
};

const FALLBACK = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=75";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, openAuth } = useAuth();
  const { addLog } = useActivityLog();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", pincode: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const submittingRef = useRef(false);
  const checkoutTokenRef = useRef(`chk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

  const grandTotal = totalPrice;
  const subtotal = Math.round(grandTotal / 1.03);
  const gst = grandTotal - subtotal;

  useEffect(() => {
    if (user && !form.name) {
      setForm((f) => ({ ...f, name: user.name, email: user.email, phone: user.phone }));
    }
  }, [user]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    if (!form.name || !form.email || !form.address || !form.city || !form.pincode || !form.phone) {
      toast.error("Please provide complete delivery credentials");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    const orderItems = items.map((item) => ({
      productId: String(item.product.id),
      name: item.product.name,
      price: item.product.price + ((item as any).customization?.customizationPrice || 0),
      quantity: item.quantity || 1,
      image: item.product.image,
      description: item.product.description || "",
      customization: (item as any).customization
        ? { ...(item as any).customization, customizationPrice: (item as any).customization.customizationPrice || (item as any).customization.selectedDiamond?.price || 0 }
        : undefined,
    }));

    const shippingAddress = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
    };

    try {
      const orderData = {
        items: orderItems.map((i) => ({ productId: i.productId, quantity: i.quantity, customization: i.customization })),
        shippingAddress,
        notes: form.notes || "",
        paymentMethod: "cod",
        checkoutToken: checkoutTokenRef.current,
      };

      const response = await orderAPI.create(orderData);

      if (response.success && response.order) {
        const itemsList = items.map((i) => `${i.product.name} (x${i.quantity})`).join(", ");
        addLog({
          action: "Order Placed",
          description: `Order ID: ${response.order.orderId} | Total: ${formatPrice(grandTotal)} | Items: ${itemsList}`,
          userName: user.name,
        });
        clearCart();
        toast.success("Order secured! Transitioning to private payment...");
        setTimeout(() => navigate(`/payment?orderId=${response.order.orderId}`), 1000);
        return;
      }
    } catch (error: any) {
      console.warn("[Checkout] Backend unavailable, using local order fallback:", error.message);
    }

    const localOrderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const localOrder = {
      orderId: localOrderId,
      items: orderItems,
      totalPrice: subtotal,
      gst,
      finalTotal: grandTotal,
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
      shippingAddress,
      notes: form.notes || "",
      paymentMethod: "cod",
      paymentStatus: "pending",
      status: "pending",
      createdAt: new Date().toISOString(),
      _isLocal: true,
    };

    const existingOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
    existingOrders.push(localOrder);
    localStorage.setItem("localOrders", JSON.stringify(existingOrders));

    const itemsList = items.map((i) => `${i.product.name} (x${i.quantity})`).join(", ");
    addLog({
      action: "Order Placed",
      description: `Order ID: ${localOrderId} | Total: ${formatPrice(grandTotal)} | Items: ${itemsList}`,
      userName: user.name,
    });
    clearCart();
    toast.success("Order secured! Transitioning to payment...");
    setTimeout(() => navigate(`/payment?orderId=${localOrderId}`), 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Checkout | Diamond Jewels" description="Secure checkout." />
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-32 text-center">
          <ScrollReveal>
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="font-heading text-4xl font-light mb-4">No Items to Checkout</h1>
            <p className="text-foreground/60 text-base mb-10">Your selection is currently empty. Discover our collections to proceed.</p>
            <Link to="/" className="btn-gold px-12">Return to Collections</Link>
          </ScrollReveal>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Checkout | Diamond Jewels" description="Secure checkout." />
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-32 text-center">
          <ScrollReveal>
            <Lock className="w-16 h-16 text-accent mx-auto mb-6 opacity-30" />
            <h1 className="font-heading text-4xl font-light mb-4">Luxury Requires Recognition</h1>
            <p className="text-foreground/60 text-base mb-10 leading-relaxed">Please sign in to your exclusive account to proceed with your secure checkout experience.</p>
            <button onClick={openAuth} className="btn-gold px-12 uppercase tracking-widest text-xs font-bold py-4">Authenticate & Checkout</button>
          </ScrollReveal>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Secure Checkout | Diamond Jewels" description="Complete your purchase securely." />
      <Header />

      <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 sm:pb-16">
        <ScrollReveal>
          <div className="mb-8 rounded-[2rem] border border-border/40 bg-card/70 p-5 sm:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold tracking-[0.26em] uppercase mb-3">
                  <Lock className="w-4 h-4" /> Secure gateway
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">Secure Checkout</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base">
                  Confirm your delivery details, review your order, and continue to payment in a guided flow.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/15 bg-emerald-500/8 px-3 py-2 text-emerald-700">
                  <CheckCircle className="w-4 h-4" /> Selection
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-background px-3 py-2 text-foreground">
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] shadow-lg shadow-accent/20">2</span>
                  Credentials
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-background px-3 py-2">
                  <span className="w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-[10px]">3</span>
                  Payment
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
          <div className="xl:col-span-7 space-y-6 sm:space-y-8">
            <ScrollReveal>
              <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-[2rem] p-5 sm:p-8 lg:p-10 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/10">
                  <Truck className="w-6 h-6 text-accent" />
                  <h2 className="font-heading text-2xl font-light">Delivery Identity</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Recipient Name</label>
                    <input required type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" placeholder="Enter full legal name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Private Email</label>
                    <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Secure Phone</label>
                    <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Street Residence</label>
                    <textarea required value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all resize-none" rows={3} placeholder="Complete physical address" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">City / Region</label>
                    <input required type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" placeholder="London" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">PIN / Postal Code</label>
                    <input required type="text" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" placeholder="XXXXXX" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-[2rem] p-5 sm:p-8 lg:p-10 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h2 className="font-heading text-xl font-light">Luxury Enhancements & Notes</h2>
                </div>
                <textarea
                  placeholder="Request gift packaging, personal messages, or specific delivery instructions..."
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all resize-none"
                  rows={3}
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="xl:col-span-5">
            <ScrollReveal>
              <div className="bg-foreground text-background backdrop-blur-md border border-border/40 rounded-[2rem] p-5 sm:p-7 lg:p-8 sticky top-24 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                <div className="flex items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent/90">Secure summary</p>
                    <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-light text-background">Order Overview</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-background/80">
                    {items.length} items
                  </div>
                </div>

                <div className="space-y-4 max-h-[30vh] sm:max-h-[34vh] overflow-y-auto pr-2 sm:pr-3 mb-6 custom-scrollbar">
                  {items.map(({ product, quantity, customization }: any, i) => {
                    const customTotal = ((customization?.customizationPrice || 0) * quantity) || 0;
                    const itemTotal = product.price * quantity + customTotal;
                    const imgSrc = imgErrors[product.id] ? FALLBACK : product.image;

                    return (
                      <div key={`${product.id}-${i}`} className="flex gap-4 items-start rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-background border border-border/40 flex-shrink-0 shadow-inner">
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-full h-full object-contain p-1.5"
                            onError={() => setImgErrors((p) => ({ ...p, [product.id]: true }))}
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-heading text-sm sm:text-base font-semibold truncate leading-tight text-background">{product.name}</h4>
                            <span className="font-semibold text-xs sm:text-sm text-accent whitespace-nowrap">{formatPrice(itemTotal)}</span>
                          </div>
                          <p className="text-[10px] font-bold text-background/55 mt-1 uppercase tracking-widest">Qty: {quantity}</p>
                          {customization && (
                            <div className="mt-2 scale-90 origin-top-left opacity-80">
                              <CartItemCustomizationDisplay customization={customization} itemPrice={itemTotal} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-background/60 uppercase tracking-widest text-[9px] font-bold">Subtotal</span>
                    <span className="font-semibold text-background">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="text-background/60 uppercase tracking-widest text-[9px] font-bold">GST (3%)</span>
                      <span className="text-[8px] text-background/40 italic lowercase">Included</span>
                    </div>
                    <span className="font-semibold text-background">{formatPrice(gst)}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="font-heading text-xl text-background">Grand Total</span>
                    <span className="text-3xl font-heading font-semibold text-accent">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full py-4 sm:py-5 rounded-full text-[10px] text-yellow sm:text-sm font-bold tracking-[0.22em] shadow-lg shadow-accent/20 disabled:opacity-50 disabled:shadow-none"
                >
                  {submitting ? "AUTHENTICATING..." : "PROCEED TO SECURE PAYMENT"}
                </button>
              </div>
            </ScrollReveal>
          </div>
        </form>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/30 bg-background/95 backdrop-blur-md px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Grand total</p>
            <p className="truncate font-heading text-lg font-semibold text-foreground">{formatPrice(grandTotal)}</p>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={submitting}
            className="btn-gold flex-1 py-3 text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
