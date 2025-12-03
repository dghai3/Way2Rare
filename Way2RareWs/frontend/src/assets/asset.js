// Icons imports
import logo from './Icons/logo.png'
import search from './Icons/search.svg'
import searchg from './Icons/searchg.gif'
import profile from './Icons/profile.png'
import profileg from './Icons/profileg.gif'
import cart from './Icons/cart.png'
import cartg from './Icons/cartg.gif'
import menu from './Icons/menu.png'
import close from './Icons/close.png'

const BASE_URL = "https://rwccduyhfvbsvogsheth.supabase.co/storage/v1/object/public/product%20images";

// Model pics URLs
const w2rzip3girls = `${BASE_URL}/model_pics/w2rzip3girls.jpeg`;
const w2rzipmodel = `${BASE_URL}/model_pics/w2rzipmodel.JPG`;

// Product pics URLs
const SummerTee = `${BASE_URL}/product_pics/SummerTee.png`;
const NavyZip = `${BASE_URL}/product_pics/NavyZip.jpeg`;
const Pullover = `${BASE_URL}/product_pics/Pullover.jpeg`;

export const assets = {
  // Icons
  logo,
  search,
  searchg,
  profile,
  profileg,
  cart,
  cartg,
  menu,
  close,

  // Model pics
  w2rzip3girls,
  w2rzipmodel,

  // Product pics
  SummerTee,
  NavyZip,
  Pullover
}

export const products = [
  {
    _id: "0001",
    name: "Way2Rare Zip Hoodie",
    description: "Zip Hoodie with Way2Rare Logo",
    price: 60,
    images: [NavyZip],
    category: "Hoodies", // ✅ fixed spelling
    sizes: ["S", "M", "L", "XL", "XXL"],
    current: true,
  },
  {
    _id: "0002",
    name: "Way2Rare Summer Tee",
    description: "Lightweight summer t-shirt with Way2Rare Logo",
    price: 25,
    images: [SummerTee],
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    current: false,
  },
  {
    _id: "0003",
    name: "Way2Rare Pullover Hoodie",
    description: "Pullover Hoodie with Bubble Way2Rare Logo",
    price: 50,
    images: [Pullover],
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    current: false,
  },
  {
    _id: "0004",
    name: "Way2Rare Retro Zip Hoodie",
    description: "Retro Style Zip Hoodie with Way2Rare Logo",
    price: 65,
    images: [NavyZip],
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    current: false,
  },
  {
    _id: "0005",
    name: "Way2Rare Logo Sweatpants",
    description: "Comfortable Sweatpants with Way2Rare Logo",
    price: 40,
    images: [NavyZip],
    category: "Bottoms",
    sizes: ["S", "M", "L", "XL", "XXL"],
    current: false,
  }
];

// ✅ export name matches what you'll import, AND src is a string (not array)
export const Slides = [
  {
    type: "image",
    src: w2rzip3girls,                 // ✅ was [SummerTee]
    alt: "New drop 01",
    kicker: "Way2Rare",
    headline: "FW ‘25 Essentials",
    subhead: "Heavyweight fleece. Minimal branding.",
    cta: { label: "Shop Hoodies", href: "/collection?cat=hoodies" },
  },
  {
    type: "image",
    src: w2rzipmodel,
    headline: "The Zip Hoodie",
    cta: { label: "Buy Now", href: "/product/0001" },
  },
];