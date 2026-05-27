import React, { useState } from 'react';
import './vendorTabs.css';
import { VendorProfile, Passwords } from '../';
import { useLogout } from '../../Hooks/useLogout';
import { useProfile } from '../../Hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { MdLogout } from "react-icons/md";
import { Toaster } from 'react-hot-toast';

function VendorSettings() {
  const [activeTab, setActiveTab] = useState('store');

  const logout = useLogout();

  const vendorSettingTabs = [
    { name: 'Store Infomation', value: 'store', icon: null },
    { name: 'Password Manager', value: 'password', icon: null },
    { name: 'Wallet', value: 'wallet', icon: null },
    { name: 'Logout', value: 'Logout', icon: MdLogout }
  ]

  const handleLogOut = async() => {
    await logout();
  }
  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      <section className='p-4 mt-4 mb-1 rounded-md bg-white'>
        <div className='grid grid-cols-[25%_75%] gap-2 SettVenTab938'>
          <div className='flex flex-col gap-3 w-full SettVenTabsMain'>
            {vendorSettingTabs.map((item, index) => {
              const isLogout = item.value === 'Logout';
              const Icon = item.icon;

              return (
                <div 
                  key={index}
                  onClick={isLogout ? handleLogOut : () => setActiveTab(item.value)}
                  className={` border-gray-200 text-dark gap-2 px-2 py-2 rounded-md text-base cursor-pointer SettVenTabsd ${!isLogout && activeTab === item.value ? 'bg-orange-400 border-0 activeTab' : 'border-[1.5px]'}
                  ${isLogout ? 'text-red-600 flex items-center gap-2' : 'text-dark'}`}
                  >
                    {Icon && <Icon className='AccNavLog' size={23} />}
                    <li className='list-none'>{item.name}</li>
                  </div>
              )
            })}
          </div>
          <div className=''>
            <AnimatePresence mode='wait'>
              {activeTab === 'store' && (
                <motion.div
                  key='store'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  >
                  <VendorProfile />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
              {activeTab === 'password' && (
                <motion.div
                  key='password'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  >
                  <div className='flex items-center justify-center overflow-hidden'>
                    <Passwords/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}

export default VendorSettings