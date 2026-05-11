import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasPermission = (permissionCode) => {
    if (!user) return false;
    const role = user.role?.toUpperCase();
    if (role === 'ADMIN') return true;
    return user.permissions?.includes(permissionCode) || false;
  };

  const handleUserData = (response) => {
    // Extrae el usuario sin importar si viene en .data, .user o directo
    const userData = response?.data?.user || response?.user || response?.data || response;
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    }
    return null;
  };

  const login = async (usuario, password) => {
    try {
      // 1. Intenta el login (esto genera el token)
      await authService.login(usuario, password);

      try {
        // 2. Intenta obtener el perfil completo
        const response = await authService.getMe();
        return handleUserData(response);
      } catch (meError) {
        // ERROR 403 FIX: Si el login fue exitoso pero /me da 403 (falta auth:me),
        // creamos un estado de sesión básico para que el usuario pueda entrar.
        if (meError.message?.includes('403') || meError.response?.status === 403) {
          console.warn("Acceso limitado: El usuario no tiene permiso auth:me");
          const sessionUser = { usuario, role: 'USER', permissions: [] };
          setUser(sessionUser);
          setIsAuthenticated(true);
          return sessionUser;
        }
        throw meError;
      }
    } catch (error) {
      console.error("Error en proceso de login:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        setLoading(false);
        return;
      }
      try {
        const response = await authService.getMe();
        handleUserData(response);
      } catch (error) {
        // Si el token es válido pero /me da 403, mantenemos la sesión
        if (error.response?.status !== 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};