import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { Api } from '../utils';

const useCart = (location) => {
  const queryClient = useQueryClient();

  const cartKey = ['cart', location]; 

  // On getting cart
  const getCart = useQuery({
    queryKey: cartKey,
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
      await queryClient.cancelQueries({ queryKey: cartKey });
  
      const previousCart = queryClient.getQueryData(cartKey);
  
      const productId = payload.productId.toString();
      const quantity = payload.quantity || 1;
  
      const unitPrice =
        payload.discount > 0 ? payload.discountPrice : payload.price;
  
      queryClient.setQueryData(cartKey, (old) => {
        if (!old) {
          return {
            cart: {
              vendors: [{
                vendorId: payload.vendorId,
                vendorName: payload.vendorName || 'Vendor',
                items: [{
                  _id: productId,
                  productId,
                  quantity,
                  price: payload.price,
                  discount: payload.discount || 0,
                  discountPrice: payload.discountPrice || 0,
                  name: payload.name,
                  image: payload.image,
                  description: payload.description,
                  productQuantity: payload.productQuantity,
                }],
                vendorTotal: unitPrice * quantity,
              }],
            },
            totalItems: quantity,
          };
        }
  
        let found = false;
  
        const updatedVendors = old.cart.vendors.map((vendor) => {
          const updatedItems = vendor.items.map((item) => {
            if (item.productId.toString() === productId) {
              found = true;
              return {
                ...item,
                quantity: item.quantity + quantity,
              };
            }
            return item;
          });
  
          return {
            ...vendor,
            items: updatedItems,
            vendorTotal: updatedItems.reduce((sum, i) => {
              const price =
                i.discount > 0 ? i.discountPrice : i.price;
              return sum + price * i.quantity;
            }, 0),
          };
        });
  
        if (!found) {
          updatedVendors.push({
            vendorId: payload.vendorId,
            vendorName: payload.vendorName || 'Vendor',
            items: [{
              _id: productId,
              productId,
              quantity,
              price: payload.price,
              discount: payload.discount || 0,
              discountPrice: payload.discountPrice || 0,
              name: payload.name,
              image: payload.image,
              description: payload.description,
              productQuantity: payload.productQuantity,
            }],
            vendorTotal: unitPrice * quantity,
          });
        }
  
        return {
          ...old,
          cart: {
            ...old.cart,
            vendors: updatedVendors,
          },
          totalItems: updatedVendors
            .flatMap(v => v.items)
            .reduce((sum, i) => sum + i.quantity, 0),
        };
      });
  
      const toastId = toast.loading('Adding to cart...');
      return { previousCart, toastId };
    },
  
    onSuccess: (data, _, context) => {
      toast.success('Added to cart', { id: context.toastId });
  
      queryClient.setQueryData(cartKey, (old) => ({
        ...old,
        cart: data.cart,
        totalItems: data.totalItems,
      }));
    },
  
    onError: (error, _, context) => {
      queryClient.setQueryData(cartKey, context.previousCart);
  
      toast.error(
        error?.response?.data?.message || 'Failed to add to cart',
        { id: context.toastId }
      );
    },
  });

  // On updating cart product quantity
  const updateQuantity = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.put('/cart/update', payload);
      return data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: cartKey });

      const previousCart = queryClient.getQueryData(cartKey);

      queryClient.setQueryData(cartKey, (old) => {
        if (!old?.cart?.vendors) return old;

        const updatedVendors = old.cart.vendors.map(vendor => {
          const items = vendor.items.map(item =>
            item.productId.toString() === payload.productId.toString()
              ? { ...item, quantity: payload.quantity }
              : item
          );

          return {
            ...vendor,
            items,
            vendorTotal: items.reduce((s, i) => {
              const price = i.discount > 0 ? i.discountPrice : i.price;
              return s + price * i.quantity;
            }, 0),
          };
        });

        return {
          ...old,
          cart: { ...old.cart, vendors: updatedVendors },
          totalItems: updatedVendors
            .flatMap(v => v.items)
            .reduce((s, i) => s + i.quantity, 0),
        };
      });

      return { previousCart };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(cartKey, context.previousCart);

      toast.error(
        error?.response?.data?.message || 'Failed to update quantity'
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });


  // On removing a product from cart
  const removeFromCart = useMutation({
    mutationFn: async (productId) => {
      const { data } = await Api.delete(`/cart/delete/${productId}`);
      return data;
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: cartKey });

      const previousCart = queryClient.getQueryData(cartKey);

      queryClient.setQueryData(cartKey, (old) => {
        if (!old?.cart?.vendors) return old;

        const updatedVendors = old.cart.vendors
          .map(v => {
            const items = v.items.filter(
              i => i.productId.toString() !== productId.toString()
            );

            return {
              ...v,
              items,
              vendorTotal: items.reduce((s, i) => {
              const price = i.discount > 0 ? i.discountPrice : i.price;
              return s + price * i.quantity;
            }, 0),
            };
          })
          .filter(v => v.items.length > 0);

        return {
          ...old,
          cart: { ...old.cart, vendors: updatedVendors },
          totalItems: updatedVendors
            .flatMap(v => v.items)
            .reduce((s, i) => s + i.quantity, 0),
        };
      });

      return { previousCart };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(cartKey, context.previousCart);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });


  // on clearing cart
  const clearCart = useMutation({
    mutationFn: async () => {
      const { data } = await Api.put('/cart/clear');
      return data;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKey });

      const previousCart = queryClient.getQueryData(cartKey);

      queryClient.setQueryData(cartKey, (old) => ({
        ...old,
        cart: { vendors: [] },
        totalItems: 0,
      }));

      const toastId = toast.loading('Clearing cart...');
      return { previousCart, toastId };
    },

    onSuccess: (data, _, context) => {
      toast.success('Cart cleared', { id: context.toastId });
      queryClient.setQueryData(cartKey, data);
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(cartKey, context.previousCart);
    },
  });

  const flattenedItems =
    getCart.data?.cart?.vendors?.flatMap(v => v.items) || [];

  return {
    cart: {
      ...getCart.data?.cart,
      items: flattenedItems,
    },
    totalItems: getCart.data?.totalItems || 0,
    pricing: getCart.data?.pricing || null,
    isLoading: getCart.isLoading,
    isError: getCart.isError,

    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};

export default useCart;