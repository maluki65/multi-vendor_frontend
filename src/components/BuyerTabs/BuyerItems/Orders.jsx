import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import useOrders from '../../../Hooks/useOrders';
import { AdLoader, OrderModal } from '../../';
import { MdError, MdOutlineSort } from "react-icons/md";
import { LuBox } from "react-icons/lu";
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function Orders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalType, setModalType] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { getBuyerOrder, updateOrderStatus } = useOrders();
  const { data, isLoading, isError } = getBuyerOrder({
    page,
    limit: 5,
    status: activeTab,
    search: debouncedSearch,
  })
  
  const count = data?.results;
  const orders = data?.orders || [];

  const totalPages = data?.totalPages || 1;

  const orderTabs = [
    { name: 'All', value: 'all', statuses: [] },
    { name: 'Processing', value: 'processing', statuses: ['pending', 'processing', 'shipped'] },
    { name: 'Cancelled', value: 'cancelled', statuses: ['cancelled'] },
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
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
  
      return sortOrder === 'latest'
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [orders, sortOrder]);

  const canCancelOrder = (order) => ['pending', 'processing'].includes(order.orderStatus);
  const canCompleteOrder = (order) => ['shipped'].includes(order.orderStatus);

  const handleCancelOrder = (order) => {
    if (!canCancelOrder(order)) {
      return toast.error('This order can no longer be cancelled.');
    }

    toast((t) => (
      <span className='flex flex-col gap-2 text-sm'>
        <p className='font-medium'>
          Are you sure you want to cancel this order{' '}
          <span className='text-orange-400'>{order?.orderNumber}</span>          
        </p>
        <div className='flex justify-end gap-2'>
          <button
            onClick={() => {
              toast.dismiss(t.id);

              updateOrderStatus.mutate({
                orderId: order._id,
                status: 'cancelled',
              });
            }}
            className='px-3 cursor-pointer py-1 text-white bg-red-600 rounded-md hover:bg-red-700'
            >
              Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className='px-3 py-1 cursor-pointer bg-gray-300 rounded-md hover:bg-gray-400r'
            >
              No
          </button>
        </div>
      </span>
    ))
  }

  const handleCompleteOrder = (order) => {
    if (!canCompleteOrder(order)) {
      return toast.error("You can only mark an order as 'Completed' if its current status is 'Shipped'.");
    }

    toast((t) => (
      <span className='flex flex-col gap-2 text-sm'>
        <p className='font-medium'>
          Are you sure you want to mark this order as completed?{' '}
          <span className='text-orange-400'>{order?.orderNumber}</span>          
        </p>
        <div className='flex justify-end gap-2'>
          <button
            onClick={() => {
              toast.dismiss(t.id);

              updateOrderStatus.mutate({
                orderId: order._id,
                status: 'completed',
              });
            }}
            className='px-3 cursor-pointer py-1 text-white bg-red-600 rounded-md hover:bg-red-700'
            >
              Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className='px-3 py-1 cursor-pointer bg-gray-300 rounded-md hover:bg-gray-400r'
            >
              Cancel
          </button>
        </div>
      </span>
    ))
  }

  //console.log('Buyer order:', orders);

  return (
    <section className='flex flex-col gap-3 overflow-hidden py-2 px-4'>
      <div className='flex items-center justify-between orders09'>
        <div className='flex gap-3 items-center orderBuyerTabs83'>
          {orderTabs.map((item, index) => {
            return (
              <div 
                key={index}
                onClick={() => setActiveTab(item.value)}
                className={`rounded-md bg-gray-200 px-3 py-1 text-dark font-medium cursor-pointer  ${item.value === activeTab ? 'bg-orange-400 text-white' : ''}`}
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
              <MdOutlineSort className='sortOrderBtn' size={23} />

              <span className='text-xs text-dark capitalize sortOrderText'>
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
      
      <AnimatePresence mode='wait'>
        <div className='flex flex-col gap-3'>
          {!isLoading && !isError && (
            filteredOrder.length > 0 ? (
              filteredOrder.map((order) => {
                return (
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
                            onClick={() => {
                              setSelectedOrder(order);
                              setModalType('track');
                            }}
                            className='rounded-full px-3 py-1 text-white bg-primary cursor-pointer'>
                              Track order
                          </button>

                          {/*<button
                            onClick={() => {
                              setSelectedOrder(order)
                              setModalType('invoice')
                            }}
                            className='rounded-full px-3 py-1 text-primary border-[1.3px] border-primary cursor-pointer'>
                              Invoice
                          </button>*/}
                        </div>
                        <button
                          onClick={() => handleCompleteOrder(order)}

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
                        <button 
                          onClick={() => handleCancelOrder(order)}
                          disabled={!canCancelOrder(order) || updateOrderStatus.isPending}
                          className={`font-semibold orderCancel transition ${['shipped', 'completed', 'cancelled'].includes(order?.orderStatus) ? 'text-gray-400 cursor-not-allowed' : 'text-orange-400 hover:underline cursor-pointer'}`}
                          >
                          {order?.orderStatus === 'cancelled'
                            ? 'cancelled'
                            : updateOrderStatus.isPending ? 'Cancelling' : 'Cancel Order'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
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
      </AnimatePresence>  

      <OrderModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        type={modalType}
        onClose={() => {
          setSelectedOrder(null);
          setModalType(null);
        }}
      />
    </section>
  )
}

export default Orders