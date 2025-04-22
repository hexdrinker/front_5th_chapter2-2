import { createContext, useContext, ReactNode, useState, useMemo } from "react";
import { Coupon } from "../../types";

interface CouponContextProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addCoupon: (coupon: Coupon) => void;
  applyCoupon: (coupon: Coupon | null) => void;
}

const CouponContext = createContext<CouponContextProps | undefined>(undefined);

export const CouponProvider = ({
  children,
  initialCoupons,
}: {
  children: ReactNode;
  initialCoupons: Coupon[];
}) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  };

  const value = useMemo(() => {
    return {
      coupons,
      selectedCoupon,
      addCoupon,
      applyCoupon,
    };
  }, [coupons, selectedCoupon, addCoupon, applyCoupon]);

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error("useCoupons must be used within a CouponProvider");
  }
  return context;
};
