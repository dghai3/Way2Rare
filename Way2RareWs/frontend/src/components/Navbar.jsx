import React, { useState, useContext } from "react";
import { assets } from "../assets/asset.js";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const linkBase =
  "group flex flex-col items-center gap-1 transition-colors duration-200";
const linkInactive = "text-gray-400 hover:text-gray-700";
const linkActive = "text-gray-900";

const Underline = ({ active = false }) => (
  <span
    className={`h-[2px] bg-gray-700 transition-all duration-200 rounded 
      ${active ? "w-3/4 opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-100"}`}
    aria-hidden="true"
  />
);

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [profileHover, setProfileHover] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const { setShowSearch, navigate, token, setToken } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
  }

  const toggleSidebar = () => setVisible((v) => !v);
  const toggleSearchBar = () => {
    setShowSearch((prev) => !prev);
  };

  return (
    <div className="relative flex items-center justify-between py-5 font-medium">
      <NavLink to="/"> {/* Make the logo clickable to go back to home */}
        <img src={assets.logo} className="w-28" alt="Way2Rare" />
      </NavLink>

      {/* desktop nav */}
      <ul className="hidden sm:flex gap-6 text-lg">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          {({ isActive }) => (
            <>
              <p>HOME</p>
              <Underline active={isActive} />
            </>
          )}
        </NavLink>

        <NavLink
          to="/collection"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          {({ isActive }) => (
            <>
              <p>COLLECTION</p>
              <Underline active={isActive} />
            </>
          )}
        </NavLink>

        <NavLink
          to="/inaction"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          {({ isActive }) => (
            <>
              <p>IN ACTION</p>
              <Underline active={isActive} />
            </>
          )}
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          {({ isActive }) => (
            <>
              <p>ABOUT</p>
              <Underline active={isActive} />
            </>
          )}
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          {({ isActive }) => (
            <>
              <p>CONTACT</p>
              <Underline active={isActive} />
            </>
          )}
        </NavLink>
      </ul>

      {/* right icons */}
      <div className="flex items-center gap-6">
        <div
          onMouseEnter={() => setSearchHover(true)}
          onMouseLeave={() => setSearchHover(false)}
          onClick={toggleSearchBar}
          role="button"
          aria-label="Toggle search bar"
          className="flex items-center cursor-pointer"
        >
          <img
            src={searchHover ? assets.searchg : assets.search}
            className="w-8 h-8 transition-transform duration-150 hover:scale-105"
            alt="Search"
          />
        </div>

        <Link
          to="/cart"
          onMouseEnter={() => setCartHover(true)}
          onMouseLeave={() => setCartHover(false)}
          className="flex items-center"
        >
          <img
            src={cartHover ? assets.cartg : assets.cart}
            className="w-8 h-8 cursor-pointer transition-transform duration-150 hover:scale-105"
            alt="Cart"
          />
        </Link>

        <div className='group relative'>
          <Link to='/login'>
            <img
              src={profileHover ? assets.profileg : assets.profile}
              className="w-8 h-8 cursor-pointer transition-transform duration-150 hover:scale-105"
              alt="Profile"
              onMouseEnter={() => setProfileHover(true)}
              onMouseLeave={() => setProfileHover(false)}
            />
          </Link>
          {/* Dropdown Menu */}
          {token &&
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-lg border border-gray-200'>
                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          }
        </div>

        <img
          onClick={toggleSidebar}
          src={assets.menu}
          className="w-8 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Backdrop overlay */}
      {visible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar} // Close sidebar when clicking on backdrop
        />
      )}

      {/* mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-[width] duration-300 overflow-hidden sm:hidden ${visible ? "w-2/3" : "w-0"
          } z-50`}
      >
        {visible && (
          <button
            onClick={toggleSidebar}
            className="absolute top-2 right-2 p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <img src={assets.close} alt="Close" className="w-8 h-8" />
          </button>
        )}

        <ul className="mt-14 flex flex-col items-start p-6 gap-2">
          <NavLink
            to="/"
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `w-full py-4 text-3xl transition-colors duration-200 ${isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
              }`
            }
          >
            HOME
          </NavLink>

          <NavLink
            to="/collection"
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `w-full py-4 text-3xl transition-colors duration-200 ${isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
              }`
            }
          >
            COLLECTION
          </NavLink>

          <NavLink
            to="/inaction"
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `w-full py-4 text-3xl transition-colors duration-200 ${isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
              }`
            }
          >
            IN ACTION
          </NavLink>

          <NavLink
            to="/about"
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `w-full py-4 text-3xl transition-colors duration-200 ${isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
              }`
            }
          >
            ABOUT
          </NavLink>

          <NavLink
            to="/contact"
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `w-full py-4 text-3xl transition-colors duration-200 ${isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
              }`
            }
          >
            CONTACT
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
