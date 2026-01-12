import React from  'react';
import { useLogout } from '../Hooks/useLogout';
import { IoIosLogOut } from "react-icons/io";

const LogoutBtn = () => {
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out successfully');
    } catch (error) { 
      console.error('Logout failed:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className='flex items-center w-full px-4 gap-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100' role="menuitem">
        <IoIosLogOut className='text-red-600' size={20}/> Logout
      </button>
  );
};

export default LogoutBtn;