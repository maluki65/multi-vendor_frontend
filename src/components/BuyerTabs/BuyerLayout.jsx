import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Inner } from '../../commons';
import { Link, useLocation, useNavigate, useSearchParams, Outlet} from 'react-router-dom';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { useLogout } from '../../Hooks/useLogout';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { getProfileFormByRole } from '../../utils/profileforms';
import { useProfile } from '../../Hooks/useProfile';
import { getUserProfileByRole, needsProfile } from '../../utils/userProfiles';
import { CiSearch, CiUser, CiHeart } from "react-icons/ci";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { Cart, Profile, Wishlist, BuyerDashboard } from '../../components';
import { menuRoleItems } from '../DashboardLayout/roles/menuConfig';

function BuyerLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: me, isLoading } = useCurrentUser();

  const role = me?.role;

  const { profile, isLoading: profileLoading } = useProfile(role);

  const buyerNeedsProfile = useMemo(() => {
    return role === 'Buyer' && !profile;
  }, [role, profile]);

  const ProfileComponent = useMemo(
    () => getProfileFormByRole(role),
    [role]
  );

  const currentPath = location.pathname + location.hash;

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/signin');
  }, [logout, navigate]);

  useEffect(() => {
    if(location.hash){
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [location.hash]);

  const menuItems = useMemo(() => {
    return menuRoleItems[role] || [];
  }, [role]);

  /*const BuyerNavs = useMemo(() => [
    { link: '/profile', icon: CiUser },
    { link: '/wishlist', icon: CiHeart },
    { link: '/cart', icon: LiaShoppingCartSolid }
  ], []);

  const fullNav = menuOpen ? [
    ...BuyerNavs,
    {}
  ]
  : BuyerNavs;*/

  if (isLoading || profileLoading){
    return <div className='p-4'>Loading...</div>
  }

  return (
    <>
      <div className="flex gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.value} to={`/buyer${item.link}`}>
              <div className="flex items-center gap-1 cursor-pointer">
                <Icon className='' size={25} />
                {/*<span>{item.label}</span>*/}
              </div>
            </Link>
          );
        })}
        <button className='cursor-pointer' onClick={handleLogout}>Logout</button>
      </div>

      <div className="p-4">
        {buyerNeedsProfile && ProfileComponent ? (
          <ProfileComponent />
        ) : (
          <Outlet/>
        )}
      </div>
    </>
  );
}

export default React.memo(BuyerLayout);