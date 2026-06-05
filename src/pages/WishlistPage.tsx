import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ArrowRight, ShoppingBag, Diamond, Share2 } from "@/components/Icons";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { productAPI } from "@/lib/api";
import { type Product } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "sonner";

const FALLBACK = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=75";

const WishlistPage = () => {
  const { wishlist, addToCart, toggleWishlist, removeFromWishlist } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const [wishedProducts, setWishedProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const promises = wishlist.map(id => productAPI.getById(id.toString()));
        const responses = await Promise.all(promises);
        const validProducts = responses
          .filter(r => r.success && r.product)
          .map(r => r.product) as Product[];
        setWishedProducts(validProducts);

        // Remove stale wishlist ids that no longer resolve to a valid product.
        const validIds = new Set(validProducts.map((p) => String(p.id)));
        wishlist
          .filter((id) => !validIds.has(String(id)))
          .forEach((id) => removeFromWishlist(String(id)));
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchRecommendations = async () => {
      try {
        const response = await productAPI.getAll();
        if (response.success && response.products) {
          const wishedIds = new Set(wishlist.map(id => String(id)));
          const recs = response.products
            .filter((p: Product) => !wishedIds.has(String(p.id)))
            .slice(0, 4);
          setRecommendations(recs);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
    };

    if (wishlist.length > 0) {
      fetchWishlist();
    } else {
      setWishedProducts([]);
      setLoading(false);
    }
    fetchRecommendations();
  }, [wishlist, removeFromWishlist]);

  const totalValue = wishedProducts.reduce((s, p) => s + p.price, 0);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    navigate("/cart");
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: "My DiamondJewels Wishlist", url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-muted-foreground text-sm">Loading wishlist...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (wishedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="My Wishlist | DiamondJewels" description="Your saved jewellery wishlist." />
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-secondary/60 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-muted-foreground/50" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-light mb-3">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground text-sm mb-8">Browse our collection and save your favourite pieces for later</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/engagement-rings" className="btn-gold"><Diamond className="w-4 h-4" /> Shop Rings</Link>
            <Link to="/" className="btn-ghost">Browse All</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`My Wishlist (${wishedProducts.length}) | DiamondJewels`} description="Your saved jewellery wishlist." />
      <Header />

      <nav className="breadcrumb">
        <Link to="/">Home</Link><span>/</span><span className="text-foreground font-medium">Wishlist</span>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-light flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{wishedProducts.length} saved {wishedProducts.length === 1 ? "piece" : "pieces"}</p>
          </div>
          <button onClick={handleShare} className="btn-ghost text-xs flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Items Saved", value: wishedProducts.length.toString() },
            { label: "Total Value", value: formatPrice(totalValue) },
            { label: "Avg. Price", value: formatPrice(Math.round(totalValue / wishedProducts.length)) },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border/50 rounded-xl p-4 text-center">
              <p className="font-heading text-xl sm:text-2xl font-semibold text-accent">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {wishedProducts.map((product) => {
            const imgSrc = imgErrors[product.id] ? FALLBACK : product.image;
            const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

            return (
              <div key={product.id} className="product-card group flex flex-col">
                <div className="relative overflow-hidden bg-secondary/20 aspect-square">
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 text-[9px] font-bold bg-red-600 text-white rounded-sm">-{discount}%</span>
                  )}
                  <button
                    onClick={() => { toggleWishlist(product.id.toString(), true); toast.success("Removed from wishlist"); }}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={() => setImgErrors(p => ({ ...p, [product.id]: true }))}
                    />
                  </Link>
                </div>

                <div className="p-4 flex flex-col flex-1 bg-card">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">{product.style}</p>
                    <h3 className="font-heading text-base font-semibold mb-1 line-clamp-1 group-hover:text-accent transition-colors">{product.name}</h3>
                    <p className="text-[11px] text-muted-foreground mb-2">{product.metal} · {product.carat}ct · {product.shape}</p>
                  </Link>
                  <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-2">
                    <div>
                      {product.originalPrice > product.price && (
                        <p className="text-[11px] text-muted-foreground/60 line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                      <p className="font-heading font-bold text-accent">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground text-[11px] font-bold tracking-wider rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {recommendations.length > 0 && (
          <section className="mb-20">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Suggested for you</p>
                <h2 className="mt-2 font-heading text-3xl font-light text-foreground">You May Also Like</h2>
              </div>
              <Link to="/jewellery" className="hidden sm:inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground hover:text-accent transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {recommendations.map((product) => {
                const imgSrc = imgErrors[product.id] ? FALLBACK : (product.image || product.images?.[0]);
                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group overflow-hidden rounded-2xl border border-border/40 bg-card transition-all hover:border-accent/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-white">
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={() => setImgErrors((p) => ({ ...p, [product.id]: true }))}
                      />
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
                );
              })}
            </div>
          </section>
        )}

        <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { wishedProducts.forEach(p => addToCart(p)); toast.success("All items added to cart!"); navigate("/cart"); }}
            className="btn-gold justify-center px-10"
          >
            <ShoppingBag className="w-4 h-4" /> Add All to Cart
          </button>
          <Link to="/" className="btn-outline justify-center px-10">
            <ArrowRight className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
