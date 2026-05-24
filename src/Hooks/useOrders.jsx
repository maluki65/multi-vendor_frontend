import { useQuery, useQueryClient, useMutation,  } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";
import toast from 'react-hot-toast';
import { Api } from "../utils";

const useOrders = () => {
  const queryClient = useQueryClient();
  const { data: me } = useCurrentUser();

  const orderKey = ['order'];

  // On getting all orders (admin)
  const getAllOrders = ({
    page = 1,
    limit = 6,
    search = '',
  }) => {
    return useQuery({
      queryKey: ['AdminOrders', page, limit, search],
      queryFn: async () => {
        const { data } = await Api.get('/orders/admin/all', {
          params: {
            page,
            limit,
            search
          },
        });

        return data
      },

      enabled: me?.role === 'Admin',
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10
    })
  }

  // On getting buyer orders
  const getBuyerOrder = useQuery({
    queryKey: ['BuyerOrders'],
    queryFn: async () => {
      const { data } = await Api.get('/orders/buyer');
      return data;
    },
    enabled: me?.role === 'Buyer'
  });

  // On getting vendor orders
  const getVendorOrder = ({ 
    page = 1,
    limit = 6,
    search = '',
  }) => {
    return useQuery({
      queryKey: ['VendorOrders', page, limit, search],
      queryFn: async () => {
        const { data } = await Api.get('/orders/vendor', {
          params: {
            page,
            limit,
            search
          },
        });

        return data;
      },

      enabled: me?.role === 'Vendor',
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10,
    });
  };

  // On updating order status for all roles
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const { data } = await Api.patch(`/orders/update/${orderId}/status`, { status })
      return data;
    },

    onMutate: () => {
      const id = toast.loading('Updating order status...');
      return { toastId: id };
    },

    onSuccess: async(data, variables, context) => {
      toast.success('Order status updated', { id: context.toastId });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['VendorOrders'],
        }),
      
        queryClient.invalidateQueries({
          queryKey: ['BuyerOrders'],
        }),
      
        queryClient.invalidateQueries({
          queryKey: orderKey,
        }),
      ]);
    }, 

    onError: (error, variables, context) => {
      toast.error(error?.response?.data?.message || 'Failed to update order status', { id: context.toastId });
      console.error('Failed to update order status', error);
    }
  })
  
  return {
    getAllOrders,
    getBuyerOrder,
    getVendorOrder,
    updateOrderStatus,
  }
}

export default useOrders