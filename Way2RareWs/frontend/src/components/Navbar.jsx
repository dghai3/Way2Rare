import React, { useState } from 'react'
import { assets } from '../assets/asset.js'
import { NavLink,Link } from 'react-router-dom'

const Navbar = () => {
  const [searchHover, setSearchHover] = useState(false)
  const [profileHover, setProfileHover] = useState(false)
  const [cartHover, setCartHover] = useState(false)

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <img src={assets.logo} className='w-30' alt='Way2Rare' />
      <ul className='hidden sm:flex gap-5 text-lg text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-6'>
        <div
          onMouseEnter={() => setSearchHover(true)}
          onMouseLeave={() => setSearchHover(false)}
          className='flex items-center'
        >
          <img
            src={searchHover ? assets.searchg : assets.search}
            className='w-8 h-8 cursor-pointer'
            alt='Search'
          />
        </div>
        <NavLink
          to="/login" // Link to the profile page
          onMouseEnter={() => setProfileHover(true)}
          onMouseLeave={() => setProfileHover(false)}
          className='flex items-center'
        >
          <img
            src={profileHover ? assets.profileg : assets.profile}
            className='w-8 h-8 cursor-pointer'
            alt='Profile'
          />
        </NavLink>
        <Link
          to="/cart" // Link to the cart page
          onMouseEnter={() => setCartHover(true)}
          onMouseLeave={() => setCartHover(false)}
          className='flex items-center'
        >
          <img
            src={cartHover ? assets.cartg : assets.cart}
            className='w-8 h-8 cursor-pointer'
            alt='Cart'
          />
        </Link>
        <img src={assets.menu} className='w-8 cursor-pointer sm:hidden' alt="" />
      </div>
    </div>
  )
}

export default Navbar