import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { menuRoleItems } from '../DashboardLayout/roles/menuConfig';
import { SearchBar, ProfileDropDown } from '../';
import { useLogout } from '../../Hooks/useLogout';
import useStickyNav from '../../Hooks/useStickyNav';
import { CiGrid32 } from "react-icons/ci";

function DesktopNavbar({ products = [] }) {
  const navigate = useNavigate();
  const logout = useLogout();
  const isSticky = useStickyNav();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const BuyerNavs = [
    { name: 'All', value: '/products', icon: CiGrid32 },
    { name: "Today's peak", value: '/deals', icon: null },
    { name: 'Gift cards', value: '/', icon: null},
    { name: 'Orders', value: '/orders', icon: null },
  ];

  return (
    <div className={`desktop-navbar flex flex-col gap-2 py-2.5 px-[3%] ${isSticky ? 'fixed-nav' : ''}`}>
      <div className='flex items-center justify-between'>
        <h1 className='text-orange-400 text-[1.4em] font-goodly cursor-pointer logo'>
          Sell<span className='text-primary'>ory</span>
        </h1>

        <div className='icons flex items-center gap-2'>
          <SearchBar />
          <ProfileDropDown onLogout={handleLogout} />        

          {menuRoleItems['Buyer']?.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.value} to={`/buyer${item.link}`}>
                <Icon size={22} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className='flex gap-3 items-center z-10'>
        <ul className='list-none flex items-center gap-3'>
          {BuyerNavs.map((nav) => {
            const BuyIcon = nav.icon;
            return (
              <Link key={nav.value} to={`/buyer${nav.value}`}>
                <li className='flex items-center hover:underline'>
                  {BuyIcon && <BuyIcon className='buyerIcon' strokeWidth={1} size={20}/>} 
                  <span className='buyernavs'>{nav.name}</span>
                </li>
              </Link>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default DesktopNavbar;