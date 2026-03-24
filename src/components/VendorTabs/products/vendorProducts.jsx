import React, { useState, useMemo, useEffect, useCallback } from 'react';
import '../vendorTabs.css';
import { AdLoader } from '../..';
import { debounce } from 'lodash';
import { TbShoppingBagX } from "react-icons/tb";
import { toast, Toaster } from 'react-hot-toast';
import useProducts from '../../../Hooks/useProduts';
import { motion, AnimatePresence } from 'framer-motion';

function vendorProducts({ vendorId }) {  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSetSearch = useMemo(
    () => debounce((val) => {
      setSearch(val);
      setPage(1);
    }, 300),
    []
  );

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchInput(val);          
    debouncedSetSearch(val);       
  }, [debouncedSetSearch]);

  const { getVendorProducts } = useProducts();
  const { data, isLoading } = getVendorProducts(vendorId, page, search);

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  //On filtering based on moderation status
  const filteredProducts = useMemo(() => {
    if (statusFilter === 'all') return products;
    return products.filter(
      (p) => p.moderationStatus === statusFilter
    );
  }, [products, statusFilter]);

  console.log('counts', data?.counts)

  const counts = data?.counts || { all: 0, pending: 0, approved: 0, rejected: 0 };
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
  
    return () => clearTimeout(timeout);
  }, [searchInput]);

  return (
    <>
      <Toaster position='top-right' reverseOrder={false}/>
      {isLoading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader/>
        </div>
      ): (
        <div className='p-4 bg-gray-300 my-4 rounded-md'>
          <div className='flex gap-2 mb-4 items-center justify-center p-2 rounded'>
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1 text-sm cursor-pointer rounded-lg capitalize ${
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-200'
                }`}
              >
                {status} ({counts[status]})
              </button>
            ))}
          </div>

          <div className=''>
            <input
              type='text'
              placeholder='Search by name...'
              value={searchInput}
              onChange={handleSearchChange}
              className='p-2 outline-none SeaProd w-[30%] my-3 border-[1.5px]  focus:border-[1.5px] focus:border-orange-400 rounded-lg'
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className='flex justify-center items-center h-[75vh]'>
              <div className='flex flex-col gap-3  items-center justify-center'>
                <TbShoppingBagX  className='text-red-500' size={50}/>
                <p className=''> No products found</p>
              </div>
            </div>
          ): (
            <>
              <div className="grid grid-cols-4 gap-2 prodCardsV">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div 
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className='p-1 bg-white rounded-md shadow-sm flex flex-col gap-2 venProdCard'
                      >
                        <div className='h-40 w-full rounded-md'>
                          <img
                            src={product?.MainIMg}
                            alt={product?.slug}
                            className='h-full w-full rounded-md shadow-md object-cover'
                          />
                        </div>
                        <div className='p-2 flex flex-col space-y-1'>
                          <div className='flex items-center justify-between'>
                          <p className='text-md'>{product?.name}</p>
                          <span 
                            className={`p-1 text-xs rounded-full ${product.moderationStatus === 'approved'
                              ? 'bg-green-600'
                                : product.moderationStatus === 'pending'
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                              }`}
                            ></span>
                          </div>
                          <p className='text-sm flex items-center justify-between text-gray-500'>Price <span className='hover:underline'>{product?.price}</span></p>
                          <p className='text-sm flex items-center justify-between text-gray-500'>Quantity <span className='hover:underline'>{product?.quantity}</span></p>
                          <div className='flex items-center gap-2 justify-end'>
                            <p className='text-sm hover:underline cursor-pointer text-dark hover:text-green-600'>view</p>
                            <p className='text-sm hover:underline cursor-pointer text-dark hover:text-orange-600'>edit</p>
                            <p className='text-sm hover:underline cursor-pointer text-dark hover:text-red-600'>Delete</p>
                          </div>
                        </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          <div className="flex justify-between items-center CatNav mt-4">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
               >
                Prev
            </button>
            <span className=''>
              Page {page} of {totalPages}
            </span>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)}
              className='px-3 py-1 border rounded cursor-pointer disabled:opacity-50'
              >
               Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default vendorProducts