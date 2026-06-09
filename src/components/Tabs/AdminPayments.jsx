import React, { useState, useEffect, useRef } from 'react';
import './Tabs.css';
import { motion, AnimatePresence } from 'framer-motion';
import useWallet from '../../Hooks/useWallet';
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { Toaster } from 'react-hot-toast';
import { AdLoader } from '../';
import { MdOutlineSort } from "react-icons/md";
import { PiContactlessPaymentLight, PiContactlessPaymentFill } from "react-icons/pi";
import { IoIosWarning } from "react-icons/io";
import { IoHourglassOutline, IoCheckmarkCircle, IoBan  } from "react-icons/io5";
import { TbPlayerEjectFilled } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

function AdminPayments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest');

  const menuRef = useRef(null);

  const { data: me } = useCurrentUser()

  const role = me?.role;
  const limit = 10;
  const { getPendingWithdrawalRequests } = useWallet(role);
  
  const { data: pendingRequests, isLoading, isError } = getPendingWithdrawalRequests(
    page,
    limit,
  )

  const paymentRequests = pendingRequests?.withdrawals || [];
  const totalPages = pendingRequests?.pagination?.totalPages;

  const statusConfig = {
    pending: {
      bg: 'bg-yellow-200',
      text: 'text-yellow-700',
      icon: IoHourglassOutline,
    },
    approved: {
      bg: 'bg-blue-300',
      text: 'text-blue-700',
      icon: IoCheckmarkCircle,
    },
    paid: {
      bg: 'bg-green-300',
      text: 'text-green-700',
      icon: PiContactlessPaymentFill,
    },
    rejected: {
      bg: 'bg-red-300',
      text: 'text-red-700',
      icon: TbPlayerEjectFilled,
    },
    cancelled: {
      bg: 'bg-gray-300',
      text: 'text-gray-700',
      icon: IoBan,
    },
    failed: {
      bg: 'bg-yellow-300',
      text: 'text-yellow-700',
      icon: IoIosWarning,
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    return `${String(date.getDate()).padStart(2, '0')}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleView = (request) => {
    console.log('View', request);
    setOpenMenuId(null);
  
    // Open modal here
  };
  
  const handleApprove = (request) => {
    console.log('Approve', request);
    setOpenMenuId(null);
  
    // Call approve mutation here
  };
  
  const handleReject = (request) => {
    console.log('Reject', request);
    setOpenMenuId(null);
  
    // Open rejection modal here
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  console.log('Request', paymentRequests);

  return (
    <section className='overflow-hidden'>
      <Toaster position='top-right' reverseOrder={false} />
      <div className='p-4 my-4 bg-white rounded-md'>
        <h1 className='text-dark font-semibold underline flex items-center gap-2'>
          <PiContactlessPaymentLight className='text-primary' size={35} />
          Payments requests
        </h1>
        <div className='flex gap-3 justify-end'>
          <button
            className='px-2 py-1 border-[1.3px] rounded cursor-pointer hover:border-primary hover:text-primary flex items-center gap-1'>
              <MdOutlineSort className='' size={22} />
              <span className='text-xs text-dark hover:text-primary capitalize'>
                {sortOrder}
              </span>
          </button>
          <input
            type='text'
            placeholder='Search by request UUID'
            className='p-1 outline-none  bg-gray-200 focus:border-[1.5px] focus:border-orange-400 rounded-lg'
          />
        </div>

        <motion.div
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0, scale: 0.95}}
          transition={{ duration: 0.3 }}
          className='h-[53vh] overflow-y-auto'
          >
            <table className='w-full border-[1.4px] border-gray-300 border-separate border-spacing-0 rounded-lg overflow-x-auto mt-4'>
              <thead className=''>
                <tr className='bg-gray-200 text-left text-sm text-gray-600 rounded-lg font-light'>
                  <th className='p-3 rounded-tl-lg'>Request ID</th>
                  <th className='p-3'>Vendor</th>
                  <th className='p-3'>Amount</th>
                  <th className='p-3'>Status</th>
                  <th className='p-3'>Created At</th>
                  <th className='p-3'></th>
                </tr>
              </thead>
              <tbody className=''>
                {paymentRequests.map((item) => {
                  const config = statusConfig[item?.status] ?? statusConfig.pending;
                  const Icon = config.icon;

                  return (
                    <tr
                      key={item._id}
                      className='last:[&>td]:border-b-0 [&>td]:border-b-[1.2px] [&>td]:border-gray-300 text-gray-500 text-md'
                      >
                        <td className='p-3'>
                          {item?.requestUUID}
                        </td>
                        <td className='p-3'>
                          {item?.vendorName}
                        </td>
                        <td className='p-3'>
                          Ksh {(item?.amount / 100).toLocaleString()}
                        </td>
                        <td className='p-3'>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
                            >
                            <Icon className='withEyeIcon23' size={15} />
                            {item?.status}
                          </span>
                        </td>
                        <td className='p-3'>
                          {formatDate(item?.createdAt)}
                        </td>
                        <td className='p-3 relative'>
                          <HiOutlineDotsHorizontal
                            className='cursor-pointer'
                            size={24}
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === item._id ? null : item._id
                              )
                            }
                          />

                          <AnimatePresence>
                            {openMenuId === item._id && (
                              <motion.div 
                                ref={menuRef}
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                transition={{ duration: 0.15 }}
                                className='absolute right-8 top-8 z-50 min-h-[100px] rounded-lg min-w-[100px] border-[1.3px] border-gray-400 bg-white shadow-lg overflow-hidden'
                                >
                                  <button
                                    className='cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100'
                                    onClick={() => handleView(item)}
                                    >
                                    View
                                  </button>
                                  <button
                                    className='cursor-pointer w-full text-left px-4 py-2 text-green-600 hover:bg-green-50'
                                    onClick={() => handleApprove(item)}
                                    >
                                    Approve
                                  </button>

                                  <button
                                    className='cursor-pointer w-full text-left px-4 py-2 text-red-600 hover:bg-red-50'
                                    onClick={() => handleReject(item)}
                                    >
                                    Reject
                                  </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </motion.div>

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

export default AdminPayments