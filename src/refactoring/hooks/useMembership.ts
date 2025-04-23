import { useCallback } from "react";
import { MembershipTier } from "../../types";
import { selectedTierAtom, tiersAtom } from "../store/atom";
import { useAtom, useAtomValue } from "jotai";

const useMembership = () => {
  const tiers = useAtomValue(tiersAtom);
  const [selectedTier, setSelectedTier] = useAtom(selectedTierAtom);

  const applyTierDiscount = (tier: MembershipTier) => {
    setSelectedTier(tier);
  };

  const getDiscountRate = useCallback(() => {
    return selectedTier?.discountRate || 0;
  }, [selectedTier]);

  const calculateDiscountedPrice = useCallback(
    (price: number) => {
      return Math.round(price * (1 - (selectedTier?.discountRate || 0)));
    },
    [selectedTier],
  );

  return {
    tiers,
    selectedTier,
    applyTierDiscount,
    getDiscountRate,
    calculateDiscountedPrice,
  };
};

export default useMembership;
