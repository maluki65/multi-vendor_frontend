import React from 'react'
import './BannerCardItems.css'

function BannerCardItems({banner}) {
  return (
    <div className='grid grid-cols-2 gap-2 items-center justify-between bg-[#ebe7e7] rounded-xl BContainer'>
      <div className='flex flex-col gap-2 p-2 BSText'>
        <h1 className='text-dark font-sans text-3xl text-wrap  leading-relaxed w-[50%]'>
          {banner?.heading}
        </h1>
        <p className='text-[#787676] text-wrap w-[70%]'>
          {banner?.para}
        </p>
        <button className='border border-[#b8b6b6] rounded-full p-1 text-sm cursor-pointer text-[#3a3939] w-fit'>
          Shop Now
        </button>
      </div>
      <div className='flex items-center h-[25vw] justify-center p-3 BSImg'>
        <img
         loading='lazy'
         src={banner?.img}
         alt={banner?.heading}
         className='w-full h-full object-contain'
        />
      </div>
    </div>
  )
}

export default BannerCardItems