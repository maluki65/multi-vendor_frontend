import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfileRouteByRole } from "../utils/profileRoutes";
import { useAuth } from "../Context/AuthContext";
import { Api } from "../utils";
import toast from 'react-hot-toast';

export const useProfile = (role) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const route = getProfileRouteByRole(role);
  const PROFILE_KEY = ['profile', role];

  // On getting logged-in user profile
  const profileQuery = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: async () => {
      if (!route) return null;
      try {
        const res = await Api.get(route /*'/users/auth/profile'*/);
        //console.log('Profile API response:', res.data);
        return res.data;
      } catch (error) {
        if (error?.response?.status == 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: isAuthenticated && !!role && !!route,
    staleTime: 40 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });

  // On getting Buyer whole user & profile
  /*const userProfileQuery = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: async() => {
      if (!route) return null;
      try{
        const res = await Api.get(route);
        return res.data;
      } catch (error) {
        if (error?.response?.status == 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: isAuthenticated && !!role &&!!route,
    staleTime: 40 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });*/

  // On  creating profile
  const createProfile = useMutation({
    mutationFn: async (payload) => {
      const res = await Api.post(route, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data.profile);
      queryClient.invalidateQueries(['profile', role]);
    },
  });

  // On updating profile
  const updateProfile = useMutation({
    mutationFn: async (payload) => {
      const res = await Api.patch('/buyer/profile/update', payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data.profile);
      queryClient.invalidateQueries(PROFILE_KEY);
    },
  });

  const updateNotification = useMutation({
    mutationFn: async ({ type, value }) => {
      const res = await Api.patch('/buyer/profile/preferences/notification', {
        type,
        value,
      });
      return res.data;
    },

    onMutate: async ({ type, value }) => {
      await queryClient.cancelQueries(PROFILE_KEY);

      const prev = queryClient.getQueriesData(PROFILE_KEY);

      queryClient.setQueriesData(PROFILE_KEY, (old) => ({
        ...old,
        preferences: {
          ...old?.preferences,
          notification: {
            ...old?.preferences?.notification,
            [type]: value,
          },
        },
      }));

      return { prev };
    },

    onError: (err, variables, context) => {
      queryClient.setQueriesData(PROFILE_KEY, context.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries(PROFILE_KEY);
    }
  })

  // On updating user password
  const updatePassword = useMutation({
    mutationFn: async (payload) => {
      const { data } = await Api.patch('/password/update', payload);
      return data;
    },
    onMutate: () => {
      const toastId = toast.loading('Updating password...');
      return { toastId };
    },

    onSuccess: (data, variables, context) => {
      toast.success('Password updated successfuly', { id: context.toastId});

      if (data?.forceLogout) {
        window.location.href = '/signin';
      }
    },

    onError: (error, variables, context) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update password', { id: context.toastId }
      );

      console.error('Failed to update password', error);
    }
  });

  // On updating profile Img
  const updateProfileImg = useMutation({
    mutationFn: async (payload) => {
      const res = await Api.patch(`${route}/img`, payload);
      return res.data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries(PROFILE_KEY);
      const prev = queryClient.getQueryData(PROFILE_KEY);

      queryClient.setQueryData(PROFILE_KEY, (curr) => 
       curr
        ? {
          ...curr,
          avatar: payload.avatar,
          avatarId: payload.avatarId,
        }
      : curr
    );

    return { prev };
    },

    onError: (_error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(PROFILE_KEY, ctx.prev);
    },

    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data.profile);
    },

    onSettled: () => {
      queryClient.invalidateQueries(PROFILE_KEY);
    },
  });

  return {
    ...profileQuery,
    profile: profileQuery.data?.profile,
    user: profileQuery.data?.user,

    createProfile: createProfile.mutateAsync,
    creating: createProfile.isPending,

    updateProfile: updateProfile.mutateAsync,
    updating: updateProfile.isPending,

    updateProfileImg: updateProfileImg.mutateAsync,
    updatingImg: updateProfileImg.isPending,

    updatePassword,
    updateNotification,
  };
}
