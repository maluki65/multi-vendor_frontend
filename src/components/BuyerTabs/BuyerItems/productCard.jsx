import React, { useMemo } from 'react';
import './HomeSwiperItems.css';

function ProductCard({ product }) {
  const shortDescription = useMemo(() => {
    return product?.description?.length > 30
     ? product.description.slice(0, 30) + '...'
     : product?.description;
  }, [product?.description]);

  return (
    <div className='rounded-md bg-yellow-50  flex flex-col space-y-2'>
      <div className='h-[170px]'>
        <img
          src={product?.MainIMg}
          alt={product?.name}
          className='rounded-t-md h-full w-full object-cover'
        />
      </div>
      <div className='p-2 flex flex-col '>
        <h2 className='font-semibold leading-relaxed'>
          {product?.name}
        </h2>
        <p className='text-sm'>{shortDescription}</p>
        <div className='flex items-center justify-between my-2 priCart'>
          <p className='text-md font-semibold text-secondary'>
            Ksh{product?.price.toLocaleString()}
          </p>
          <button className='px-2 py-1 bg-primary rounded-full cursor-pointer text-sm text-gray-100'>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard