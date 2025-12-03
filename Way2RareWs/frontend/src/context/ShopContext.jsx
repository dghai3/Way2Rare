import { createContext, useState, useEffect } from "react";
import { products as seedProducts } from "../assets/asset";
import { useNavigate } from "react-router-dom";

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

  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const loadProducts = async () => {
      // If no API URL is configured we stay on seed data and avoid a failing network call.
      if (!API_URL) {
        setProducts(seedProducts);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();

        if (Array.isArray(data) && data.length) {
          console.log('Loaded products from API:', data);
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

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  const value = {
    products, currency, delivery_fee, loading, error, search, setSearch, setShowSearch,
    token, setToken, navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
