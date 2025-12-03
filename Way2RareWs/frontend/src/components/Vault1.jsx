import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title.jsx';
import ProductItem from './ProductItem.jsx';   // <-- add this

const Vault1 = () => {
  const { products } = useContext(ShopContext);
  const [vaultProducts, setVaultProducts] = useState([]);

  useEffect(() => {
    if (products && products.length) {
      setVaultProducts(products.slice(0, 10));
    }
  }, [products]); // <-- include products

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="THE" text2="VAULT" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore The Archives
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {vaultProducts.map((item, index) => (
          <ProductItem
            key={item.id ?? index}
            id={item.id}
            image={item.images}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Vault1;
