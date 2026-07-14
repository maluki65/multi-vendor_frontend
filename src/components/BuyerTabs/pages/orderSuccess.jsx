import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { addDays, format } from 'date-fns';
import { BsPatchCheck, BsPatchCheckFill } from "react-icons/bs";
function OrderSuccess({ isOpen, onClose, order }) {
  const [countDown, setCountDown] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setCountDown(20);

    const interval = setInterval(() => {
      setCountDown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const estimatedDate = addDays(new Date(order?.createdAt), 3);
  const estimate = format(estimatedDate, 'dd MMM yyyy . h:mm a');

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-9945 flex items-center justify-center bg-black/50 overflow-y-auto overflow-x-hidden backdrop-blur-sm'>
        <AnimatePresence mode='wait'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className='bg-gray-100 rounded-2xl w-full max-w-lg p-6 shadow-xl m-2 min-h-[40vh] orderSuccess'>
              <div className='flex flex-col gap-2 items-center justify-center'>
                <BsPatchCheckFill className='text-green-600' size={75} />
                <h1 className='text-center text-xl font-semibold text-dark'>
                  You order has been successfully submitted!
                </h1>
              </div>
              <div className='my-2 border-[1.5px] border-gray-300 rounded-md p-4 bg-gray-200'>
                <div className='flex items-center justify-between my-2'>
                  <p className='text-gray-500'>Order ID</p>
                  <p className='text-dark font-medium'>{order?.orderNumber}</p>
                </div>
                <hr className='flex-1 border-t border-gray-300' />                            
                <div className='flex items-center justify-between my-2'>
                  <p className='text-gray-500'>Tracking ID</p>
                  <p className='text-dark font-medium'>{order?.trackingID}</p>
                </div>
                <hr className='flex-1 border-t border-gray-300' />                            
                <div className='flex items-center justify-between my-2'>
                  <p className='text-gray-500'>Order ID</p>
                  <p className='text-dark font-medium'>{format(new Date(order?.createdAt), 'dd MMM yyyy')}</p>
                </div>
                <hr className='flex-1 border-t border-gray-300' />                            
                <div className='flex items-center justify-between my-2'>
                  <p className='text-gray-500'>Total</p>
                  <p className='text-dark font-medium'>Ksh {(order?.totalAmount / 100).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/buyer/account')}
                className='font-bold bg-dark text-white px-4 py-2 rounded-xl cursor-pointer w-full ny-2'>
                  Go to my account
              </button>
            </motion.div>
        </AnimatePresence>
      </div>
  )
}

export default OrderSuccess