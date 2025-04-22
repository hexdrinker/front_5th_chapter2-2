import { createContext, useContext, ReactNode, useState, useMemo } from "react";
import { Product } from "../../types";
import { useCart } from "./cart-context";

interface ProductContextProps {
  products: Product[];
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (product: Product) => void;
  getRemainingStock: (product: Product) => number;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined,
);

export const ProductProvider = ({
  children,
  initialProducts,
}: {
  children: ReactNode;
  initialProducts: Product[];
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
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

  const value = useMemo(() => {
    return {
      products,
      updateProduct,
      addProduct,
      getRemainingStock,
    };
  }, [products, updateProduct, addProduct, getRemainingStock]);

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
