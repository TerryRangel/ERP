import api from './api';


export const authService = {
  login: async (usuario, password) => {
    try {
      const response = await api.post('/auth/login', {
        usuario,
        password
      });

      const data = response.data;

      // Si la respuesta contiene el token, lo guardamos en localStorage
      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
    }
  },

  // Obtener el usuario actual 
  getMe : async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error("No Autorizado");
    }
  },

  //Logout 
  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};