import React, { useContext } from 'react';   // <-- import useContext
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  // handle image as string or array
  const src = Array.isArray(image) ? image[0] : image;

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img className="hover:scale-110 transition ease-in-out" src={src} alt={name} />
        <div>
          <p className="pt-3 pb-1 text-sm">{name}</p>
          <p className="text-sm font-medium">
            {currency}
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;