import React from 'react'
import { assets } from "../assets/asset.js";

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-25 text-sm'>

            <div>
                <img src = {assets.logo} className='mb-5 w-32' alt="" />
                <p className = 'w-full md:w-2/3 text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
                </p>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>WAY2RARE</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+1-(647)-293-8900</li>
                    <li>waytworare@gmail.com</li>
                </ul>
            </div>

        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@Way2Rare.ca - All Rights Reserved</p>
        </div>

    </div>
  )
}

export default Footer