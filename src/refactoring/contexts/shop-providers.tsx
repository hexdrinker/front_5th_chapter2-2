// contexts/ShopProviders.tsx
import { ReactNode } from "react";
import { ProductProvider } from "./product-context";
import { CartProvider } from "./cart-context";
import { CouponProvider } from "./coupon-context";
import { Product, Coupon } from "../../types";

interface ShopProvidersProps {
  children: ReactNode;
  initialProducts: Product[];
  initialCoupons: Coupon[];
}

export const ShopProviders = ({
  children,
  initialProducts,
  initialCoupons,
}: ShopProvidersProps) => {
  return (
    <CartProvider>
      <ProductProvider initialProducts={initialProducts}>
        <CouponProvider initialCoupons={initialCoupons}>
          {children}
        </CouponProvider>
      </ProductProvider>
    </CartProvider>
  );
};
