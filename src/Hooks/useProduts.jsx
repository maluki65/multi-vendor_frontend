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
      //console.error('Failed to get fetching products', error);
    }
  });

  // On getting vendor products
  const getVendorProducts = (vendorId, page = 1, search = '') => useQuery({
    queryKey: ['vendorProducts', vendorId, page, search],
    queryFn: async () => {
      const { data } = await Api.get(`/vendor/products/${vendorId}?page=${page}&search=${encodeURIComponent(search)}`);
      return data;
    },
    enabled: !!vendorId,
    staleTime: 1000 * 60,
    onError: (error) =>{
      toast.error(
        error?.response?.data?.message || 'Failed to fetch vendor products'
      );
      console.error('Failed to fetch vendor products', error);
    }
  });

  // On getting all products with visibility: published (buyers)
  const getAllProducts = (params) => useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await Api.get('/buyer/products', { params });
      return data;
    },
    enabled: me?.role === 'Buyer',
    staleTime: 1000 * 60,
    onError: (error) =>{
      toast.error(
        error?.response?.data?.message || 'Failed to fetch products'
      );
      console.error('Failed to fetch products', error);
    }
  });

  // On getting product by Id
  const getProductById = (productId) => useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await Api.get(`/product/${productId}`);
      return data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60,
    onError: (error) =>{
      toast.error(
        error?.response?.data?.message || 'Failed to fetch product'
      );
      console.error('Failed to fetch product', error);
    }
  });

  // On getting recommendations
  const getSmartRecommendations = (productId) => useQuery({
    queryKey: ['recommendations', productId],
    queryFn: async () => {
      const { data } = await Api.get(`/buyer/products/smart/${productId}`);
      return data.recommendations;
    },
    enabled: !!productId,
    onError: (error) =>{
      toast.error(
        error?.response?.data?.message || 'Failed to fetch recommendations'
      );
      console.error('Failed to fetch recommendations', error);
    }
  });

  const createProduct = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.post('/vendor/add-product/', payload);
      return data;
    },

    /*onMutate: () => {
      const id = toast.loading('Creating product...');
      return { toastId: id };
    },*/

    onSuccess: (data, variables, context) => {
      toast.success('Product created successfullt', { id: context.toastId });

      queryClient.invalidateQueries({
        queryKey: ['vendorProducts']
      });
    },

    onError: (error, variable, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to create product',
        { id: context.toastId }
      );
      console.error('Failed to create product', error);
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

      queryClient.invalidateQueries({
        queryKey: ['products']
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
      toast.success('Product rejected successfully', { id: context.toastId });
    
      queryClient.invalidateQueries({
        queryKey: ['pendingProducts']
      });
    },
    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to reject product',
        { id: context.toastId }
      );
    
      console.error('Failed to reject product', error);
    }
  });

  // On updatingProduct
  const updateProduct = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await Api.patch(`/vendor/product/update/${id}`, payload);
      return data;
    },
    /*onMutate: () => {
      const id = toast.loading('Updating product...');
      return { toastId: id };
    },*/

    onSuccess: () => {
      toast.success('Product updated successfully!');
  
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },

    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update product', { id: context.toastId }
      );

      console.error('Failed to update product', error);
    }
  });

  //On deleting product
  const deleteProduct = useMutation({
    mutationFn: async (ProductId) => {
      const { data } = await Api.delete(`/vendor/product/delete/${ProductId}`);
      return data;
    },
    /*onMutate: () => {
      const id = toast.loading('Deleting product...');
      return { toastId: id };
    },
  
    onSuccess: () => {
      toast.success('Product deleted');
  
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },

    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to delete product', { id: context.toastId }
      );

      console.error('Failed to delete product', error);
    }*/
  });

  return { 
    getPendingProducts,
    getVendorProducts,
    getAllProducts,
    getProductById,
    getSmartRecommendations,
    createProduct,
    approveProducts,
    rejectProducts,
    updateProduct,
    deleteProduct
  };
};

export default useProducts;