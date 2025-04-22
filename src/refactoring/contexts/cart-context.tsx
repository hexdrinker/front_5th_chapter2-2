import { createContext, useContext, ReactNode, useState, useMemo } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { useLocalStorage } from "../hooks";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  calculateTotal: (selectedCoupon: Coupon | null) => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { getItem } = useLocalStorage();
  const [cart, setCart] = useState<CartItem[]>(getItem("cart") || []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.product.id === product.id);
      if (!item) {
        return [...prevCart, { product, quantity: 1 }];
      }
      return updateCartItemQuantity(prevCart, product.id, item.quantity + 1);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotal = (selectedCoupon: Coupon | null) => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  const value = useMemo(() => {
    return {
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemCount,
      calculateTotal,
    };
  }, [
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    calculateTotal,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
