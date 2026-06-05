import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { cartAPI, userAPI } from "@/lib/api";
import type { CartItem, Product } from "@/data/products";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, customization?: any) => Promise<void>;
  removeFromCart: (productId: string, customization?: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, customization?: any) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  wishlist: string[];
  toggleWishlist: (productId: string, isLoggedIn?: boolean) => void;
  removeFromWishlist: (productId: string) => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useAuth();

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const loadFromStorage = (key: string, setter: Function) => {
      try {
        const data = localStorage.getItem(key);
        if (data) setter(JSON.parse(data));
      } catch (e) {
        console.error(`Failed to load ${key}`);
      }
    };
    loadFromStorage("cart", setItems);
    loadFromStorage("wishlist", setWishlist);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
    const total = items.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const basePrice = item.product.price * quantity;
      const customPrice = ((item as any).customization?.customizationPrice || 0) * quantity;
      return sum + basePrice + customPrice;
    }, 0);
    setTotalPrice(total);
  }, [items]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync wishlist from backend whenever authenticated user changes.
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !user) return;

    let cancelled = false;
    const syncWishlistFromBackend = async () => {
      try {
        const response = await userAPI.getWishlist();
        if (!response?.success) return;

        const normalized = (response.wishlist || [])
          .map((product: any) => String(product?.id))
          .filter((id: string) => !!id && id !== "undefined");

        if (!cancelled) {
          setWishlist(Array.from(new Set(normalized)));
        }
      } catch (error) {
        console.error("Failed to sync wishlist from backend:", error);
      }
    };

    syncWishlistFromBackend();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Sync cart from backend on user change
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !user) return;

    let cancelled = false;
    const syncCartFromBackend = async () => {
      try {
        if (localStorage.getItem("cart") !== null) return;
        const response = await cartAPI.getCart();
        if (!response?.success) return;
        if (response.cart?.items && !cancelled) {
          const backendItems = response.cart.items
            .filter((item: any) => item.productId)
            .map((item: any) => ({
              product: item.productId,
              quantity: item.quantity,
              customization: item.customization,
              customizationPrice: item.customizationPrice || 0
            }));
          if (backendItems.length > 0) setItems(backendItems);
        }
      } catch (error) {
        console.error("Failed to sync cart from backend:", error);
      }
    };
    syncCartFromBackend();
    return () => { cancelled = true; };
  }, [user]);

  // Clear wishlist when logged out
  useEffect(() => {
    if (!localStorage.getItem("authToken")) setWishlist([]);
  }, [user]);

  const normalizeCustomization = (cust: any) => {
    if (!cust) return "";
    const { customizationPrice, ...rest } = cust;
    return JSON.stringify(rest);
  };

  const addToCart = useCallback(async (product: Product, customization?: any) => {
    const customizationValue = customization?.customizationPrice || customization?.selectedDiamond?.price || 0;
    const normalizedCust = customization ? { ...customization, customizationPrice: customizationValue } : undefined;
    const customizationKey = normalizeCustomization(normalizedCust);
    
    setItems((prev) => {
      const existing = prev.find((i) => {
        const existingCustomization = normalizeCustomization((i as any).customization);
        return i.product.id === product.id && existingCustomization === customizationKey;
      });

      if (existing) {
        return prev.map((i) => {
          const itemCustomization = normalizeCustomization((i as any).customization);
          return i.product.id === product.id && itemCustomization === customizationKey 
            ? { ...i, quantity: i.quantity + 1 } 
            : i;
        });
      }
      return [...prev, { product, quantity: 1, customization: normalizedCust, customizationPrice: customizationValue } as any];
    });
    
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await cartAPI.addItem(product.id.toString(), 1, customization);
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string | number, customization?: any) => {
    const idStr = String(productId);
    const customizationKey = normalizeCustomization(customization);
    setItems((prev) => prev.filter((i) => {
      const itemCustomizationKey = normalizeCustomization(i.customization);
      return !(String(i.product.id) === idStr && itemCustomizationKey === customizationKey);
    }));

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await cartAPI.removeItem(idStr, customization);
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    }
  }, []);

  const updateQuantity = useCallback(async (productId: string | number, quantity: number, customization?: any) => {
    setLoading(true);
    const idStr = String(productId);
    const customizationKey = normalizeCustomization(customization);
    
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => {
        const itemCustomizationKey = normalizeCustomization(i.customization);
        return !(String(i.product.id) === idStr && itemCustomizationKey === customizationKey);
      }));
    } else {
      setItems((prev) =>
        prev.map((i) => {
          const itemCustomizationKey = normalizeCustomization(i.customization);
          return String(i.product.id) === idStr && itemCustomizationKey === customizationKey 
            ? { ...i, quantity } 
            : i;
        })
      );
    }

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        if (quantity <= 0) {
          await cartAPI.removeItem(idStr, customization);
        } else {
          await cartAPI.updateItem(idStr, quantity, customization);
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    }
    setLoading(false);
  }, []);

  const clearCart = useCallback(async () => {
    setLoading(true);
    setItems([]);
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await cartAPI.clear();
      } catch (error) {
        console.error("Failed to clear cart on backend:", error);
      }
    }
    setLoading(false);
  }, []);

  const toggleWishlist = useCallback((productId: string, isLoggedIn?: boolean) => {
    if (!isLoggedIn) return;
    const normalizedProductId = String(productId);
    setWishlist((prev) => {
      const isAlreadyInWishlist = prev.includes(normalizedProductId);
      const newWishlist = isAlreadyInWishlist 
        ? prev.filter((id) => id !== normalizedProductId) 
        : [...prev, normalizedProductId];
      const token = localStorage.getItem("authToken");
      if (token) {
        if (isAlreadyInWishlist) {
          userAPI.removeFromWishlist(normalizedProductId).catch((error) => {
            console.error("Failed to remove from wishlist:", error);
          });
        } else {
          userAPI.addToWishlist(normalizedProductId).catch((error) => {
            console.error("Failed to add to wishlist:", error);
          });
        }
      }
      
      return newWishlist;
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    const normalizedProductId = String(productId);
    setWishlist((prev) => prev.filter((id) => id !== normalizedProductId));

    const token = localStorage.getItem("authToken");
    if (token) {
      userAPI.removeFromWishlist(normalizedProductId).catch((error) => {
        console.error("Failed to remove wishlist item from backend:", error);
      });
    }
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
