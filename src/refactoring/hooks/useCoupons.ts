import { useAtom } from "jotai";
import { Coupon } from "../../types";
import { couponAtom, couponsAtom } from "../store/atom";

export const useCoupons = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(couponAtom);

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  };

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    applyCoupon,
  };
};
