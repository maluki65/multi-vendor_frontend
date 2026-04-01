import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { menuRoleItems } from '../DashboardLayout/roles/menuConfig';
import { SearchBar, ProfileDropDown } from '../';
import { useLogout } from '../../Hooks/useLogout';
import  useStickyNav  from '../../Hooks/useStickyNav';

function DesktopNavbar() {
  const navigate = useNavigate();
  const logout = useLogout();
  const isSticky = useStickyNav();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <div className={`desktop-navbar flex items-center justify-between py-2.5 px-[3%] ${isSticky ? 'fixed-nav' : ''}`}>

      <h1 className='text-orange-400 text-[1.4em] font-goodly cursor-pointer logo'>
        Sell<span className='text-primary'>ory</span>
      </h1>

      <div className='icons'>
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
  );
}

export default DesktopNavbar;