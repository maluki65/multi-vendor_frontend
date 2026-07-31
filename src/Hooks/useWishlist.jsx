import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { Api } from "../utils";

const useWishlist = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  const wishlistKey = ['wishlist'];

  // On getting wishlist
  const getWishlist = useQuery({
    queryKey: [...wishlistKey, page, limit],
    queryFn: async () => {
      const { data } = await Api.get('/wishlist', {
        params: {
          page,
          limit,
        }
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });

  // On adding to wishlist
  const addToWishlist = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.post('/wishlist/add', payload);
      return data;
    },
  
    onMutate: async () => {
      const cacheKey = [...wishlistKey, page, limit];
  
      await queryClient.cancelQueries({
        queryKey: cacheKey,
      });
  
      const previousWishlist = queryClient.getQueryData(cacheKey);
  
      const toastId = toast.loading('Adding product to wishlist...');
  
      return {
        previousWishlist,
        toastId,
        cacheKey,
      };
    },
  
    onSuccess: (_data, _variables, context) => {
      toast.success('Added to wishlist', {
        id: context.toastId,
      });
  
      queryClient.invalidateQueries({
        queryKey: context.cacheKey,
      });
    },
  
    onError: (error, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(
          context.cacheKey,
          context.previousWishlist
        );
      }
  
      toast.error(
        error?.response?.data?.message || 'Failed to add product to wishlist',
        {
          id: context.toastId,
        }
      );
    },
  });

  // On removing product from wishlist
  const removeFromWishlist = useMutation({
    mutationFn: async (productId) => {
      const { data } = await Api.delete(`/wishlist/remove/${productId}`);
      return data;
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({
        queryKey: wishlistKey,
      });

      const previousWishlist = 
        queryClient.getQueryData(wishlistKey);

      queryClient.setQueryData(wishlistKey, (old) => {
        if (!old?.wishlist) return old;

        const updatedWishlist = old.wishlist.filter(
          (item) => item._id?.toString() !== productId.toString()
        );

        return {
          ...old,
          wishlist: updatedWishlist,
          results: updatedWishlist.length,
        };
      });

      return { previousWishlist };
    },

    onSuccess: () => {
      //toast.success('Product removed from wishlist');

      queryClient.invalidateQueries({
        queryKey: wishlistKey,
      });
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(
        wishlistKey,
        context.previousWishlist
      );

      toast.error(
        error?.response?.data?.message || 'Failed to reomove product'
      );
    },
  });

  // On clearing wishlist
  const clearWishlist = useMutation({
    mutationFn: async () => {
      const { data } =  await Api.delete('/wishlist/clear');
      return data;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: wishlistKey,
      });

      const previousWishlist = 
        queryClient.getQueryData(wishlistKey);

      queryClient.setQueryData(wishlistKey, { 
        wishlist:[],
        results: 0,
      });

      const toastId = toast.loading('Clearing wishlist...');

      return { previousWishlist, toastId };
    },

    onSuccess: (_data, _variable, context) => {
      toast.success('Wishlist cleared', {
        id: context.toastId,
      });

      queryClient.invalidateQueries({
        queryKey: wishlistKey,
      })
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(
        wishlistKey,
        context.previousWishlist
      );

      toast.error(
        error?.response?.data?.message || 'Failed to clear wishlist', { id: context.toastId },
      );
    },
  });

  // On flatteting wishlist products
  const flattenedItems = getWishlist.data?.wishlist?.map(item => ({
    ...item.productId,
    wishlistItemId: item._id,
    selectedAttributes: item.selectedAttributes || {},
    addedAt: item.addedAt,
  })) || [];

  // On checking if product exists
  const isInWishList = (productId) => {
    return item.some(
      (item) => item?._id?.toString() === productId?.toString()
    );
  };

  return {
    wishlist: flattenedItems,
    totalWishlistItems: getWishlist.data?.pagination?.totalItems || 0,

    pagination: getWishlist.data?.pagination,

    isLoading: getWishlist.isLoading,
    isError: getWishlist.isError,

    addToWishlist,
    removeFromWishlist,
    clearWishlist,

    isInWishList,
  };
};

export default useWishlist