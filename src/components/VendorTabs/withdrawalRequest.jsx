import React, { useEffect } from 'react';
import { RiCloseCircleLine } from "react-icons/ri";

function WithdrawalRequest({ selectedRequest, onClose, status  }) {
  useEffect(() => {
    if (!selectedRequest) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedRequest]);
  
  if (!selectedRequest) return null;

  return (
    <div
     onClick={onClose} 
     className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto backdrop-blur-sm'>
      <div
       onClick={(e) => e.stopPropagation()}
       className='bg-white rounded-2xl w-full max-w-md p-6 shadow-xl m-2 withdrawalModal'>
        <div className='flex items-center justify-between'>
          <h2 className='text-md font-semibold text-gray-600 withdrawalHeading'>
            Request: {selectedRequest?.requestUUID}
          </h2>

          <button 
            onClick={onClose}
            >
              <RiCloseCircleLine className='text-red-600 cursor-pointer withdrawalIcon' size={24} />
          </button>
        </div>
        <div className='space-y-2 text-md mt-2 grid grid-cols-2 gap-3 Request08Modal'>
          <p className='flex items-center gap-2 text-dark font-semibold'>
            Vendor: <span className='text-gray-700 font-medium'>{selectedRequest?.vendorName}</span>
          </p>

          <p className='flex items-center gap-2 text-dark font-semibold'>
            Amount: <span className='text-gray-700 font-medium'>{(selectedRequest?.amount / 100).toLocaleString()}</span>
          </p>

          <p className='flex items-center gap-2 text-dark font-semibold'>
            Status:
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
              {status.icon && <status.icon size={14} />}
              {selectedRequest?.status}
            </span>
          </p>

          <p className='flex items-center gap-2 text-dark font-semibold'>
            Payment to: <span className='text-gray-700 font-medium'>{selectedRequest?.paymentMethodSnapshot?.tillNumber}</span>
          </p>

          <p className='flex items-center gap-2 text-dark font-semibold'>
            Paid At:
            <span className='text-gray-700 font-medium'>
              {selectedRequest?.paidAt
                ? new Date(selectedRequest.paidAt).toISOString().split('T')[0]
                : 'Not paid yet'
              }
            </span>
            
          </p>
        </div>
        <p
          className={`mt-4 flex flex-col gap-2 ${
            selectedRequest?.rejectionReason
              ? 'text-red-600'
              : 'text-green-600'
          }`}
         >
          <span className='text-dark font-semibold'>
           Rejection reason:
          </span> 
          {selectedRequest?.rejectionReason
            ? selectedRequest.rejectionReason
            : 'No rejection reason'}
        </p>
      </div>
    </div>
  )
}

export default WithdrawalRequest