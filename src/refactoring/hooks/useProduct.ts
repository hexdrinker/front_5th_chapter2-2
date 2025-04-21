import { useEffect, useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(products.map((p) => (p.id === product.id ? product : p)));
  };

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return {
    products,
    updateProduct,
    addProduct,
  };
};
