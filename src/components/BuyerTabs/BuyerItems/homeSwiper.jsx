import React from 'react';
import './HomeSwiperItems.css';

function HomeSwiperItems({ DashItem }) {
  return (
    <div className='h-full bg-gray-100 grid grid-cols-2 gap-4 p-6 items-center DashItems'>
      <div className='flex flex-col justify-center gap-4 DashHeading'>
        <h1 className='font-semibold text-5xl leading-tight'>
          {DashItem.title}
        </h1>
        <p className='text-base'>
          {DashItem.pTag}
        </p>
        <button 
          className='w-fit px-3 py-1 text-base rounded cursor-pointer border-[1.5px] transition-0.3 hover:border-secondary font-medium'>
            View more
          </button>
      </div>
      <div className='flex justify-center items-center DashImg901'>
        <img
          src={DashItem.img}
          alt={DashItem.title}
          className='max-h-[450px] object-cover'
        />
      </div>
    </div>
  )
}

export default HomeSwiperItems