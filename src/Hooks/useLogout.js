import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../Context/AuthContext';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: authLogout } = useAuth();

  const logout = async () => {
    await authLogout();

    queryClient.invalidateQueries(['me']);   
    queryClient.clear(); 
  };

  return logout;
};
