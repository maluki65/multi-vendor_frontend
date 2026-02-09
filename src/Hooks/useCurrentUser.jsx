import { useQuery } from "@tanstack/react-query";
import { Api } from "../utils";
import { useAuth } from "../Context/AuthContext";

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await Api.get('/users/auth/me');
      return res.data.user;
    },
    enabled: isAuthenticated,
    staleTime:0,
    refetchOnWindowFocus: false,
  });
};