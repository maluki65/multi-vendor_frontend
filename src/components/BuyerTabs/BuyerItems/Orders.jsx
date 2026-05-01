import React from 'react';
import useOrders from '../../../Hooks/useOrders';
import { AdLoader } from '../../';
import { FaChevronDown } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { LuBox } from "react-icons/lu";

function Orders() {
  const { getBuyerOrder } = useOrders();
  const { data, isLoading, isError } = getBuyerOrder;
  
  const count = data?.results;
  const orders = data?.orders;

  return (
    <section className='flex flex-col gap-3 overflow-hidden py-2 px-4'>
      <div className='flex items-center justify-between'>
        <h1 className='font-semibold text-base'>Orders({count})</h1>
        <div className='flex items-center gap-2 cursor-pointer'>
          <p className='text-base font-medium'>sort by:</p>
          <a className='flex items-center gap-1'>All <FaChevronDown className='' size={16} /></a>
        </div>
      </div>

      {isLoading && (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader/>
        </div>
      )}

      {isError && (
        <div className='text-center text-gray-500 flex flex-col items-center gap-3'>
          <MdError className='text-red-500' size={45} />
          <p className='text-red-500'> Filed to load orders</p>
        </div>
      )}

      {!isLoading && !isError && (
        count > 0 ? (
          orders.map((order) => (
            <div 
              key={order._id}
              className='rounded-3xl flex flex-col'>
              <div className='p-3 flex items-center justify-between bg-orange-400 rounded-t-3xl'>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-500 text-sm font-medium'>Order ID</p>
                  <h4 className='fonr-semibold text-base'>
                    {order?.orderNumber}
                  </h4>
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-600 text-sm font-medium'>Total Payment</p>
                  <h4 className='fonr-semibold text-base'>
                    Ksh{(order?.totalAmount / 100).toLocaleString()}
                  </h4>
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-500 text-sm font-medium'>Payment Status</p>
                  <h4 className='fonr-semibold text-base'>
                    {order?.paymentStatus}
                  </h4>
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-500 text-sm font-medium'>Order Status</p>
                  <h4 className='fonr-semibold text-base'>
                    {order?.orderStatus}
                  </h4>
                </div>
              </div>
              
              <div className='flex flex-col border-[1.4px] px-2 border-gray-200 rounded-b-3xl'>
                {order.products?.map((product) => (
                 <>
                  <hr className='flex-1 border-t border-gray-300' />
                  <div 
                    key={product._id}
                    className='flex items-center gap-3 py-4 px-3'>
                      <img 
                        src={product.image}
                        atl= {product.name}
                        className='w-15 h-15 object-contain rounded-lg'
                      />

                      <div className='flex flex-col justify-center px-4'>
                        <h4 className='font-semibold leading-relaxed'>
                          {product?.name}
                        </h4>
                        <p className='text-sm text-gray-500 flex items-center'> color: Gray | {product?.quantity} Qty.</p>
                      </div>
                  </div>
                 </>
                ))}

                <hr className='flex-1 border-t border-gray-300' />

                <div className='flex items-center justify-between my-3'>
                  <div className='flex items-center gap-4'>
                    <button
                      className='rounded-full px-3 py-1 text-white bg-primary cursor-pointer'>
                        Track order
                    </button>

                    <button
                      className='rounded-full px-3 py-1 text-primary border-[1.3px] border-primary cursor-pointer'>
                        Invoice
                    </button>
                  </div>
                  <a className='text-orange-400 font-semibold cursor-pointer hover:underline'>Cancel Order</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='col-span-full text-center text-gray-600 flex flex-col items-center gap-2'>
            <LuBox className='text-red-500' size={45} />
            <p className=''>No orders found!</p>
          </div>
        )
      )}
    </section>
  )
}

export default Orders