import React from 'react';
import './ProductItems.css';
import { PiStarFill } from "react-icons/pi";
import { CiHeart } from "react-icons/ci";
import { TbShoppingBagCheck } from "react-icons/tb";

function ProductItems({product}) {
  return (
    <div className='rounded-[10px] bg-dark p-1 shadow-[0px_2px_5px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col gap-2 space-y-1'>
      <div className='h-[60%] relative rounded-md bg-light flex justify-center items-center PIContainer'>
        <img
          src={product?.image}
          alt={product?.name}
          loading='lazy'
          className='rounded-[10px] h-45'  
        />
        <div className='absolute inset-0 p-2 flex justify-end'>
          <span className='bg-dark h-fit p-1 rounded-full'>
           <CiHeart className='text-light flex justify-center items-center cursor-pointer transition-all duration-100 ease-in-out hover:text-secondary hover:rotate-180 PIcon' strokeWidth={1} size={20} />
          </span>
        </div>
      </div>
      <span className='flex '>
        {[ ...Array(product.stars)].map((_, index) => (
          <PiStarFill
            key={index}
            className='text-secondary w-4 h-4 PIcon02'
          />
        ))}
      </span>
      <p className='text-light w-full ptext'>
        {product.name}
      </p>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-secondary text-base ptext'>
          Ksh.{product.price}
        </h2>
        <span className='flex items-center bg-light p-1 rounded-md cursor-pointer'>
         <TbShoppingBagCheck className='text-dark hover:text-secondary PIcon' size={30}/>
        </span>
      </div>
    </div>
  )
}

export default ProductItems