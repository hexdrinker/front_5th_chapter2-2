import { CartItem } from "../../types";
import { useCart } from "../hooks";

interface CartListItemProps {
  item: CartItem;
}

const CartListItem = ({ item }: CartListItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  };

  const appliedDiscount = getAppliedDiscount(item);

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded shadow">
      <div>
        <span className="font-semibold">{item.product.name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {item.product.price}원 x {item.quantity}
          {appliedDiscount > 0 && (
            <span className="text-green-600 ml-1">
              ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
            </span>
          )}
        </span>
      </div>
      <div>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          -
        </button>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartListItem;
