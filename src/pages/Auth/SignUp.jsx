import React, { useState } from 'react';
import './Auth.css';
import { Inner } from '../../commons';
import useSignUp from '../../Hooks/useSignUp'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { SIbc01, SIbc02 } from '../../assets';
import VendorSign from './VendorSign';
import BuyerSign from './BuyerSign';

function SignUp() {
  const [activeTab, setActiveTab] = useState('Buyer');

  const menu =[ 'Buyer', 'Vendor' ];

  const navigate = useNavigate();
  return (
    <Inner>
      <section className='min-h-screen overflow-hidden p-1.5 flex items-center justify-center w-full'>
  <div className='w-full  grid grid-cols-2 items-stretch justify-center gap-1'>
    <div
      className='h-[97vh] w-full rounded-md relative'
      style={{
        backgroundImage: `url(${SIbc02})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='inset-0 absolute text-light flex'>
        lojoo
      </div>
    </div>
    <div>
    <div className='flex justify-center gap-2'>
      {menu.map((item, index) => (
        <button
          key={index}
          className={`text-dark cursor-pointer ${activeTab == item ? 'font-bold' : ''}`}
          onClick={() => setActiveTab(item)}
          >
            {item}
        </button>
      ))}
      </div>
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'Buyer' ? <BuyerSign/> : <VendorSign/>}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
</section>

    </Inner>
  )
}

export default SignUp