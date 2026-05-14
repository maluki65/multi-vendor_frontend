import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './vendorTabs.css';
import useOrders from '../../Hooks/useOrders';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AdLoader } from '../';
import { MdOutlineSort } from "react-icons/md";
import { debounce } from 'lodash';
import { TbReceiptOff } from "react-icons/tb";
import { PiReceiptX } from "react-icons/pi";

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

  const formatDate = (date = new Date()) => {
    const formatted = date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month:'short',
      year: 'numeric',
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

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

  return (
    <>
    <Toaster position='top-right' reverseOrder={false} />
    {isLoading ? (
      <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
        <AdLoader/>
      </div>
    ) : (
      <div className='p-4 rounded-md my-5 bg-white'>
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold text-dark text-lg'>Orders</h2>
          <p className='font-medium text-dark text-sm'>{formatDate()}</p>
        </div>

        <div className='my-4 flex items-center justify-between px-2'>
          <div className='flex gap-3'>
            {orderTabs.map((item, index) => {
              return (
                <div 
                  key={index}
                  onClick={() => setActiveTab(item.value)}
                  className={`rounded-md bg-gray-200 px-3 py-1 text-dark font-medium cursor-pointer ${item.value === activeTab ? 'bg-orange-400 text-white' : ''}`}
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
                <div className='grid grid-cols-3 gap-3'></div>
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
    </>
  )
}

export default Orders