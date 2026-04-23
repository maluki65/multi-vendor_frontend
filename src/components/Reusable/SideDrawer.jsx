import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';
import { IoIosLogOut } from "react-icons/io";
import { useLogout } from '../../Hooks/useLogout';
import { menuRoleItems } from '../DashboardLayout/roles/menuConfig';

function SideDrawer({ isOpen, onClose }) {

  const drawerNavs = [
    { name: 'Shop', link: '/buyer/products'},
    { name: 'cart', link: '/buyer/cart' },
    { name: 'Whishlist', link: '/buyer/wishlist' },
    { name: 'Checkout', link:'/buyer/checkout' },
    { name: 'Orders', link: '/buyer/orders' },
  ]

  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  }

  const handleNavigate = (link) => {
    navigate(link);
    onClose();
  }

  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} />}

      <div className={`drawer flex flex-col justify-between ${isOpen ? 'open' : ''}`}>

        <div className="drawer-header">
          <FaXmark size={22} onClick={onClose} />
        </div>

        <div className='drawer-links gap-5 p-4 flex flex-col cursor-pointer text-primary'>

          {drawerNavs.map((item, index) => {
            return (
              <div 
                onClick={() => handleNavigate(item.link)}
                key={index}
                className=''
                >
                  {item.name}
              </div>
            )
          }
          )}
        </div>

        <div className='flex items-center justify-between px-4 my-2 text-primary'>
            <a onClick={() => navigate('/buyer/profile')} className=''>Profile</a>
            <IoIosLogOut onClick={handleLogout} className='hover:text-red-500' size={23} />
          </div>
      </div>
    </>
  );
}

export default SideDrawer;