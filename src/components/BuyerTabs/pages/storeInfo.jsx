import React, { useState } from 'react'
import './../BuyerTabs.css';
import { useParams } from 'react-router-dom';
import { Inner } from '../../../commons';
import { BBanner02, logoIcon } from '../../../assets';
import { AdLoader, Footer } from '../../';
import useProducts from '../../../Hooks/useProduts';
import { MdError, MdRemoveShoppingCart } from 'react-icons/md';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import ProductSkeleton from '../BuyerItems/productSkeleton';
import ProductCard from '../BuyerItems/productCard';
import { IoStorefrontSharp } from "react-icons/io5";
import { AnimatePresence, motion } from 'framer-motion';
import { FaStoreSlash } from "react-icons/fa";
import { ReactLenis } from 'lenis/react';

function StoreInfo() {
  const [sortOrder, setSortOrder] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 12;
  
  const { storeSlug } = useParams();

  const { getStore } = useProducts();

  const { data, isLoading, isFetching, isError } = getStore(
    storeSlug,
    sortOrder,
    page,
    limit
  );

  const vendor = data?.vendor;
  const products = data?.products || [];
  const pagination = data?.pagination;

  //console.log('Vendor', vendor);
  //console.log('Products', products);

  if (isLoading) {
    return (
      <Inner>
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-60'>
          <AdLoader/>
        </div>
      </Inner>
    );
  }

  return (
    <Inner>
      <ReactLenis root>
        <section className='min-h-[35vh] w-full relative bg-gray-100'
          style={{
            backgroundImage: `url(${ vendor?.banner || BBanner02 })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            <div className='absolute bottom-5 right-8 z-10'>
              <div className='w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-md bg-white'>
                <img
                  src={vendor?.logo || logoIcon}
                  alt={vendor?.businessInfo?.legalName}
                  loading='lazy'
                  className='w-full h-full object-cover'
                />
              </div>
            </div>          
        </section>

        <section className='px-[2%] my-3 overflow-hidden min-h-[30vh]'>
          <div className='grid grid-cols-[35%_65%] gap-2 items-center'>
            <h1 className='px-3 py-2 rounded-full border-[1.4px] font-semibold border-dark w-fit m-3 hover:bg-gray-200 hover:text-primary hover:border-orange-400 flex items-center gap-2'>
              About {vendor?.businessInfo?.legalName}
              <span className=''>
                {vendor?.verification?.isverified === true ? (
                  <RiVerifiedBadgeFill className='text-primary' size={23} />
                ) : (
                  <p className=''/>
                )}
              </span>
            </h1>
            <p className='text-right px-4 font-medium text-dark tracking-wide'>
            Fascism is a far-right, authoritarian, and ultranationalist political ideology. It features a dictatorial leader, strict societal control, and the violent crushing of any opposition. The state or race comes before individual rights.
            </p> {/*{vendor?.store?.description}*/}
          </div>
        </section>

        <section className='px-[2%] my-5 overflow-hidden min-h-[30vh] bg-gray-200 py-5'>
          <h1 className='text-primary text-lg font-semibold text-right underline'> 
            Products 
          </h1>
          <div className='relative px-3'>
            <button
              onClick={() => setSortOpen(prev => !prev)}
              className='px-2 py-1 bg-white rounded-xl shadow-sm text-sm cursor-pointer hover:bg-primary hover:text-white'>
                {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>
            {sortOpen && (
              <div className='absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-50'>
                <button
                  onClick={() => {
                    setSortOrder('newest');
                    setPage(1);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                  sortOrder === 'newest'
                    ? 'font-medium text-primary'
                    : ''
                  }`}
                  >
                    Newest
                </button>

                <button
                  onClick={() => {
                    setSortOrder('oldest');
                    setPage(1);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                  sortOrder === 'oldest'
                    ? 'font-medium text-primary'
                    : ''
                  }`}
                  >
                    Oldest
                </button>
              </div>
            )}
          </div>
          <div className='p-2'>
            {isFetching && (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3'>
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            )}

            {isError && (
              <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                <IoStorefrontSharp className='text-red-500' size={45} />
                <p className='text-red-500'>Failed to load store products</p>
              </div>
            )}

            {!isLoading && !isFetching && !isError && (
              <AnimatePresence mode='wait'>
                <motion.div 
                  key={`${sortOrder} - ${page}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className='grid grid-cols-4 gap-2'>
                    {products.length > 0 ? (
                      products.map((product, index) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))
                    ) : (
                      <div className='col-span-full text-center text-gray-500 flex flex-col items-center gap-2'>
                        <FaStoreSlash className='text-red-600' size={45} />
                        <p className=''>No products found for this vendor</p>
                      </div>
                    )}
                </motion.div>
              </AnimatePresence>
            )}
            
          </div>

          {pagination?.totalPages > 1 && (
            <div className='flex justify-between items-center my-3 px-3'>
              <button
                disabled={!pagination.hasPreviousPage || isFetching}
                onClick={() => setPage(prev => prev - 1)}
                className='px-3 py-1 bg-white rounded border disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed'
                >
                  Prev
              </button>

              <span className='font-medium'>
                Page {pagination?.page} of {pagination?.totalPages}
              </span>

              <button
                disabled={!pagination.hasNextPage || isFetching}
                onClick={() => setPage(prev => prev + 1)}
                className='px-3 py-1 bg-white rounded border disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed'
                >
                  Next
              </button>
            </div>
          )}
        </section>

        <div className='p-2'>
          <Footer/>
        </div>
      </ReactLenis>
    </Inner>
  )
}

export default StoreInfo