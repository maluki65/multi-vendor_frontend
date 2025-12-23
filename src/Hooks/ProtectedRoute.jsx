import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // add loading component later

  return isAuthenticated ? <Outlet/> : <Navigate to='/signin' replace/>;
}