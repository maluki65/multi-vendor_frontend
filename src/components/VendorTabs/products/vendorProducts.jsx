import React, { useState, useMemo, useEffect, useCallback } from 'react';
import '../vendorTabs.css';
import { AdLoader } from '../..';
import { debounce } from 'lodash';
import { VerifyDoc } from '../../';
import { TbShoppingBagX, TbShoppingBagExclamation, TbEdit } from "react-icons/tb";
import { toast, Toaster } from 'react-hot-toast';
import useProducts from '../../../Hooks/useProduts';
import { motion, AnimatePresence } from 'framer-motion';
import useDeleteProduct from '../deleteProduct';
import EditProductForm from '../EditProductForm';
import { GrFormViewHide } from "react-icons/gr";
import { IoTrashOutline } from "react-icons/io5";

function vendorProducts({ vendorId }) {  
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(false);
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

  const { getVendorProducts, deleteProduct, updateProduct } = useProducts();
  const handleDeleteProduct = useDeleteProduct(deleteProduct);;
  const { data, isLoading, isError } = getVendorProducts(vendorId, page, search);

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  //On filtering based on moderation status
  const filteredProducts = useMemo(() => {
    if (statusFilter === 'all') return products;
    return products.filter(
      (p) => p.moderationStatus === statusFilter
    );
  }, [products, statusFilter]);

  //console.log('counts', data?.counts)

  const counts = data?.counts || { all: 0, pending: 0, approved: 0, rejected: 0 };
  
  /*useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
  
    return () => clearTimeout(timeout);
  }, [searchInput]);*/

  const handleEditProduct = (product) => {
    setSelectedEditProduct(product);
    setEditForm(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    //console.log(product.attributes);
    setModalOpen(true);
  }

  const rejectionReason = () => {
    if(!selectedProduct?.rejectionReason){
      return (
        <span className='text-sm text-dark'>
          No rejection reason: product approved
        </span>
      );
    }

    return selectedProduct?.rejectionReason;
  }

  return (
    <>
      <Toaster position='top-right' reverseOrder={false}/>
      {isLoading ? (
        <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
          <AdLoader/>
        </div>
      ): (
        <div className='p-4 bg-white my-4 rounded-md'>
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

          <AnimatePresence mode='wait'>
            <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             transition={{ duration: 0.3 }}
             className='w-full mt-3 table-view h-[360px] overflow-auto VenProdTableCon8u'>
              {isError && (
                <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                  <TbShoppingBagExclamation className='text-red-500' size={65} />
                  <p className='text-red-500'>Failed to get vendor products!</p>
                </div>
              )}

              {!isError && (
                filteredProducts?.length > 0 ? (
                  <table className='w-full border-collapse WishTable'>
                    <thead className=''>
                      <tr className='bg-secondary text-left text-sm font-medium text-dark rounded-lg'>
                        <th className='p-3 rounded-l-lg'>Product</th>
                        <th className='p-3'>Price</th>
                        <th className='p-3'>Brand</th>
                        <th className='p-3'>status</th>
                        <th className='p-3 rounded-r-lg'></th>
                      </tr>
                    </thead>

                    <tbody className=''>
                      {filteredProducts.map((item) => {
                        return (
                          <tr
                            key={item._id}
                            className='border-b border-gray-300'>
                              <td className='p-2 flex items-center gap-2'>
                                <img
                                  src={item?.MainIMg}
                                  alt={item?.name}
                                  loading='lazy'
                                  className='w-15 h-15 object-contain rounded-md cartImg'
                                />
                                <div className='flex flex-col gap-1'>
                                  <p className='font-semibold cartItem'>{item?.name}</p>
                                  <p className='text-sm'> {item?.quantity <= 10 ? (
                                    <span className='text-red-500 prodVenItem'>Quantity: {item?.quantity}</span>
                                  ) : (
                                    <span className='text-gray-500 prodVenItem'>Quantity: {item?.quantity}</span>
                                  )}</p>
                                </div>
                              </td>
                              <td className='p-2'>
                                {item?.discount > 0 ? (
                                  <p className='wishPrice'>
                                    ksh {(item.discountPrice /100).toLocaleString()}
                                  </p>
                                ) : (
                                  <p className='wishPrice'>
                                    ksh {(item?.price / 100).toLocaleString()}
                                  </p>
                                )}
                              </td>
                              <td className='p-2'>{item?.brand}</td>
                              <td className='p-2'>
                                <span 
                                  className={`p-1 text-xs rounded-full wishDate ${item?.moderationStatus === 'approved'
                                    ? 'bg-green-200 text-green-500 p-1'
                                      : item?.moderationStatus === 'pending'
                                      ? 'bg-yellow-200 text-yellow-500 p-1'
                                      : 'bg-red-200 text-red-500 p-1'
                                    }`}
                                >
                                  {item?.moderationStatus}
                                </span>
                              </td>
                              <td className='p-2'>
                                <div className='flex items-center gap-4'>
                                  <GrFormViewHide 
                                    onClick={() => handleViewProduct(item)}
                                    className='cursor-pointer text-gray-600 hover:text-orange-400 venProdIcon4u' 
                                    size={20} 
                                  />
                                  <TbEdit 
                                    onClick={() => handleEditProduct(item)}
                                    className='cursor-pointer text-gray-600 hover:text-orange-400 venProdIcon4u' 
                                    size={20} 
                                  />
                                  <IoTrashOutline 
                                    onClick={() => handleDeleteProduct(item._id)}
                                    className='cursor-pointer text-gray-600 hover:text-orange-400 venProdIcon4u' 
                                    size={20} 
                                  />
                                </div>
                              </td>
                            </tr>
                        )
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className='my-5 flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                    <TbShoppingBagX className='text-red-500' size={65} />
                    <p className='text-dark font-semibold text-xl'>No products found</p>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode='wait'>
            <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             transition={{ duration: 0.3 }}
             className='card-view'>
              {isError && (
                <div className='text-center text-gray-500 flex flex-col items-center gap-2'>
                  <TbShoppingBagExclamation className='text-red-500' size={65} />
                  <p className='text-red-500'>Failed to get vendor products!</p>
                </div>
              )}

              {!isError && (
                filteredProducts.length > 0 ? (
                  <div className='flex flex-col gap-3'>
                    {filteredProducts.map((item) => {
                      return (
                        <div
                          key={item._id}
                          className='flex gap-2 rounded-md shadow-sm p-3'>
                            <img
                              src={item?.MainIMg}
                              alt={item?.name}
                              className='w-20 h-20 object-contain rounded-md'
                              loading='lazy'
                            />
                            <div className='flex flex-col gap-2 w-full'>
                              <div className='flex items-center justify-between wishNameStock'>
                                <p className='text-md text-dark'>{item?.name}</p>
                                <p className='text-sm'> {item?.quantity <= 10 ? (
                                    <span className='text-red-500 prodVenItem'>Quantity: {item?.quantity}</span>
                                  ) : (
                                    <span className='text-gray-500 prodVenItem'>Quantity: {item?.quantity}</span>
                                  )}
                                </p>
                              </div>
                              <p className='text-gray-600 font-semibold'>
                                {item?.discount > 0 ? (
                                  <span className=''>
                                    Ksh {(item.discountPrice / 100).toLocaleString()}
                                  </span>
                                ): (
                                  <span className=''>
                                    Ksh {(item.price / 100).toLocaleString()}
                                  </span>
                                )}
                              </p>
                              <div className='flex items-center justify-between'>
                                <GrFormViewHide 
                                  onClick={() => handleViewProduct(item)}
                                  className='cursor-pointer text-primary hover:text-orange-400 venProdIcon4u' 
                                  size={20} 
                                />
                                <TbEdit 
                                  onClick={() => handleEditProduct(item)}
                                  className='cursor-pointer text-primary hover:text-orange-400 venProdIcon4u' 
                                  size={20} 
                                />
                                <IoTrashOutline 
                                  onClick={() => handleDeleteProduct(item._id)}
                                  className='cursor-pointer text-primary hover:text-red-500 venProdIcon4u' 
                                  size={20} 
                                />
                              </div>
                            </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className='my-5 flex flex-col justify-center items-center text-center text-gray-500 gap-2'>
                    <TbShoppingBagX className='text-red-500' size={65} />
                    <p className='text-dark font-semibold text-xl'>No products found</p>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>

          <div className='flex justify-between items-center CatNav mt-4'>
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

          <VerifyDoc
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={`product: ${selectedProduct?.name}`}
            className="max-h-[80vh] overflow-y-auto"
            >
            <div className='flex flex-col gap-2'>
              <img 
                src={selectedProduct?.MainIMg}
                alt={selectedProduct?.slug}
                className='rounded-md h-50 object-contain w-full selectImg'
              />
              <div className='flex flex-wrap gap-2'>
                {selectedProduct?.supportImgs?.map((item, index) => (
                  <div 
                    key={index}
                    className='h-25 w-30 selectImgArr rounded overflow-hidden'
                    >
                      <img
                        src={item}
                        alt={`support-${index}`}
                        className='h-full w-full object-contain rounded'
                      />
                    </div>
                ))}
              </div>
              <div className='flex flex-col gap-2 my-3'>
                <div className='grid grid-cols-3 gap-2 selectChar'>
                <p className='text-sm text-dark flex items-center gap-3'> <span className='font-semibold'>Category:</span>{selectedProduct?.category?.name}</p>
                <p className='text-sm text-dark flex items-center gap-3'> <span className='font-semibold'>Quantity:</span>{selectedProduct?.quantity}</p>
                <p className='text-sm text-dark flex items-center gap-3'> <span className='font-semibold'>Price:</span>{selectedProduct?.discount > 0 ? (
                  <span className=''>ksh: {(selectedProduct?.discountPrice / 100).toLocaleString()}</span>
                ) : (
                  <span className=''>
                    ksh: {(selectedProduct?.price / 100).toLocaleString()}
                  </span>
                )}</p>
                </div>
                <p className='text-sm text-dark flex flex-col'> <span className='font-semibold'>Description:</span>{selectedProduct?.description}</p>
                <p className='text-sm text-dark font-semibold flex flex-col'>
                  Rejection Reason:
                  <span className='font-normal text-red-600'>
                    {selectedProduct?.rejectionReason
                      ? selectedProduct.rejectionReason
                      : <span className='text-green-500'>No rejection reason: product approved/pending</span>}
                  </span>
                </p>
                {selectedProduct?.attributes?.map((attr, index) => (
                  <div key={index} className='flex flex-col text-sm'>                    
                    <span className='font-semibold capitalize attrName'>
                      {attr.attributeId?.name}
                    </span>
                    <div className='flex gap-2 flex-wrap'>
                      {attr.value.split(',').map((val, i) => (
                        <span
                          key={i}
                          className='px-2 py-1 bg-gray-200 rounded text-sm attrVal'
                        >
                          {val}
                        </span>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setModalOpen(false)}
              className='px-2 py-1 border cursor-pointer rounded bg-gray-300 text-dark'>
                Cancel
            </button>
          </VerifyDoc>

          {editForm && (
            <VerifyDoc
              isOpen={editForm}
              onClose={() => setEditForm(false)}
              title={`Edit: ${selectedEditProduct?.name}`}
              className="max-h-[80vh] overflow-y-auto"
            >
              <EditProductForm
                product={selectedEditProduct}
                onClose={() => setEditForm(false)}
                onUpdate={(id, payload) => updateProduct.mutate({ id, payload })}
              />
            </VerifyDoc>
          )}
        </div>
      )}
    </>
  )
}

export default vendorProducts