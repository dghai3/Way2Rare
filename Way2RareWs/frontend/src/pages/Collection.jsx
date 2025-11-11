import React, { useContext, useState } from 'react'
import Vault1 from '../components/Vault1'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/asset'

const Collection = () => {

  const { products } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);

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
              <input className='w-3' type="checkbox" value={'Hoodies & Zip-Ups'}/> Hoodies & Zip-Ups
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Sweats'}/> Sweats
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Tees'}/> Tees
            </p>
          </div>

        </div>

      </div>

      <Vault1 />
    </div>
  )
}

export default Collection