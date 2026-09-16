import React, { createContext, useContext, useState } from "react";
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
  wishlist: WishlistItem[];
  toggleWishlist: (productId: string, size?: string, color?: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

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

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        wishlist,
        toggleWishlist,
        isInWishlist,
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
