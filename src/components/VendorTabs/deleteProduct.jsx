import React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
function useDeleteProduct(deleteProduct) {
  const queryClient = useQueryClient();
  
  const handleDeleteProduct = (productId) => {
    toast((t) => (
      <span className='flex flex-col gap-2 text-sm'>
        Are you sure you want to delete this product?
        <div className='flex justify-end gap-2 mt-1'>
          <button
            className='px-3 cursor-pointer py-1 text-white bg-red-600 rounded-md hover:bg-red-500'
            onClick={async () => {
              toast.dismiss(t.id);
              const toastId = toast.loading('Deleting product...', { duration: Infinity });

              try {
                await deleteProduct.mutateAsync(productId);
                toast.dismiss(toastId);
                queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Product deleted successfully!', { duration: 3000 });
              } catch (error) {
                toast.dismiss(toastId);
                toast.error(error?.response?.data?.message || 'Failed to delete product');
                console.error('Failed to delete product:', error);
              }
            }}
          >
            Yes
          </button>
          <button
            className='px-3 py-1 cursor-pointer bg-gray-300 rounded-md hover:bg-gray-200'
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </span>
    ));
  };

  return handleDeleteProduct;
}

export default useDeleteProduct;