// src/services/authService.js
import axios from 'axios';

// Obtiene la variable de entorno configurada
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const authService = {
  login: async (usuario, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        usuario,
        password
      });

      // Si la respuesta contiene el token, lo guardamos en localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};