import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import useOrders from '../../../Hooks/useOrders';
import { AdLoader } from '../../';
import { MdError, MdOutlineSort } from "react-icons/md";
import { LuBox } from "react-icons/lu";
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';

function Orders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { getBuyerOrder, updateOrderStatus } = useOrders();
  const { data, isLoading, isError } = getBuyerOrder({
    page,
    limit: 3,
    search: debouncedSearch,
  })
  
  const count = data?.results;
  const orders = data?.orders || [];

  const totalPages = data?.totalPages || 1;

  const orderTabs = [
    { name: 'All', value: 'all', statuses: [] },
    { name: 'Processing', value: 'processing', statuses: ['pending', 'processing', 'shipped'] },
    { name: 'Cancelled', value: 'cancelled', statuses: [] },
    { name: 'Completed', value: 'completed', statuses: ['completed'] },
  ]

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500),
  )

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);
    debouncedSetSearch(value);
  }

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSearch]);

  const filteredOrder = useMemo(() => {
    const currentTab = orderTabs.find(
      (tab) => tab.value === activeTab
    );

    let filtered = orders;

    if (currentTab && activeTab !== 'all') {
      filtered =orders.filter((order) => currentTab.statuses.includes(order.orderStatus));
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return sorted
  }, [orders, activeTab, sortOrder]);

  console.log('Buyer order:', orders);

  return (
    <section className='flex flex-col gap-3 overflow-hidden py-2 px-4'>
      <div className='flex items-center justify-between orders09'>
        <div className='flex gap-3 items-center'>
          {orderTabs.map((item, index) => {
            return (
              <div 
                key={index}
                onClick={() => setActiveTab(item.value)}
                className={`rounded-md bg-gray-200 px-3 py-1 text-dark font-medium cursor-pointer ${item.value === activeTab ? 'bg-orange-400 text-white' : ''}`}
                >
                  {item.name}
              </div>
            )
          })}
        </div>
        <div className='flex gap-3 items-center'>
          <button
            onClick={() => setSortOrder((prev) => prev === 'latest' ? 'oldest' : 'latest')}
            className='p-1 rounded bg-gray-200 flex items-center gap-1 cursor-pointer'
            >
              <MdOutlineSort className='' size={23} />

              <span className='text-xs text0dark capitalize'>
                {sortOrder}
              </span>
          </button>
          <input
            type='text'
            value={search}
            onChange={handleSearchChange}
            placeholder='Search by order Id...'
            className='p-1 outline-none bg-gray-200 focus:border-[1.5px] focus:border-orange-400 rounded-lg'
          />
        </div>
      </div>

      {isLoading && (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader/>
        </div>
      )}

      {isError && (
        <div className='text-center text-gray-500 flex flex-col items-center gap-3'>
          <MdError className='text-red-500' size={65} />
          <p className='text-red-500'> Failed to load orders</p>
        </div>
      )}
      
      <div className='flex flex-col gap-3'>
        {!isLoading && !isError && (
          filteredOrder.length > 0 ? (
            filteredOrder.map((order) => {
              return (
                <AnimatePresence mode='wait'>
                  <motion.div 
                    key={order?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className='rounded-3xl flex flex-col'>
                    <div className='p-3 flex items-center justify-between bg-orange-400 rounded-t-3xl orderHeading'>
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
                      <Fragment key={product?._id}>
                        <hr className='flex-1 border-t border-gray-300' />
                        <div 
                          key={product._id}
                          className='flex items-center gap-3 py-4 px-3'>
                            <img 
                              src={product.image}
                              atl= {product.name}
                              className='w-15 h-15 object-contain rounded-lg orderProdImg'
                            />

                            <div className='flex flex-col justify-center px-4 orderProdHeading32'>
                              <h4 className='font-semibold leading-relaxed'>
                                {product?.name}
                              </h4>
                              <p className='text-sm text-gray-500 flex items-center'> color: Gray | {product?.quantity} Qty.</p>
                            </div>
                        </div>
                      </Fragment>
                      ))}

                      <hr className='flex-1 border-t border-gray-300' />

                      <div className='flex items-center justify-between my-3 orderActions'>
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
                        <button
                          onClick={() => {
                            updateOrderStatus.mutate({
                              orderId: order._id,
                              status: 'completed',
                            });
                          }}

                          disabled={
                            order.orderStatus !== 'shipped' ||
                            updateOrderStatus.isPending
                          }
                          className={`rounded-full cursor-pointer transition ${
                          order?.orderStatus === 'shipped'
                          ? 'text-green-500 hover:underline'
                          : 'text-gray-400 cursor-not-allowed'}`}>
                            {updateOrderStatus.isPending
                            ? 'Updating'
                            : order?.orderStatus === 'completed'
                              ? 'Order received'
                              : 'Mark as received'}
                        </button>
                        <a className='text-orange-400 font-semibold cursor-pointer hover:underline orderCancel'>Cancel Order</a>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )
            })
          ) : (
            <div className='col-span-full text-center text-gray-600 flex flex-col items-center gap-2'>
              <LuBox className='text-red-500' size={65} />
              <p className=''>No orders found!</p>
            </div>
          )
        )}
        <div className='flex justify-between items-center CatNav mt-4'>
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(page - 1)}
            className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
              >
              Prev
          </button>
          <span className=''>
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(page + 1)}
            className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
            >
              Next
          </button>
        </div>
      </div>
    </section>
  )
}

export default Orders