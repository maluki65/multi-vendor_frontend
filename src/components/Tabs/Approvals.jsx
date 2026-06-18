import React, { useState } from 'react';
import './Tabs.css';
import { Toaster } from 'react-hot-toast';
import { LuAlarmClock } from "react-icons/lu";
import { FaFileContract } from "react-icons/fa";
import { VerifyDoc, RejectVendorModal } from '..';
import useVerification from '../../Hooks/useVerification';
import useVendorAction from '../../Hooks/useVendorAction';
import usePendingVendors  from '../../Hooks/usePendingVendors';
import { MdOutlineProductionQuantityLimits, MdOutlineErrorOutline } from "react-icons/md";

function Approvals() {
  const [rejectModal, setRejectModal] = useState(null);
  const [verifyModal, setVerifyModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const { getVerificationByUserId } = useVerification();
  
  const { data, isLoading: isDataLoading, isError } = usePendingVendors();
  const { handleVendorActions, isLoading: isActionLoading } = useVendorAction();

  const vendorVerificationQuery = getVerificationByUserId(selectedVendorId);

  const getFirstTwoChars = (name) => {
    return name.slice(0,2).toUpperCase()
  }

  //console.log('Testing vendor:', data?.map(v => v.storeName));
  const formatDate = (isoString) => {
    const date = new Date(isoString);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short'});
    const year = date.getFullYear().toString().slice(-2);

    const getOriginal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd'
        default: return 'th';
      }
    };

    return `${day}${getOriginal(day)} ${month} ${year}`;
  };

  const openModal = (vendorId) =>{
    setSelectedVendorId(vendorId);
    setVerifyModal(true);
  }

  const openRejectModal = (vendor) => {
    setSelectedVendor(vendor);
    setRejectModal(true);
  };

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      <div>
        {isDataLoading ? (
          <p> Loading vendors...</p>
        ) : isError ? (
          <p className='h-[80vh] text-dark text-md  mt-2 flex flex-col justify-center items-center gap-2'>
            <MdOutlineErrorOutline className='text-red-500' size={60} />
            Failed to load vendor approvals
          </p>
        ) : data.length === 0 ? (
          <p className='h-[80vh] text-dark text-md  mt-2 flex flex-col justify-center items-center gap-2'>
            <MdOutlineProductionQuantityLimits className='text-red-500' size={60} />
            No vendors awaiting approval
          </p>
        ):(
          <div className='grid grid-cols-3 gap-3 mt-3 ApprovalCards'>
            {data.map((vendor) => (
              <div 
                key={vendor._id}
                className='bg-primary rounded-4xl flex flex-col h-[210px] appContainer'
                >
                  <div className='bg-[#282828] py-4 px-2 h-[90%] rounded-4xl flex flex-col space-y-3 justify-center UUIDcon'>
                    <div className='flex items-center justify-between'>
                      <p className='text-muted font-normal leading-relaxed text-sm'>
                        {vendor?.UUID}
                      </p>
                      <p className='text-muted font-normal leading-relaxed text-sm flex items-center gap-1'>
                        <LuAlarmClock className=''/> {formatDate(vendor?.createdAt)}
                      </p>
                    </div>
                    <div className='flex items-center gap-3 '>
                      <p className='rounded-full w-12 h-12 bg-orange-400 text-[#282828] flex items-center justify-center namesTag'>
                        {getFirstTwoChars(vendor?.storeName || vendor?.storeSlug)}
                      </p>
                      <div className='flex flex-col gap-1'>
                        <h1 className='text-[#c7ccd6] font-medium leading-relaxed STitle'>
                        {vendor?.storeName || vendor?.storeSlug}
                        </h1>
                        <p className='text-muted font-medium leading-relaxed text-sm'>
                          {vendor?.email}
                        </p>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <button
                        disabled={isActionLoading(vendor._id)}
                        onClick={() => handleVendorActions(
                          vendor._id, 
                          'approve'
                        )}
                        className={`px-3 py-1 rounded-lg cursor-pointer text-light hover:border-[1.5px] hover:border-green-500 ${isActionLoading(vendor._id) ? 'bg-gray-400' : 'bg-[#424242]'}`}
                      >
                        {isActionLoading(vendor._id) ? 'Approving...' :'Approve'}
                      </button>
                      <button
                        disabled={isActionLoading(vendor._id)}
                        onClick={() => openRejectModal(vendor)}
                        className={`px-3 py-1 rounded-lg cursor-pointer text-light hover:border-[1.5px] hover:border-red-500 ${isActionLoading(vendor._id) 
                          ? 'bg-gray-[#424242]' 
                          : 'bg-[#424242]'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <button className='flex items-center justify-center   gap-2 text-white p-2 cursor-pointer hover:underline'
                   onClick={() => openModal(vendor._id)}
                   >
                    <FaFileContract className=''/> view approval docs
                  </button>
              </div>
            ))}

            <RejectVendorModal
              isOpen={rejectModal}
              vendor={selectedVendor}
              onClose={() => {
                setRejectModal(false)
                setSelectedVendor(null);
              }}
              isSubmitting={
                selectedVendor ? isActionLoading(selectedVendor?._id) : false
              }
              onReject={async (reason) => {
                await handleVendorActions(
                  selectedVendor?._id,
                  'reject',
                  reason
                );

                setRejectModal(false);
                setSelectedVendor(null);
              }}
            />

            <VerifyDoc
              isOpen={verifyModal}
              onClose={() => setVerifyModal(false)}
              title='Vendor verification documents'
              >
                {vendorVerificationQuery.isLoading ? (
                  <p>Loading docs...</p>
                ) : vendorVerificationQuery.isError ? (
                  <p className='text-red-600'>Failed to load documents</p>
                ): vendorVerificationQuery.data?.verificationFiles?.length > 0 ? (
                  <div className='flex flex-col gap-2'>
                    <div className='grid grid-cols-2 gap-2 verifyImg '>
                      {vendorVerificationQuery.data.verificationFiles.map((file, idx) => (
                        <img 
                          key={idx}
                          src={file.url}
                          className='w-full h-32 object-cover rounded verImg'
                        />
                      ))}
                    </div>

                    <div className='bg-gray-100 p-3 rounded-lg'>
                      <p className='text-sm text-gray-500 AppSign'>Signature</p>
                      <p className='text-dark font-medium wrap-break-words'>
                        {vendorVerificationQuery.data.signature}
                      </p>
                    </div>
                    
                    <div className='bg-gray-100 p-3 rounded-lg'>
                      <p className='text-sm text-gray-600'>Terms & Conditions</p>
                      <p className={`font-medium ${vendorVerificationQuery.data.termsConditions 
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                          {vendorVerificationQuery.data.termsConditions
                            ? 'Accepted'
                            : 'Note Accepted'
                          }
                        </p>
                    </div>
                  </div>
                ) : (
                  <p className=''> No documents uploaded by this vendor</p>
                )}
                
            </VerifyDoc>
          </div>
        )}
      </div>
    </>
  )
}

export default Approvals