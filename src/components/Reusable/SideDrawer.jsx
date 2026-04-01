import React from 'react';
import { Link } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';
import { menuRoleItems } from '../DashboardLayout/roles/menuConfig';

function SideDrawer({ isOpen, onClose }) {

  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} />}

      <div className={`drawer ${isOpen ? 'open' : ''}`}>

        <div className="drawer-header">
          <FaXmark size={22} onClick={onClose} />
        </div>

        <div className="drawer-links">

          <Link to="/buyer/wishlist" onClick={onClose}>Wishlist</Link>
          <Link to="/buyer/cart" onClick={onClose}>Cart</Link>
          <Link to="/buyer/profile" onClick={onClose}>Profile</Link>

          {menuRoleItems['Buyer']?.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.value}
                to={`/buyer${item.link}`}
                onClick={onClose}
              >
                <Icon /> {item.label}
              </Link>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default SideDrawer;