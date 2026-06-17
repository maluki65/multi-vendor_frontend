import React from 'react';
import './DashBoardItems.css';
import { FaArrowRight } from "react-icons/fa";
import { AnimatePresence, motion } from 'framer-motion';

function PaymentItem({ payment }) {

  const getFirstTwoChars = (name) => {
    return name.slice(0,2).toUpperCase();
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div 
        className='flex justify-between items-center pay'
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.95}}
        transition={{ duration: 0.3 }}
        >
          <p className='p-2 rounded-md bg-dark text-white'>{getFirstTwoChars(payment.vendorName)}</p>
          <div className='flex flex-col gap-1'>
            <h3 className='text-md font-medium text-dark'>
              {payment.vendorName}
            </h3>
            <p className='text-[#525151] text-xs'>Ksh {(payment.amount / 100).toLocaleString()}</p>
          </div>
          <button className='px-2 py-1 rounded-md text-sm text-white cursor-pointer bg-orange-500 flex items-center gap-2'>
            Review 
            <FaArrowRight className='Iconp' size={10}/>
          </button>
      </motion.div>
    </AnimatePresence>
    
  )
}

export default PaymentItem