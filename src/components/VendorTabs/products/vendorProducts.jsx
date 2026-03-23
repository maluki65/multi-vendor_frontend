import React, { useState, useMemo } from 'react';
import '../vendorTabs.css';
import { AdLoader } from '../..';
import { TbShoppingBagX } from "react-icons/tb";
import { toast, Toaster } from 'react-hot-toast';
import useProducts from '../../../Hooks/useProduts';

function vendorProducts({ vendorId }) {
  const { getVendorProducts } = useProducts();
  const { 
    data: products = [],
    isLoading
  } = getVendorProducts(vendorId);
  //console.log("Vendor ID (frontend):", vendorId);

  const [statusFilter, setStatusFilter] = useState('all');

  //On filtering based on moderation status
  const filteredProducts = useMemo(() => {
    if (statusFilter === 'all') return products;
    return products.filter(
      (p) => p.moderationStatus === statusFilter
    );
  }, [products, statusFilter]);

  const counts = useMemo(() => ({
    all: products.length,
    pending: products.filter(p => p.moderationStatus === 'pending').length,
    approved: products.filter(p => p.moderationStatus === 'approved').length,
    rejected: products.filter(p => p.moderationStatus === 'rejected').length
  }), [products]);

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

          {filteredProducts.length === 0 ? (
            <div className='flex justify-center items-center h-[75vh]'>
              <div className='flex flex-col gap-3  items-center justify-center'>
                <TbShoppingBagX  className='text-red-500' size={50}/>
                <p className=''> No products found</p>
              </div>
            </div>
          ): (
            <div className='grid grid-cols-4 gap-2 prodCardsV'>
              {filteredProducts.map((product) => (
                <div 
                  key={product._id}
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
                        <p className='text-sm hover:underline cursor-pointer text-dark'>view</p>
                        <p className='text-sm hover:underline cursor-pointer text-dark'>edit</p>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default vendorProducts