import React, { useState, useEffect } from 'react';
import { RiCloseCircleLine } from "react-icons/ri";
import { motion, AnimatePresence } from 'framer-motion';


function OrderModal({ isOpen, onClose, order, onTrack, onInvoice, type }) {
  
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <div 
      onClick={onClose}
      className='fixed inset-0 z-9945 flex items-center justify-center bg-black/50 overflow-y-auto backdrop-blur-sm'>
      <AnimatePresence mode='wait'>
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className='bg-white rounded-2xl w-full max-w-md p-6 shadow-xl m-2'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='font-semibold text-lg capitalize'>
              {type} Order
            </h2>
            <button onClick={onClose}>
              <RiCloseCircleLine
                size={28}
                className='text-red-600 cursor-pointer'
              />
            </button>
          </div>

          {type === 'track' && (
            <div className=''>Track</div>
          )}

          {type === 'invoice' && (
            <div className=''>Invoice</div>
          )}
        </motion.div>
      </AnimatePresence>
      
    </div>
  );
}

export default OrderModal