import React, { useState, useEffect } from 'react';
import { Inner } from '../../commons';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { useLogout } from '../../Hooks/useLogout';
import { CiSearch, CiUser, CiHeart } from "react-icons/ci";
import { LiaShoppingCartSolid } from "react-icons/lia";

function BuyerLayout({ children }) {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Inner >
      <nav className="flex justify-between items-center p-4 shadow-md">
        <h1 className="font-bold text-lg cursor-pointer" onClick={() => navigate('/')}>
          Store
        </h1>

        <div className="flex gap-4">
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="p-4">
        {children}
      </div>
    </Inner>
  );
}

export default BuyerLayout;