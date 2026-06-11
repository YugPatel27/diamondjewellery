import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { orderAPI } from "@/lib/api";
import { generateOrderPDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";
import { Package, Eye, Clock, CheckCircle, Truck, XCircle, Download, ArrowRight, Diamond, Sparkles, Phone, Shield } from "@/components/Icons";
import { SEOHead } from "@/components/SEOHead";

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

const FALLBACK = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=75";

const MyOrders = () => {
  const { user, openAuth } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      let backendOrders = [];
      try {
        const response = await orderAPI.getMyOrders();
        if (response.success) {
          backendOrders = response.orders;
        }
      } catch (err) {
        console.warn("[MyOrders] Backend unavailable, showing local orders only.");
      }
      
      const localOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
      
      // Filter local orders to only show the ones belonging to the current user (if email matches)
      // or just show all local orders for the demo/offline purpose
      const mergedOrders = [...backendOrders, ...localOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Remove duplicates if any (by orderId)
      const uniqueOrders = mergedOrders.filter((v, i, a) => a.findIndex(t => t.orderId === v.orderId) === i);
      
      setOrders(uniqueOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      const localOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
      setOrders(localOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { icon: <Clock className="w-4 h-4" />, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
      case 'confirmed': return { icon: <Diamond className="w-4 h-4" />, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
      case 'processing': return { icon: <Package className="w-4 h-4" />, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" };
      case 'shipped': return { icon: <Truck className="w-4 h-4" />, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" };
      case 'delivered': return { icon: <CheckCircle className="w-4 h-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case 'cancelled': return { icon: <XCircle className="w-4 h-4" />, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
      default: return { icon: <Clock className="w-4 h-4" />, color: "text-muted-foreground", bg: "bg-secondary", border: "border-border" };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="My Orders | Diamond Jewels" description="View your order history." />
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-32 text-center">
          <ScrollReveal>
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8">
              <Package className="w-12 h-12 text-accent opacity-50" />
            </div>
            <h1 className="font-heading text-4xl font-light mb-4">Your Order Treasury</h1>
            <p className="text-foreground/60 text-base mb-10 max-w-sm mx-auto">Please sign in to view your order history and track your precious acquisitions.</p>
            <button onClick={openAuth} className="btn-gold px-12 py-4 text-xs font-bold tracking-widest">LOGIN TO VIEW ORDERS</button>
          </ScrollReveal>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <Diamond className="w-10 h-10 text-accent animate-pulse mb-6" />
          <p className="text-muted-foreground font-heading text-xl animate-pulse">Consulting your order history...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`My Orders (${orders.length}) | Diamond Jewels`} description="View your order history." />
      <Header />
      
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">My Orders</span>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-8 border-b border-border/30 gap-6">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-[0.2em] uppercase mb-3">
                <Sparkles className="w-4 h-4" /> Your Acquisitions
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-light leading-tight">Order History</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground bg-secondary/30 px-5 py-2 rounded-full border border-border/40">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Recorded
              </span>
              <Link to="/" className="btn-outline px-6 py-2 text-[10px] font-bold tracking-widest hidden sm:flex">
                SHOP MORE
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {orders.length === 0 ? (
          <ScrollReveal>
            <div className="bg-card/20 backdrop-blur-sm border border-border/40 rounded-[2.5rem] p-16 sm:p-24 text-center">
              <Package className="w-16 h-16 text-accent/20 mx-auto mb-6" />
              <h2 className="font-heading text-3xl font-light mb-4">No Orders Yet</h2>
              <p className="text-foreground/60 text-base max-w-sm mx-auto mb-10 leading-relaxed">Your journey with Diamond Jewels is just beginning. Your first acquisition will be recorded here.</p>
              <Link to="/engagement-rings" className="btn-gold px-12 py-4">
                <Diamond className="w-4 h-4" /> START SHOPPING
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-12">
            {orders.map((order, idx) => {
              const status = getStatusDisplay(order.status || 'pending');
              return (
                <ScrollReveal key={order._id}>
                  <div className="group bg-card/20 backdrop-blur-md border border-border/40 rounded-[2.5rem] overflow-hidden hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5">
                    {/* Order Header */}
                    <div className="bg-secondary/20 px-8 sm:px-12 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/10">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-1.5">Acquired On</p>
                          <p className="font-medium text-base">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-border/20" />
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-1.5">Total Value</p>
                          <p className="font-heading text-lg font-semibold text-foreground">{formatPrice(order.finalTotal || order.totalPrice)}</p>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-border/20" />
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-1.5">Record ID</p>
                          <p className="font-mono text-sm tracking-wider">#{order.orderId}</p>
                        </div>
                      </div>
                      <Link to={`/order-confirmation?orderId=${order.orderId}`} className="btn-outline px-6 py-2.5 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase h-auto">
                        VIEW INVOICE
                      </Link>
                    </div>

                    {/* Order Body */}
                    <div className="p-8 sm:p-12">
                      <div className="flex flex-col lg:flex-row gap-12">
                        
                        {/* Status and Items */}
                        <div className="flex-1 space-y-8">
                          <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full border ${status.border} ${status.bg} ${status.color} text-[10px] font-bold tracking-widest uppercase`}>
                            <span className="animate-pulse">{status.icon}</span> {order.status || 'pending'}
                          </div>
                          
                          <div className="space-y-8">
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} className="flex gap-6 sm:gap-8 group/item">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-secondary/40 border border-border/20 flex-shrink-0 shadow-inner group-hover/item:scale-[1.02] transition-transform duration-500">
                                  <img
                                    src={item.image || FALLBACK}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1 py-1">
                                  <h4 className="font-heading text-xl sm:text-2xl font-medium mb-2">{item.name}</h4>
                                  <p className="text-sm text-foreground/60 leading-relaxed max-w-md">{item.description}</p>
                                  <div className="mt-4 flex items-center gap-4">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">Quantity: {item.quantity}</span>
                                    {item.customization && <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">Bespoke Options Applied</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping and Actions */}
                        <div className="lg:w-80 flex flex-col gap-10 border-t lg:border-t-0 lg:border-l border-border/20 pt-10 lg:pt-2 lg:pl-12">
                          <div>
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-4">Destination</p>
                            <div className="space-y-1.5">
                              <p className="font-semibold text-lg">{order.shippingAddress?.name}</p>
                              <div className="text-sm text-foreground/70 leading-relaxed space-y-0.5">
                                <p>{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
                                <p className="pt-2 flex items-center gap-2"><Phone className="w-3 h-3" /> {order.shippingAddress?.phone}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-3">Transaction Method</p>
                            <div className="inline-flex items-center gap-2 text-sm font-semibold capitalize px-4 py-2 bg-foreground/5 rounded-xl border border-border/20">
                              <Shield className="w-4 h-4 text-accent" /> {order.paymentMethod || 'COD'}
                            </div>
                          </div>

                          <div className="mt-auto pt-6">
                            <button
                              onClick={async () => await generateOrderPDF(order)}
                              className="w-full flex items-center justify-center gap-3 py-4 bg-foreground text-background rounded-2xl text-xs font-bold tracking-widest uppercase hover:bg-accent transition-all duration-300 shadow-lg shadow-black/10 group-hover:scale-[1.02]"
                            >
                              <Download className="w-4 h-4" /> DOWNLOAD OFFICIAL PDF
                            </button>
                            <p className="text-[10px] text-center text-muted-foreground mt-4 italic">Certified by Diamond Jewels London</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
