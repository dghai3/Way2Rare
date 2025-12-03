import { createContext, useState, useEffect } from "react";
import { products as seedProducts } from "../assets/asset";

export const ShopContext = createContext();
export const ShopContextProvider = (props) => {
  // Start with local seed data so the UI has something to show even if the API is down.
  const [products, setProducts] = useState(seedProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currency = '$';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();

        if (Array.isArray(data) && data.length) {
          setProducts(data);
        } else {
          // Fallback to local seed if API returns empty/invalid.
          setProducts(seedProducts);
        }
      } catch (err) {
        // In dev, failing fetch (API offline/CORS) will land here. We silently fall back to seed data.
        if (import.meta.env.DEV) {
          console.info('Using local seed products because API request failed:', err.message);
        }
        setError(err.message);
        setProducts(seedProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [API_URL]);

  const value = {
    products, currency, delivery_fee, loading, error, search, setSearch, setShowSearch
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
