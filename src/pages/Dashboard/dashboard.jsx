import React from 'react';
import './dashboard.css';
import { useSearchParams } from "react-router-dom";
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { needsProfile } from '../../utils/userProfiles';
import { getProfileFormByRole } from '../../utils/profileforms';
import { useAuth } from '../../Context/AuthContext';
import { useProfile } from '../../Hooks/useProfile';
import { DashboardLayout, Overview, AddAdmin, Users, VendorKyc, Approvals, AdminVerifications, AddProducts, ProductCategory, VendorProducts, VendorOrders, VendorPayments, VendorSettings, VendorOverviewTab, AdminSettings, AdminPayments, BuyerDashboard } from '../../components';
//import { AdLoader } from  '../../components'

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab')|| 'overview';
  const  { userData } = useAuth();
  const { data: me, isLoading } = useCurrentUser();
  const { profile } = useProfile(me?.role);

  //console.log('vendor profile', profile);

  const isAdmin = me?.role === 'Admin';
  const isBuyer = me?.role === 'Buyer';
  const isVendor = me?.role === 'Vendor';
  const isVendorPending = isVendor && me?.status === 'pending';
  const isVendorApproved = isVendor && me?.status === 'approved';
  const isVendorRejected = isVendor && me?.status === 'rejected';

  
  if (isLoading) return <p>Loading...</p>

  const showProfileForm = (!isVendor || isVendorApproved) && needsProfile(me);
  const adminNeedsProfile = isAdmin && needsProfile(me);
  const buyerNeedsProfile = isBuyer && !profile;
  const ProfileComponent = getProfileFormByRole(me?.role);

  const user = {
    fullName: userData.username || userData.storename,
    role: userData.role,
    email: userData.email,
    storeName: userData.storeName,
  }
  //console.log("ME:", me);
  //console.log("AdminProfile:", me?.adminProfile);
  
  return (
    <>
        <DashboardLayout 
          fullName={user.fullName} 
          role={user.role} 
          email={user.email}
          storeName={user.storeName}          
          disableNavigation={adminNeedsProfile || isVendorPending || isVendorRejected}
          >
          {isVendorRejected &&  tab !== 'kyc' && (
            <div className='bg-red-100 border-red-400 text-red-800 p-4 rounded-lg my-4'>
              <h3 className='font-semibold'>
                Vendor application rejected
              </h3>
              <p className='text-sm'>
                Unfortunately your vendor application was not approved.
                Please contact support or submit a new kyc request.
              </p>
              <p className='mt-2 flex items-center gap-2 font-semibold text-sm'>
                Reason: <span className='font-normal'>{me?.rejectionReason}</span>
              </p>
              <button 
              onClick={() => {
                setSearchParams({
                  tab: 'kyc'
                })
              }}
              className='mt-2 px-4 py-2 bg-orange-500 text-white rounded cursor-pointer'
              >
                Resubmit kyc
              </button>
            </div>
          )}
          {isVendorPending &&  tab !== 'kyc' &&(
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
                  tab: 'kyc'
                })
              }}
              className='mt-2 px-4 py-2 bg-orange-500 text-white rounded cursor-pointer'
              >
                Complete kyc
              </button>
            </div>
          )}

          {!isVendorPending && showProfileForm && ProfileComponent &&(
            <ProfileComponent/>
          )}

          {(
            (!isVendorPending && !showProfileForm && !isVendorRejected) ||
            (isVendorPending && tab === 'kyc') ||
            (isVendorRejected && tab === 'kyc')
          ) && (
            <>
              {/*tab === 'overview' && isAdmin && <Overview/>*
                {tab === 'overview' && isAdmin && <AdminOverview />}
                {tab === 'overview' && isVendor && <VendorOverview />}
                {tab === 'overview' && isBuyer && <BuyerOverview />}
              */}
              {tab === 'overview' && !adminNeedsProfile && isAdmin && (
                <Overview  />
              )}
              {tab === 'overview' && isVendor && (
                <VendorOverviewTab />
              )}
              {tab === 'Users' && <Users />}
              {tab === 'Add-admin' && <AddAdmin/>}
              {tab === 'Approvals' && <Approvals/>}
              {tab === 'Add-Product' && isVendorApproved && <AddProducts vendorId={userData._id}/>}
              {tab === 'kyc' && isVendor && <VendorKyc/>}
              {tab === 'product-approval' && isAdmin && <ProductCategory/>}
              {tab === 'kyc' && me?.role === 'Admin' && <AdminVerifications/>}
              {tab === 'products' && profile?._id && (
                <VendorProducts vendorId={profile._id} />
              )}
              {tab === 'orders' && <VendorOrders/>}
              {tab === 'wallet' && isVendor && <VendorPayments/>}
              {tab === 'vendorSettings' && isVendor && <VendorSettings/>}
              {tab === 'AdminSettings' && isAdmin && <AdminSettings/>}
              {tab === 'Payments' && isAdmin && <AdminPayments />}
            </>
          )}
        </DashboardLayout>
    </>
  )
}

export default Dashboard