import React, { useState } from 'react';
import '../vendorTabs.css';
import { useCurrentUser } from '../../../Hooks/useCurrentUser';
import { CiEdit } from 'react-icons/ci';
import { motion, AnimatePresence } from 'framer-motion';
import { EditVendorProfile, AdLoader } from '../../';
import { useProfile } from '../../../Hooks/useProfile';

function VendorProfile() {
  const [activeTab, setActiveTab] = useState('VendorProfile');
  const { data: me, isLoading } = useCurrentUser();
  const role = me?.role;

  const { profile, user, vendorProfileUpdate } = useProfile(role);

  console.log('profile:', profile);
  console.log('User:', user);

  return (
    <section className='bg-gray-100 rounded-xl p-1 shadow-xs h-[80vh] overflow-y-auto'>
     <AnimatePresence mode='wait'>
      {activeTab === 'VendorProfile' && (
        <motion.div
          key='VendorProfile'
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

              <div className='flex flex-col space-y-4'>
                <div className='w-full rounded-xl overflow-hidden relative'>
                  <div className='h-35 w-full relative'>
                    <img
                      src={profile?.banner}
                      alt='banner'
                      className='w-full h-full object-cover'
                      loading='lazy'
                    />
                  </div>

                  <div className='relative px-8 pt-15'>
                    <div className='absolute -top-10 left-8'>
                      <div className='w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md'>
                        <img 
                          src={profile?.avatar}
                          alt='logo'
                          loading='lazy'
                          className='w-full h-full object-cover'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='flex flex-col gap-2 p-3 space-y-3'>
                <div className='flex justify-end'>
                  <button 
                    onClick={() => setActiveTab('EditProfile')}
                    className='border-dark border px-2 py-1 flex font-semibold rounded-lg  items-center gap-2 cursor-pointer hover:bg-blue-200 hover:border-none w-fit'>
                    Edit 
                    <CiEdit className='' strokeWidth={1} size={20} />
                  </button>
                </div>

                <div className='flex flex-col gap-2'>
                  <h1 className='text-dark font-semibold underline'>
                    Business Information:
                  </h1>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='flex flex-col gap-1'>
                      <label className='text-gray-500 text-base'>
                        Legal Name
                      </label>
                      <p className='text-dark font-semibold text-base'>
                        {profile?.businessInfo?.legalName}
                      </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className='text-gray-500 text-base'>
                        Registration Number
                      </label>
                      <p className='text-dark font-semibold text-base'>
                        {profile?.businessInfo?.registrationNumber}
                      </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className='text-gray-500 text-base'>
                        Tax ID
                      </label>
                      <p className='text-dark font-semibold text-base'>
                        {profile?.businessInfo?.taxId}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex flex-col gap-2'>
                  <h1 className='text-dark font-semibold underline'>
                    Store Information:
                  </h1>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='flex flex-col gap-1'>
                      <label className='text-gray-500 text-base'>
                        Email
                      </label>
                      <p className='text-dark font-semibold text-base'>
                        {profile?.store?.contactEmail}
                      </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className='text-gray-500 text-base'>
                        Phone
                      </label>
                      <p className='text-dark font-semibold text-base'>
                        {profile?.store?.contactPhone}
                      </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className='text-gray-500 text-base'>
                        Description
                      </label>
                      <p className='text-dark font-semibold text-base'>
                        {profile?.store.description}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex flex-col gap-2'>
                  <h1 className='text-dark font-semibold underline'>
                    Payout Information:
                  </h1>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='flex flex-col gap-1'>
                      <label className='text-gray-500 text-base'>
                        Method
                      </label>
                      <p className='text-dark font-semibold text-base'>
                        {profile?.payout?.method}
                      </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className='text-gray-500 text-base'>
                        Till Number
                      </label>
                      <p className='text-dark font-semibold text-base'>
                        {profile?.payout?.tillNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex flex-col gap-2'>
                  <h1 className='text-dark font-semibold underline'>
                    Addresses:
                  </h1>
                  <div className='grid grid-cols-2 gap-3'>
                    {Object.entries(profile?.store?.addresses || {}).map(
                      ([key, value], index) => (
                        <div key={index} className='flex flex-col gap-1'>
                          <label className='text-gray-500 text-base capitalize'>
                            {key}
                          </label>
                          <p className='text-dark font-semibold text-base'>
                            {value}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>                
              </div>
            </>
        </motion.div>
      )}
     </AnimatePresence>

     <AnimatePresence mode='wait'>
      {activeTab === 'EditProfile' && (
        <motion.div
          key='EditProfile'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
           >
            <EditVendorProfile
              setActiveTab={setActiveTab}
            />
        </motion.div>
      )}
     </AnimatePresence>
    </section>
  )
}

export default VendorProfile