import React, { useState } from 'react';
import '../Tabs.css';
import { Toaster } from 'react-hot-toast';
import { useLogout } from '../../../Hooks/useLogout';
import { MdLogout } from "react-icons/md";
import { AnimatePresence, motion } from 'framer-motion';
import { Passwords, AdminProfile } from '../../';

function AdminSettings() {
  const [activeTab, setActiveTab] = useState('AdminProfile');

  const logout = useLogout();

  const handleLogOut = async() => {
    await logout();
  }

  const adminSettingTabs = [
    { name: 'Personal Information', value: 'AdminProfile', icon: null },
    { name: 'Password Manager', value: 'passwords', icon: null },
    { name: 'Logout', value: 'logout', icon: MdLogout },
  ];

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      <section className='mt-4 bg-white mb-1 rounded-md p-4'>
        <div className='grid grid-cols-[25%_75%] gap-2 AdminSettingTabs'>
          <div className='flex flex-col gap-3 w-full AdminNavTabsCon'>
            {adminSettingTabs.map((item, index) => {
              const isLogout = item.value === 'logout';
              const Icon = item.icon;

              return (
                <div 
                 key={index}
                 onClick={isLogout ? handleLogOut : () => setActiveTab(item.value)}
                 className={`border-gray-200 text-dark gap-2 p-2 rounded-md text-base cursor-pointer AdminNavTabs ${!isLogout && activeTab === item.value ? 'bg-orange-400 border-0 activeTab' : 'border-[1.5px]'}
                 ${isLogout ? 'text-red-600 flex items-center gap-2' : 'text-dark'}`}
                 >
                  {Icon && <Icon className='' size={23} />}
                  <a className=''>{item.name}</a>
                 </div>
              )
            })}
          </div>
          <div className='p-1'>
            <AnimatePresence mode='wait'>
              {activeTab === 'AdminProfile' && (
                <motion.div
                  key='AdminProfile'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  >
                    <AdminProfile />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
              {activeTab === 'passwords' && (
                <motion.div
                  key='passwords'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  >
                    <div className='flex items-center justify-center overflow-hidden'>
                     <Passwords />
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

export default AdminSettings