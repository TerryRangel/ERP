import { useAuth } from "../context/AuthContext";

export const Can = ({ perform, excludeRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const userRole = user.role?.toUpperCase();

  // 1. Prioridad: Si es ADMIN, entra siempre
  if (userRole === 'ADMIN') return children;

  // 2. Si el rol está en la lista negra, fuera
  if (excludeRoles.includes(user.role)) return null;

  // 3. Si no hay permiso requerido, se muestra
  if (!perform) return children;

  // 4. Verificación de permisos individuales
  const hasPermission = user.permissions?.includes(perform);
  return hasPermission ? children : null;
};