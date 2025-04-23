import { atom } from "jotai";
import { CartItem, Coupon, MembershipTier, Product } from "../../types";
import { defaultTiers, initialCoupons, initialProducts } from "./constants";

export const productsAtom = atom<Product[]>(initialProducts);

export const cartAtom = atom<CartItem[]>([]);

export const couponsAtom = atom<Coupon[]>(initialCoupons);
export const couponAtom = atom<Coupon | null>(null);

export const tiersAtom = atom<MembershipTier[]>(defaultTiers);
export const selectedTierAtom = atom<MembershipTier | null>(null);
