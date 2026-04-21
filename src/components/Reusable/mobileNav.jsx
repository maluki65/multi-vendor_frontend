import React, { useState } from 'react';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import SideDrawer from './SideDrawer';
import { SearchBar, ProfileDropDown  } from '../';
import useStickyNav from '../../Hooks/useStickyNav';
import { MdOutlineShoppingCart } from "react-icons/md";
import { BsSuitHeart } from "react-icons/bs";
import { CiUser, CiGrid32 } from "react-icons/ci";
import useCart from '../../Hooks/useCart';
import { useLogout } from '../../Hooks/useLogout';


function mobileNav() {
  const [isOpen,setIsOpen] = useState(false);
  const navigate = useNavigate();
    const logout = useLogout();
  
  const isSticky = useStickyNav();
  const { totalItems } = useCart();

  const BuyerNavs = [
    { name: 'All', value: '/products', icon: CiGrid32 },
    { name: "Today's peak", value: '/deals', icon: null },
    { name: 'Gift cards', value: '/', icon: null},
    { name: 'Orders', value: '/orders', icon: null },
  ]

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

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
            <span>
              <ProfileDropDown onLogout={handleLogout} />   
            </span>

            <span 
              onClick={() => navigate('/buyer/cart')}   className="relative">
              <MdOutlineShoppingCart size={20} />

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className='nav-bottom flex items-center justify-center'>
          <SearchBar />
        </div>

        <div className='flex gap items-center'>
        <ul className='list-none flex itams-center gap-3 LinkCon'>
          {BuyerNavs.map((nav) => {
            const BuyIcon = nav.icon;
            return (
              <Link key={nav.value} to={`/buyer${nav.value}`}>
                <li className='flex items-center hover:underline my-2 LinkTexts09'>{BuyIcon && <BuyIcon strokeWidth={1} size={20}/>} <span className=''>{nav.name}</span></li>
              </Link>
            )
          })}
        </ul>
      </div>
      </div>

      <SideDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
     </>
  )
}

export default mobileNav