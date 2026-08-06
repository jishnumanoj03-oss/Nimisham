import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../feedback/LoadingScreen';

export default function RoleRoute({ children, roles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
