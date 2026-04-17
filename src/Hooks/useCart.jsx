import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { Api } from '../utils';

const useCart = (location) => {
  const queryClient = useQueryClient();

  // On fetching cart
  const getCart = useQuery({
    queryKey: ['cart', location],
    queryFn: async () => {
      let url = '/cart';

      if (location?.county) {
        url += `?county=${location.county}&area=${location.area}`;
      }

      const { data } = await Api.get(url);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // On adding to cart
  const addToCart = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.post('/cart/add', payload);
      return data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
    
      const previousCart = queryClient.getQueryData(['cart']);
    
      const productId = payload.productId.toString();
      const quantity = payload.quantity || 1;
    
      queryClient.setQueryData(['cart'], (old) => {
        if (!old?.cart?.vendors) return old;
    
        let found = false;
    
        const updatedVendors = old.cart.vendors.map(vendor => {
          const updatedItems = vendor.items.map(item => {
            if (item.productId.toString() === productId) {
              found = true;
              return {
                ...item,
                quantity: item.quantity + quantity
              };
            }
            return item;
          });
    
          return {
            ...vendor,
            items: updatedItems,
            vendorTotal: updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            )
          };
        });
    
        if (!found) {
          updatedVendors.push({
            vendorId: payload.vendorId || 'temp',
            vendorName: 'vendor',
            items: [{
              productId,
              quantity,
              name: payload.name,
              price: payload.price,
              image: payload.image,
              vendorId: payload.vendorId
            }],
            vendorTotal: payload.price * quantity
          });
        }
    
        return {
          ...old,
          cart: {
            ...old.cart,
            vendors: updatedVendors
          },
          totalItems: updatedVendors
            .flatMap(v => v.items)
            .reduce((sum, i) => sum + i.quantity, 0)
        };
      });
    
      const toastId = toast.loading('Adding product to cart...');
    
      return { previousCart, toastId };
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

      const previousCart = queryClient.getQueriesData(['cart']);

      queryClient.setQueriesData(['cart'], (old) => {
        if (!old?.cart?.vendors) return old;

        const updatedVendors = old.cart.vendors.map(vendor => {
          const updatedItems = vendor.items.map(item => 
            item.productId.toString() === payload.productId.toString()
              ? { 
                ...item,
                quantity: payload.quantity
              }
              : item
          );

          return {
            ...vendor,
            items: updatedItems,
            vendorTotal: updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity, 0
            )
          };
        });

        return {
          ...old,
          cart: {
            ...old.cart,
            vendors: updatedVendors
          },
          totalItems:updatedVendors
            .flatMap(v => v.items)
            .reduce((s, i) => s + i.quantity, 0)
        };
      });

      //const toastId = toast.loading('Updating product quantity...');

      return { 
        previousCart,
        //toastId
      };
    },

    onSuccess: (data, _, context) => {
      //toast.success('Product quantity updated', { id: context.toastId });
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

  const clearCart = useMutation({
    mutationFn: async () => {
      const { data } = await Api.put('/cart/clear');
      return data;
    },
  
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
  
      const previousCart = queryClient.getQueryData(['cart']);
  
      queryClient.setQueryData(['cart'], (old) => {
        if (!old?.cart) return old;
  
        return {
          ...old,
          cart: {
            ...old.cart,
            vendors: old.cart.vendors?.map(v => ({
              ...v,
              items: [],
              vendorTotal: 0
            })) || [],
            items: []
          },
          totalItems: 0
        };
      });
  
      const toastId = toast.loading('Clearing cart...');
  
      return { previousCart, toastId };
    },
  
    onSuccess: (data, _, context) => {
      toast.success('Cart cleared', { id: context.toastId });
  
      
      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old;
  
        return {
          ...old,
          cart: {
            ...data.cart,
            vendors: data.cart?.vendors || [],
            items: data.cart?.items || []
          },
          totalItems: 0
        };
      });
    },
  
    onError: (error, _, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
  
      toast.error(
        error?.response?.data?.message || 'Failed to clear cart',
        { id: context.toastId }
      );
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

      queryClient.setQueriesData(['cart'], (old) => {
        if (!old?.cart) return old;
      
        const vendors = old.cart.vendors || [];
      
        const updatedVendors = vendors.map(vendor => {
          const filteredItems = vendor.items.filter(
            i => i.productId.toString() !== productId.toString()
          );
      
          return {
            ...vendor,
            items: filteredItems,
            vendorTotal: filteredItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            )
          };
        }).filter(v => v.items.length > 0);
      
        return {
          ...old,
          cart: {
            ...old.cart,
            vendors: updatedVendors
          },
          totalItems: updatedVendors
            .flatMap(v => v.items)
            .reduce((s, i) => s + i.quantity, 0)
        };
      });

      const toastId = toast.loading('Deleting product from cart...');

      return{
        previousCart,
        toastId
      }
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

  const flattenedItems =
  getCart.data?.cart?.vendors?.flatMap(v => v.items) || [];

  return {
    cart: {
      ...getCart.data?.cart,
      items: flattenedItems,
    },
    pricing: getCart.data?.pricing || null,
    totalItems: getCart.data?.totalItems || 0,
    isLoading: getCart.isLoading,
    isError: getCart.isError,
    error: getCart.error,

    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};

export default useCart