import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './vendorTabs.css';
import useOrders from '../../Hooks/useOrders';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AdLoader, VerifyDoc, TableSkeleton } from '../';
import { MdOutlineSort } from "react-icons/md";
import { debounce } from 'lodash';
import { TbReceiptOff, TbTruckDelivery, TbCancel } from "react-icons/tb";
import { PiReceiptX } from "react-icons/pi";
import { IoCheckmarkDone } from "react-icons/io5";
import { BiStopwatch } from "react-icons/bi";
import { LuFileCheck } from "react-icons/lu";
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { HiOutlineDotsHorizontal } from "react-icons/hi";

function Orders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest');
  const [debouncedSearch, setDebouncedSearch] = useState('');  
  const [selectedOrder, setSelectedOrder] = useState(null);

  const menuRef = useRef(null);
  const { data: me } = useCurrentUser();

  const { getAllOrders, getVendorOrder, updateOrderStatus } = useOrders();
  
  //const { data: orderStatus, isLoading: statusLoading, isError: statusError } = updateOrderStatus();
  const orderQuery = me?.role === 'Admin' 
    ? getAllOrders({
      page,
      limit: 6,
      search: debouncedSearch,
    })
    : getVendorOrder({
      page,
      limit: 6,
      search: debouncedSearch,
    });

  const { data, isLoading, isFetching, isError } = orderQuery;

  const orders = data?.orders || [];
  console.log('orders:', orders);

  const  totalPages = data?.totalPages || 1

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
    { name: 'Processing', value: 'processing', statuses: ['pending', 'processing', 'shipped'] },
    { name: 'Completed', value: 'completed', statuses: ['completed'] },
  ]

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500),
    []
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

  const filteredOrders = useMemo(() => {
    const currentTab = orderTabs.find(
      (tab) => tab.value === activeTab
    );

    let filtered = orders;

    if (currentTab && activeTab !== 'all') {
      filtered = orders.filter((order) => currentTab.statuses.includes(order.orderStatus));
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortOrder === 'latest'
       ? dateB - dateA
       : dateA  - dateB;
    });

    return sorted
  }, [orders, activeTab, sortOrder]);

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
      bg: 'bg-yellow-200 text-dark',
      icon: <LuFileCheck />,
    },
    processing: {
      bg: 'bg-yellow-200 text-dark',
      icon: <BiStopwatch />,
    },
    shipped: {
      bg: 'bg-yellow-200 text-dark',
      icon: <TbTruckDelivery />,
    },
    completed: {
      bg: 'bg-green-200 text-dark',
      icon: <IoCheckmarkDone />,
    },
    cancelled: {
      bg: 'bg-red-200 text-dark',
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

  const handleViewOrder = (order) => {
    setOpenMenuId(null);
    setSelectedOrder(order);
    setModalOpen(true);
  }

  const currentStatus = statusConfig[selectedOrder?.orderStatus] || {
    bg: 'bg-gray-300 text-dark',
    icon: null
  };

  const settlementStatusStyles = {
    pending: 'bg-yellow-200 text-yellow-600',
    processing: 'bg-blue-200 text-blue-600',
    settled: 'bg-green-200 text-green-600',
    failed: 'bg-red-200 text-red-600',
    cancelled: 'bg-gray-200 text-gray-600',
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className='overflow-hidden'>
      <Toaster position='top-right' reverseOrder={false} />
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
          <div className='flex gap-3 items-center orderSortInput'>
            <button
              onClick={() =>
                setSortOrder((prev) =>
                  prev === 'latest' ? 'oldest' : 'latest'
                )
              }
              className='p-1 rounded bg-gray-200 flex items-center gap-1 cursor-pointer'
            >
              <MdOutlineSort className='' size={23} />

              <span className='text-xs text-dark capitalize'>
                {sortOrder}
              </span>
            </button>
            <input 
              type='text'
              value={search}
              onChange={handleSearchChange}
              placeholder='Search by order Id...'
              className='p-1 outline-none bg-gray-200 focus:border-[1.2px] focus:border-orange-400 rounded-lg'
            />
          </div>
        </div>

        <AnimatePresence mode='wait'>
          <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.3 }}
           className='my-5 w-full min-h-[50vh] orderTableLarge'>
            {isLoading && (
              <TableSkeleton
                rows={8}
                columns={[
                  'Order ID',
                  'Settled',
                  'Amount',
                  'Status',
                  'Created At',
                  ''
                ]}   
              />   
            )}

            {isError && (
              <div className='h-full justify-center text-center text-gray-500 flex flex-col items-center gap-2'>
                <PiReceiptX className='text-red-500' size={65} />
                <p className='text-red-500'>Failed to get orders!</p>
              </div>
            )}

            {!isLoading && !isError && (
              filteredOrders.length > 0 ? (
                <table className='w-full border-[1.4px] border-gray-300 border-separate border-spacing-0 rounded-lg overflow-x-auto mt-4'>
                  <thead className=''>
                  <tr className='bg-orange-400 text-left text-sm text-dark rounded-lg font-light'>
                      <th className='p-3 rounded-tl-lg'>Order ID</th>
                      <th className='p-3'>Settlement</th>
                      <th className='p-3'>Amount</th>
                      <th className='p-3'>Status</th>
                      <th className='p-3'>Created At</th>
                      <th className='p-3 rounded-tr-lg'></th>
                    </tr>
                  </thead>
                  <tbody className=''>
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
                      <tr
                        key={order?._id}
                        className='last:[&>td]:border-b-0 [&>td]:border-b-[1.2px] [&>td]:border-gray-300 text-gray-500 text-md'
                        >
                          <td className='p-3'>
                            {order?.orderNumber}
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-sm rounded-full px-2 py-1 font-medium ${
                                settlementStatusStyles[order?.settlementStatus] ??
                                "bg-yellow-200 text-yellow-600"
                              }`}
                            >
                              {order?.settlementStatus || "pending"}
                            </span>
                          </td>
                          <td className='p-3'>
                            ksh {(order?.totalAmount / 100).toLocaleString()}
                          </td>
                          <td className='p-3'>
                            <span className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 w-fit capitalize ${currentStatus.bg}`}>
                              {currentStatus.icon}
                              {order?.orderStatus}
                            </span>
                          </td>
                          <td className='p-3'>
                            {orderDate.date}
                          </td>

                          <td className='p-3 relative'>
                            <HiOutlineDotsHorizontal
                              className='cursor-pointer'
                              size={24}
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === order._id ? null : order._id
                                )
                              }
                            />

                            <AnimatePresence>
                              {openMenuId === order?._id && (
                                <motion.div  
                                  ref={menuRef}
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  transition={{ duration: 0.15 }}
                                  className='absolute right-8 top-8 z-50 min-h-[60px] rounded-lg min-w-[100px] border-[1.3px] border-gray-400 bg-white shadow-lg overflow-hidden p-2'>
                                    <button
                                      className='cursor-pointer w-full my-1 rounded-md text-center hover:bg-gray-100'
                                      onClick={() => handleViewOrder(order)}
                                      >
                                        view
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
                                        className='bg-primary text-white rounded-md px-3 py-1 cursor-pointer disabled:opacity-50'
                                        >
                                          <option value={order?.orderStatus}>{order?.orderStatus}</option>
                                          
                                          {nextStatusMap[order?.orderStatus]?.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                          ))}
                                        </select>
                                  </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </tr>
                    )
                    })}
                  </tbody>
                </table>
              ): (
                <div className='my-5 flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                  <TbReceiptOff className='text-red-500' size={65} />
                  <p className='text-dark font-semibold text-xl'>No orders found!</p>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>   

        <AnimatePresence mode='wait'>
          <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.3 }}
           className='my-5 w-full min-h-[50vh] orderCardSmall flex justify-center items-center'>
            {isLoading && (
              <div className='fixed inset-0 flex items-center justify-center bg-white/90 z-50'>
                <AdLoader/>
              </div>
            )}

            {isError && (
              <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                <PiReceiptX className='text-red-500' size={65} />
                <p className='text-red-500'>Failed to get orders!</p>
              </div>
            )}

            {!isLoading && !isError && (
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
                       key={order?._id}
                       className='p-2 shadow-xs bg-gray-200 rounded-md'>
                        <div className='flex gap-2'>
                          <p className='bg-orange-400 rounded-md p-2 text-white text-lg font-semibold uppercase'>
                            {order?.buyerId.username.slice(0,2)}
                          </p>
                          <div className='flex flex-col gap-1 flex-1'>
                            <div className='flex w-full items-center justify-between'>
                              <p className='font-semibold text-base text-dark capitalize'>
                                {order?.buyerId.username}
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

                        <p className='flex items-center justify-between text-sm my-2 orderShipAdd'>
                          <span className='text-gray-700'>Shipping address:</span>
                          <span className='text-gray-500'>{order?.shippingAddress}</span>
                        </p>

                        <hr className='flex-1 border-t border-gray-300' />

                        <table className='w-full border-none my-2'>
                          <thead className=''>
                            <tr className=''>
                              <td className='text-sm text-gray-400 oderPopTd'>Name</td>
                              <td className='text-sm text-gray-400 text-center oderPopTd'>Qty</td>
                              <td className='text-sm text-gray-400 text-end oderPopTd'>Price</td>
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
                            onClick={() => handleViewOrder(order)}
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

        <VerifyDoc
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}  
          title={
            <div className='flex items-center gap-2'>
              <span className='text-gray-500 text-md'>Order:</span>
              <span className='font-semibold text-orange-400'>
                {selectedOrder?.orderNumber}
              </span>
            </div>
          }
          className='max-h-[80vh] overflow-y-auto'>
            <div className='flex flex-col space-y-2'>
              <div className='flex items-center justify-between'>
               <h1 className='text-dark font-semibold orderPopH'>
                Buyer Contacts
              </h1>
              <p className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 w-fit capitalize ${currentStatus.bg}`}>
                {currentStatus.icon}
                {selectedOrder?.orderStatus}
              </p>
              </div>
              <div className='flex items-center justify-between orderShipAdd'>
                <h2 className='text-dark flex items-center gap-2 orderPopH'>
                  Buyer: <span className='text-gray-600 capitalize'>
                  {selectedOrder?.buyerId?.username}
                  </span>
                </h2>
                <h2 className='text-dark flex items-center gap-2 orderPopH'>
                  Phone: <span className='text-gray-600'>
                  {selectedOrder?.buyerId?.buyerProfile.phone}
                  </span>
                </h2>
              </div>
              <h2 className='text-dark flex items-center gap-2 orderPopH'>
                Email: <span className='text-gray-600'>
                {selectedOrder?.buyerId?.email}
                </span>
              </h2>

              {me.role === 'Admin' && (
                <div className='flex flex-col space-y-2'>
                  <div className='flex items-center justify-between'>
                    <h1 className='text-dark font-semibold orderPopH'>
                      Vendor Contacts
                    </h1>
                  </div>
                  <div className='flex items-center justify-between orderShipAdd'>
                    <h2 className='text-dark flex items-center gap-2 orderPopH'>
                      Vendor: <span className='text-gray-600 capitalize'>
                      {selectedOrder?.vendorId?.businessInfo.legalName}
                      </span>
                    </h2>
                    <h2 className='text-dark flex items-center gap-2 orderPopH'>
                      Phone: <span className='text-gray-600'>
                      {selectedOrder?.vendorId?.store.contactPhone}
                      </span>
                    </h2>
                  </div>
                  <h2 className='text-dark flex items-center gap-2 orderPopH'>
                    Email: <span className='text-gray-600'>
                    {selectedOrder?.vendorId?.store.contactEmail}
                    </span>
                  </h2>
                </div>
              )}

              <h1 className='text-dark font-semibold my-2 orderPopH'>
                Order products:
              </h1>

              <table className='w-full border-none my-2'>
                <thead className=''>
                  <tr className=''>
                    <td className='text-sm text-gray-400 oderPopTd'>Name</td>
                    <td className='text-sm text-gray-400 text-center oderPopTd'>Qty</td>
                    <td className='text-sm text-gray-400 text-end oderPopTd'>Price</td>
                  </tr>
                </thead>

                <tbody className=''>
                  {selectedOrder?.products?.map((item) => {
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
                  Ksh {(selectedOrder?.totalAmount / 100).toLocaleString()}
                </p>
              </div>

              <p className='flex items-center justify-between text-base my-2 orderShipAdd'>
                <span className='text-dark'>Shipping address:</span>
                <span className='text-gray-700'>{selectedOrder?.shippingAddress}</span>
              </p>                     
            </div>
        </VerifyDoc>
      </div>
    </section>
  )
}

export default Orders