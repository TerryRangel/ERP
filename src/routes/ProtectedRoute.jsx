import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Simulamos la verificación del token en localStorage
  const token = localStorage.getItem('token');
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}