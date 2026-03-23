import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaChevronDown, FaBarsStaggered } from "react-icons/fa6";
import { useLogout } from '../../../Hooks/useLogout';
import { menuRoleItems } from '../roles/menuConfig';
import { useProfile } from '../../../Hooks/useProfile';
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { ImgP } from '../../../assets';
import { TbLogout2 } from "react-icons/tb";

function Navbar({ role, fullName, email, storeName }) {
  const logout = useLogout();
  const menuRef = useRef();
  const [scrolled, setScrolled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const activeTab = searchParams.get('tab') || 'overview';
  //const profile = role === 'Admin' ? null : useProfile(role).profile;
  const { profile } = useProfile(role);


  const menuItems = menuRoleItems[role] || [];

  const displayName = role === 'Vendor'
   ? profile?.store?.storeName ?? storeName
   : role === 'Admin'
   ? profile?.fullnames ?? fullName
   : profile?.fullname ?? fullName


  useEffect(() => {
    const handleClickOutSide =(e) => {
      if(menuRef.current && !menuRef.current.contains(e.target)){
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const profileImage = role === 'Vendor'
    ? profile?.logo ||  ImgP
    : profile?.avatar || ImgP;

  return (
    <>
      <div className={ `sticky top-0 z-40 flex md:flex-row flex-col-reverse justify-end gap-6 transition-all duration-300 ${scrolled ? 'bg-gray-100  p-2' : 'bg-transparent'}`}>
        {/*<div className='lg-flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-full'>
          <input 
            type='text'
            placeholder='search for users'
            className='flex w-full font-sans font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none'
          />
          <div className='w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer'>
            <IoIosSearch className='w-[15px] h-[15px] text-white object-contain'/>
          </div>
        </div>
        <div className="relative lg-flex-1 flex flex-row w-[full] lg:w-[30%] py-2 pl-4 pr-2 h-[52px] PayIn">
          <input
            type='text'
            placeholder='search for users'
            required
            className="w-full p-2 border-[1.5px] border-gray-400 rounded-3xl focus:outline-none"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700"
          >
            <IoIosSearch className='Icon' size={20}/>
          </span>
        </div>*/}
        <div className='sm:flex hidden flex-row  gap-4'>      
          <div className='flex items-center gap-2'>
            <div className='flex flex-col gap-1'>
              <h3 className='font-normal text-black text-sm'>{displayName}</h3>
              <p className='text-sm text-[#a1a0a0]'>{email}</p>
            </div>
            <div 
              className='relative inline-block text-left'
              ref={menuRef}>
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className='flex flex-col items-center gap-2 px-3 py-2 bg-transparent cursor-pointer'
                  aria-label='user menu'
                >
                  <FaChevronDown/>
                </button>
                {isOpen && (
                  <div className='absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50'
                  role='menu'
                  arial-orientation='vertical'
                  >
                    <div className='py-1' role='none'>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          setSearchParams({
                            tab: 'Settings'
                          })
                        }}
                        className='flex items-center w-full px-4 py-2 text-sm text-gary-700 cursor-pointer hover:bg-gray-200'
                        role='menuItem'
                      >
                        <IoSettingsOutline className='mr-2' />
                        settings
                      </button>
                      <div className='border-t border-t-gray-200 my-1'/>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          handleLogout()
                        }}
                        className='flex items-center w-full px-4 py-2 text-sm text-gary-700 cursor-pointer hover:bg-gray-200'
                        role='menuItem'
                      >
                        <TbLogout2 className='mr-2 text-red-600' />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            <img 
              src={profile?.avatar || ImgP} 
              alt='user'
              className='rounded-full object-cover h-10 w-10'
              loading='lazy'
            />
          </div>
        </div>

        {/* On small screen navigation*/}
        <div className='sm:hidden flex justify-between items-center relative'>
          <div className='w-10 h-10 rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
            <img 
              src={profile?.avatar || ImgP}
              alt='user'
              className='h-10 w-10 object-cover rounded-full'
              loading='lazy'
            />
          </div>
          <FaBarsStaggered 
            className='w-[25px] h-[25px] cursor-pointer' 
            onClick={() => setToggleDrawer(!toggleDrawer)}
          />

          <div className={`absolute flex flex-col top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-2xl rounded-xl py-4 transition-all duration-700
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
                  src={profile?.avatar ?? ImgP}
                  alt="user"
                  className="rounded-full object-cover h-10 w-10"
                  loading='lazy'
                />
                <span className="flex flex-col text-left">
                  <span className="font-normal text-black flex items-center text-md gap-2" onClick={handleLogout}>Logout <TbLogout2 className='text-[#727272] cursor-pointer' size={20}/></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar