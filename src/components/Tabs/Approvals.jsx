import React, { useState } from 'react';
import './Tabs.css';
import { Toaster } from 'react-hot-toast';
import { LuAlarmClock } from "react-icons/lu";
import usePendingVendors  from '../../Hooks/usePendingVendors';
import useVendorAction from '../../Hooks/useVendorAction';
import { FaFileContract } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits, MdOutlineErrorOutline } from "react-icons/md";

function Approvals() {
  const { data, isLoading: isDataLoading, isError } = usePendingVendors();
  const { handleVendorActions, isLoading: isActionLoading } = useVendorAction();

  const getFirstTwoChars = (name) => {
    return name.slice(0,2).toUpperCase()
  }

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
          <div className='grid grid-cols-3 gap-3 mt-3'>
            {data.map((vendor) => (
              <div 
                key={vendor._id}
                className='bg-primary rounded-4xl flex flex-col h-[210px]'
                >
                  <div className='bg-[#282828] py-4 px-2 h-[90%] rounded-4xl flex flex-col space-y-3 justify-center'>
                    <div className='flex items-center justify-between'>
                      <p className='text-muted font-normal leading-relaxed text-sm'>
                        {vendor?.UUID}
                      </p>
                      <p className='text-muted font-normal leading-relaxed text-sm flex items-center gap-1'>
                        <LuAlarmClock className=''/> {formatDate(vendor?.createdAt)}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <p className='rounded-full w-12 h-12 bg-orange-400 text-[#282828] flex items-center justify-center'>
                        {getFirstTwoChars(vendor?.storeName || vendor?.storeSlug)}
                      </p>
                      <div className='flex flex-col gap-1'>
                        <h1 className='text-[#c7ccd6] font-medium leading-relaxed'>
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
                        onClick={() => handleVendorActions(
                          vendor._id, 
                          'reject', 
                          'Incomplete Info'
                        )}
                        className={`px-3 py-1 rounded-lg cursor-pointer text-light hover:border-[1.5px] hover:border-red-500 ${isActionLoading(vendor._id) ? 'bg-gray-[#424242]' : 'bg-[#424242]'}`}
                      >
                        {isActionLoading(vendor._id) ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                  <p className='flex items-center justify-center gap-2 text-white p-2 cursor-pointer hover:underline'>
                    <FaFileContract className=''/> view approval docs
                  </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Approvals