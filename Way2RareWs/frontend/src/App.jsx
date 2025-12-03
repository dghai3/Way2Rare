import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import InAction from './pages/InAction'
import SearchBar from './components/SearchBar'
import SearchBar from './components/SearchBar'

const App = () => {
  return (
    <div className = 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] xl:px-[11vw] 2xl:px-[14vw]'>
        <Navbar/>
        <SearchBar />
        <Routes> 
          <Route path='/' element = {<Home/>} />
          <Route path='/collection' element = {<Collection/>} />
          <Route path="/about" element = {<About/>} />
          <Route path ='/contact' element = {<Contact/>} />
          <Route path ='/cart' element = {<Cart/>} />
          <Route path ='/product/:productId' element = {<Product/>} />
          <Route path ='/login' element = {<Login/>} />
          <Route path ='/placeorder' element = {<PlaceOrder/>} />
          <Route path = '/orders' element = {<Orders/>} />
          <Route path = '/inaction' element = {<InAction/>} />
        </Routes>
        <Footer/>
    </div>
  )
}

export default App