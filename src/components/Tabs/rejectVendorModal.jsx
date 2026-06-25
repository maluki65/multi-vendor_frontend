import React, { useState, useEffect } from 'react';
import { RiCloseCircleLine } from "react-icons/ri";

function RejectVendorModal({ isOpen, onClose, vendor, onReject, isSubmitting }) {
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('')
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !vendor) return null;

  const handleRejectVendor = async (e) => {
    if (!reason.trim()) {
      setError('Vendor rejection reason is required!');

      setTimeout(() => {
        setError('');
      }, 5000);

      return;
    }

    await onReject(reason);
  };

  return (
    <div 
     onClick={onClose}
     className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto backdrop-blur-sm'>
      <div 
       onClick={(e) => e.stopPropagation()}
       className='bg-white rounded-2xl w-full max-w-md p-6 shadow-xl m-2 withdrawalModal'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-semibold text-lg capitalize'>
            Reject {vendor?.storeName || vendor?.storeSlug}
          </h2>

          <button onClick={onClose}>
            <RiCloseCircleLine
              size={28}
              className='text-red-600 cursor-pointer'
            />
          </button>
        </div>

        {error &&(
          <div className='text-red-600 bg-red-100 border-red-400 p-2 rounded mt-3 mb-2'>
            {error}
          </div>
        )}

        <div className='flex flex-col gap-2'>
          <div className='mb-4'>
            <label className='font-medium mb-2 flex items-center gap-1'>
              Rejection Reason <span className='text-red-600'>*</span>
            </label>

            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder='Enter vendor rejection reason'
              className='w-full border outline-none rounded-lg p-3 resize-none focus:border-[1.5px] focus:border-orange-400'
            />
          </div>
          <div className='flex justify-end gap-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded-lg bg-primary text-white cursor-pointer'
            >
              Close
            </button>

            <button
              disabled={isSubmitting}
              onClick={handleRejectVendor}
              className='px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer'
            >
              {isSubmitting
                ? 'Rejecting...'
                : 'Reject Request'}
            </button>
          </div>
        </div>    
      </div>
    </div>
  )
}

export default RejectVendorModal