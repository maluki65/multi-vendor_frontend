import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './BuyerTabs.css';
import { Link, useLocation, useNavigate, useSearchParams, Outlet} from 'react-router-dom';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { useLogout } from '../../Hooks/useLogout';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { getProfileFormByRole } from '../../utils/profileforms';
import { useProfile } from '../../Hooks/useProfile';
import { menuRoleItems } from '../DashboardLayout/roles/menuConfig';
import { SearchBar, ProfileDropDown } from '../';

function BuyerLayout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleHamburgerClick = () => {
    setMenuOpen(prev => !prev);
    setIsOpen(prev => !prev);
  };

  const closeNavBar = () => {
    setMenuOpen(false);
  };


  useEffect(() => {
    if(location.hash){
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [location.hash]);

  useEffect(() => {
      const handelScroll = () => {
        setSticky(window.scrollY > 0);
      };
      window.addEventListener('scroll', handelScroll);
      return () => window.removeEventListener('scroll', handelScroll);
    }, []);
  
    useEffect(() => {
      const links = document.querySelectorAll('.PageLinks');
      links.forEach(link => {
        link.addEventListener('click', closeNavBar);
      });
  
      return () => {
        links.forEach(link => {
          link.removeEventListener('click', closeNavBar);
          //setIsOpen(false);
        });
      }
    }, []);

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
    <div className='flex flex-col'>
      <p className='flex items-center bg-secondary  text-gray-400 justify-end text-xs py-1 px-[3%] m-0'>Call us +254 123456789</p>
      <div className={`sticky  pt-0 pb-2 px-[3%] flex items-center justify-between top-0 z-1000 w-full transition-all duration-300 ${sticky ? 'background-blur-[20px]' : 'bg-secondary'} navbar`}>
        <div className='logo'>
          <h1 className='text-orange-400 text-[1.4em] font-goodly cursor-pointer'>
            Sell<span className='text-primary'>ory</span>
          </h1>
        </div>
        <div className='flex gap-4 items-center'>
          <SearchBar onSearch={(q) => console.log(q)} />
          <ProfileDropDown onLogout={handleLogout} />

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.value} to={`/buyer${item.link}`}>
                <div className="flex items-center gap-1 cursor-pointer">
                  <Icon className='font-semibold' size={25} />
                  {/*<span>{item.label}</span>*/}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-4">
        {buyerNeedsProfile && ProfileComponent ? (
          <ProfileComponent />
        ) : (
          <Outlet/>
        )}
      </div>
    </div>
  );
}

export default React.memo(BuyerLayout);