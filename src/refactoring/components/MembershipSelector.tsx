import useMembership from "../hooks/useMembership";

const MembershipSelector = () => {
  const { tiers, selectedTier, applyTierDiscount } = useMembership();

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">회원 등급</h2>
      <div className="space-y-1 bg-white p-4 rounded shadow">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`${
              selectedTier?.id === tier.id ? "bg-blue-500" : "bg-gray-200"
            } w-[100px] text-center px-2 py-1 rounded hover:bg-blue-700 hover:text-white cursor-pointer`}
            onClick={() => applyTierDiscount(tier)}
          >
            {tier.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipSelector;
