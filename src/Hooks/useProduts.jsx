import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './useCurrentUser';
import toast from 'react-hot-toast';
import { Api } from '../utils';

const useProducts = () => {
  const queryClient = useQueryClient();
  const { data: me } = useCurrentUser();

  // On getting all pending products
  const getPendingProducts = useQuery({
    queryKey: ['pendingProducts'],
    queryFn: async() => {
      const { data } = await Api.get('/admin/products/pending');
      return data.products;
    },
    enabled: me?.role === 'Admin',
    staleTime: 1000 * 60,
    onError: (error) =>{
      toast.error(
        error?.response?.data?.message || 'Failed to fetch pending products'
      );
      console.error('Failed to get fetching products', error);
    }
  });

  // On approving products
  const approveProducts = useMutation({
    mutationFn: async (productId) => {
      const { data } = await Api.patch(`/admin/products/${productId}/approve`);
      return data;
    },

    onMutate: () => {
      const id = toast.loading('Approving product...');
      return { toastId: id };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Product approved', { id: context.toastId });

      queryClient.invalidateQueries({
        queryKey: ['pendingProducts']
      });
    },

    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to approve product', { id: context.toastId }
      );

      console.error('Failed to approve product', error);
    }
  });

  // On rejecting products
  const rejectProducts = useMutation({
    mutationFn: async ({ productId, reason }) => {
      const { data } = await Api.patch(`/admin/products/${productId}/reject`,
        { reason }
      );

      return data;
    },

    onMutate: () => {
      const id = toast.loading('Rejecting product...');
      return { toastId: id };
    },

    onSuccess: (data, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to reject product', { id: context.toastId }
      );

      console.error('Failed to reject product', error);
    }
  });

  return { 
    getPendingProducts,
    approveProducts,
    rejectProducts
  };
};

export default useProducts;