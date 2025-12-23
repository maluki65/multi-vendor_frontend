import { useAuth } from "../Context/AuthContext"

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};