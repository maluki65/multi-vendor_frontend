import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfileRouteByRole } from "../utils/profileRoutes";
import { useAuth } from "../Context/AuthContext";
import { Api } from "../utils";



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
        return res.data.profile;
      } catch (error) {
        if (error?.response?.status == 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: isAuthenticated && !!role && !!route,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });

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
      const res = await Api.patch(route, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data.profile);
      queryClient.invalidateQueries(PROFILE_KEY);
    },
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
    profile: profileQuery.data,

    createProfile: createProfile.mutateAsync,
    creating: createProfile.isPending,

    updateProfile: updateProfile.mutateAsync,
    updating: updateProfile.isPending,

    updateProfileImg: updateProfileImg.mutateAsync,
    updatingImg: updateProfileImg.isPending,
  };
}
