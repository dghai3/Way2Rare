import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const Vault1 = () => {
  
  const { products } = useContext(ShopContext);
  console.log(products);

    return (
    <div>

    </div>
  )
}

export default Vault1;

