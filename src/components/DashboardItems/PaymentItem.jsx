import React from 'react';
import './DashBoardItems.css';
import { FaArrowRight } from "react-icons/fa";

function PaymentItem({payments}) {

  const getFirstTwoChars = (name) => {
    return name.slice(0,2).toUpperCase();
  }

  return (
    <div className='flex justify-between items-center pay'>
      <p className='p-2 rounded-md bg-dark text-white'>{getFirstTwoChars(payments.name)}</p>
      <div className='flex flex-col gap-1'>
        <h3 className='text-md font-medium text-dark'>
          {payments.name}
        </h3>
        <p className='text-[#525151] text-xs'>{payments.amount}</p>
      </div>
      <button className='px-2 py-1 rounded-md text-sm text-white cursor-pointer bg-orange-500 flex items-center gap-2'>
        Pay Now 
        <FaArrowRight className='Iconp' size={10}/>
      </button>
    </div>
  )
}

export default PaymentItem