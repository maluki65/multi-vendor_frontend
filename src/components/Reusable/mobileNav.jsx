import React, { useState } from 'react';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import SideDrawer from './SideDrawer';
import { SearchBar } from '../';
import useStickyNav from '../../Hooks/useStickyNav';
import { MdOutlineShoppingCart } from "react-icons/md";
import { BsSuitHeart } from "react-icons/bs";
import { CiUser } from "react-icons/ci";

function mobileNav() {
  const [isOpen,setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isSticky = useStickyNav();

  return (
    <>
      <div className={`mobile-navbar ${isSticky ? 'fixed-nav' : ''}`}>
        <div className='nav-top'>
          <div onClick={() => setIsOpen(true)}>
            <FaBarsStaggered className='' size={22}/>
          </div>

          <h1 className='text-orange-400 text-[1.4em] font-goodly cursor-pointer logo'>
            Sell<span className='text-primary'>ory</span>
          </h1>

          <div className='icons'>
            {/*<span onClick={() => navigate('/buyer/wishlist')}>
              <MdOutlineShoppingCart className='' size={20} />
            </span>*/}
            <span onClick={() => navigate('/buyer/profile')}>
              <CiUser className='' size={20} />
            </span>

            <span onClick={() => navigate('/buyer/cart')}>
              <MdOutlineShoppingCart className='' size={20} />
            </span>
          </div>
        </div>

        <div className='nav-bottom'>
          <SearchBar />
        </div>
      </div>

      <SideDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
     </>
  )
}

export default mobileNav