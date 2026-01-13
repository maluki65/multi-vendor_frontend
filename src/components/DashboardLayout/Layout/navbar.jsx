import React, {useState} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaChevronDown, FaBarsStaggered } from "react-icons/fa6";
import { useLogout } from '../../../Hooks/useLogout';
import { menuRoleItems } from '../roles/menuConfig';
import { IoIosSearch } from "react-icons/io";
import { ImgP } from '../../../assets';
import { TbLogout2 } from "react-icons/tb";

function Navbar({ role, fullName, email }) {
  const logout = useLogout();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const activeTab = searchParams.get('tab') || 'overview';

  const menuItems = menuRoleItems[role] || [];

  const Icon = ({ name, label, icon: Icon, isActive, handleClick }) => (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
      ${isActive === name ? "bg-gray-400 text-orange-500" : "text-[#808191]"}`}
    >
      <Icon size={20} />
      <span className="text-sm text-white">{label}</span>
    </div>
  );
  
  const handleLogout = async () => {
    try{
      await logout();
    } catch(error){
      console.log('Logout failed', error);
    }
  }
  return (
    <div className='flex md:flex-row flex-col-reverse justify-between mb-5 gap-6'>
      <div className='lg-flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-full'>
        <input 
          type='text'
          placeholder='search for users'
          className='flex w-full font-sans font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none'
        />
        <div className='w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer'>
          <IoIosSearch className='w-[15px] h-[15px] text-white object-contain'/>
        </div>
      </div>
      <div className='sm:flex hidden flex-row justify-end gap-4'>      
        <div className='flex items-center gap-1 bg-white rounded-full p-2'>
          <img 
            src={ImgP}
            alt='user'
            className='rounded-full object-cover h-10 w-10'
          />
          <div className='flex flex-col'>
            <h3 className='font-normal text-black text-sm'>{fullName}</h3>
            <p className='text-sm text-[#a1a0a0]'>{email}</p>
          </div>
          <FaChevronDown className='text-[#161616] cursor-pointer '/>
        </div>
      </div>

      {/* On small screen navigation*/}
      <div className='sm:hidden flex justify-between items-center relative'>
        <div className='w-10 h-10 rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
          <img 
            src={ImgP}
            alt='user'
            className='w-[60%] h-[60%] object-contain rounded-full'
          />
        </div>
        <FaBarsStaggered 
          className='w-[25px] h-[25px] cursor-pointer' 
          onClick={() => setToggleDrawer(!toggleDrawer)}
        />

        <div className={`absolute flex flex-col top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-2xl py-4 transition-all duration-700
        ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'}`}>
          <ul className='mb-4 px-4'>
            {menuItems.map((link) => (
              <Icon
                key={link.value}
                name={link.value}
                isActive={activeTab}
                label= {link.label}
                icon={link.icon}   
                handleClick={() => {
                  setSearchParams({ tab: link.value});
                  setToggleDrawer(false)
                }}
              />
            ))}
          </ul>

          <div className="flex flex-col px-4 mt-4 border-t border-gray-700 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 p-2 rounded-lg bg-white"
            >
              <img
                src={ImgP}
                alt="user"
                className="rounded-full object-cover h-10 w-10"
              />
              <span className="flex flex-col text-left">
                <span className="font-normal text-black flex items-center text-md gap-2">Logout <TbLogout2 className='text-[#727272] cursor-pointer' size={20}/></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar