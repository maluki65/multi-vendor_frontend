import React, { useState, useRef, useEffect } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { LuUserRound } from "react-icons/lu";
import { PiUser } from "react-icons/pi";
function ProfileDropDown({ onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (ref.current && !ref.current.contains(e.target)){
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  return (
    <div className='relative' ref={ref}>
      <PiUser
        size={25}
        className='cursor-pointer'
        onClick={() => setOpen(prev => !prev)}
      />

      {open && (
        <div className='absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md p-1 z-50'>
          <div className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
            onClick={() => navigate('/buyer/profile')}
            >
             <IoSettingsOutline className='text-dark' size={20}/> Settings
          </div>
          <div className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
            onClick={onLogout}
            >
              <IoLogOutOutline className='text-red-500' size={20}/> Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown