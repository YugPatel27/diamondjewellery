import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Shield, CreditCard, Wallet, Banknote, ArrowRight } from "@/components/Icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { orderAPI } from "@/lib/api";
import { useCurrency } from "@/contexts/CurrencyContext";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

const PaymentPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const orderId = params.get("orderId");
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [method, setMethod] = useState<"card" | "upi" | "netbanking" | "cod">("card");
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  // Helper: find order in localStorage
  const getLocalOrder = (id: string) => {
    try {
      const orders = JSON.parse(localStorage.getItem("localOrders") || "[]");
      return orders.find((o: any) => o.orderId === id) || null;
    } catch { return null; }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) { setLoading(false); return; }

      // Try backend first
      try {
        const response = await orderAPI.getOrderById(orderId);
        if (response.success && response.order) {
          if (response.order.paymentStatus === 'paid') {
            navigate(`/order-confirmation?orderId=${orderId}`, { replace: true });
            return;
          }
          setOrder(response.order);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("[Payment] Backend unavailable, checking localStorage");
      }

      // Fallback: localStorage
      const local = getLocalOrder(orderId);
      if (local) {
        if (local.paymentStatus === 'paid') {
          navigate(`/order-confirmation?orderId=${orderId}`, { replace: true });
          return;
        }
        setOrder(local);
      } else {
        toast.error("Order not found");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (processingRef.current || processing) return;
    processingRef.current = true;
    setProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Try backend first
    try {
      const response = await orderAPI.updatePaymentStatus(
        orderId!,
        'paid',
        method,
        order?.paymentVerificationToken || ""
      );
      if (response.success) {
        toast.success("Payment successful!");
        navigate(`/order-confirmation?orderId=${orderId}`);
        return;
      }
    } catch (error: any) {
      console.warn("[Payment] Backend unavailable, updating locally");
    }

    // Fallback: update order in localStorage
    try {
      const orders = JSON.parse(localStorage.getItem("localOrders") || "[]");
      const idx = orders.findIndex((o: any) => o.orderId === orderId);
      if (idx !== -1) {
        orders[idx].paymentStatus = "paid";
        orders[idx].paymentMethod = method;
        orders[idx].status = "confirmed";
        localStorage.setItem("localOrders", JSON.stringify(orders));
      }
      toast.success("Payment successful!");
      navigate(`/order-confirmation?orderId=${orderId}`);
    } catch {
      toast.error("Payment update failed. Please try again.");
      setProcessing(false);
      processingRef.current = false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-32">
          <p className="font-heading text-2xl text-muted-foreground mb-6">Order not found</p>
          <button onClick={() => navigate("/")} className="btn-gold">Return Home</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Secure Payment | DiamondJewels" description="Complete your secure payment." />
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-border/50">
          <h1 className="font-heading text-3xl font-light flex items-center gap-3">
            <Shield className="w-6 h-6 text-accent" /> Secure Payment
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Cart</span>
            <span className="w-4 h-px bg-border/80" />
            <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Details</span>
            <span className="w-4 h-px bg-border/80" />
            <span className="text-foreground flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[9px]">3</span> Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Methods */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold mb-6">Select Payment Method</h2>
            
            <form onSubmit={handlePayment} className="space-y-4">
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${method === "card" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border/60 hover:border-accent/40"}`}>
                <input type="radio" name="paymentMethod" value="card" checked={method === "card"} onChange={() => setMethod("card")} className="text-accent focus:ring-accent" />
                <CreditCard className={`w-5 h-5 ${method === "card" ? "text-accent" : "text-muted-foreground"}`} />
                <div>
                  <p className={`font-semibold text-sm ${method === "card" ? "text-foreground" : "text-foreground/80"}`}>Credit / Debit Card</p>
                  <p className="text-[11px] text-muted-foreground">Visa, Mastercard, Amex, RuPay</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${method === "upi" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border/60 hover:border-accent/40"}`}>
                <input type="radio" name="paymentMethod" value="upi" checked={method === "upi"} onChange={() => setMethod("upi")} className="text-accent focus:ring-accent" />
                <Wallet className={`w-5 h-5 ${method === "upi" ? "text-accent" : "text-muted-foreground"}`} />
                <div>
                  <p className={`font-semibold text-sm ${method === "upi" ? "text-foreground" : "text-foreground/80"}`}>UPI (GPay, PhonePe, Paytm)</p>
                  <p className="text-[11px] text-muted-foreground">Instant payment via UPI ID</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${method === "netbanking" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border/60 hover:border-accent/40"}`}>
                <input type="radio" name="paymentMethod" value="netbanking" checked={method === "netbanking"} onChange={() => setMethod("netbanking")} className="text-accent focus:ring-accent" />
                <Banknote className={`w-5 h-5 ${method === "netbanking" ? "text-accent" : "text-muted-foreground"}`} />
                <div>
                  <p className={`font-semibold text-sm ${method === "netbanking" ? "text-foreground" : "text-foreground/80"}`}>Net Banking</p>
                  <p className="text-[11px] text-muted-foreground">All major Indian banks supported</p>
                </div>
              </label>

              <button 
                type="submit" 
                disabled={processing}
                className="w-full mt-6 py-4 btn-gold justify-center text-sm"
              >
                {processing ? "Processing Payment..." : `Pay ${formatPrice(order.finalTotal || order.totalPrice)}`}
                {!processing && <ArrowRight className="w-4 h-4 ml-1" />}
              </button>
            </form>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground/80">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              100% Secure Transaction. 256-bit SSL encryption.
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 sticky top-24">
              <h2 className="font-heading text-lg font-semibold mb-6 pb-4 border-b border-border/50">Order Details</h2>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-medium">#{order.orderId}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Delivery To</span>
                <span className="font-medium text-right max-w-[200px] truncate">{order.shippingAddress?.name}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Total Items</span>
                <span className="font-medium">{order.items?.reduce((a: number, c: any) => a + c.quantity, 0) || 0}</span>
              </div>
              
              <div className="border-t border-border/50 mt-6 pt-6 flex items-end justify-between">
                <span className="font-semibold">Amount Payable</span>
                <div className="text-right">
                  <span className="font-heading text-2xl font-bold text-accent">{formatPrice(order.finalTotal || order.totalPrice)}</span>
                  <p className="text-[10px] text-muted-foreground">Inclusive of GST</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPage;
