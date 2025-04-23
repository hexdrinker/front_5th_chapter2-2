import { useAtom } from "jotai";
import { Product } from "../../types";
import { productsAtom } from "../store/atom";
import { useCart } from "./useCart";

export const useProducts = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const { cart } = useCart();

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const getRemainingStock = (product: Product) => {
    if (!product) {
      return 0;
    }

    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  return {
    products,
    updateProduct,
    addProduct,
    getRemainingStock,
  };
};
