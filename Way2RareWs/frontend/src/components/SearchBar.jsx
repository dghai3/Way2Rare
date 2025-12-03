import React, { useContext, useEffect, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/asset'

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const containerRef = useRef(null);

    useEffect(() => {
      if (!showSearch) return;

      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setShowSearch(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSearch, setShowSearch]);

  return showSearch ? (
    <div ref={containerRef} className='border-t border-b bg-gray-50 text-center'> 
        <div className='inline-flex itenms-center justify-center border border-geay-400 px-5 py-2 my-5 mx3 rounded-full w-3/4 sm:w-1/2'>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm' type="text" placeholder='Search' />
            <img className='w-4' src={assets.search} />
        </div>
        <img onClick={()=>setShowSearch(false)}className='inline w-3 cursor-pointer' src={assets.cross} alt=""/>
    </div>
  ) : null
}

export default SearchBar
