import React, { useState } from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import { cartB3 } from '../../../assets';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogout } from '../../../Hooks/useLogout';
import { MdLogout } from "react-icons/md";
import { Orders, Profiles, Passwords, Footer } from '../../';

function Account() {
  const [activeTab, setActiveTab] = useState('Profile');

  const navigate = useNavigate();
  const logOut = useLogout();

  const handleLogOut = async() => {
    await logOut();
  }

  const activeMenu = [
    { name: 'Personal Info', value: 'Profile', icon: null },
    { name: 'My Orders', value: 'Orders', icon: null },
    //{ name: 'WishList', value: 'WishList', icon: null },
    { name: 'Password Manager', value: 'Passwords', icon: null },
    { name: 'Logout', value: 'Logout', icon: MdLogout },
  ]

  //console.log('Tab:', activeTab);

  return (
    <Inner>
      <Toaster position='top-right' reverseOrder={false} />
      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${cartB3})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <h1 className='font-semibold text-4xl text-dark leading-relaxed PathName'>
            My Account
          </h1>
          <span className='flex items-center gap-1'>
            <a
              onClick={() => navigate('/buyer/products')}
              className='text-gray-700 hover:text-primary cursor-pointer path'>
                Home
              </a>
              <a 
               className='text-gray-700 path'>
                / My Account
              </a>
          </span>
      </section>

      <section className='min-h-[50vh] my-4 px-[2%] overflow-hidden'>
        <div className='grid grid-cols-[25%_75%] gap-3 AccTabSwitch'>
          <div className='flex flex-col w-full p-2 gap-3 AccNavTabsMain'>
            {activeMenu.map((item) => {
              const isLogout = item.value === 'Logout';
              const Icon = item.icon;

              return (
                <div
                 key={item.value}
                 onClick={isLogout ? handleLogOut : () => setActiveTab(item.value)}
                 className={`border-[1.5px]  border-gray-200 py-2 px-2 text-dark rounded-md cursor-pointer AccNavTabs ${!isLogout && activeTab === item.value ? 'bg-orange-400 border-none activeTab' : ''} 
                 ${isLogout ? 'text-red-600 flex items-center gap-2' : 'text-dark'}`}
                >
                  {Icon && <Icon className='AccNavLog' size={23} />}
                  <li className='list-none'>{item.name}</li>
              </div>
              )
            })}
          </div>
          <div className='p-2'>
            <AnimatePresence mode='wait'>
              {activeTab === 'Profile' && (
                <motion.div
                 key='Profile'
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.3 }}
                  >
                  <Profiles />
              </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
              {activeTab === 'Orders' && (
                <motion.div
                 key='Orders'
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.3 }}
                  >
                  <Orders />
              </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
              {activeTab === 'Passwords' && (
                <motion.div
                 key='Passwords'
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

      <div className='p-2'>
       <Footer />
      </div>
    </Inner>
  )
}

export default Account