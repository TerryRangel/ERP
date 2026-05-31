import api from './api';

export const suppliersService = {
  // Obtener todos los proveedores
  getSuppliers: async () => {
    try {
      const response = await api.get('/suppliers');
      return response.data;
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      throw new Error("No se pudieron cargar los proveedores");
    }
  },

  // Crear un nuevo proveedor
  createSupplier: async (data) => {
    try {
      const response = await api.post('/suppliers', data);
      return response.data;
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      throw new Error("No se pudo crear el proveedor");
    }
  },

  // Actualizar un proveedor
  updateSupplier: async (id, data) => {
    try {
      const response = await api.patch(`/suppliers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      throw new Error("No se pudo actualizar el proveedor");
    }
  },

  // Eliminar un proveedor
  deleteSupplier: async (id) => {
    try {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      throw new Error("No se pudo eliminar el proveedor");
    }
  }
};