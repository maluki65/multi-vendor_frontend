import React from 'react';
import './HomeSwiperItems.css';

function ProductSkeleton() {
  return (
    <div className='rounded-md bg-gray-100 overflow-hidden animate-pulse'>
      <div className='h-[170px] w-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer'/>
      <div className='p-2 space-y-2'>
        <div className='h-4 w-3/4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded'/>

        <div className='h-3 w-full bg-lienar-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded' />
        <div className='h-3 w-5/6 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded'/>

        <div className='flex justify-between items-center pt-2'>
          <div className='h-4 w-16 bg-lienar-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded' />
          <div className='h-6 w-20 bg-lienar-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-full' />
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton