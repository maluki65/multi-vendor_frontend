import React from 'react';
import { TbLogout2 } from "react-icons/tb";
import { useLogout } from '../../Hooks/useLogout';

function BuyerDashboard() {
  const logout = useLogout();

  const handleLogout = async () => {
    try{
      await logout();
      console.log('Logout successfull');
    } catch (error){
      console.log('Logout failed', error);
    }
  }

  return (
    <div className='text-red-600'>BuyerDashboard
            <TbLogout2 onClick={handleLogout} className='cursor-pointer text-gray-700 Iconz' size={20}/>
    </div>
  )
}

export default BuyerDashboard