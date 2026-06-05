import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Home, Package, ArrowRight, Download, Diamond, Clock } from "@/components/Icons";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import InvoiceReceipt from "@/components/InvoiceReceipt";
import { orderAPI, productAPI } from "@/lib/api";
import { useCurrency } from "@/contexts/CurrencyContext";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

const FALLBACK = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=75";

interface OrderItem {
  name: string; price: number; quantity: number;
  image: string; description: string;
  customization?: any; customizationPrice?: number;
}
interface Order {
  orderId: string; items: OrderItem[]; totalPrice: number;
  gst: number; finalTotal: number; totalItems: number;
  shippingAddress: { name: string; email: string; phone: string; address: string; city: string; pincode: string; };
  notes: string; paymentMethod: string; paymentStatus: string;
  createdAt: string; status: string; trackingNumber?: string;
}

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { formatPrice } = useCurrency();

  const orderId = params.get("orderId");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) { setLoading(false); return; }

      // Try backend first
      try {
        const response = await orderAPI.getOrderById(orderId);
        if (response.success && response.order) {
          setOrder(response.order);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("[OrderConfirmation] Backend unavailable, checking localStorage");
      }

      // Fallback: localStorage
      try {
        const orders = JSON.parse(localStorage.getItem("localOrders") || "[]");
        const local = orders.find((o: any) => o.orderId === orderId);
        if (local) { setOrder(local); }
        else { toast.error("Order not found"); }
      } catch { toast.error("Failed to load order details"); }
      setLoading(false);
    };
    fetchOrder();

    const fetchRecommendations = async () => {
      try {
        const response = await productAPI.getAll();
        if (response.success && response.products) {
          setRecommendations(response.products.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
    };
    fetchRecommendations();
  }, [orderId]);




  const steps = [
    { label: "Order Placed", done: true, icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Confirmed", done: order?.status !== "pending", icon: <Diamond className="w-5 h-5" /> },
    { label: "Processing", done: ["processing", "shipped", "delivered"].includes(order?.status || ""), icon: <Package className="w-5 h-5" /> },
    { label: "Shipped", done: ["shipped", "delivered"].includes(order?.status || ""), icon: <Package className="w-5 h-5" /> },
    { label: "Delivered", done: order?.status === "delivered", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading your order details…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="font-heading text-2xl font-light mb-3">Order not found</p>
          <p className="text-sm text-muted-foreground mb-8">The order ID may be invalid or expired</p>
          <Link to="/" className="btn-gold">Back to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`Order Confirmed #${order.orderId} | DiamondJewels`} description="Your order has been successfully placed. View your order details and download your invoice." />
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Success Banner ── */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 sm:p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-light text-emerald-900 dark:text-emerald-100 mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-4">
            Thank you for your order. We'll send a confirmation to <strong>{order.shippingAddress.email}</strong>
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 rounded-full px-4 py-2 text-sm font-semibold">
            Order ID: #{order.orderId}
          </div>
        </div>

        {/* ── Order Tracking Steps ── */}
        <div className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6 mb-6">
          <h2 className="font-heading text-lg font-semibold mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" /> Order Status
          </h2>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-emerald-600 text-white" : "bg-secondary/50 text-muted-foreground"}`}>
                  {step.icon}
                </div>
                <p className={`text-[10px] font-semibold tracking-wide text-center ${step.done ? "text-emerald-600" : "text-muted-foreground"}`}>{step.label}</p>
                {i < steps.length - 1 && (
                  <div className={`absolute hidden sm:block w-full h-0.5 ${step.done ? "bg-emerald-600" : "bg-border/50"}`} style={{ top: "18px", left: "50%", width: "100%", zIndex: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6 mb-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 py-3 border-b border-border/30 last:border-b-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/30 border border-border/30">
                  <img
                    src={item.image || FALLBACK}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="font-semibold text-sm text-accent">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <PriceBreakdown
              total={order.totalPrice}
              gst={order.gst}
              grandTotal={order.finalTotal}
              certificationCharges={0}
              showBreakdown={true}
            />
          </div>
        </div>

        {/* ── Shipping Info ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div className="bg-card border border-border/50 rounded-2xl p-5">
            <h3 className="font-heading text-base font-semibold mb-3">Delivery Address</h3>
            <div className="text-sm space-y-1 text-foreground/80">
              <p className="font-semibold">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city} — {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.phone}</p>
              <p className="text-muted-foreground">{order.shippingAddress.email}</p>
            </div>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-5">
            <h3 className="font-heading text-base font-semibold mb-3">Payment Details</h3>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-foreground/70">Method</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-foreground/70">Status</span>
                <span className={`font-semibold capitalize ${order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between"><span className="text-foreground/70">Order Date</span><span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span></div>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setShowInvoice(!showInvoice)}
            className="btn-gold"
          >
            <Download className="w-4 h-4" /> {showInvoice ? "Hide Invoice" : "Download Invoice"}
          </button>
          <Link to="/my-orders" className="btn-ghost">
            <Package className="w-4 h-4" /> My Orders
          </Link>
          <Link to="/" className="btn-ghost">
            <Home className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* ── Invoice ── */}
        {showInvoice && (
          <div className="mt-8">
            <InvoiceReceipt order={order} />
          </div>
        )}

        {/* ── Suggested Products ── */}
        {recommendations.length > 0 && (

          <section className="mt-16 pt-10 border-t border-border/40">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Suggested for you</p>
                <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-light text-foreground">You May Also Like</h2>
              </div>
              <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground hover:text-accent transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {recommendations.map((product) => (

                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group overflow-hidden rounded-2xl border border-border/40 bg-card transition-all hover:border-accent/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white">
                    <img
                      src={product.image || product.images?.[0] || FALLBACK}
                      alt={product.name}
                      className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full border border-border/50 bg-background px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground shadow-lg">
                        + Add to cart
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 font-heading text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                      {product.name}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {product.style}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-accent">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
