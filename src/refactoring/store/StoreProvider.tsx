import { useState } from "react";
import { createStore, Provider } from "jotai";
import { Coupon, Product } from "../../types";
import { couponsAtom, productsAtom } from "./atom";

export default function StoreProvider({
  children,
  initialProducts,
  initialCoupons,
}: {
  children: React.ReactNode;
  initialProducts?: Product[];
  initialCoupons?: Coupon[];
}) {
  const [store] = useState(() => {
    const store = createStore();
    if (initialProducts) {
      store.set(productsAtom, initialProducts);
    }
    if (initialCoupons) {
      store.set(couponsAtom, initialCoupons);
    }
    return store;
  });

  return <Provider store={store}>{children}</Provider>;
}
