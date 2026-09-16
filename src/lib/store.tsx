import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/catalog";

type CartItem = {
  product: Product;
  size?: string;
  color?: string;
  quantity: number;
};

export type WishlistItem = {
  productId: string;
  size?: string;
  color?: string;
};

import { Coupon } from "./db";

type StoreContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (
    productId: string,
    size: string | undefined,
    color: string | undefined,
    quantity: number,
  ) => void;
  clearCart: () => void;
  wishlist: WishlistItem[];
  toggleWishlist: (productId: string, size?: string, color?: string) => void;
  isInWishlist: (productId: string) => boolean;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("chic_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const savedWishlist = localStorage.getItem("chic_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCoupon = localStorage.getItem("chic_coupon");
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error("Failed to load store from local storage", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("chic_cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("chic_wishlist", JSON.stringify(wishlist));
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (appliedCoupon) {
      localStorage.setItem("chic_coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("chic_coupon");
    }
  }, [appliedCoupon, isLoaded]);

  const applyCoupon = (coupon: Coupon) => setAppliedCoupon(coupon);
  const removeCoupon = () => setAppliedCoupon(null);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if same item with same size/color exists
      const existing = prev.find(
        (p) => p.product.id === item.product.id && p.size === item.size && p.color === item.color,
      );
      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, quantity: p.quantity + item.quantity } : p,
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter((p) => !(p.product.id === productId && p.size === size && p.color === color)),
    );
  };

  const updateCartQuantity = (
    productId: string,
    size: string | undefined,
    color: string | undefined,
    quantity: number,
  ) => {
    setCart((prev) =>
      prev.map((p) =>
        p.product.id === productId && p.size === size && p.color === color ? { ...p, quantity } : p,
      ),
    );
  };

  const toggleWishlist = (productId: string, size?: string, color?: string) => {
    setWishlist((prev) => {
      // If toggling without specific size/color (e.g. from ProductCard), just check if any exists for this productId
      const exists = prev.some((item) => item.productId === productId);
      if (exists) {
        // Remove all entries for this productId
        return prev.filter((item) => item.productId !== productId);
      }
      return [...prev, { productId, size, color }];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((item) => item.productId === productId);

  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
