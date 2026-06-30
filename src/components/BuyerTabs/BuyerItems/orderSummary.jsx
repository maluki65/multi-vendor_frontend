import React, { useState } from 'react';

function OrderSummary({ pricing, canCheckOut, totalItems, onCheckout, isLoading, cartItems=[] }) {

  return (
    <div className='border-[1.5px] border-gray-200 p-4 rounded-md space-y-3 '>
      <h3 className='font-semibold text-dark'>Order summary</h3>

      <hr className='flex-1 border-t border-gray-300' />

      <div className='flex justify-between'>
        <span className='text-muted'>Items</span>
        <span className='font-semibold'>{totalItems}</span>
      </div>
      <div className='max-h-56 overflow-y-auto space-y-3 pr-1'>
        {cartItems.map((item) => {
          const price =
            item.discount > 0
              ? item.discountPrice
              : item.price;

          return (
            <div
              key={item.productId}
              className='flex justify-between'
            >
              <div className='flex-1'>
                <p className='text-muted font-medium line-clamp-1 flex items-center gap-2'>
                  {item.name}
                  <span className='text-sm text-gray-500'>
                    x {item.quantity}
                  </span>
                </p>
              </div>

              <p className='text-sm font-semibold whitespace-nowrap text-right'>
                Ksh {((price * item.quantity) / 100).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className='flex justify-between'>
        <span className='text-muted'>Subtotal</span>
        <span className='font-semibold'>Ksh {(pricing.subtotal / 100).toLocaleString()}</span>
      </div>

      <div className='flex justify-between'>
        <span className='text-muted'>VAT (16%)</span>
        <span className='font-semibold'> Ksh {(pricing.tax / 100).toLocaleString()}</span>
      </div>

      {/*}<div className='flex justify-between'>
        <span className='text-muted'>Shipping</span>
        <span className='text-gray-500 text-sm'>
          Calculated at checkout
        </span>
      </div>*/}

      <hr className='flex-1 border-t border-gray-300' />

      <div className='flex justify-between'>
        <span className='text-muted'>Estimated Total</span>
        <span className='font-semibold'>Ksh {(pricing.total / 100).toLocaleString()}</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={!canCheckOut }
        className={`w-full py-3 rounded-full text-white cursor-pointer ${canCheckOut ? 'bg-dark' : 'bg-gray-400 cursor-not-allowed'}`}
        >
         {isLoading ? 'Processing...' : ' Proceed to Checkout'}
      </button>
    </div>
  );
};

export default OrderSummary