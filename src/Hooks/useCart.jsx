import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { Api } from '../utils';

const useCart = () => {
  const queryClient = useQueryClient();

  // On fetching cart
  const getCart = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await Api.get('/cart');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  // On adding to cart
  const addToCart = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.post('/cart/add', payload);
      return data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      const previousCart = queryClient.getQueriesData(['cart']);

      const productId = payload.productId;
      const quantity = payload.quantity || 1;

      queryClient.setQueriesData(['cart'], (old) => {
        if (!old?.cart) return old;

        const existingItem = old.cart.vendors.find(
          i => i.productId === productId
        );

        let newItems;

        if (existingItem) {
          newItems = old.cart.vendors.map(item => 
            item.productId === productId
             ? {
              ...item,
              quantity: item.quantity + quantity
             }
             : item
          );
        } else {
          newItems = [
            ...old.cart.vendors,
            {
              productId,
              quantity,
              name: payload.name,
              price: payload.price,
              image: payload.image,
              vendorId: payload.vendorId
            }
          ];
        }

        return {
          ...old,
          cart: {
            ...old.cart,
            items: newItems
          },
          totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0)
        };
      });

      const toastId = toast.loading('Adding product to cart...');

      return { 
        previousCart,
        toastId
      }
    }, 

    onSuccess: (data, _, context) => {
      toast.success('Product added to cart', { id: context.toastId });

      queryClient.setQueriesData(['cart'], (old) => {
        return {
          ...old,
          cart: data.cart,
          totalItems: data.totalItems
        };
      });
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);

      toast.error(
        error?.response?.data?.message || 'Failed to add product to cart', { id: context.toastId }
      );

      console.error('Failed to add product to cart', error);
    }
  });

  // On updating cart
  const updateQuantity = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.put('/cart/update', payload);
      return data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries(['cart']);
    
      const previousCart = queryClient.getQueryData(['cart']);
    
      queryClient.setQueryData(['cart'], (old) => {
        const items = old.cart.vendors.map(item =>
          item.productId === payload.productId
            ? { ...item, quantity: payload.quantity }
            : item
        );
    
        return {
          ...old,
          cart: {
            ...old.cart,
            items
          },
          totalItems: items.reduce((s, i) => s + i.quantity, 0)
        };
      });

      const toastId = toast.loading('Updating product quantity to cart...');
    
      return { 
        previousCart,
        toastId
      };
    },

    onSuccess: (data, _, context) => {
      toast.success('Product quantity updated', { id: context.toastId });
      queryClient.invalidateQueries(['cart']);
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);

      toast.error(
        error?.response?.data?.message || 'Failed to update product to cart', { id: context.toastId }
      );

      console.error('Failed to update product to cart', error);
    }
  });

  // On removing product from cart
  const removeFromCart = useMutation({
    mutationFn: async (productId) => {
      const { data } = await Api.delete(`/cart/delete/${productId}`);
      return data;
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries(['cart']);
    
      const previousCart = queryClient.getQueryData(['cart']);
    
      queryClient.setQueryData(['cart'], (old) => {
        const items = old.cart.vendors.filter(
          i => i.productId !== productId
        );
    
        return {
          ...old,
          cart: {
            ...old.cart,
            items
          },
          totalItems: items.reduce((s, i) => s + i.quantity, 0)
        };
      });

      const toastId = toast.loading('Deleting product from cart...');
    
      return { 
        previousCart,
        toastId
      };
    },

    onSuccess: (data, _, context) => {
      toast.success('Product removed from cart', { id: context.toastId });
      queryClient.invalidateQueries(['cart']);
    },

    onError: (error, _, context) => {
      toast.error(error?.response?.data?.message || 'Failed to remove from cart', { id: context.toastId });

      console.error('Failed to remove from cart', error);
    }
  });

  return {
    cart: getCart.data?.cart,
    totalItems: getCart.data?.totalItems || 0,
    isLoading: getCart.isLoading,

    addToCart,
    updateQuantity,
    removeFromCart,
  };
};

export default useCart