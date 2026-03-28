import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCurrentUser } from './useCurrentUser';
import { WLoader, AdLoader } from '../components';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, loading } = useAuth();
  const { data: me, isLoading } = useCurrentUser();
  const location = useLocation();

  if (loading || isLoading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
        <AdLoader/>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!me) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-50'>
        <AdLoader/>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(me.role)) {
    if (me.role === 'Buyer') return <Navigate to="/" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}