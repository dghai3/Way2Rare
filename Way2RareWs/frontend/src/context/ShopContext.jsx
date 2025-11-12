import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext();
export const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currency = '$';
  const delivery_fee = 10;
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    // Fetch products from API
    fetch(`${API_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL]);

  const value = {
    products,
    currency,
    delivery_fee,
    loading,
    error,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
