import React, { useState } from 'react';

function OrderSummary({ pricing, canCheckOut, totalItems }) {
  if (!pricing) {
    return (
      <div className='border p-4 rounded-md'>
        <p className='text-gray-500'>
          Select a delivery location to see order summary
        </p>
      </div>
    );
  }

  return (
    <div className='border-[1.5px] border-gray-200 p-4 rounded-md space-y-3 '>
      <h3 className='font-semibold text-dark'>Order summary</h3>

      <hr className='flex-1 border-t border-gray-300' />

      <div className='flex justify-between'>
        <span className='text-muted'>Items</span>
        <span className='font-semibold'>{totalItems}</span>
      </div>

      <div className='flex justify-between'>
        <span className='text-muted'>Subtotal</span>
        <span className='font-semibold'>Ksh {(pricing.subtotal / 100).toLocaleString()}</span>
      </div>

      <div className='flex justify-between'>
        <span className='text-muted'>VAT (16%)</span>
        <span className='font-semibold'> Ksh {(pricing.tax / 100).toLocaleString()}</span>
      </div>

      <div className='flex justify-between'>
        <span className='text-muted'>Shipping</span>
        <span className='font-semibold'>Ksh {(pricing.shipping / 100).toLocaleString()}</span>
      </div>

      <hr className='flex-1 border-t border-gray-300' />

      <div className='flex justify-between'>
        <span className='text-muted'>Total</span>
        <span className='font-semibold'>Ksh {(pricing.total / 100).toLocaleString()}</span>
      </div>

      <button
        disabled={!canCheckOut}
        className={`w-full py-3 rounded-full text-white cursor-pointer ${canCheckOut ? 'bg-dark' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary