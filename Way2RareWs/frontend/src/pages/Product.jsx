import React, { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(
    () => products.find((item) => (item._id || item.id) === productId),
    [products, productId]
  );

  if (!product) {
    return (
      <div className="py-16 text-center text-gray-600">
        Product not found.
      </div>
    );
  }

  const imagesRaw = Array.isArray(product.image)
    ? product.image
    : product.image
    ? [product.image]
    : product.images || [];
  const gallery = imagesRaw.length ? imagesRaw : [''];
  const primary = gallery[0];
  const secondary = gallery[1] || gallery[0];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    alert(`Added ${quantity} × ${product.name} (${selectedSize}) to cart`);
  };

  return (
    <div className="py-10">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl bg-gray-50">
            <img
              src={primary}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl bg-gray-50">
            <img
              src={secondary}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {product.name}
              </p>
              <p className="mt-2 text-lg font-medium text-gray-800">
                {currency}
                {product.price}
              </p>
              {product.description && (
                <p className="mt-3 text-sm text-gray-600">
                  {product.description}
                </p>
              )}
            </div>
            <button
              type="button"
              className="rounded-full border border-gray-300 p-3 text-gray-600 hover:border-gray-500"
              aria-label="Save to favorites"
            >
              ♥
            </button>
          </div>

          <div className="border-t pt-4">
            <p className="mb-3 text-sm font-medium text-gray-700">Select size</p>
            <div className="flex flex-wrap gap-3">
              {(product.sizes || []).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 w-11 rounded-full border text-sm font-medium transition
                    ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700" htmlFor="quantity">
              Qty
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-24 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wide transition
                ${
                  selectedSize
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              Add to Basket
            </button>
            <button
              type="button"
              className="rounded-md border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400"
            >
              Size guide
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-md border border-gray-200 p-3 text-sm text-gray-700">
              Model height: 187 cm · Wearing size L
            </div>
            <div className="rounded-md border border-gray-200 p-3 text-sm text-gray-800">
              Materials, care and source
            </div>
            <div className="rounded-md border border-gray-200 p-3 text-sm text-gray-800">
              Deliveries and returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
