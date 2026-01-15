import React, {useState} from 'react';
import './Tabs.css';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCalendarOutline, IoChevronForward } from "react-icons/io5";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { FaRecordVinyl } from "react-icons/fa";

function OverviewTab() {
  const [now, setNow] = React.useState(new Date());

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

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='grid grid-cols-[65%_35%] gap-2 bg-transparent'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-xl text-black font-medium leading-relaxed'>
              Dashboard
            </h1>
            <p className='text-md text-gray-500'>
              An easy way to manage vendors, orders and buyers with ease
            </p>
          </div>
          <div className='rounded-full border-2 border-gray-300 py-1 px-3 flex items-base w-fit text-gray-600'>
            <IoCalendarOutline className='' size={20}/>
            <p className='text-sm'>{formatDateTime(now)}</p>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-2'>
        <div className='rounded-xl border-gray-300 p-2 bg-dark'>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center gap-1'>
              <div className='bg-red-300 text-md p-1 rounded-full flex items-center'>
               <FaRecordVinyl className='text-red-400' size={10}/>
              </div>
              <p className='text-sm text-white'> Update</p>
            </div>
            <p className='text-sm text-primary'>Jan 15th 2026</p>
            <p className='text-white text-md'>Sales revenue increased by <span className='text-primary'>40%</span> in 1 week</p>
            <a className='text-[#787777] text-sm flex items-center cursor-pointer hover:underline'>
             see more <IoChevronForward/>
            </a>
          </div>
        </div>
        <div className='rounded-xl border-2 border-gray-300 p-2 flex flex-col space-y-2 justify-between'>
          <div className='flex items-center justify-between'>
            <h3 className='text-md text-gray-800'>Net Income</h3>
            <BiDotsHorizontalRounded className='cursor-pointer' size={20}/>
          </div>
          <p className="text-3xl font-semibold">
            <sup className="text-sm align-super mr-1">Ksh</sup>
            23,000
          </p>
          <p className='text-sm flex items-center gap-2 text-[#787777]'>
            <FaArrowTrendUp className='text-green-400'/>
            <span className='text-green-400'>
              +34%
            </span> from last month
          </p>
        </div>
        <div className='rounded-xl border-2 border-gray-300 p-2 flex flex-col space-y-2 justify-between'>
          <div className='flex items-center justify-between'>
            <h3 className='text-md text-gray-800'>Total Return</h3>
            <BiDotsHorizontalRounded className='cursor-pointer' size={20}/>
          </div>
          <p className="text-3xl font-semibold">
            <sup className="text-sm align-super mr-1">Ksh</sup>
            35,000
          </p>
          <p className='text-sm flex items-center gap-2 text-[#787777]'>
            <FaArrowTrendDown className='text-red-500'/>
            <span className='text-red-500'>
              -24%
            </span> from last month
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}

export default OverviewTab