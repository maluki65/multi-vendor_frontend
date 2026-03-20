import React, { useState } from 'react';
import './Tabs.css';
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import useProducts from '../../Hooks/useProduts';
import { Toaster, toast } from 'react-hot-toast';
import { AdLoader } from '..';

function ProductApproval() {
 const { getPendingProducts, approveProducts, rejectProducts } = useProducts();
 const { data: products, isLoading } = getPendingProducts;

 const [selectedComplianceProduct, setSelectedComplianceProduct] = useState(null);
 const [selectedRejectProduct, setSelectedRejectProduct] = useState(null);
 const [rejectReason, setRejectReason] = useState('');
 const [open, setOpen] = useState(false);

 const handleApprove = (productId) => {
  approveProducts.mutate(productId);
 }

 const handleRejectClick = (product) => {
  setSelectedRejectProduct(product);
 };

 //console.log(products)

 const handleRejectSubmit = () => {
  if (!rejectReason.trim()) {
    toast.error('Please enter a rejection reason');
    return;
  }
  rejectProducts.mutate(
    {
      productId: selectedRejectProduct._id,
      reason: rejectReason,
    },
  ),
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
      {/*<Toaster position='top-right' reverseOrder={false}/>*/}
      <div className='product-approval-container'>   
        {products?.length === 0 && (
          <div className='flex justify-center items-center h-[75vh]'>
            <div className='flex flex-col gap-3  items-center justify-center'>
              <MdOutlineRemoveShoppingCart className='text-red-500' size={50}/>
              <p className=''> No products found</p>
            </div>
          </div>
        )}

        <div className='grid grid-cols-4 gap-2 procuctContainer'>
          {/*<h2 className='text-dark'>
            Pending product approval
          </h2>*/}
          {products?.map((product) => (
            <div key={product._id} className='bg-gray-100 rounded-md p-1 product-card flex flex-col gap-1 PROD'>
              <img
                src={product.MainIMg}
                alt={product.name}
                className='main-image PromainImg w-full h-40 object-cover rounded-md'
              />

              <div className='flex flex-col p-2'>
                <div className='flex items-center justify-between venProdpend'>
                  <p className='text-sm'>{product.name}</p>
                  <p className='text-sm items-center flex flex-wrap'>Vendor: {product.vendorId?.businessInfo?.legalName}</p>
                </div>
              </div>
              <div className='compliance flex gap-1 flex-col bg-white rounded p-2'>
                <p className='text-sm'>The following compliance are non-required:</p>
                <div className='flex text-sm flex-col gap-2'>
                  <p>Resolution: {product.imageCompliance?.resolutionCheck ? 'match' : 'non-match'}</p>
                  <p>Aspect Ratio: {product.imageCompliance?.aspectRatioCheck ? 'match' : 'non-match'}</p>
                </div>
              </div>

              <a className='text-sm text-primary cursor-pointer hover:underline'
              onClick={() => setSelectedComplianceProduct(product)}
               >
                Check Img compliance
              </a>

              <div className='actions flex items-center justify-between'>
                <button
                  className='approve-btn bg-green-500 text-sm cursor-pointer text-white px-2 py-1 rounded'
                  onClick={() => handleApprove(product._id)}
                >
                  Approve
                </button>
                <button
                  className='reject-btn bg-red-500 text-sm cursor-pointer text-white px-2 py-1 rounded'
                  onClick={() => handleRejectClick(product)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}

        {selectedRejectProduct && (
          <div className='modal-overlay fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50'>
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
                  className='bg-red-500 text-white px-3 py-1 rounded cursor-pointer'
                  onClick={handleRejectSubmit}
                >
                  Submit
                </button>
                <button
                  className='bg-gray-300 px-3 py-1 rounded cursor-pointer'
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

        {selectedComplianceProduct && (
          <div className='fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50'>
            <div className='bg-white p-4 rounded w-[500px] max-h-[80vh] overflow-y-auto suppImgComp'>
              <h3 className='font-semibold text-lg mb-2'>
                Image compliance: {selectedComplianceProduct.name}
              </h3>

              <div className='mb-4'>
                <p className='text-sm font-semibold mb-1'>Main Image</p>
                <img
                  src={selectedComplianceProduct.MainIMg}
                  alt="Main Img"
                  className='w-full mainIMg h-48 object-cover rounded border'
                />

                <div className=''>
                  <p className='text-sm font-semibold mb-2'>Supporting Images</p>

                  <div className='grid grid-cols-3 gap-2 suppImgCon'>
                    {selectedComplianceProduct.supportImgs?.length > 0 ?(
                      selectedComplianceProduct.supportImgs.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Support ${idx}`}
                          className='w-full h-28 object-cover border rouded suppIMg'
                        />
                      ))
                    ): (
                      <p className='text-sm text-gray-500'>No supporting images</p>
                    )}
                  </div>
                </div>

                <div className='mt-4 text-sm'>
                  <p>Resolution: {selectedComplianceProduct.imageCompliance.resolutionCheck ? 'match' : 'non-match'}</p>
                  <p>Aspect Ratio: {selectedComplianceProduct.imageCompliance.aspectRatioCheck ? 'match' : 'non-match'}</p>
                </div>

                <div className='flex justify-end mt-4'>
                  <button
                    className='bg-red-500 text-white px-2 py-1 rounded cursor-pointer'
                    onClick={() => setSelectedComplianceProduct(null)}
                    >
                      Close
                  </button>
                </div>

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