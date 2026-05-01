import { useQuery, useQueryClient, useMutation,  } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";
import toast from 'react-hot-toast';
import { Api } from "../utils";

const useOrders = () => {
  const queryClient = useQueryClient();
  const { data: me } = useCurrentUser();

  const orderKey = ['order'];

  // On getting all orders (admin)
  const getAllOrders = useQuery({
    queryKey: orderKey,
    queryFn: async () => {
      const { data } = await Api.get('/orders/admin/all');
      return data;
    },
    enabled: me?.role === 'Admin'
  });

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
  const getVendorOrder = useQuery({
    queryKey: ['VendorOrders'],
    queryFn: async () => {
      const { data } = await Api.get('/orders/vendor');
      return data;
    },
    enabled: me?.role === 'Vendor'
  });

  return {
    getAllOrders,
    getBuyerOrder,
    getVendorOrder,
  }
}

export default useOrders