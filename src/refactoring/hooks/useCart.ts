import { useAtom } from "jotai";
import { Coupon, MembershipTier, Product } from "../../types";
import { cartAtom } from "../store/atom";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);

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

  const calculateTotal = (
    selectedCoupon: Coupon | null,
    selectedTier: MembershipTier | null,
  ) => {
    return calculateCartTotal(cart, selectedCoupon, selectedTier);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
  };
};
