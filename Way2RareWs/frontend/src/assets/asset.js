import logo from "./logo.png";
import background1 from "./background1.jpg";
import search from "./search.svg";
import searchg from "./searchg.gif";
import profile from "./profile.png";
import profileg from "./profileg.gif";
import cart from "./cart.png"; // 
import cartg from "./cartg.gif";
import menu from "./menu.png";
import close from "./close.png";
import NavyZip from "./NavyZip.png";

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
    catergory: "Hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    current: true,
  },
];
