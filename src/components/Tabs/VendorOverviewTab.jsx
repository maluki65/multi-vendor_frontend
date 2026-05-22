import React, { useState } from 'react';
import CountUp from 'react-countup';
import './Tabs.css';
import { motion, AnimatePresence } from 'framer-motion';
import { VendorSalesReportChart, VendorRevenueChart } from '..';
import { IoCalendarOutline, IoChevronForward } from 'react-icons/io5'; 'react-icons/md';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import { FaRecordVinyl } from 'react-icons/fa';
import useAnalytics from '../../Hooks/useAnalytics';
import { useAuth } from '../../Context/AuthContext';

function VendorOverviewTab() {

  const { userData } = useAuth();
  const role = userData?.role;
  const { getVendorAnalytics } = useAnalytics(role);
  const { data, isLoading } = getVendorAnalytics; 

  console.log('Analytics:', data);

  const revenue = (data?.totalRevenue || 0) / 100;
  const commission = (data?.totalCommission || 0) / 100;

  const revenueTrend = data?.revenueTrend || 0;
  const platformCommissionTrend = data?.commissionTrend || 0;

  const revenueIncrease = revenueTrend >= 0;
  const commissionIncrease = platformCommissionTrend >= 0;

  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  
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
          <div className='rounded-full border-2 border-gray-300 py-1 px-3 gap-2 flex items-base w-fit text-gray-600 IContainer'>
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
              <p className='text-white text-md'>
                Sales revenue {' '}
                {data?.hasCurrentRevenue ? (
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
                    No sales recorded this
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
                  {revenueIncrease ? '+' : '-'}
                  {Math.abs(revenueTrend)}
                </span>
                from last month
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
              ): (
                <FaArrowTrendDown className='text-red-500'/>
              )}

              <span 
                className={
                  commissionIncrease
                    ? 'text-green-400'
                    : 'text-red-500'
                }
                >
                  {data?.hasCurrentCommission ? (
                    <span className='flex items-center gap-4'>
                      <span className=''>
                        {commissionIncrease ? '+' : '-'}
                        {Math.abs(platformCommissionTrend)}%
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
            className='grid grid-cols-1 gap-2 my-2 overflow-y-auto overflow-x-hidden PaymentChart'>
            <div className='flex flex-col gap-2'>
              <div className='bg-white rounded-xl p-2 shadow-sm w-full min-h-[260px] charts01'>
                <h3 className='text-sn font-medium mb-3'>Revenue</h3>
                <VendorRevenueChart 
                  data={data?.monthlyRevenue || []}
                />
              </div>
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
          <VendorSalesReportChart 
            data={data}
          />
          <p className='text-muted text-center mb-2'>
            Overview of how key performance metrics are distributed
          </p>
          <div className='grid grid-cols-3 items-center gap-1'>
            <div className='flex items-center gap-1 Ctext'>
              <span className='flex items-center rounded-md bg-[#22c55e] p-2'></span>
              <span className='text-sm text-muted'>Earnings</span>
            </div>
            <div className='flex items-center gap-1 Ctext'>
              <span className='flex items-center rounded-md bg-[#fbbf24] p-2'></span>
              <span className='text-sm text-muted'>Orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorOverviewTab