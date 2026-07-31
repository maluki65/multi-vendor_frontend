import React, { useState } from 'react';
import '../BuyerTabs.css';
import { Inner } from '../../../commons';
import { cartB12 } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import useWishlist from '../../../Hooks/useWishlist';
import { Toaster } from 'react-hot-toast';
import { WishlistTable, Footer } from '../../';

function Wishlist() {
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const { 
    wishlist,
    totalWishlistItems, 
    isLoading,
    isError,
    removeFromWishlist,
    clearWishlist,
    pagination,
  } = useWishlist(page, 10);

  //console.log('Wishlist:', wishlist);

  return (
    <Inner>
      <Toaster position='top-right' reverseOrder={false} />
      <section className='min-h-[30vh] flex flex-col justify-center items-center overflow-hidden'
        style={{
          backgroundImage: `url(${cartB12})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          <h1 className='font-semibold text-4xl text-dark leading-relaxed PathName'>
            Wishlist
          </h1>
          <span className='flex items-center gap-1'>
            <a 
              onClick={() => navigate('/buyer/products')}
              className='text-gray-700 hover:text-primary cursor-pointer path'>
              Home
            </a>
            <a className='text-gray-700 path'>
              / Wishlist
            </a>
          </span>
      </section>

      <section className='min-h-[60vh] px-[3%] my-5 overflow-hidden'>
        <WishlistTable
          wishlist={wishlist}
          totalWishlistItems={totalWishlistItems}
          isLoading={isLoading}
          isError={isError}
          removeFromWishlist={removeFromWishlist}
        />
        <div className='flex justify-between items-center CatNav mt-4'>
            <button 
              disabled={!pagination?.hasPrevPage} 
              onClick={() => setPage((p) => p - 1)}
              className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
                >
                Prev
            </button>
            <span className=''>
              Page {pagination?.page} of {pagination?.totalPages}
            </span>
            <button 
              disabled={!pagination?.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
              >
                Next
            </button>
          </div>
      </section>

      <section className='min-h-[20vh] px-[3%] my-5 overflow-hidden'>
        {wishlist.length > 0 ? (
          <div className='my-3 px-[3%] flex items-center justify-between clearWishlisxtCon'>
            <div className='flex gap-3 items-center'>
              <a className='text-dark text-base font-semibold underline hover:text-primary cursor-pointer'>
                Wishlink link:
              </a>
              <span className='rounded-full px-3 py-2 border border-gray-400 text-gray-700 text-sm flex flex-wrap'>
                https://www.sellory/com/buyer/879843/wishlist
              </span>
              <button
                className='rounded-full bg-dark text-white px-3 py-2 cursor-pointer hover:bg-orange-400'>Copy Link</button>
            </div>

            <a 
            onClick={() => clearWishlist.mutate()}
            className='text-dark text-base underline hover:text-primary font-semibold cursor-pointer'>
              Clear Wishlist
            </a>
          </div>
        ): (
          <div className=''></div>
        )}
      </section>

      <div className='p-2'>
       <Footer/>
      </div>
    </Inner>
  )
}

export default Wishlist