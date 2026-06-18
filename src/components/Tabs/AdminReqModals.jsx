import React, { useState, useEffect } from 'react';
import { RiCloseCircleLine } from "react-icons/ri";

function AdminReqModals({ isOpen, onClose, request, type, onReject, isSubmitting }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setRejectionReason('');
      setError('')
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const handleRejectionSubmit = async (e) => {
    try{

      if (!rejectionReason.trim()) {
        setError('Rejection reason is required!');

        setTimeout(() => {
          setError('');
        }, 5000);

        return;
      }
      
      await onReject(rejectionReason);
      setRejectionReason('');
      onClose()
    } catch (error){
      console.error('Failed to reject request', error);
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto backdrop-blur-sm'>
      <div className='bg-white rounded-2xl w-full max-w-md p-6 shadow-xl m-2 withdrawalModal'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-semibold text-lg capitalize'>
            {type} Withdrawal Request
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

        {type === 'view' && (
          <div className='space-y-3 mb-5'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                Request ID:
              </span>
              {request?.requestUUID}
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                Vendor:
              </span>
              {request?.vendorName}
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                Vendor:
              </span>
              {(request?.amount / 100).toLocaleString()}
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                Status:
              </span>
              {request?.status}
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                Till Number:
              </span>
              {request?.paymentMethodSnapshot.tillNumber}
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                Account Name:
              </span>
              {request?.paymentMethodSnapshot.accountName}
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                Created At:
              </span>
              {new Date(request?.createdAt).toLocaleString()}
            </div>
          </div>
        )}        

        {type === 'reject' && (
          <div className='flex flex-col gap-2'>
            <div className='mb-4'>
              <label className='font-medium mb-2 flex items-center gap-1'>
                Rejection Reason <span className='text-red-600'>*</span>
              </label>

              <textarea
                rows={4}
                required
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(e.target.value)
                }
                placeholder='Enter rejection reason'
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
                onClick={handleRejectionSubmit}
                className='px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer'
              >
                {isSubmitting
                  ? 'Rejecting...'
                  : 'Reject Request'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminReqModals