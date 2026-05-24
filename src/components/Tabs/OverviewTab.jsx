import React, { useState } from 'react';
import './Tabs.css';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentItem, SalesChart, RevenueChart, AdLoader } from '..';
import { PaymentsRequests } from '../../commons';
import { IoCalendarOutline, IoChevronForward } from 'react-icons/io5';
import { MdOutlineProductionQuantityLimits, MdOutlineErrorOutline } from 'react-icons/md';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import usePendingVendors from '../../Hooks/usePendingVendors';
import { FaRecordVinyl } from "react-icons/fa";
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosSearch } from 'react-icons/io';
import { useAuth } from '../../Context/AuthContext';
import useAnalytics from '../../Hooks/useAnalytics';
import { Toaster } from 'react-hot-toast';
import CountUp from 'react-countup';

function OverviewTab() {
  const [now, setNow] = React.useState(new Date());
  
  const { userData } = useAuth();
  const role = userData?.role;
  
  const { data, isLoading, isError } = usePendingVendors();
  
  const { getAdminAnalytics } = useAnalytics(role);
  const { data: adminAnalytics, isLoading: isAnalyticsLoading, isError: isAnalyticsError } = getAdminAnalytics;
  
  console.log('Admin analytics:', adminAnalytics);
  const commission = (adminAnalytics?.totalPlatformCommission || 0) / 100;
  const revenue = (adminAnalytics?.totalRevenue || 0) / 100;

  const revenueTrend = adminAnalytics?.revenueTrend || 0;
  const commissionTrend = adminAnalytics?.commissionTrend || 0;

  const revenueIncrease = revenueTrend >= 0;
  const commissionIncrease = commissionTrend >= 0;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getFirstTwoChars = (name) => {
    return name.slice(0,2).toUpperCase();
  }
  
  const formatDate = (date) => {
    const day = date.getDate();
    const year = date.getFullYear();

    const month = date.toLocaleString('en-US', { month: 'long'});

    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10 ) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinal(day)} ${month} ${year}`;
  };

  const formatDateTime = (date) => {
    const formattedDate = formatDate(date);

    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} • ${formattedTime}`;
  }

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      {isAnalyticsLoading && (
        <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
          <AdLoader/>
        </div>
      )}
      <div className='grid grid-cols-[75%_25%] gap-3 bg-transparent overview'>
        <div className='flex flex-col gap-4 border-r-2 border-gray-300 px-2 OverCard'>
          <div className='flex items-end justify-between DashIntro'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-xl text-black font-medium leading-relaxed HDash'>
                Dashboard
              </h1>
              <p className='text-md text-gray-500 PDash'>
                An easy way to manage vendors, orders and buyers with ease
              </p>
            </div>
            <div className='rounded-full border-2 border-gray-300 py-1 px-3 flex items-base w-fit gap-2 text-gray-600 IContainer'>
              <IoCalendarOutline className='Icon' size={20}/>
              <p className='text-sm cal'>{formatDateTime(now)}</p>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-2 AnaCards'>
            <div className='rounded-xl border-gray-300 p-2 bg-dark'>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center gap-1'>
                  <div className='bg-red-300 text-md p-1 rounded-full flex items-center'>
                  <FaRecordVinyl className='text-red-400' size={10}/>
                  </div>
                  <p className='text-sm text-white'> Update</p>
                </div>
                <p className='text-sm text-primary'>{formatDate(now)}</p>
                <p className='text-white text-md'>Sales revenue {' '}
                  {adminAnalytics?.hasCurrentRevenue ? (
                    <>
                      <span className='text-primary'>
                        {revenueIncrease ? 'increased' : 'decreased'}
                      </span>
                      {' '} by {' '}
                      <span className='text-primary'>
                        {Math.abs(revenueTrend)}%
                      </span>
                      {' '} this month
                    </>
                  ) : (
                    <span className='text-primary'>
                      No sales recorded this month
                    </span>
                  )}
                </p>
                <a className='text-[#ada9a9] text-sm flex items-center cursor-pointer hover:underline'>
                see more <IoChevronForward/>
                </a>
              </div>
            </div>
            <div className='rounded-xl border-2 border-gray-300 bg-white p-2 flex flex-col space-y-2 justify-between'>
              <div className='flex items-center justify-between'>
                <h3 className='text-md text-gray-800'>Total Revenue</h3>
                <BiDotsHorizontalRounded className='cursor-pointer Icon' size={20}/>
              </div>
              <h1 className="text-3xl font-semibold">
                <sup className="text-sm align-super mr-1">Ksh</sup>
                <CountUp
                  end={revenue}
                  duration={1.5}
                  separator=','
                  decimal={0}
                />
              </h1>
              <p className='text-sm flex items-center gap-2 text-[#787777]'>
                {revenueIncrease ? (
                  <FaArrowTrendUp className='text-green-400'/>
                ) : (
                  <FaArrowTrendDown className='text-red-500'/>
                )}

                <span 
                className={
                  revenueIncrease
                    ? 'text-green-400'
                    : 'text-red-500'
                }
                >
                  {adminAnalytics?.hasCurrentRevenue ? (
                    <span className='flex items-center gap-4'>
                        <span className=''>
                          {revenueIncrease ? '+' : '-'}
                          {Math.abs(revenueTrend)}%
                        </span>
                        <span className='text-[#787777]'>
                        from last month
                        </span>
                      </span>
                    ) : (
                      'No revenue this month'
                    )}
                </span>
              </p>
            </div>
            <div className='rounded-xl border-2 border-gray-300 bg-white p-2 flex flex-col space-y-2 justify-between'>
              <div className='flex items-center justify-between'>
                <h3 className='text-md text-gray-800'>Platform Commission</h3>
                <BiDotsHorizontalRounded className='cursor-pointer Icon' size={20}/>
              </div>
              <h1 className="text-3xl font-semibold">
                <sup className="text-sm align-super mr-1">Ksh</sup>
                <CountUp
                  end={commission}
                  duration={1.5}
                  separator=','
                  decimal={0}
                />
              </h1>
              <p className='text-sm flex items-center gap-2 text-[#787777]'>
                {commissionIncrease ? (
                  <FaArrowTrendUp className='text-green-400'/>
                ) : (
                  <FaArrowTrendDown className='text-red-500'/>
                )}

                <span 
                  className={
                    commissionIncrease
                      ? 'text-green-400'
                      : 'text-red-500'
                  }
                  >
                    {adminAnalytics?.hasCurrentCommission ? (
                      <span className='flex items-center gap-4'>
                        <span className=''>
                          {commissionIncrease ? '+' : '-'}
                          {Math.abs(commissionTrend)}%
                        </span>
                        <span className='text-[#787777]'>
                          from last month
                        </span>
                      </span>
                    ) : (
                      'No commission this month'
                    )}
                  </span>
              </p>
            </div>
          </div>
          <AnimatePresence mode='wait'>
            <motion.div 
              initial={{opacity: 0, scale: 0.95}}
              animate={{ opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
              transition={{duration: 0.3}}
              className='grid grid-cols-2 gap-2 my-2 overflow-y-auto overflow-x-hidden PaymentChart'>
              <div className='rounded-xl border-2 border-gray-300 p-2 flex flex-col gap-1 paymentsReq'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-md text-dark'>Payment requests</h1>
                  <BsThreeDots className='cursor-pointer Icon' size={20}/>
                </div>
                <div className='relative flex w-full py-2 h-[52px] PayIn'>
                  <input
                    type='text'
                    placeholder='search for payment requests'
                    required
                    className='w-full p-2 border-[1.5px] border-gray-400 rounded-md focus:outline-none focus:border-orange-400'
                  />
                  <span
                    className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700'
                  >
                    <IoIosSearch className='Icon' size={20}/>
                  </span>
                </div>
                <div className='flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1 PayItems'>
                  {PaymentsRequests.map((items, index) =>(
                    <PaymentItem key={index} payments={items}/>
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-2 min-h-[260px]'>
                <div className='bg-white rounded-xl p-2 shadow-sm w-full charts01'>
                  <h3 className='text-sn font-medium mb-3'>Revenue</h3>
                  <RevenueChart 
                    data={adminAnalytics?.monthlyRevenue || []
                  }
                  />
                </div>
                {/*<div className='bg-white rounded-xl p-2 shadow-sm w-full'>
                  <h3 className='text-sn font-medium mb-3'>Sales Report</h3>
                  <SalesChart />
                </div>*/}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='flex flex-col gap-2 my-2 overflow-y-auto overflow-x-hidden salesContainer'>
          <div className='bg-white rounded-xl p-2 shadow-sm w-full overflow-hidden salesRev'>
            <div className='flex flex-col gap-2 px-4'>
            <h3 className='text-md font-medium text-center'>Total Sales Report</h3>
            <hr className='flex-1 border-t border-gray-300' />
            </div>
            <SalesChart 
              data={adminAnalytics}
            />
            <p className='text-muted text-center mb-2'>
              Overview of how key performance metrics are distributed
            </p>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='flex items-center gap-1 Ctext'>
                <span className='flex items-center rounded-md bg-[#84cc16] p-2'></span>
                <span className='text-sm text-muted'>Orders</span>
              </div>
              <div className='flex items-center gap-1 Ctext'>
                <span className='flex items-center rounded-md bg-[#22c55e] p-2'></span>
                <span className='text-sm text-muted'>Products sold</span>
              </div>
              {/*<div className='flex items-center gap-1 Ctext'>
                <span className='flex items-center rounded-md bg-[#fbbf24] p-2'></span>
                <span className='text-sm text-muted'>Products</span>
               </div>*/}
            </div>
          </div>
          <div className='p-3 rounded-xl bg-muted vendors'>
            <h1 className=''>Vendor Approvals</h1>
            <div className='flex flex-col gap-2 max-h-[90px] overflow-y-auto pr-1 vendorItem'>
              {isLoading ? (
                <p className='text-dark'> loading vendor approvals...</p>
              ) : isError ? (
                <p className='text-dark text-sm  mt-2 flex flex-col justify-center items-center gap-2'>
                  <MdOutlineErrorOutline className='text-red-500' size={45} />
                  Failed to load vendor approvals
                </p>
              ) : (
                data.length === 0 ? (
                <p className='text-dark text-sm  mt-2 flex flex-col justify-center items-center gap-2'>
                  <MdOutlineProductionQuantityLimits className='text-red-500' size={45} />
                  No vendors awaiting approval
                </p>
              ) : (
                data.map((vendor) => (
                  <div
                    key={vendor._id}
                    className='flex justify-between items-center'
                  >
                    <p className='rounded-full items-center p-1 text-xs text-white bg-dark'>
                      {getFirstTwoChars(vendor.storeName || vendor.email)}
                    </p>

                    <div className='flex flex-col gap-1'>
                      <p className='text-xs font-medium text-dark'>
                        {vendor.storeName || 'No store name'}
                      </p>
                      <p className='text-[#525151] text-xs'>
                        {vendor.email}
                      </p>
                    </div>

                    <BsThreeDotsVertical
                      className='cursor-pointer Icon'
                      size={20}
                    />
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OverviewTab