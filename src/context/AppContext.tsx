"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, PRODUCTS } from "@/data/products";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  image: string;
}

export interface AppliedCoupon {
  code: string;
  rate: number;
}

export interface CatalogFilters {
  category: string;
  color: string;
  maxPrice: number;
  search: string;
}

interface AppContextType {
  cart: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  checkoutPaymentMethod: string;
  isCartOpen: boolean;
  isFilterOpen: boolean;
  isSearchOpen: boolean;
  catalogFilters: CatalogFilters;
  catalogSort: string;
  setCheckoutPaymentMethod: (method: string) => void;
  toggleCartDrawer: (show: boolean) => void;
  toggleFilterDrawer: (show: boolean) => void;
  toggleSearchOverlay: (show: boolean) => void;
  addToCart: (product: Product, color: string, size: string, quantity: number) => void;
  removeFromCart: (index: number) => void;
  updateCartItemQty: (index: number, delta: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  setCategoryFilter: (category: string) => void;
  toggleColorFilter: (color: string) => void;
  handlePriceRangeChange: (price: number) => void;
  handleCatalogSort: (sort: string) => void;
  resetFilters: () => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const COUPONS: { [key: string]: number } = {
  "BLAQ10": 0.10, // 10% off
  "STREET20": 0.20 // 20% off
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethodState] = useState<string>("cod");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [catalogFilters, setCatalogFilters] = useState<CatalogFilters>({
    category: "all",
    color: "all",
    maxPrice: 8000,
    search: ""
  });
  const [catalogSort, setCatalogSort] = useState<string>("default");

  // Synchronize cart with LocalStorage on client mount
  useEffect(() => {
    const savedCart = localStorage.getItem("dblaq_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  const saveCartToLocalStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("dblaq_cart", JSON.stringify(newCart));
  };

  const toggleCartDrawer = (show: boolean) => {
    setIsCartOpen(show);
    if (show) setIsFilterOpen(false); // Close other drawers
  };

  const toggleFilterDrawer = (show: boolean) => {
    setIsFilterOpen(show);
    if (show) setIsCartOpen(false); // Close other drawers
  };

  const toggleSearchOverlay = (show: boolean) => {
    setIsSearchOpen(show);
  };

  const setCheckoutPaymentMethod = (method: string) => {
    setCheckoutPaymentMethodState(method);
  };

  const addToCart = (product: Product, color: string, size: string, quantity: number) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        selectedColor: color,
        selectedSize: size,
        quantity: quantity,
        image: product.images[0]
      });
    }
    saveCartToLocalStorage(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    saveCartToLocalStorage(newCart);
  };

  const updateCartItemQty = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    saveCartToLocalStorage(newCart);
  };

  const applyCoupon = (code: string) => {
    const uppercaseCode = code.toUpperCase();
    if (COUPONS[uppercaseCode]) {
      const coupon = { code: uppercaseCode, rate: COUPONS[uppercaseCode] };
      setAppliedCoupon(coupon);
      return {
        success: true,
        message: `Coupon "${uppercaseCode}" applied successfully! You got ${COUPONS[uppercaseCode] * 100}% off.`
      };
    } else {
      return {
        success: false,
        message: "Invalid coupon code."
      };
    }
  };

  const clearCart = () => {
    saveCartToLocalStorage([]);
    setAppliedCoupon(null);
  };

  const setCategoryFilter = (category: string) => {
    setCatalogFilters((prev) => ({ ...prev, category }));
  };

  const toggleColorFilter = (color: string) => {
    setCatalogFilters((prev) => ({
      ...prev,
      color: prev.color === color ? "all" : color
    }));
  };

  const handlePriceRangeChange = (price: number) => {
    setCatalogFilters((prev) => ({ ...prev, maxPrice: price }));
  };

  const handleCatalogSort = (sort: string) => {
    setCatalogSort(sort);
  };

  const resetFilters = () => {
    setCatalogFilters({
      category: "all",
      color: "all",
      maxPrice: 8000,
      search: ""
    });
    setCatalogSort("default");
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        appliedCoupon,
        checkoutPaymentMethod,
        isCartOpen,
        isFilterOpen,
        isSearchOpen,
        catalogFilters,
        catalogSort,
        setCheckoutPaymentMethod,
        toggleCartDrawer,
        toggleFilterDrawer,
        toggleSearchOverlay,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        applyCoupon,
        setCategoryFilter,
        toggleColorFilter,
        handlePriceRangeChange,
        handleCatalogSort,
        resetFilters,
        clearCart
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
