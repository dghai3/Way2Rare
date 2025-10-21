import logo from "./logo.png";
import background1 from "./background1.jpg";
import search from "./search.svg";
import searchg from "./searchg.gif";
import profile from "./profile.png";
import profileg from "./profileg.gif";
import cart from "./cart.png";
import cartg from "./cartg.gif";
import menu from "./menu.png";
import close from "./close.png";
import NavyZip from "./NavyZip.png";
import SummerTee from "./SummerTee.png";

export const assets = {
  logo,
  background1,
  search,
  searchg,
  profile,
  profileg,
  cart,
  cartg,
  menu,
  close,
};

export const products = [
  {
    _id: "0001",
    name: "Way2Rare Zip Hoodie",
    description: "Zip Hoodie with Way2Rare Logo",
    price: 60,
    image: [NavyZip],
    category: "Hoodies", // ✅ fixed spelling
    sizes: ["S", "M", "L", "XL", "XXL"],
    current: true,
  },
];

// ✅ export name matches what you'll import, AND src is a string (not array)
export const Slides = [
  {
    type: "image",
    src: SummerTee,                 // ✅ was [SummerTee]
    alt: "New drop 01",
    kicker: "Way2Rare",
    headline: "FW ‘25 Essentials",
    subhead: "Heavyweight fleece. Minimal branding.",
    cta: { label: "Shop Hoodies", href: "/collection?cat=hoodies" },
  },
  {
    type: "image",
    src: NavyZip,                   
    headline: "The Zip Hoodie",
    cta: { label: "Buy Now", href: "/product/way2rare-zip-hoodie" },
  },
];
