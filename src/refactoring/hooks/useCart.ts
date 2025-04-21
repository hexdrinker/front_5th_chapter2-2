// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const item = cart.find((item) => item.product.id === product.id);
    if (!item) {
      setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity > 20) {
      return;
    }
    if (newQuantity < 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    const totalBeforeDiscount = cart.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
    const totalAfterDiscount = selectedCoupon
      ? selectedCoupon.discountType === "amount"
        ? totalBeforeDiscount - selectedCoupon.discountValue
        : totalBeforeDiscount * (1 - selectedCoupon.discountValue)
      : totalBeforeDiscount;
    const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

    return {
      totalBeforeDiscount,
      totalAfterDiscount,
      totalDiscount,
    };
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
