import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/asset";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {

  const { products } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    // Filter products whenever data or filters change
    let data = [...products];
    if (category.length) {
      data = data.filter((item) => category.includes(item.category));
    }
    // Apply sorting
    if (sortType === "low-high") {
      data = [...data].sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      data = [...data].sort((a, b) => b.price - a.price);
    }
    setFilterProducts(data);
  }, [products, category, sortType]);


  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS</p>
        <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.logo} alt='' />

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? 'block' : 'hidden sm:block'}`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Hoodies'} onChange={handleCategoryChange}/> Hoodies & Zip-Ups
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottoms'} onChange={handleCategoryChange}/> Sweats / Bottoms
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'T-Shirts'} onChange={handleCategoryChange}/> Tees
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className= 'flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'PRODUCTS'} />
          {/* Product Sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className = 'border-2 bordergray-200 text-sm px-2'>
            <option value="relevant" >Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item, index)=> (
              <ProductItem key={index} name = {item.name} price = {item.price} id = {item._id} image = {item.image} />
            ))
          }
        </div>

      </div>
    </div>
  )
}

export default Collection
