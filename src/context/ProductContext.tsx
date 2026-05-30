import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService, Product } from '../services/productService';

interface ProductContextType {
  products: Product[];
  productsLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setProductsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await productService.getProducts();
      if (fetchErr) throw fetchErr;
      setProducts(data || []);
    } catch (err: any) {
      console.error("Fetch error: getProducts failed in context:", err);
      setError(err.message || 'Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, productsLoading, error, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
