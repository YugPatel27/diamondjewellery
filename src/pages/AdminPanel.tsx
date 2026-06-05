import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { type Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCurrency } from "@/contexts/CurrencyContext";
import { orderAPI, userAPI, likesAPI, activityAPI, appointmentAPI, productAPI } from "@/lib/api";
import { generateOrderPDF } from "@/lib/pdfGenerator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Shield, Users, Package, Activity, Calendar, FileText, Trash2, Edit, Eye, Plus, X, Save, Check, Heart, Download } from "@/components/Icons";
import { toast } from "sonner";

const FALLBACK = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=75";

type Tab = "dashboard" | "products" | "users" | "logs" | "appointments" | "orders" | "wishlists";

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const { logs } = useActivityLog();
  const { formatPrice } = useCurrency();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; price: string; category: string; metal: string; diamondType: string }>({ name: "", price: "", category: "Rings", metal: "White Gold", diamondType: "lab" });
  const [newProduct, setNewProduct] = useState({
    name: "", category: "Rings" as const, price: "", metal: "White Gold" as const, shape: "Round" as const,
    cut: "Excellent" as const, clarity: "VS1" as const, color: "D" as const, carat: "1.0",
    diamondType: "lab" as const, description: "", style: "Solitaire" as const,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [wishlistsLoading, setWishlistsLoading] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<any>(null);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [productLikes, setProductLikes] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<string[]>([]);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [selectedWishlistIds, setSelectedWishlistIds] = useState<string[]>([]);
  
  // Search state variables
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [wishlistSearch, setWishlistSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");

  const { products: allProducts, refresh: refreshProducts } = useProducts();

  // Filtered data based on search
  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone?.includes(userSearch)
  );

  const filteredOrders = orders.filter(o =>
    o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.shippingAddress?.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.shippingAddress?.phone.includes(orderSearch)
  );

  const filteredWishlists = wishlists.filter(w =>
    w.name?.toLowerCase().includes(wishlistSearch.toLowerCase()) ||
    w.email?.toLowerCase().includes(wishlistSearch.toLowerCase()) ||
    w.phone?.includes(wishlistSearch)
  );

  const filteredLogs = logs.filter(l =>
    (l.userName || '').toLowerCase().includes(logSearch.toLowerCase()) ||
    l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    (l.description || '').toLowerCase().includes(logSearch.toLowerCase())
  );

  // Fetch orders when orders tab is selected
  useEffect(() => {
    if (tab === "orders" && isAdmin) {
      fetchOrders();
    }
  }, [tab, isAdmin, orderStatusFilter]);

  // Fetch users when users tab is selected
  useEffect(() => {
    if (tab === "users" && isAdmin) {
      fetchUsers();
    }
  }, [tab, isAdmin]);

  // Fetch appointments when appointments tab is selected
  useEffect(() => {
    if (tab === "appointments" && isAdmin) {
      fetchAppointments();
    }
  }, [tab, isAdmin]);

  // Fetch wishlists when wishlists tab is selected
  useEffect(() => {
    if (tab === "wishlists" && isAdmin) {
      fetchWishlists();
      fetchProductLikes();
    }
  }, [tab, isAdmin]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await orderAPI.getAllOrders(orderStatusFilter);
      if (response.success) {
        setOrders(response.orders);
        setSelectedOrderIds([]);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await userAPI.getAll();
      if (response.success) {
        setUsers(response.users || []);
        setSelectedUserIds([]);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    try {
      const response = await appointmentAPI.getAllAppointments();
      if (response.success) {
        setAppointments(response.appointments || []);
        setSelectedAppointmentIds([]);
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await orderAPI.updateStatus(orderId, status);
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status } : order
        ));
        toast.success(`Order status updated to ${status}`);
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const updateOrderPayment = async (orderId: string, paymentStatus: string, paymentMethod: string) => {
    try {
      const response = await orderAPI.updatePaymentStatus(orderId, paymentStatus, paymentMethod);
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, paymentStatus, paymentMethod } : order
        ));
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, paymentStatus, paymentMethod } : prev);
        }
        toast.success(`Order payment updated`);
      }
    } catch (error) {
      toast.error("Failed to update payment details");
    }
  };

  const confirmOrder = async (orderId: string) => {
    try {
      const response = await orderAPI.confirmOrder(orderId);
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: 'confirmed' } : order
        ));
        toast.success("Order confirmed successfully");
        setSelectedOrder(null);
        setShowOrderDetails(false);
      }
    } catch (error) {
      toast.error("Failed to confirm order");
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const response = await orderAPI.cancelOrder(orderId);
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
        toast.success("Order cancelled successfully");
        setSelectedOrder(null);
        setShowOrderDetails(false);
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const fetchWishlists = async () => {
    setWishlistsLoading(true);
    try {
      const response = await userAPI.getAllWishlists();
      if (response.success) {
        setWishlists(response.wishlists);
        setSelectedWishlistIds([]);
      }
    } catch (error) {
      toast.error("Failed to load wishlists");
    } finally {
      setWishlistsLoading(false);
    }
  };

  const fetchProductLikes = async () => {
    try {
      const response = await likesAPI.getProductLikesCount();
      if (response.success) {
        setProductLikes(response.products);
      }
    } catch (error) {
      // Silent failure - product likes not critical to display
    }
  };

  const removeLikeAsAdmin = async (userId: string, productId: number) => {
    try {
      const response = await userAPI.removeLike(userId, productId);
      if (response.success) {
        toast.success("Like removed");
        fetchWishlists();
        fetchProductLikes();
      }
    } catch (error) {
      toast.error("Failed to remove like");
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-20">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto" />
          <h1 className="font-heading text-2xl mt-4">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground mt-2">Please login with admin credentials</p>
          <Link to="/" className="inline-block mt-6 px-8 py-3 bg-primary text-primary-foreground text-xs tracking-widest uppercase">Go Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please fill product name and price");
      return;
    }
    
    try {
      const productData = {
        name: newProduct.name,
        style: newProduct.style,
        metal: newProduct.metal,
        shape: newProduct.shape,
        category: newProduct.category,
        price: Number(newProduct.price),
        cut: newProduct.cut,
        clarity: newProduct.clarity,
        color: newProduct.color,
        carat: parseFloat(newProduct.carat),
        description: newProduct.description || `Beautiful ${newProduct.name} crafted with care.`,
        diamondType: newProduct.diamondType,
      };

      const response = await productAPI.create(productData);
      if (response.success) {
        toast.success(`Product "${newProduct.name}" added successfully!`);
        setShowAddProduct(false);
        setNewProduct({ name: "", category: "Rings", price: "", metal: "White Gold", shape: "Round", cut: "Excellent", clarity: "VS1", color: "D", carat: "1.0", diamondType: "lab", description: "", style: "Solitaire" });
        refreshProducts();
      }
    } catch (error) {
      toast.error("Failed to add product to database");
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await productAPI.delete(id);
      if (response.success) {
        toast.success("Product deleted successfully");
        refreshProducts();
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    // Use _id for database operations if available, otherwise id
    const dbId = (product as any)._id || product.id;
    setEditForm({ 
      name: product.name, 
      price: String(product.price), 
      category: product.category, 
      metal: product.metal, 
      diamondType: product.diamondType 
    });
  };

  const handleSaveEdit = async (product: Product) => {
    const dbId = (product as any)._id || product.id;
    try {
      const updateData = {
        name: editForm.name,
        price: Number(editForm.price),
        category: editForm.category,
        metal: editForm.metal,
        diamondType: editForm.diamondType,
        originalPrice: Math.round(Number(editForm.price) * 1.15)
      };

      const response = await productAPI.update(dbId, updateData);
      if (response.success) {
        toast.success("Product updated successfully!");
        setEditingId(null);
        refreshProducts();
      }
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleQuickPriceUpdate = async (product: Product, newPrice: string) => {
    const dbId = (product as any)._id || product.id;
    const price = Number(newPrice);
    if (isNaN(price)) return;

    try {
      const response = await productAPI.update(dbId, { 
        price,
        originalPrice: Math.round(price * 1.15)
      });
      if (response.success) {
        toast.success("Price updated in real-time");
        refreshProducts();
      }
    } catch (error) {
      toast.error("Failed to update price");
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <Eye className="w-4 h-4" /> },
    { key: "products", label: "Products", icon: <Package className="w-4 h-4" /> },
    { key: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { key: "logs", label: "Activity Logs", icon: <Activity className="w-4 h-4" /> },
    { key: "appointments", label: "Appointments", icon: <Calendar className="w-4 h-4" /> },
    { key: "orders", label: "Orders", icon: <FileText className="w-4 h-4" /> },
    { key: "wishlists", label: "Wishlists & Likes", icon: <Heart className="w-4 h-4" /> },
  ];

  const appointmentLogs = logs.filter((l) => l.action === "Appointment Booked");
  const orderLogs = logs.filter((l) => l.action === "Order Placed");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground px-4 sm:px-6 py-3">
        <Link to="/" className="hover:text-foreground">Home</Link><span>/</span>
        <span className="text-foreground">Admin Panel</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-medium">Admin Panel</h1>
        </div>

        <div className="flex overflow-x-auto gap-1 mb-6 border-b border-border pb-0">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium tracking-wider whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-border p-5"><p className="text-2xl font-heading font-medium">{allProducts.length}</p><p className="text-xs text-muted-foreground mt-1">Total Products</p></div>
              <div className="border border-border p-5"><p className="text-2xl font-heading font-medium">{logs.length}</p><p className="text-xs text-muted-foreground mt-1">Activities</p></div>
              <div className="border border-border p-5"><p className="text-2xl font-heading font-medium">{appointmentLogs.length}</p><p className="text-xs text-muted-foreground mt-1">Appointments</p></div>
              <div className="border border-border p-5"><p className="text-2xl font-heading font-medium">{orderLogs.length}</p><p className="text-xs text-muted-foreground mt-1">Orders</p></div>
            </div>
            <div className="border border-border p-5">
              <h3 className="font-heading text-base font-medium mb-3">Store Location</h3>
              <p className="text-sm text-muted-foreground">DiamondJewels London — C.G. Road, Navrangpura, London - 380009, Greater London</p>
            </div>
            <div className="border border-border p-5">
              <h3 className="font-heading text-base font-medium mb-3">Recent Activity</h3>
              {logs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No activity yet</p>
              ) : (
                <div className="space-y-2">
                  {logs.slice(0, 5).map((l) => (
                    <div key={l.id} className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                      <span className="font-medium">{l.action}</span>
                      <span className="text-muted-foreground">{l.userName} · {new Date(l.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="🔍 Search products by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-transparent text-sm rounded outline-none focus:border-accent"
                />
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-muted-foreground whitespace-nowrap self-center">{filteredProducts.length} results</p>
                <button onClick={() => setShowAddProduct(!showAddProduct)} className="px-4 py-2 bg-accent text-accent-foreground text-xs tracking-wider font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap">
                  {showAddProduct ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {showAddProduct ? "Cancel" : "Add"}
                </button>
              </div>
            </div>

            {showAddProduct && (
              <div className="border border-accent/30 bg-accent/5 p-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
                <h3 className="font-heading text-base font-medium">Add New Product</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input type="text" placeholder="Product Name *" value={newProduct.name} onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent" />
                  <input type="number" placeholder="Price (₹) *" value={newProduct.price} onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent" />
                  <select value={newProduct.category} onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value as any }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent">
                    <option value="Rings">Rings</option><option value="Necklaces">Necklaces</option><option value="Earrings">Earrings</option>
                  </select>
                  <select value={newProduct.style} onChange={(e) => setNewProduct(p => ({ ...p, style: e.target.value as any }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent">
                    <option value="Solitaire">Solitaire</option><option value="Halo">Halo</option><option value="Vintage">Vintage</option><option value="Trilogy">Trilogy</option><option value="Diamond Band">Diamond Band</option>
                  </select>
                  <select value={newProduct.metal} onChange={(e) => setNewProduct(p => ({ ...p, metal: e.target.value as any }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent">
                    <option>White Gold</option><option>Yellow Gold</option><option>Rose Gold</option><option>Platinum</option>
                  </select>
                  <select value={newProduct.diamondType} onChange={(e) => setNewProduct(p => ({ ...p, diamondType: e.target.value as any }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent">
                    <option value="natural">Natural</option><option value="lab">Lab Grown</option>
                  </select>
                  <select value={newProduct.shape} onChange={(e) => setNewProduct(p => ({ ...p, shape: e.target.value as any }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent">
                    <option>Round</option><option>Princess</option><option>Cushion</option><option>Oval</option><option>Pear</option><option>Emerald</option><option>Heart</option><option>Marquise</option>
                  </select>
                  <input type="text" placeholder="Carat (e.g. 1.5)" value={newProduct.carat} onChange={(e) => setNewProduct(p => ({ ...p, carat: e.target.value }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent" />
                  <select value={newProduct.cut} onChange={(e) => setNewProduct(p => ({ ...p, cut: e.target.value as any }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent">
                    <option>Excellent</option><option>Very Good</option><option>Good</option>
                  </select>
                  <select value={newProduct.clarity} onChange={(e) => setNewProduct(p => ({ ...p, clarity: e.target.value as any }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent">
                    <option>FL</option><option>IF</option><option>VVS1</option><option>VVS2</option><option>VS1</option><option>VS2</option><option>SI1</option><option>SI2</option>
                  </select>
                  <select value={newProduct.color} onChange={(e) => setNewProduct(p => ({ ...p, color: e.target.value as any }))} className="px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent">
                    <option>D</option><option>E</option><option>F</option><option>G</option><option>H</option><option>I</option><option>J</option><option>K</option>
                  </select>
                </div>
                <textarea placeholder="Product description..." value={newProduct.description} onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2.5 border border-border bg-transparent text-sm outline-none focus:border-accent" rows={2} />
                <button onClick={handleAddProduct} className="px-6 py-2.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Save Product
                </button>
              </div>
            )}

            <div className="border border-border overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-secondary/30 text-left">
                  <th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Source</th><th className="px-4 py-3 font-medium">Actions</th>
                </tr></thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-secondary/20 transition-colors group">
                      <td className="px-4 py-3">
                        {editingId === p.id ? (
                          <input type="text" value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} className="px-2 py-1 border border-accent bg-transparent text-xs w-full outline-none" />
                        ) : (
                          <span className="font-medium">{p.name} {p.isNew && <span className="text-accent text-[10px] ml-1">NEW</span>}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === p.id ? (
                          <select value={editForm.category} onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))} className="px-2 py-1 border border-accent bg-transparent text-xs outline-none">
                            <option>Rings</option><option>Necklaces</option><option>Earrings</option><option>Bracelets</option>
                          </select>
                        ) : p.category}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === p.id ? (
                          <input type="number" value={editForm.price} onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))} className="px-2 py-1 border border-accent bg-transparent text-xs w-24 outline-none" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{formatPrice(p.price)}</span>
                            <button 
                              onClick={() => {
                                const newPrice = prompt("Enter new price:", String(p.price));
                                if (newPrice !== null && newPrice !== "") {
                                  handleQuickPriceUpdate(p, newPrice);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-accent hover:underline"
                            >
                              Edit Price
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === p.id ? (
                          <select value={editForm.diamondType} onChange={(e) => setEditForm(f => ({ ...f, diamondType: e.target.value }))} className="px-2 py-1 border border-accent bg-transparent text-xs outline-none">
                            <option value="natural">Natural</option><option value="lab">Lab Grown</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 text-[10px] tracking-wider ${p.diamondType === "lab" ? "bg-emerald-600/20 text-emerald-700 dark:text-emerald-400" : "bg-amber-600/20 text-amber-700 dark:text-amber-400"}`}>{p.diamondType === "lab" ? "Lab Grown" : "Natural"}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground">Database</span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        {editingId === p.id ? (
                          <>
                            <button onClick={() => handleSaveEdit(p)} className="text-emerald-600 hover:text-foreground" aria-label="Save product changes"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground" aria-label="Cancel editing product"><X className="w-3.5 h-3.5" /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleStartEdit(p)} className="text-accent hover:text-foreground" aria-label={`Edit ${p.name} product`}><Edit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteProduct((p as any)._id || p.id)} className="text-sale hover:text-foreground" aria-label={`Delete ${p.name} product`}><Trash2 className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Logs */}
        {tab === "logs" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                placeholder="🔍 Search logs by user, action, or details..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-border bg-transparent text-sm rounded outline-none focus:border-accent"
              />
              <button
                onClick={async () => {
                  if (selectedLogIds.length === 0) {
                    toast.error("Select at least one log to delete");
                    return;
                  }
                  if (!window.confirm(`Delete ${selectedLogIds.length} selected log(s) permanently? This cannot be undone.`)) return;
                  try {
                    const response = await activityAPI.deleteMultipleLogs(selectedLogIds);
                    if (response.success) {
                      toast.success(`${selectedLogIds.length} log(s) successfully deleted`);
                      setSelectedLogIds([]);
                      // Logs auto-update via ActivityLogContext
                    } else {
                      toast.error(response.message || "Failed to delete logs");
                    }
                  } catch (error) {
                    toast.error("Failed to delete logs");
                  }
                }}
                className="px-4 py-2 bg-red-600/20 text-red-700 dark:text-red-400 text-xs font-medium hover:bg-red-600/30 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
              <button
                onClick={async () => {
                  if (!window.confirm("⚠️ Delete ALL activity logs? This action cannot be undone and is permanent.")) return;
                  try {
                    const allLogIds = filteredLogs.map(l => l.id);
                    const response = await activityAPI.deleteMultipleLogs(allLogIds);
                    if (response.success) {
                      toast.success(`All ${allLogIds.length} logs successfully deleted`);
                      setSelectedLogIds([]);
                      // Logs auto-update via ActivityLogContext
                    } else {
                      toast.error(response.message || "Failed to delete all logs");
                    }
                  } catch (error) {
                    toast.error("Failed to delete all logs");
                  }
                }}
                className="px-4 py-2 bg-orange-600/20 text-orange-700 dark:text-orange-400 text-xs font-medium hover:bg-orange-600/30 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete All Logs
              </button>
              {selectedLogIds.length > 0 && (
                <span className="text-xs text-muted-foreground">{selectedLogIds.length} selected</span>
              )}
            </div>
            <div className="border border-border overflow-x-auto">
              {filteredLogs.length === 0 ? (
                <p className="text-center py-10 text-sm text-muted-foreground">No activity logs found</p>
              ) : (
                <table className="w-full text-xs">
                  <thead><tr className="bg-secondary/30 text-left">
                    <th className="px-4 py-3 font-medium">
                      <input
                        type="checkbox"
                        checked={filteredLogs.length > 0 && selectedLogIds.length === filteredLogs.length}
                        onChange={(e) => setSelectedLogIds(e.target.checked ? filteredLogs.map((l) => l.id) : [])}
                        className="w-4 h-4 text-accent border-border rounded"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium">Timestamp</th><th className="px-4 py-3 font-medium">IP Address</th><th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Phone</th><th className="px-4 py-3 font-medium">Action</th><th className="px-4 py-3 font-medium">Details</th><th className="px-4 py-3 font-medium">Delete</th>
                  </tr></thead>
                  <tbody>
                    {filteredLogs.map((l) => (
                      <tr key={l.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedLogIds.includes(l.id)}
                            onChange={(e) => {
                              setSelectedLogIds((prev) =>
                                e.target.checked ? [...prev, l.id] : prev.filter((id) => id !== l.id)
                              );
                            }}
                            className="w-4 h-4 text-accent border-border rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-[10px]">{l.ip || "—"}</td><td className="px-4 py-3 font-medium">{l.userName}</td>
                        <td className="px-4 py-3 font-mono text-[10px]">{l.userPhone || "—"}</td><td className="px-4 py-3 font-medium">{l.action}</td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{l.description}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={async () => {
                              if (!window.confirm("Delete this activity log?")) return;
                              try {
                                const response = await activityAPI.deleteLog(l.id);
                                if (response.success) {
                                  toast.success("Log deleted");
                                  setSelectedLogIds((prev) => prev.filter((id) => id !== l.id));
                                  // Logs auto-update via ActivityLogContext
                                }
                              } catch (error) {
                                toast.error("Failed to delete log");
                              }
                            }}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                            aria-label="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                placeholder="🔍 Search users by name, email, or phone..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-border bg-transparent text-sm rounded outline-none focus:border-accent"
              />
              <button
                onClick={async () => {
                  if (selectedUserIds.length === 0) {
                    toast.error("Select at least one user to delete");
                    return;
                  }

                  if (!window.confirm(`Delete ${selectedUserIds.length} selected user(s) permanently? This action cannot be undone.`)) return;
                  try {
                    const response = await userAPI.deleteMultipleUsers(selectedUserIds);
                    if (response.success) {
                      toast.success(`${selectedUserIds.length} user(s) successfully deleted`);
                      fetchUsers();
                    } else {
                      toast.error(response.message || "Failed to delete users");
                    }
                  } catch (error) {
                    toast.error("Failed to delete users");
                  }
                }}
                className="px-4 py-2 bg-red-600/20 text-red-700 dark:text-red-400 text-xs font-medium hover:bg-red-600/30 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
              <button
                onClick={async () => {
                  if (!window.confirm("⚠️ Delete ALL users and their data permanently? This will remove all profiles, orders, wishlists, and appointments. This cannot be undone.")) return;
                  try {
                    const allUserIds = filteredUsers.map(u => u._id);
                    const response = await userAPI.deleteMultipleUsers(allUserIds);
                    if (response.success) {
                      toast.success(`All ${allUserIds.length} users successfully deleted`);
                      setSelectedUserIds([]);
                      fetchUsers();
                    } else {
                      toast.error(response.message || "Failed to delete all users");
                    }
                  } catch (error) {
                    toast.error("Failed to delete all users");
                  }
                }}
                className="px-4 py-2 bg-orange-600/20 text-orange-700 dark:text-orange-400 text-xs font-medium hover:bg-orange-600/30 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete All Users
              </button>
              {selectedUserIds.length > 0 && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">{selectedUserIds.length} selected</span>
              )}
            </div>
            <div className="border border-border overflow-x-auto">
              {usersLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground mt-3">No users found</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead><tr className="bg-secondary/30 text-left">
                    <th className="px-4 py-3 font-medium">
                      <input
                        type="checkbox"
                        checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                        onChange={(e) => setSelectedUserIds(e.target.checked ? filteredUsers.map(u => u._id) : [])}
                        className="w-4 h-4 text-accent border-border rounded"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr></thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-t border-border hover:bg-secondary/20">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user._id)}
                            onChange={(e) => {
                              setSelectedUserIds((prev) =>
                                e.target.checked ? [...prev, user._id] : prev.filter((id) => id !== user._id)
                              );
                            }}
                            className="w-4 h-4 text-accent border-border rounded"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium truncate max-w-[120px]">{user.name}</td>
                        <td className="px-4 py-3 text-muted-foreground truncate max-w-[150px]">{user.email}</td>
                        <td className="px-4 py-3 font-mono">{user.phone || "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-[10px]">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={async () => {
                              if (!window.confirm(`Delete user "${user.name}"? This action cannot be undone.`)) return;
                              try {
                                const response = await userAPI.deleteMultipleUsers([user._id]);
                                if (response.success) {
                                  toast.success("User deleted");
                                  fetchUsers();
                                }
                              } catch (error) {
                                toast.error("Failed to delete user");
                              }
                            }}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                            aria-label="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Appointments */}
        {tab === "appointments" && (
          <div className="space-y-4">
            <div className="border border-border p-4 bg-accent/5">
              <p className="text-sm font-medium">Store: DiamondJewels London</p>
              <p className="text-xs text-muted-foreground">C.G. Road, Navrangpura, London - 380009</p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center border border-border p-4 bg-secondary/10 rounded">
              <select 
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs border border-border bg-transparent px-3 py-2 rounded"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="date"
                className="text-xs border border-border bg-transparent px-3 py-2 rounded"
                placeholder="Filter by date"
              />
              <input
                type="time"
                className="text-xs border border-border bg-transparent px-3 py-2 rounded"
                placeholder="Filter by time"
              />
              <span className="text-xs text-muted-foreground">Results: {appointments.length}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={async () => {
                  if (selectedAppointmentIds.length === 0) {
                    toast.error("Select at least one appointment to delete");
                    return;
                  }
                  if (!window.confirm(`Delete ${selectedAppointmentIds.length} selected appointment(s)? This cannot be undone.`)) return;
                  try {
                    await Promise.all(selectedAppointmentIds.map((id) => appointmentAPI.delete(id)));
                    toast.success(`${selectedAppointmentIds.length} appointments deleted`);
                    fetchAppointments();
                  } catch (error) {
                    toast.error('Failed to delete appointment(s)');
                  }
                }}
                className="px-4 py-2 bg-red-600/20 text-red-700 dark:text-red-400 text-xs font-medium hover:bg-red-600/30 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
              {selectedAppointmentIds.length > 0 && (
                <span className="text-xs text-muted-foreground">{selectedAppointmentIds.length} selected</span>
              )}
            </div>
            <div className="border border-border overflow-x-auto">
              {appointmentsLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-center py-10 text-sm text-muted-foreground">No appointments yet</p>
              ) : (
                <table className="w-full text-xs">
                  <thead><tr className="bg-secondary/30 text-left">
                    <th className="px-4 py-3 font-medium">
                      <input
                        type="checkbox"
                        checked={appointments.length > 0 && selectedAppointmentIds.length === appointments.length}
                        onChange={(e) => setSelectedAppointmentIds(e.target.checked ? appointments.map((apt) => apt._id) : [])}
                        className="w-4 h-4 text-accent border-border rounded"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium">Booked At</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr></thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt._id} className="border-t border-border hover:bg-secondary/20">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedAppointmentIds.includes(apt._id)}
                            onChange={(e) => {
                              setSelectedAppointmentIds((prev) =>
                                e.target.checked ? [...prev, apt._id] : prev.filter((id) => id !== apt._id)
                              );
                            }}
                            className="w-4 h-4 text-accent border-border rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-[10px]">{new Date(apt.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium">
                          <div>{apt.userId?.name || apt.name}</div>
                          <div className="text-[10px] text-muted-foreground">{apt.userId ? 'Registered' : 'Guest'}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground truncate max-w-[150px]">{apt.email}</td>
                        <td className="px-4 py-3">{apt.phone || apt.userId?.phone || '—'}</td>
                        <td className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium">{apt.userId ? 'User' : 'Guest'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{new Date(apt.date).toLocaleDateString()} {apt.time}</td>
                        <td className="px-4 py-3">
                          <select
                            value={apt.status || 'pending'}
                            onChange={async (e) => {
                              try {
                                const response = await appointmentAPI.update(apt._id, e.target.value);
                                if (response.success) {
                                  toast.success(`Appointment status updated to ${e.target.value}`);
                                  fetchAppointments();
                                }
                              } catch (error) {
                                toast.error('Failed to update appointment status');
                              }
                            }}
                            className={`text-[10px] px-2 py-1 rounded-full font-semibold border ${
                              apt.status === 'confirmed' 
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                : apt.status === 'cancelled' 
                                ? 'bg-red-100 text-red-700 border-red-200' 
                                : 'bg-amber-100 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground truncate max-w-[150px] text-[10px]">{apt.message || '—'}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={async () => {
                              if (!window.confirm('Delete this appointment?')) return;
                              try {
                                const response = await appointmentAPI.delete(apt._id);
                                if (response.success) {
                                  toast.success('Appointment deleted');
                                  fetchAppointments();
                                }
                              } catch (error) {
                                toast.error('Failed to delete appointment');
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row gap-3 border border-border p-4 bg-secondary/10 rounded">
              <select 
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs border border-border bg-transparent px-3 py-2 rounded"
              >
                <option value="">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="text"
                placeholder="🔍 Search by Order ID, name, or phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-border bg-transparent text-xs rounded outline-none focus:border-accent"
              />
              <span className="text-xs text-muted-foreground self-center whitespace-nowrap">Results: {filteredOrders.length}</span>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-background border border-border rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
                    <h3 className="font-heading text-lg">Order Details</h3>
                    <button onClick={() => setShowOrderDetails(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Order ID</p>
                        <p className="font-mono text-sm">{selectedOrder.orderId}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Date</p>
                        <p className="text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Customer</p>
                        <p className="text-sm font-medium">{selectedOrder.shippingAddress?.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                        <p className="text-sm">{selectedOrder.shippingAddress?.phone}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Shipping Address</p>
                      <p className="text-sm">{selectedOrder.shippingAddress?.address}</p>
                      <p className="text-sm">{selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.pincode}</p>
                      <p className="text-sm">{selectedOrder.shippingAddress?.phone || selectedOrder.userId?.phone || '—'}</p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item: any, idx: number) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                            {item.customization && (
                              <div className="text-[10px] text-muted-foreground pl-4 space-y-1">
                                {item.customization.ringSize && <div>Ring Size: {item.customization.ringSize}</div>}
                                {item.customization.engravingText && <div>Engraving: {item.customization.engravingText}</div>}
                                {item.customization.selectedDiamond && (
                                  <div>
                                    Selected Diamond: {item.customization.selectedDiamond.carat}ct {item.customization.selectedDiamond.color}/{item.customization.selectedDiamond.clarity} - {formatPrice(item.customization.selectedDiamond.price)}
                                  </div>
                                )}
                                {item.customizationPrice ? <div>Customization Charge: {formatPrice(item.customizationPrice)}</div> : null}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Subtotal:</span>
                        <span className="text-sm">{formatPrice(selectedOrder.totalPrice)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">GST:</span>
                        <span className="text-sm">{formatPrice(selectedOrder.gst || Math.round(selectedOrder.totalPrice * 0.18))}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Grand Total:</span>
                        <span className="font-medium">{formatPrice(selectedOrder.finalTotal || selectedOrder.totalPrice + Math.round(selectedOrder.totalPrice * 0.18))}</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Payment Method</label>
                          <select
                            value={selectedOrder.paymentMethod || 'cod'}
                            onChange={(e) => setSelectedOrder({ ...selectedOrder, paymentMethod: e.target.value })}
                            className="w-full mt-2 px-3 py-2 border border-border bg-transparent text-sm rounded outline-none focus:border-accent"
                          >
                            <option value="cod">Cash on Delivery</option>
                            <option value="stripe">Stripe</option>
                            <option value="upi">UPI</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="check">Check</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Payment Status</label>
                          <select
                            value={selectedOrder.paymentStatus || 'pending'}
                            onChange={(e) => setSelectedOrder({ ...selectedOrder, paymentStatus: e.target.value })}
                            className="w-full mt-2 px-3 py-2 border border-border bg-transparent text-sm rounded outline-none focus:border-accent"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.notes && (
                      <div className="border-t border-border pt-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Notes</p>
                        <p className="text-sm">{selectedOrder.notes}</p>
                      </div>
                    )}

                    {selectedOrder.trackingNumber && (
                      <div className="border-t border-border pt-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Tracking Number</p>
                        <p className="text-sm font-mono">{selectedOrder.trackingNumber}</p>
                      </div>
                    )}

                    <div className="border-t border-border pt-4 flex gap-2 flex-wrap">
                      <button 
                        onClick={() => generateOrderPDF(selectedOrder)}
                        className="flex-1 min-w-[120px] px-3 py-2 bg-primary/20 text-primary text-xs font-medium rounded hover:bg-primary/30"
                      >
                        <Download className="w-3 h-3 inline mr-2" />Download PDF
                      </button>
                      <button
                        onClick={() => updateOrderPayment(selectedOrder._id, selectedOrder.paymentStatus, selectedOrder.paymentMethod)}
                        className="flex-1 min-w-[120px] px-3 py-2 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700"
                      >
                        <Save className="w-3 h-3 inline mr-2" />Save Payment Details
                      </button>
                      {['pending', 'confirmed'].includes(selectedOrder.status) && (
                        <>
                          {selectedOrder.status === 'pending' && (
                            <button 
                              onClick={() => confirmOrder(selectedOrder._id)}
                              className="flex-1 min-w-[120px] px-3 py-2 bg-accent text-accent-foreground text-xs font-medium rounded hover:bg-accent/90"
                            >
                              <Check className="w-3 h-3 inline mr-2" />Confirm Order
                            </button>
                          )}
                          <button 
                            onClick={() => cancelOrder(selectedOrder._id)}
                            className="flex-1 min-w-[120px] px-3 py-2 bg-sale text-white text-xs font-medium rounded hover:bg-sale/90"
                          >
                            <X className="w-3 h-3 inline mr-2" />Cancel Order
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setShowOrderDetails(false)}
                        className="flex-1 min-w-[120px] px-3 py-2 border border-border text-xs font-medium rounded hover:bg-secondary/20"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <button
                  onClick={async () => {
                    if (selectedOrderIds.length === 0) {
                      toast.error("Select at least one order to delete");
                      return;
                    }
                    if (!window.confirm(`Delete ${selectedOrderIds.length} selected order(s)? This cannot be undone.`)) return;
                    try {
                      const response = await orderAPI.deleteMultipleOrders(selectedOrderIds);
                      if (response.success) {
                        toast.success(`${selectedOrderIds.length} orders deleted`);
                        fetchOrders();
                      }
                    } catch (error) {
                      toast.error("Failed to delete orders");
                    }
                  }}
                  className="px-4 py-2 bg-red-600/20 text-red-700 dark:text-red-400 text-xs font-medium hover:bg-red-600/30 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </button>
                {selectedOrderIds.length > 0 && (
                  <span className="text-xs text-muted-foreground">{selectedOrderIds.length} selected</span>
                )}
              </div>
              <div className="border border-border overflow-x-auto">
                {ordersLoading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-3">Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground mt-3">No orders found</p>
                  </div>
                ) : (
                  <table className="w-full text-xs">
                    <thead><tr className="bg-secondary/30 text-left">
                      <th className="px-4 py-3 font-medium">
                        <input
                          type="checkbox"
                          checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                          onChange={(e) => setSelectedOrderIds(e.target.checked ? filteredOrders.map(o => o._id) : [])}
                          className="w-4 h-4 text-accent border-border rounded"
                        />
                      </th>
                      <th className="px-4 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Items</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr></thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="border-t border-border hover:bg-secondary/20">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedOrderIds.includes(order._id)}
                              onChange={(e) => {
                                setSelectedOrderIds((prev) =>
                                  e.target.checked ? [...prev, order._id] : prev.filter((id) => id !== order._id)
                                );
                              }}
                              className="w-4 h-4 text-accent border-border rounded"
                            />
                          </td>
                          <td className="px-4 py-3 font-mono text-[10px]">{order.orderId}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{order.shippingAddress?.name}</div>
                              <div className="text-[10px] text-muted-foreground">{order.shippingAddress?.phone || order.userId?.phone || '—'}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="max-w-[200px] truncate">
                              {order.items?.map((item: any, idx: number) => (
                                <span key={idx} className="text-[10px]">
                                  {item.name} (x{item.quantity}){idx < order.items.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{formatPrice(order.totalPrice)}</td>
                          <td className="px-4 py-3">
                            <select 
                              value={order.status || 'pending'} 
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="text-[10px] border border-border bg-transparent px-2 py-1 rounded"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 flex gap-1">
                            <button 
                              onClick={() => generateOrderPDF(order)}
                              className="text-primary hover:text-primary/80 text-[10px] flex items-center gap-1"
                              title="Download PDF"
                            >
                              <Download className="w-3 h-3" />PDF
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                              className="text-accent hover:underline text-[10px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />Details
                            </button>
                            <button 
                              onClick={async () => {
                                if (!window.confirm("Delete this order? This cannot be undone.")) return;
                                try {
                                  const response = await orderAPI.deleteMultipleOrders([order._id]);
                                  if (response.success) {
                                    toast.success("Order deleted");
                                    fetchOrders();
                                  }
                                } catch (error) {
                                  toast.error("Failed to delete order");
                                }
                              }}
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                              aria-label="Delete order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wishlists & Likes */}
        {tab === "wishlists" && (
          <div className="space-y-6">
            {/* Wishlists Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border p-5">
                <Heart className="w-6 h-6 text-accent mb-2" />
                <p className="text-2xl font-heading font-medium">{filteredWishlists.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Users with Wishlists</p>
              </div>
              <div className="border border-border p-5">
                <p className="text-2xl font-heading font-medium">{filteredWishlists.reduce((sum, w) => sum + (w.wishlistCount || 0), 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Wishlist Items</p>
              </div>
              <div className="border border-border p-5">
                <p className="text-2xl font-heading font-medium">{productLikes.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Products with Likes</p>
              </div>
            </div>

            {/* Wishlists Search and Controls */}
            <div className="border border-border">
              <div className="bg-secondary/30 px-4 py-3 font-medium text-sm">User Wishlists & Likes</div>
              <div className="p-4 space-y-3 border-b border-border">
                <input
                  type="text"
                  placeholder="🔍 Search wishlists by user name, email, or phone..."
                  value={wishlistSearch}
                  onChange={(e) => setWishlistSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-transparent text-xs rounded outline-none focus:border-accent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (selectedWishlistIds.length === 0) {
                        toast.error("Select at least one wishlist to delete");
                        return;
                      }
                      if (!window.confirm(`Delete ${selectedWishlistIds.length} selected wishlist(s)? This action cannot be undone.`)) return;
                      try {
                        const deletePromises = selectedWishlistIds.map(id => userAPI.deleteUserWishlist(id));
                        await Promise.all(deletePromises);
                        toast.success(`${selectedWishlistIds.length} wishlists deleted`);
                        setSelectedWishlistIds([]);
                        fetchWishlists();
                      } catch (error) {
                        toast.error("Failed to delete wishlists");
                      }
                    }}
                    className="px-4 py-2 bg-red-600/20 text-red-700 dark:text-red-400 text-xs font-medium hover:bg-red-600/30 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                  </button>
                  {selectedWishlistIds.length > 0 && (
                    <span className="text-xs text-muted-foreground">{selectedWishlistIds.length} selected</span>
                  )}
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete ALL product likes from all users? This action cannot be undone.")) return;
                      try {
                        await userAPI.deleteAllLikes();
                        toast.success("All product likes deleted");
                        fetchWishlists();
                        fetchProductLikes();
                      } catch (error) {
                        toast.error("Failed to delete all likes");
                      }
                    }}
                    className="px-4 py-2 bg-orange-600/20 text-orange-700 dark:text-orange-400 text-xs font-medium hover:bg-orange-600/30 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete All Likes
                  </button>
                </div>
              </div>
              {wishlistsLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-3">Loading wishlists...</p>
                </div>
              ) : filteredWishlists.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-10 h-10 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground mt-3">No wishlists found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-t border-border">
                      <th className="px-4 py-3 text-left font-medium">
                        <input
                          type="checkbox"
                          checked={filteredWishlists.length > 0 && selectedWishlistIds.length === filteredWishlists.length}
                          onChange={(e) => setSelectedWishlistIds(e.target.checked ? filteredWishlists.map((w) => w._id) : [])}
                          className="w-4 h-4 text-accent border-border rounded"
                        />
                      </th>
                      <th className="px-4 py-3 text-left font-medium">User</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Phone</th>
                      <th className="px-4 py-3 text-left font-medium">Items</th>
                      <th className="px-4 py-3 text-left font-medium">Products</th>
                      <th className="px-4 py-3 text-left font-medium">Actions</th>
                    </tr></thead>
                    <tbody>
                      {filteredWishlists.map((wishlist, idx) => (
                        <tr key={idx} className="border-t border-border hover:bg-secondary/30">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedWishlistIds.includes(wishlist._id)}
                              onChange={(e) => {
                                setSelectedWishlistIds((prev) =>
                                  e.target.checked ? [...prev, wishlist._id] : prev.filter((id) => id !== wishlist._id)
                                );
                              }}
                              className="w-4 h-4 text-accent border-border rounded"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium">{wishlist.name || "N/A"}</td>
                          <td className="px-4 py-3 text-muted-foreground truncate max-w-[180px]">{wishlist.email}</td>
                          <td className="px-4 py-3 font-mono text-[10px]">{wishlist.phone || "N/A"}</td>
                          <td className="px-4 py-3">
                            <span className="inline-block bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                              {wishlist.totalLikes || 0} likes
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => {
                                setSelectedWishlist(wishlist);
                                setShowWishlistModal(true);
                              }}
                              className="text-accent hover:underline text-xs font-medium"
                            >
                              View ({wishlist.wishlistCount || 0})
                            </button>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedWishlist(wishlist);
                                setShowWishlistModal(true);
                              }}
                              className="px-2 py-1 text-accent hover:bg-accent/10 rounded"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button 
                              onClick={async () => {
                                if (!window.confirm(`Delete wishlist for "${wishlist.name}"? This cannot be undone.`)) return;
                                try {
                                  await userAPI.deleteUserWishlist(wishlist._id);
                                  toast.success("Wishlist deleted");
                                  fetchWishlists();
                                } catch (error) {
                                  toast.error("Failed to delete wishlist");
                                }
                              }}
                              className="px-2 py-1 text-red-600 hover:bg-red-600/10 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Wishlist Modal */}
            {showWishlistModal && selectedWishlist && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background border border-border rounded w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <div className="sticky top-0 bg-secondary/30 px-6 py-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-heading text-lg font-medium">{selectedWishlist.name}'s Wishlist</h3>
                    <button onClick={() => setShowWishlistModal(false)} className="p-1 hover:bg-secondary rounded">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-sm">{selectedWishlist.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Likes</p>
                        <p className="font-medium text-sm">{selectedWishlist.totalLikes || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium text-sm">{selectedWishlist.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Joined</p>
                        <p className="font-medium text-sm">{new Date(selectedWishlist.joinedDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium text-sm mb-3">Liked Products</h4>
                      {selectedWishlist.wishlist && selectedWishlist.wishlist.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {selectedWishlist.wishlist.map((product: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 bg-secondary/20 p-4 rounded-2xl border border-border/40 group hover:border-accent/40 transition-all">
                              <div className="w-16 h-16 rounded-xl overflow-hidden border border-border/20 flex-shrink-0">
                                <img src={product.image || FALLBACK} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold truncate">{product.name}</p>
                                  <span className="text-xs font-bold text-accent">{formatPrice(product.price)}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="text-[9px] font-bold tracking-widest uppercase bg-card px-2 py-0.5 rounded border border-border/40 text-muted-foreground">{product.category}</span>
                                  <span className="text-[9px] font-bold tracking-widest uppercase bg-card px-2 py-0.5 rounded border border-border/40 text-muted-foreground">{product.metal}</span>
                                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${product.diamondType === 'lab' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' : 'bg-amber-500/5 border-amber-500/20 text-amber-600'}`}>{product.diamondType === 'lab' ? 'Lab Grown' : 'Natural'}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeLikeAsAdmin(selectedWishlist._id, product.id)}
                                className="p-2 text-sale hover:bg-sale/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                title="Remove item from user wishlist"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No products in wishlist</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Likes Overview */}
            <div className="border border-border">
              <div className="bg-secondary/30 px-4 py-3 font-medium text-sm flex items-center justify-between">
                <span>Product Likes (Public Counts)</span>
              </div>
              {productLikes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-muted-foreground">No likes yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-t border-border bg-secondary/10">
                      <th className="px-4 py-3 text-left font-medium">Product Detail</th>
                      <th className="px-4 py-3 text-left font-medium">Attributes</th>
                      <th className="px-4 py-3 text-left font-medium">Price</th>
                      <th className="px-4 py-3 text-left font-medium">
                        <Heart className="w-3.5 h-3.5 inline mr-1" />Total Likes
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Action</th>
                    </tr></thead>
                    <tbody>
                      {productLikes.sort((a:any, b:any) => (b.likes || 0) - (a.likes || 0)).map((product:any, idx:number) => (
                        <tr key={idx} className="border-t border-border hover:bg-secondary/30 transition-all">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded border border-border/40 overflow-hidden bg-background">
                                <img src={product.image || FALLBACK} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-semibold">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <span className="text-muted-foreground">{product.category}</span>
                              <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">{product.metal} · {product.style}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full font-bold">
                              <Heart className="w-3 h-3 fill-current" /> {product.likes || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Delete all ${product.likes || 0} like(s) for "${product.name}"? This cannot be undone.`)) return;
                                try {
                                  await userAPI.deleteProductLikes(product.id);
                                  toast.success("Product likes deleted");
                                  fetchProductLikes();
                                  fetchWishlists();
                                } catch (error) {
                                  toast.error("Failed to delete product likes");
                                }
                              }}
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                              aria-label="Delete product likes"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
