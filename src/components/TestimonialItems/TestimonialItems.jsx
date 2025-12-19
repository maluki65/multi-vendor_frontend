import React from 'react';
import './TestimonialItems.css';
import { PiStarFill } from "react-icons/pi";


function TestimonialItems({testimonial}) {
  return (
    <div className='flex flex-col space-y-2 rounded-md p-4'>
      <span className='flex self-end'>
        {[ ...Array(testimonial.stars)].map((_, index) => (
          <PiStarFill
            key={index}
            className='text-secondary w-4 h-4 PIcon02'
          />
        ))}
      </span>
      <p className='text-white font-extralight text-base'>
        {testimonial?.text}
      </p>
      <div className='flex gap-4 items-center'>
        <img
          src={testimonial?.img}
          alt={testimonial?.name}
          loading='lazy'
          className='h-15 w-15 rounded-full'
        />
        <div className='flex flex-col'>
          <h2 className='text-base text-light'>
            {testimonial?.name}
          </h2>
          <p className='text-xs text-light'>
            {testimonial?.role}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TestimonialItems