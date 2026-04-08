import React, { useState, useMemo } from 'react';
import './HomeSwiperItems.css';

function ProductCard({ product }) {
  const [loaded, setLoaded] = useState(false);

  const shortDescription = useMemo(() => {
    return product?.description?.length > 30
      ? product.description.slice(0, 30) + '...'
      : product?.description;
  }, [product?.description]);

  return (
    <div className='rounded-md bg-yellow-50 flex flex-col space-y-2 overflow-hidden'>
      
      <div className='h-[170px] relative overflow-hidden prodCon009'>

        <img
          src={product?.MainIMg}
          alt=''
          className={`absolute inset-0 w-full h-full object-cover scale-110 blur-md transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <img
          src={product?.MainIMg}
          alt={product?.name}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ProdCarImg ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      </div>

      <div className='p-2 flex flex-col'>
        <h2 className='font-semibold leading-relaxed line-clamp-2 wrap-break-words prodName'>
          {product?.name}
        </h2>

        <p className='text-sm line-clamp-2'>{shortDescription}</p>

        <div className='flex flex-col'>
          <div className='flex items-center justify-between gap-2 DisCardText'>
            {product?.discount > 0 ? (
              <>
                <p className='text-md font-semibold text-secondary'>
                  Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.discountPrice / 100)}
                </p>

                <p className='text-sm font-medium text-red-500 line-through'>
                  Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.price / 100)}
                </p>                
              </>
            ) : (
              <p className='text-md font-semibold text-secondary'>
                Ksh{new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product?.price / 100)}
              </p>
            )}
          </div>
          <button className='px-2 py-1 bg-primary rounded-full text-sm text-gray-100 cursor-pointer'>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;