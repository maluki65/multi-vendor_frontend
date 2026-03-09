import React, { useState } from 'react';
import './Tabs.css';
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import useProducts from '../../Hooks/useProduts';
import { Toaster, toast } from 'react-hot-toast';
import { AdLoader } from '..';

function ProductApproval() {
 const { getPendingProducts, approveProduct, rejectProduct } = useProducts();
 const { data: products, isLoading } = getPendingProducts;

 const [selectedRejectProduct, setSelectedRejectProduct] = useState(null);
 const [rejectReason, setRejectReason] = useState('');

 const handleApprove = (productId) => {
  approveProduct.mutate(productId);
 }

 const handleRejectClick = (product) => {
  setSelectedRejectProduct(product);
 };

 const handleRejectSubmit = () => {
  if (!rejectReason.trim()) {
    toast.error('Please enter a rejection reason');
    return;
  }
  rejectProduct.mutate({
    productId: selectedRejectProduct._id,
    reason: rejectReason,
  });
  setSelectedRejectProduct(null);
  setRejectReason('');
 }

 if (isLoading) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
      <AdLoader/>
    </div>
  );
 }

  return (
    <>
      <Toaster position='top-right' reverseOrder={false}/>
      <div className='product-approval-container'>   
        {products?.length === 0 && (
          <div className='flex justify-center items-center h-[80vh]'>
            <div className='flex flex-col gap-3  items-center justify-center'>
              <MdOutlineRemoveShoppingCart className='text-red-500' size={50}/>
              <p className=''> No products found</p>
            </div>
          </div>
        )}

        <div className='flex flex-col gap-5'>
          {/*<h2 className='text-dark'>
            Pending product approval
          </h2>*/}
          {products?.map((product) => (
            <div key={product._id} className='product-card'>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Vendor: {product.vendorId?.businessInfo?.legalName}</p>

              <div className='images flex gap-2 my-2'>
                <img
                  src={product.MainIMg}
                  alt={product.name}
                  className='main-image w-40 h-40 object-cover border'
                />
                {product.supportImgs?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Support ${idx}`}
                    className='w-32 h-32 object-cover border'
                  />
                ))}
              </div>

              <div className='compliance flex gap-4'>
                <p>Resolution: {product.imageCompliance?.resolutionCheck ? '✅' : '❌'}</p>
                <p>Aspect Ratio: {product.imageCompliance?.aspectRatioCheck ? '✅' : '❌'}</p>
              </div>

              <div className='actions flex gap-2 mt-2'>
                <button
                  className='approve-btn bg-green-500 text-white px-3 py-1 rounded'
                  onClick={() => handleApprove(product._id)}
                >
                  Approve
                </button>
                <button
                  className='reject-btn bg-red-500 text-white px-3 py-1 rounded'
                  onClick={() => handleRejectClick(product)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}

        {selectedRejectProduct && (
          <div className='modal-overlay fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
            <div className='modal-content bg-white p-4 rounded w-96'>
              <h3 className='font-bold text-lg'>
                Reject Product: {selectedRejectProduct.name}
              </h3>
              <textarea
                className='w-full mt-2 p-2 border rounded'
                placeholder='Enter rejection reason...'
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className='modal-actions flex justify-end gap-2 mt-3'>
                <button
                  className='bg-red-500 text-white px-3 py-1 rounded'
                  onClick={handleRejectSubmit}
                >
                  Submit
                </button>
                <button
                  className='bg-gray-300 px-3 py-1 rounded'
                  onClick={() => {
                    setSelectedRejectProduct(null);
                    setRejectReason('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}

export default ProductApproval