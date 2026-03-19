import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";
import toast  from 'react-hot-toast';
import { Api } from '../utils';

const useCategory = (categoryId, page) => {
  const queryClient = useQueryClient();
  const { data: me } = useCurrentUser();
  
  const getAllCategories = useQuery({
    queryKey: ['categories', page],
    queryFn: async () => {
      const { data } = await Api.get(`/admin/categories?page=${page}&limit=10`);
      return data.categories;
    },
    enabled: me?.role === 'Admin',
    staleTime: 1000 * 60,
    keepPreviousData: true,
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
      const { data } = await Api.get(`/category-Attributes/${categoryId}`);
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

  const fetchCategoryAttributes = async (categoryId) => {
    if(!categoryId) return [];

    try{
      const { data } = await Api.get(`/category-Attributes/${categoryId}`);
      return data.attributes;
    } catch (error) {
      console.error('Error fetchin category attributes:', error);

      const message = error?.response?.data?.message || 'Failed to fetch category attributes';

      throw new Error(message);
    }
  };

  const useCategoryAttributes = (categoryId) => {
    return useQuery({
      queryKey: ['categoryAttributes', categoryId],
      queryFn: () => fetchCategoryAttributes(categoryId),
      enabled: !!categoryId,
      staleTime: 1000 * 60 * 5,
      retry: 1,
      onError: (error) => {
        console.error('React query error', error);

        toast.error(
          error.message || 'Failed to load category attributes'
        );
      }
    });
  };

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
      const { data } = await Api.patch(`/admin/categories/update/${id}`, updateData);
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

  const toggleStatusMutation = useMutation({
    mutationFn: async (category) => {
      const { data } = await Api.patch(`/admin/categories/${category._id}/status`,{ 
        isActive: !category.isActive,
      });
      return data;
    }, 
    onMutate: () => {
      const toastId = toast.loading('Updating category status...');
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success(data.message, { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['activeCategories'] });
    },
    onError: (error, variables, context) => {
      toast.error(error?.response?.data?.message || 'Failed to update category', { id: context.toastId });
      console.error('Failed to update category', error);
    }
  })

  return {
    getAllCategories,
    getActiveCategories,
    fetchCategoryAttributes,
    useCategoryAttributes,
    addCategory,
    updateCategory,
    deactivateCategory,
    getCategoryAttributes,
    toggleStatusMutation
  };
};

export default useCategory