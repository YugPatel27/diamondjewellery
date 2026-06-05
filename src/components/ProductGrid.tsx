import { Heart, ShoppingBag, Star } from "@/components/Icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { Product } from "@/data/products";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getProductImage, getProductPrimaryImage } from "@/lib/productImages";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useCart();
  const { user, openAuth } = useAuth();
  const { addLog } = useActivityLog();
  const { formatPrice } = useCurrency();
  const isWished = wishlist.includes(product.id.toString());
  const [imgSrc, setImgSrc] = useState(getProductPrimaryImage(product));
  const fallbackImg = getProductImage(product, 1);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(getProductPrimaryImage(product));
    setImgLoaded(false);
  }, [product.image, product.images, product.id]);

  const handleAddToCart = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuth();
      toast.info("Please login to add items to wishlist");
      return;
    }

    toggleWishlist(product.id.toString(), true);
    addLog({
      action: "wishlist_toggle",
      description: `${isWished ? "Removed" : "Added"} ${product.name} ${isWished ? "from" : "to"} wishlist`,
      entityType: "product",
      entityId: product.id.toString(),
    });
    toast.success(isWished ? "Removed from wishlist" : "Added to wishlist");
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <article 
      className="product-card pro-card-hover group relative flex flex-col animate-cart-in"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      <Link to={`/product/${product.id}`} className="block" aria-label={`View ${product.name}`}>
        <div className="relative overflow-hidden bg-white aspect-[4/5] shine-container">
          <div className="shine-sweep-hover"></div>
          
          {!imgLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/40 to-secondary/70">
              <div className="h-12 w-12 rounded-full border border-accent/30 border-t-accent animate-spin" />
            </div>
          ) : null}

          <img
            src={imgSrc}
            alt={`${product.name} - ${product.style} in ${product.metal}`}
            className={`h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? "animate-image-load" : "opacity-0"}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgSrc(fallbackImg);
              setImgLoaded(true);
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent transition-opacity duration-500 group-hover:from-black/15" />

          {/* Enhanced Quick View Button */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0">
            <div className="bg-gradient-to-t from-accent/95 to-accent/90 backdrop-blur-md py-4 text-center shadow-[0_-15px_40px_rgba(212,155,23,0.2)]">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 font-heading font-semibold tracking-wider text-white hover:scale-[1.02] active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-[0.3em]">Quick View</span>
              </button>
            </div>
          </div>

          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            <span
              className={`rounded-full border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md ${
                product.diamondType === "lab"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              {product.diamondType === "lab" ? "Lab Grown" : "Natural"}
            </span>
            {product.isNew ? (
              <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400 backdrop-blur-md">
                New Arrival
              </span>
            ) : null}
            {discount > 0 ? (
              <span className="rounded-full border border-sale/20 bg-sale/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-sale backdrop-blur-md">
                {discount}% Off
              </span>
            ) : null}
          </div>

          <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
            {user?.isAdmin && (product as any).likesCount > 0 ? (
              <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100/85 px-2.5 py-1.5 dark:border-amber-800 dark:bg-amber-900/40">
                <Heart className="w-3.5 h-3.5 fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  {(product as any).likesCount}
                </span>
              </div>
            ) : null}
            <button
              onClick={handleWishlist}
              aria-label={isWished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 shadow-sm ${
                isWished
                  ? "border-accent bg-accent text-white scale-110"
                  : "border-white/70 bg-white/90 text-foreground/70 hover:border-accent hover:bg-accent/10 hover:text-accent"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col bg-card p-4 sm:p-5">
        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="mb-1 line-clamp-2 font-heading text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-accent sm:text-[1.05rem]">
            {product.name}
          </h3>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent/80">
            {product.style}
          </p>
          <p className="mb-2 text-[10px] tracking-wide text-muted-foreground/80 sm:text-[11px]">
            {product.metal} · {product.carat}ct · {product.shape}
          </p>

          <div className="mb-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-accent text-accent" />
            ))}
            <span className="ml-1 text-[10px] text-muted-foreground">(5.0)</span>
          </div>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/40 pt-4">
          <div className="min-w-0 flex-1">
            <span className="block text-xs text-muted-foreground/60 line-through mb-1">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="font-heading text-base sm:text-lg font-bold text-accent bg-gradient-to-r from-accent to-accent/80 bg-clip-text">
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/20 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-accent/30 active:scale-95"
            aria-label={`View ${product.name}`}
            title="View product details"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-border/30 bg-card animate-pulse">
    <div className="aspect-[4/5] w-full bg-gradient-to-br from-secondary/60 to-muted/60" />
    <div className="space-y-2.5 p-4 sm:p-5">
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-1/2 rounded bg-muted" />
      <div className="h-3 w-2/3 rounded bg-muted" />
      <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3">
        <div className="space-y-1">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
        <div className="h-10 w-10 rounded-full bg-muted" />
      </div>
    </div>
  </div>
);

const ProductGrid = ({ products, loading }: ProductGridProps) => {
  const [showSkeleton, setShowSkeleton] = useState(loading ?? true);

  useEffect(() => {
    if (!loading) {
      const timer = window.setTimeout(() => setShowSkeleton(false), 300);
      return () => window.clearTimeout(timer);
    }
    setShowSkeleton(true);
  }, [loading]);

  if (showSkeleton) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="mb-2 font-heading text-2xl font-light text-foreground sm:text-3xl">No products found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or clearing your selection.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:gap-10">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
