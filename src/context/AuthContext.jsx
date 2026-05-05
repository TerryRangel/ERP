import {createContext, useState, useEffect} from 'react';
import { useContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (usuario, password) => {
    await authService.login(usuario, password);

    const userData = await authService.getMe();

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Validacion del token al cargar
    useEffect(() => {
        const  checkAuth = async () => {
            if (!authService.isAuthenticated()) {
                setLoading(false);
                return;
            } 
            
            try {
                const userData = await authService.getMe();
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                logout();
            } finally {
                setLoading(false); 
            }
        };

        checkAuth();
    }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}
