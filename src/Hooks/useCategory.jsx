import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";
import toast  from 'react-hot-toast';
import { Api } from '../utils';

const useCategory = (categoryId) => {
  const queryClient = useQueryClient();
  const { data: me } = useCurrentUser();
  
  const getAllCategories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await Api.get('/admin/categories')
      return data.categories;
    },
    enabled: me?.role === 'Admin',
    staleTime: 1000 * 60,
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Failed to get categories'
      );
      console.error('Failed to get categories', error);
    }
  });

  const getCategoryAttributes  = useQuery({
    queryKey: ['categoryAttributes', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data } = await Api.get(`/vendor/category-Attributes/${categoryId}`);
      return data.attributes;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60,
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Failed to get category attribute'
      );
      console.error('Failed to get category attribute', error);
    },
  });

  const getActiveCategories = useQuery({
    queryKey:['activeCategories'],
    queryFn: async () => {
      const { data } = await Api.get('/vendor/categories')
      return data.categories;
    },
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
     toast.error(
       error?.response?.data?.message || 'Failed to get active categories'
     )
     console.error('Failed to get active categories', error);
    }
  });

  const addCategory = useMutation({
    mutationFn: async (categoryData) => {
      const { data } = await Api.post('/admin/categories', categoryData);
      return data;
    },

    onMutate: () => {
      const id = toast.loading('Creating category...');
      return { toastId: id };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Category created successfully', { id: context.toastId });

      queryClient.invalidateQueries({
        queryKey:['categories']
      });

      queryClient.invalidateQueries({
        queryKey: ['activeCategories']
      });
    },

    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to create category',
        { id: context.toastId }
      );

      console.error('Failed to create category', error);
    }
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, updateData }) => {
      const { data } = await Api.patch(`/admin/categories/${id}`, updateData);
      return data;
    },

    onMutate: () => {
      const id = toast.loading('Updating category...');
      return { toastId: id };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Category updated successfully', { id: context.toastId });

      queryClient.invalidateQueries({
        queryKey: ['categories']
      });

      queryClient.invalidateQueries({
        queryKey: ['activeCategories']
      });
    },

    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update category',
        { id: context.toastId }
      );

      console.error('Failed to update category', error);
    }
  });

  const deactivateCategory = useMutation({
    mutationFn: async (id) => {
      const { data } = await Api.patch(`/admin/update/categories/:${id}`);
      return data;
    },

    onMutate: () => {
      const id = toast.loading('Deactivating category...');
      return { toastId: id };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Category deactivated successfully', { id: context.toastId });

      queryClient.invalidateQueries({
        queryKey: ['categories']
      });

      queryClient.invalidateQueries({
        queryKey: ['activeCategories']
      });
    },

    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to deactivate category',
        { id: context.toastId }
      );

      console.error('Failed to deactivate category', error);
    }
  });

  return {
    getAllCategories,
    getActiveCategories,
    addCategory,
    updateCategory,
    deactivateCategory,
    getCategoryAttributes,
  };
};

export default useCategory