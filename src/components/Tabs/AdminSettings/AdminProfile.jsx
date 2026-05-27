import React, { useState } from 'react';
import '../Tabs.css';
import { useCurrentUser } from '../../../Hooks/useCurrentUser';
import { motion, AnimatePresence } from 'framer-motion';
import { EditAdminProfile, AdLoader } from '../../';
import { useProfile } from '../../../Hooks/useProfile';
import { CiEdit } from "react-icons/ci";

function AdminProfile() {
  const [activeTab, setActiveTab] = useState('AdminProfile');
  const { data: me, isLoading } = useCurrentUser();
  const role = me?.role;

  const { profile, user, adminProfileUpdate } = useProfile(role);

  console.log('profile:', profile);
  console.log('User:', user);
  return (
    <section className='bg-gray-100 rounded-xl px-1 shadow-xs h-[80vh] overflow-y-auto'>
      <AnimatePresence mode='wait'>
        {activeTab === 'AdminProfile' && (
          <motion.div
            key='AdminProfile'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            >
              <>
                {isLoading && (
                  <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
                    <AdLoader/>
                  </div>
                )}

                <div className='p-2 flex flex-col space-y-4'>
                  <h2 className='text-dark text-lg font-semibold my-4 AdminSetHeadSec'>My Profile</h2>
                  <div className='p-1 space-y-1 flex items-center justify-between gap-2 adminProIMgs3'>
                    <div className='flex gap-3 items-center'>
                      <img
                        src={profile?.avatar}
                        alt={profile?.fullNames}
                        loading='lazy'
                        className='h-25 w-25 rounded-full border-2 border-white object-cover'
                      />

                      <div className='flex flex-col'>
                        <h3 className='text-gray-700 text-xl font-semibold'>
                          {profile?.fullNames}
                        </h3>
                        <p className='text-gray-500 text-base'>
                          {user?.UUID}
                        </p>
                        <p className='text-gray-500 text-sm'>
                          {profile?.gender}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('EditAdminProfile')}
                      className='border-dark border px-2 py-1 font-semibold rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-200 hover:border-none editSetBtn'>
                      Edit 
                      <CiEdit className='' strokeWidth={1} size={20} />
                    </button>
                  </div>

                  <hr className='flex-1 border-t border-gray-300' />

                  <div className='flex flex-col gap-2'>
                    <h4 className='font-semibold text-dark AdminSetHeadSec'> Personal Information: </h4>
                    <div className='grid grid-cols-2 gap-2 AdminSettProLabels8'>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          Fullname:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {profile?.fullNames}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          Phone:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {profile?.phoneNo}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                        Email:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {user?.email}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                        ID/Password:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {profile?.IDPassport}
                        </p>
                      </div>                        
                    </div>
                  </div>

                  <hr className='flex-1 border-t border-gray-300' />

                  <div className='flex flex-col gap-2'>
                    <h4 className='font-semibold text-dark flex items-center gap-1 AdminSetHeadSec'> 
                      Addresses:
                    </h4>
                    <div className='grid grid-cols-2 gap-2 AdminSettProLabels8'>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          Country:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {profile?.addresses?.country}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          City:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                        {profile?.addresses?.city}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                        Street:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                        {profile?.addresses?.street}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                        Postal:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                        {profile?.addresses?.postal}
                        </p>
                      </div>
                    </div>
                  </div>

                  <hr className='flex-1 border-t border-gray-300' />

                  <div className='flex flex-col gap-2'>
                    <h4 className='font-semibold text-dark flex items-center gap-1'> 
                      Next of Kin:
                    </h4>
                    <div className='grid grid-cols-2 gap-2 AdminSettProLabels8'>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          Name:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {profile?.nextOfKin?.names}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base AdminSetHeadSec'>
                          Relationship:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                        {profile?.nextOfKin?.relationship}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                         Phone:
                        </label>
                        <p className='text-dark font-semibold text-base'>
                         {profile?.nextOfKin?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
      {activeTab === 'EditAdminProfile' && (
        <motion.div
          key='EditAdminProfile'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
           >
            <div className='p-2'>
              <EditAdminProfile
                setActiveTab={setActiveTab}
                profile={profile}
                user={user}
                onUpdate={adminProfileUpdate}
              />
            </div>
        </motion.div>
      )}
     </AnimatePresence>
    </section>
  )
}

export default AdminProfile