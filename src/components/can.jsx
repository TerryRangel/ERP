import { useAuth } from "../context/AuthContext";

export const Can = ({ I, perform, excludeRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const userRole = user.role?.toUpperCase();

  // 1. Prioridad: Si es ADMIN, entra siempre
  if (userRole === 'ADMIN') return children;

  // 2. Si el rol está en la lista negra, fuera
  if (excludeRoles.includes(user.role)) return null;

  // Detectamos si usaste "I" o "perform"
  const permissionRequired = I || perform;

  // 3. Si no hay permiso requerido, se muestra
  if (!permissionRequired) return children;

  // 4. Verificación de permisos individuales
  const hasPermission = user.permissions?.includes(permissionRequired);
  return hasPermission ? children : null;
};