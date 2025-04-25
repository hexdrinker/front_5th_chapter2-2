import { MembershipTier } from '../../types'
import { selectedTierAtom, tiersAtom } from '../store/atom'
import { useAtom, useAtomValue } from 'jotai'

const useMembership = () => {
  const tiers = useAtomValue(tiersAtom)
  const [selectedTier, setSelectedTier] = useAtom(selectedTierAtom)

  const applyTierDiscount = (tier: MembershipTier) => {
    setSelectedTier(tier)
  }

  return {
    tiers,
    selectedTier,
    applyTierDiscount,
  }
}

export default useMembership
