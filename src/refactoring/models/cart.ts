import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const maxApplicableDiscount = getMaxApplicableDiscount(item);
  return item.product.price * item.quantity * (1 - maxApplicableDiscount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts.length === 0
    ? 0
    : item.product.discounts.reduce((max, discount) => {
        return item.quantity >= discount.quantity
          ? Math.max(max, discount.rate)
          : max;
      }, 0);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const { price } = item.product;
    const { quantity } = item;
    totalBeforeDiscount += price * quantity;

    const discount = getMaxApplicableDiscount(item);
    totalAfterDiscount += price * quantity * (1 - discount);
  });

  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue,
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
  }

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};
