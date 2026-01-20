import React from 'react';
import './DashBoardItems.css';
import { BsThreeDotsVertical } from "react-icons/bs";

function vendorItems({vendorApprovals}) {
  const getFirstTwoChars = (name) => {
    return name.slice(0,2).toUpperCase();
  } 
  return (
    <div className='flex justify-between items-center'>
      <p className='rounded-full items-center p-1 text-xs text-white bg-dark'>{getFirstTwoChars(vendorApprovals.storename)}</p>
      <div className='flex flex-col gap-1'>
        <p className='text-xs font-medium text-dark'>
          {vendorApprovals.storename}
        </p>
        <p className='text-[#525151] text-xs'>{vendorApprovals.email}</p>
      </div>
      <BsThreeDotsVertical className='cursor-pointer' size={20}/>
    </div>
  )
}

export default vendorItems