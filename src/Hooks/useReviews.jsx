import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './useCurrentUser';
import toast from 'react-hot-toast';
import { Api } from '../utils';

const useReviews = () => {
  const queryClient = useQueryClient();
  const { data: me } = useCurrentUser();

  //On getting reviews
  const getProductReview = (productId) => useQuery({
    queryKey: ['productReviews', productId],
    queryFn: async() => {
      const { data } = await Api.get(`/buyer/reviews/product/${productId}`);
      return data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60,
    onError: (error) =>{
      toast.error(
        error?.response?.data?.message || 'Failed to fetch reviews'
      );
      console.error('Failed to get fetch reviews', error);
    }
  });

  // On creating review
  const createReview = useMutation({
    mutationFn: async ({ productId, payload }) => {
      const { data } = await Api.post(`/buyer/reviews/${productId}`, payload);
      return data;
    },

    onMutate: () => {
      const id = toast.loading('Creating review...');
      return { toastId: id };
    },

    onSuccess: (_, variables, context) => {
      toast.success('Review posted', { id: context.toastId });

      queryClient.invalidateQueries([
        'productReviews', variables.productId
      ]);

      queryClient.invalidateQueries([
        'product', 
        variables.productId
      ]);

      variables?.onSuccessCallback?.();
    },

    onError: (error, _, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to post review',
        { id: context.toastId }
      );
      console.error('Failed to post review', error);
    }
  });

  // On updating reviews
  const updateReview = useMutation({
    mutationFn: async ({ reviewId, payload }) => {
      const { data } = await Api.patch(`/buyer/reviews/${reviewId}`, payload);
      return data;
    },

    onMutate: () => {
      const id = toast.loading('Updating review...');
      return { toastId: id };
    },

    onSuccess: (data, _, context) => {
      toast.success('Review updated', { id: context.toastId });

      queryClient.invalidateQueries(['productReviews']);
      queryClient.invalidateQueries(['product']);
    },

    onError: (error, _, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update review',
        { id: context.toastId }
      );
      console.error('Failed to delete review', error);
    }
  });

  // On deleting review
  const deleteReview = useMutation({
    mutationFn: async (reviewId) => {
      const { data } = await Api.delete(`/reviews/${reviewId}`);
      return data;
    },

    onMutate: () => {
      const id = toast.loading('Deleting review...');
      return { toastId: id };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Review deleted', { id: context.toastId });

      queryClient.invalidateQueries(['productReviews']);
      queryClient.invalidateQueries(['product']);
    },

    onError: (error, _, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to delete review',
        { id: context.toastId }
      );
      console.error('Failed to delete review', error);
    }
  });

  return {
    getProductReview,
    createReview,
    updateReview,
    deleteReview
  };
};

export default useReviews