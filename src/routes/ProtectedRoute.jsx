import { Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  console.log("Auth:", { loading, isAuthenticated });

  if (loading) return <div>Cargando...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;

}

