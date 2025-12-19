import React from 'react';
import './ProdCardItems.css';
import { PiStarFill } from "react-icons/pi";

function ProdCardItems({ prodCard }) {

  const sizeClasses = {
    sm: 'h-40 md:h-48',
    md: 'h-52 md:h-64',
    lg: 'h-64 md:h-80',
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className={`rounded-3xl overflow-hidden group relative ${sizeClasses[prodCard?.size]}`}>
        <img 
          src={prodCard?.image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:rotate-1 group-hover:scale-[1.03]"
          alt={prodCard?.title}
        />
      </div>
      <div className="px-2.5">
        <div className='flex justify-between items-center '>
          <h3 className="text-sm font-semibold text-dark">{prodCard?.title}</h3>
          <p className="font-semibold">${prodCard?.price}</p>
        </div>
        <span className="flex">
          {[...Array(prodCard.rating)].map((_, index) => (
            <PiStarFill
              key={index}
              className='text-secondary w-4 h-4 SIcon'/>
          ))}
        </span>
      </div>
    </div>
  )
}

export default ProdCardItems