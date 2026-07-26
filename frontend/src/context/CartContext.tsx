"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string; // unique id for cart item, usually menuId + servings
  menuId: string;
  menuName: string;
  image: string;
  servings: number;
  price: number;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const getCartStorageKey = () => {
  if (typeof window === "undefined") return "meal_kits_cart_guest";
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.id) {
        return `meal_kits_cart_${user.id}`;
      }
    }
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }
  return "meal_kits_cart_guest";
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentKey, setCurrentKey] = useState<string>("meal_kits_cart_guest");

  const loadCartForKey = (key: string) => {
    try {
      const savedCart = localStorage.getItem(key);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error("Failed to parse cart data", e);
      setCartItems([]);
    }
  };

  // Load initial cart and monitor user ID changes
  useEffect(() => {
    const key = getCartStorageKey();
    setCurrentKey(key);
    loadCartForKey(key);
    setIsLoaded(true);

    // Monitor for login/logout or account switching
    const interval = setInterval(() => {
      const newKey = getCartStorageKey();
      setCurrentKey((prevKey) => {
        if (newKey !== prevKey) {
          loadCartForKey(newKey);
          return newKey;
        }
        return prevKey;
      });
    }, 1000);

    const handleStorageChange = () => {
      const newKey = getCartStorageKey();
      setCurrentKey((prevKey) => {
        if (newKey !== prevKey) {
          loadCartForKey(newKey);
          return newKey;
        }
        return prevKey;
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Save to local storage under the current user's specific key
  useEffect(() => {
    if (isLoaded && currentKey) {
      localStorage.setItem(currentKey, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded, currentKey]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    setCartItems((prev) => {
      // Create a unique ID based on menuId and servings
      const id = `${item.menuId}-${item.servings}`;
      const existing = prev.find((i) => i.id === id);

      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newQuantity = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQuantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
