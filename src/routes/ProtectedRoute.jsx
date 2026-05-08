import { Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  console.log("Auth:", { loading, isAuthenticated });

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-pink-600"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;

}

