import React, { useMemo } from 'react';
import './BuyerTabs.css';
import { useLocation, Outlet} from 'react-router-dom';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { getProfileFormByRole } from '../../utils/profileforms';
import { useProfile } from '../../Hooks/useProfile';
import { DesktopNav, MobileNav, AdLoader } from '../'; 

function BuyerLayout() {

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


  if (isLoading || profileLoading){
    return <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader/>
        </div>
  }

  return (
    <div className=''>
      <div className='hidden md:block'>
        <DesktopNav />
      </div>

      <div className='block md:hidden'>
        <MobileNav />
      </div>

      <div className=' overflow-hidden '>
        {buyerNeedsProfile && ProfileComponent ? (
          <ProfileComponent />
        ) : (
          <Outlet />
        )}
      </div>
  </div>
  );
}

export default React.memo(BuyerLayout);