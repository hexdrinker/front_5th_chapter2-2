import { Coupon, MembershipTier } from '../../types'

interface Props {
  defaultAfterDiscount: number
  selectedCoupon: Coupon | null
  selectedTier: MembershipTier | null
}

export const useDiscountCalculator = ({
  defaultAfterDiscount,
  selectedCoupon,
  selectedTier,
}: Props) => {
  let totalAfterDiscount = defaultAfterDiscount

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      )
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100
    }
  }

  if (selectedTier) {
    totalAfterDiscount *= 1 - selectedTier.discountRate / 100
  }

  return {
    totalAfterDiscount,
  }
}
