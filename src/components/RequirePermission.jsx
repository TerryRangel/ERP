import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function RequirePermission({ I, children }) {
  const { hasPermission, loading } = useAuth();

  if (loading) return null;

  if (!hasPermission(I)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}