import React from 'react';
import './dashboard.css';
import { useSearchParams } from "react-router-dom";
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { needsProfile } from '../../utils/userProfiles';
import { getProfileFormByRole } from '../../utils/profileforms';
import { useAuth } from '../../Context/AuthContext';
import { DashboardLayout, Overview, AddAdmin, Users, VendorVerification, Approvals } from '../../components';

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab')|| 'overview';
  const  { userData } = useAuth();
  const { data: me, isLoading } = useCurrentUser();

  const isVendor = me?.role === 'Vendor';
  const isVendorPending = isVendor && me?.status === 'pending';
  const isVendorApproved = isVendor && me?.status === 'approved';

  
  if (isLoading) return <p>Loading...</p>

  const showProfileForm = (!isVendor || isVendorApproved) && needsProfile(me);
  const ProfileComponent = getProfileFormByRole(me.role);

  const user = {
    fullName: userData.username || userData.storename,
    role: userData.role,
    email: userData.email,
    storeName: userData.storeName
  }

  return (
    <DashboardLayout 
      fullName={user.fullName} 
      role={user.role} 
      email={user.email}
      storeName={user.storeName}
      >
      {isVendorPending &&  tab !== 'verification' &&(
        <div className='bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg my-4'>
          <h3 className='font-semibold'>
            Your vendor account is under review
          </h3>
          <p className='text-sm'>
            Please submit your ID and sign the vendor agreement to proceed.
          </p>
          <button 
           onClick={() => {
            setSearchParams({
              tab: 'verification'
            })
           }}
           className='mt-2 px-4 py-2 bg-orange-500 text-white rounded cursor-pointer'
           >
            Complete verification
          </button>
        </div>
      )}

      {!isVendorPending && showProfileForm && ProfileComponent &&(
        <ProfileComponent/>
      )}

      {(
        (!isVendorPending && !showProfileForm ) ||
        (isVendorPending && tab === 'verification')
      ) && (
        <>
          {tab === 'overview' && <Overview/>}
          {tab === 'Add-admin' && <AddAdmin/>}
          {tab === 'Approvals' && <Approvals/> }
          {tab === 'verification' && <VendorVerification/>}
          {tab === 'Users' && <Users />}
        </>
      )}
    </DashboardLayout>
  )
}

export default Dashboard