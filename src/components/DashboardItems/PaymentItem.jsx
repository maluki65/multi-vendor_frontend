import React, { useEffect, useRef} from 'react';
import './DashBoardItems.css';
import { FaArrowRight } from "react-icons/fa";
import { AnimatePresence, motion } from 'framer-motion';

function PaymentItem({ payment, setOpenMenuId, openMenuId, handleView, handleApprove, handleReject}) {

  const menuRef = useRef();

  const getFirstTwoChars = (name) => {
    return name.slice(0,2).toUpperCase();
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AnimatePresence mode='wait'>
      <motion.div 
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.95}}
        transition={{ duration: 0.3 }}
        className='relative flex justify-between items-center pay'
        >
          <p className='p-2 rounded-md bg-dark text-white'>{getFirstTwoChars(payment.vendorName)}</p>
          <div className='flex flex-col gap-1'>
            <h3 className='text-md font-medium text-dark'>
              {payment.vendorName}
            </h3>
            <p className='text-[#525151] text-xs'>Ksh {(payment.amount / 100).toLocaleString()}</p>
          </div>
          <button 
            onClick={() => setOpenMenuId(
              openMenuId === payment._id ? null : payment._id
            )}
            className='px-2 py-1 rounded-md text-sm text-white cursor-pointer bg-orange-500 flex items-center gap-2'>
            Review 
            <FaArrowRight className='Iconp' size={10}/>
          </button>

          <AnimatePresence>
            {openMenuId === payment?._id && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15 }}
                className='absolute right-8 top-8 z-50 min-h-[100px] rounded-lg min-w-[60px] border-[1.3px] border-gray-400 bg-white shadow-lg overflow-hidden'
                >
                  <button
                    className='cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100'
                    onClick={() => handleView(payment)}
                    >
                    View
                  </button>
                  <button
                    className='cursor-pointer w-full text-left px-4 py-2 text-green-600 hover:bg-green-50'
                    onClick={() => handleApprove(payment)}
                    >
                    Approve
                  </button>

                  <button
                    className='cursor-pointer w-full text-left px-4 py-2 text-red-600 hover:bg-red-50'
                    onClick={() => handleReject(payment)}
                    >
                    Reject
                  </button>
                </motion.div>
            )}
          </AnimatePresence>
      </motion.div>
    </AnimatePresence>
    
  )
}

export default PaymentItem