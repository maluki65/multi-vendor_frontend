import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './vendorTabs.css';
import useOrders from '../../Hooks/useOrders';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AdLoader } from '../';
import { MdOutlineSort } from "react-icons/md";
import { debounce } from 'lodash';
import { TbReceiptOff, TbTruckDelivery, TbCancel } from "react-icons/tb";
import { PiReceiptX } from "react-icons/pi";
import { IoCheckmarkDone } from "react-icons/io5";
import { BiStopwatch } from "react-icons/bi";
import { LuFileCheck } from "react-icons/lu";

function Orders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  const { getVendorOrder, updateOrderStatus } = useOrders();
  
  //const { data: orderStatus, isLoading: statusLoading, isError: statusError } = updateOrderStatus();
  const { data, isLoading, isError } = getVendorOrder({
    page,
    limit: 6,
    search,
  });

  const orders = data?.orders || [];
  console.log('Vendor orders:', orders);

  const formatDate = (
    date = new Date(),
    {
      weekday = 'long',
      showTime = false,
      month = 'short',
    } = {}
  ) => {
    const dateOptions = {
      weekday,
      day: 'numeric',
      month,
      year: 'numeric',
    };

    const timeOptions = {
      hour: 'numeric',
      minute:'2-digit',
      hour12: true,
    };

    const formattedDate = new Date(date).toLocaleDateString(
      'en-GB',
      dateOptions
    );

    const formmattedTime = new Date(date).toLocaleTimeString(
      'en-US',
      timeOptions
    );

    return {
      date: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
      time: formmattedTime,
    };
  };

  const orderTabs = [
    { name: 'All', value: 'all', statuses: [] },
    { name: 'Processing', value: 'pending', statuses: ['pending', 'processing', 'shipped'] },
    { name: 'Completed', value: 'completed', statuses: ['completed'] },
  ]

  const debouncedSearch = useMemo(
    () => debounce((val) => {
      setSearch(val);
      setPage(1);
    }, 300),
    []
  );

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchInput(val);
    debouncedSearch(val);
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const filteredOrders = useMemo(() => {
    const currentTab = orderTabs.find(
      (tab) => tab.value === activeTab
    );

    if (!currentTab || activeTab === 'all') {
      return orders;
    }

    return orders.filter((order) => currentTab.statuses.includes(order.orderStatus));
  }, [orders, activeTab]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
  
      processing: orders.filter((o) =>
        ['pending', 'processing', 'shipped'].includes(o.orderStatus)
      ).length,
  
      /*shipped: orders.filter(
        (o) => o.orderStatus === 'shipped'
      ).length,*/
  
      completed: orders.filter(
        (o) => o.orderStatus === 'completed'
      ).length,
    };
  }, [orders]);

  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100 text-dark',
      icon: <LuFileCheck />,
    },
    processing: {
      bg: 'bg-yellow-100 text-dark',
      icon: <BiStopwatch />,
    },
    shipped: {
      bg: 'bg-yellow-100 text-dark',
      icon: <TbTruckDelivery />,
    },
    completed: {
      bg: 'bg-green-200 text-dark',
      icon: <IoCheckmarkDone />,
    },
    cancelled: {
      bg: 'bg-red-100 text-dark',
      icon: <TbCancel />
    }
  }

  const nextStatusMap = {
    pending: ['processing'],
    processing: ['shipped'],
    shipped: ['completed'],
    completed: [],
    cancelled: [],
  }

  return (
    <section className='overflow-hidden'>
    <Toaster position='top-right' reverseOrder={false} />
    {isLoading ? (
      <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
        <AdLoader/>
      </div>
    ) : (
      <div className='p-4 rounded-md my-5 bg-white'>
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold text-dark text-lg'>Orders</h2>
          <p className='font-medium text-dark text-sm'>{formatDate().date}</p>
        </div>

        <div className='my-4 flex items-center justify-between px-2 VenOrdersHs'>
          <div className='flex gap-3'>
            {orderTabs.map((item, index) => {
              return (
                <div 
                  key={index}
                  onClick={() => setActiveTab(item.value)}
                  className={`rounded-md bg-gray-200 px-3 py-1 text-dark font-medium cursor-pointer orderStatusTitles ${item.value === activeTab ? 'bg-orange-400 text-white' : ''}`}
                 >
                 {item.name} {/*({counts[item.value]})*/}
                </div>
              )
            })}
          </div>
          <div className='flex gap-3 items-center'>
            <span className='p-1 rounded bg-gray-200'>
             <MdOutlineSort className='cursor-pointer' size={23} />
            </span>
            <input 
              type='text'
              value={searchInput}
              onChange={handleSearchChange}
              placeholder='Search by order Id...'
              className='p-1 outline-none border-none bg-gray-200 focus:border-[1.2px] focus:border-orange-400 rounded-lg'
            />
          </div>
        </div>

        <AnimatePresence mode='wait'>
          <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.3 }}
           className='my-5 w-full min-h-[50vh]'>
            {isError && (
              <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                <PiReceiptX className='text-red-500' size={65} />
                <p className='text-red-500'>Failed to get vendor products!</p>
              </div>
            )}

            {!isError && (
              filteredOrders.length > 0 ? (
                <div className='grid grid-cols-3 gap-3 VenOrders'>
                  {filteredOrders.map((order) => {
                    const currentStatus = statusConfig[order.orderStatus] || {
                      bg: 'bg-gray-300 text-dark',
                      icon: null
                    };

                    const orderDate = formatDate(order?.createdAt, {
                      weekday: 'short',
                      month: 'long',
                    });

                    return (
                      <div 
                       key={order._id}
                       className='p-2 shadow-xs bg-gray-100 rounded-md'>
                        <div className='flex gap-2'>
                          <p className='bg-orange-400 rounded-md p-2 text-white text-lg font-semibold uppercase'>
                            {order?.buyer.username.slice(0,2)}
                          </p>
                          <div className='flex flex-col gap-1 flex-1'>
                            <div className='flex w-full items-center justify-between'>
                              <p className='font-semibold text-base text-dark capitalize'>
                                {order?.buyer.username}
                              </p>
                              <p className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 w-fit capitalize ${currentStatus.bg}`}>
                                {currentStatus.icon}
                                {order?.orderStatus}
                              </p>
                            </div>
                            <p className='text-xs text-gray-500'>
                              Order: {order?.orderNumber}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center justify-between my-2'>
                          <p className='text-sm text-gray-500'>
                            {orderDate.date}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {orderDate.time}
                          </p>
                        </div>

                        <hr className='flex-1 border-t border-gray-300' />

                        <table className='w-full border-none my-2'>
                          <thead className=''>
                            <tr className='orderTableH1'>
                              <td className='text-sm text-gray-400'>Name</td>
                              <td className='text-sm text-gray-400 text-center'>Qty</td>
                              <td className='text-sm text-gray-400 text-end'>Price</td>
                            </tr>
                          </thead>

                          <tbody className=''>
                            {order?.products?.map((item) => {
                              return (
                                <tr 
                                  key={item._id}
                                  className=''>
                                    <td className='text-sm text-gray-700 py-2'>{item?.name}</td>
                                    <td className='text-sm text-gray-700 py-2 text-center'>{item?.quantity}</td>
                                    <td className='text-sm text-gray-700 py-2 text-end'>ksh {(item?.price / 100).toLocaleString()}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>

                        <hr className='flex-1 border-t border-gray-300' />
                         
                        <div className='flex items-center justify-between my-1'>
                        <p className='font-semibold text-dark text-base'>
                          Total
                        </p>
                        <p className='font-semibold text-dark text-base'>
                          Ksh {(order?.totalAmount / 100).toLocaleString()}
                        </p>
                        </div>

                        <div className='grid grid-cols-2 gap-2 mt-2'>
                          <button
                            className='bg-gray-300 rounded-md px-3 py-1 text-orange-400 cursor-pointer'>
                              See details
                          </button>
                          
                          <select 
                            value={order?.orderStatus}
                            onChange={(e) => {
                              const newStatus = e.target.value;

                              if (newStatus === order?.orderStatus) return;

                              updateOrderStatus.mutate({
                                orderId: order._id,
                                status: newStatus,
                              });
                            }}

                            disabled={
                              order?.orderStatus === 'completed' ||
                              order?.orderStatus === 'cancelled' ||
                              updateOrderStatus.isPending
                            }

                            className='bg-primary rounded-md px-3 py-1 text-white cursor-pointer capitalize disabled:opacity-50'
                             >
                              <option value={order?.orderStatus}>{order?.orderStatus}</option>
                              {nextStatusMap[order.orderStatus]?.map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                  >
                                    {status}
                                </option>
                              ))}
                          </select>
                        </div>
                       </div>
                    )
                  })}
                </div>
              ): (
                <div className='my-5 flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                  <TbReceiptOff className='text-red-500' size={65} />
                  <p className='text-dark font-semibold text-xl'>No orders found</p>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>     
      </div>
    )}
    </section>
  )
}

export default Orders