import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { menuRoleItems } from '../roles/menuConfig';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLogout } from '../../../Hooks/useLogout';
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Logo01, Logo02 } from '../../../assets';
import { TbLogout2 } from "react-icons/tb";


function Sidebar( { role, fullName }) {
  const logout = useLogout();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const Icon = ({ name, icon: Icon, isActive, handleClick }) => (
    <div
      onClick={handleClick}
      className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer
        ${isActive === name ? "bg-gray-200 text-orange-500" : "text-gray-700"}
      `}
    >
      <Icon size={20} />
    </div>
  );
  const menuItems = menuRoleItems[role] || [];

  const handleLogout = async () => {
    try{
      await logout();
      console.log('Logout successfull');
    } catch (error){
      console.log('Logout failed', error);
    }
  }
  return (
    <div className='flex justify-between items-center flex-col sticky top-5 h-[93vh]'>
      <Link to='/'>
        <img
          src={Logo01}
          className="w-[52px] h-[52px] rounded-lg"
          alt="Logo"
        />
      </Link>
      <div className=' flex flex-col justify-between items-center bg-white rounded-[20px] w-14 py-2'>
        <div className='flex flex-col justify-center items-center gap-3'>
          {menuItems.map((link) => (
            <Icon
              key={link.value}
              name={link.value}
              isActive={activeTab}
              icon={link.icon}   
              handleClick={() => {
                setSearchParams({ tab: link.value});
              }}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col justify-between gap-3 items-center bg-white rounded-[20px] w-14 py-2 shadow-secondary'>
        <AiOutlineQuestionCircle  className='cursor-pointer text-gray-700' size={20}/>
        <TbLogout2 onClick={handleLogout} className='cursor-pointer text-gray-700' size={20}/>
      </div>
    </div>
  )
}

export default Sidebar
