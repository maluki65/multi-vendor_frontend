import React, { useState } from 'react';
import { useProfile } from '../../../Hooks/useProfile';
import { useCurrentUser } from '../../../Hooks/useCurrentUser';
import { CiEdit } from "react-icons/ci";
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileEdit, AdLoader } from '../../';

function Profiles() {
  const [activeTab, setActiveTab] = useState('BuyerProfile');
  const { data: me, isLoading } = useCurrentUser();
  const role = me?.role;

  const { profile, user, updateNotification, updateProfile } = useProfile(role);

  const handleToggle = (type) => {
    const current = profile?.preferences?.notification?.[type] || false;

    updateNotification.mutate({
      type,
      value: !current,
    });
  };

  const Toggle = ({ value, onChange }) => {
    return (
      <button 
        onClick={onChange}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${value ? 'bg-primary' : 'bg-muted'}`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition cursor-pointer ${ value ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </button>
    )
  }

  //console.log('profile:', profile);
  //console.log('User:', user);

  return (
    <section className='bg-gray-100 rounded-xl p-2 shadow-xs overflow-hidden'>
      <AnimatePresence mode='wait'>
        {activeTab === 'BuyerProfile' && (
          <motion.div
            key='BuyerProfile'
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
                <h2 className='text-dark text-lg font-semibold my-4 setHeading'>My Profile</h2>
                <div className='p-1 space-y-1 flex items-center justify-between gap-2 SetImgEdit'>
                  <div className='flex gap-3 items-center imgSetCon87'>
                    <img
                      src={profile?.avatar}
                      alt={profile?.fullName}
                      loading='lazy'
                      className='h-25 w-25 rounded-full border-2 border-white object-cover profileSetImg'
                    />

                    <div className='flex flex-col'>
                      <h3 className='text-gray-700 text-xl font-semibold'>
                        {profile?.fullname}
                      </h3>
                      <p className='text-gray-500 text-sm'>
                        {profile?.gender}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('Edit')}
                    className='border-dark border px-2 py-1 font-semibold rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-200 hover:border-none editSetBtn'>
                    Edit 
                    <CiEdit className='' strokeWidth={1} size={20} />
                  </button>
                </div>

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex flex-col gap-2'>
                  <h4 className='font-semibold text-dark setHeading'> Personal Information </h4>
                  <div className='grid grid-cols-[70%_30%] gap-3 p-2 SetProCon'>
                    <div className='grid grid-cols-2 gap-2 SetProInner'>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          Fullname
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {profile?.fullname}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          Phone
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {profile?.phone}
                        </p>
                      </div><div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                        Email
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {/*<div className='flex justify-end'>
                      <button className='border-dark border px-2 py-1 font-semibold rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-200 hover:border-none h-fit editSetBtn'>
                        Edit 
                        <CiEdit className='' strokeWidth={1} size={20} />
                      </button>
                    </div>*/}
                  </div>
                </div>

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex flex-col gap-2'>
                  <h4 className='font-semibold text-dark flex items-center gap-1 setHeading'> Addresses <span className='text-gray-600 font-medium'>({profile?.addresses?.[0]?.label})</span></h4>
                  <div className='grid grid-cols-[70%_30%] gap-3 p-2 SetProCon'>
                    <div className='grid grid-cols-2 gap-2 SetProInner'>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          Country
                        </label>
                        <p className='text-dark font-semibold text-base'>
                          {profile?.addresses?.[0]?.country}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                          City
                        </label>
                        <p className='text-dark font-semibold text-base'>
                        {profile?.addresses?.[0]?.city}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                        Street
                        </label>
                        <p className='text-dark font-semibold text-base'>
                        {profile?.addresses?.[0]?.street}
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-gray-500 text-base'>
                        Postal
                        </label>
                        <p className='text-dark font-semibold text-base'>
                        {profile?.addresses?.[0]?.postalCode}
                        </p>
                      </div>
                    </div>
                    {/*<div className='flex justify-end'>
                      <button className='border-dark border px-2 py-1 font-semibold rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-200 hover:border-none h-fit editSetBtn'>
                        Edit 
                        <CiEdit className='' strokeWidth={1} size={20} />
                      </button>
                    </div>*/}
                  </div>
                </div>

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex flex-col gap-2'>
                  <h4 className='font-semibold text-dark flex items-center gap-1 setHeading'> Preferences</h4>
                  <div className='grid grid-cols-[70%_30%] gap-3 p-2 SetProCon'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-dark font-semibold text-base'>Email Notification</span>
                        <Toggle
                          value={profile?.preferences?.notification?.email}
                          onChange={() => handleToggle('email')}
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-dark font-semibold text-base'>SMS Notification</span>
                        <Toggle
                          value={profile?.preferences?.notification?.sms}
                          onChange={() => handleToggle('sms')}
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-dark font-semibold text-base'>Push Notification</span>
                        <Toggle
                          value={profile?.preferences?.notification?.push}
                          onChange={() => handleToggle('push')}
                        />
                      </div>
                    </div>
                    {/*<div className='flex justify-end'>
                      <button className='border-dark border px-2 py-1 font-semibold rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-200 hover:border-none h-fit editSetBtn'>
                        Edit 
                        <CiEdit className='' strokeWidth={1} size={20} />
                      </button>
                    </div>*/}
                  </div>
                </div>
              </div>
            </>
        </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {activeTab === 'Edit' && (
          <motion.div
            key='Edit'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            >
            <div className='p-2'>
              <ProfileEdit 
                setActiveTab = {setActiveTab}
                profile = {profile} 
                user = {user} 
                onUpdate = {updateProfile}
              />
            </div>
        </motion.div>
        )}
      </AnimatePresence>
      
    </section>
  )
}

export default Profiles