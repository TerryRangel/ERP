const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token'); 
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const productService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: { ...getAuthHeader(), 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener productos');
    const data = await response.json();
    return data.items || []; 
  },

  create: async (productData) => {
    const payload = {
      sku: productData.sku,
      nombre: productData.nombre,
      descripcion: productData.descripcion || '',
      categoria: productData.categoria || '',
      precioVenta: Number(productData.precioVenta || 0),
      stock: Number(productData.stock || 0),
      activo: true
    };

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear el producto');
    }
    return await response.json();
  },

  update: async (id, productData) => {
    const payload = {
      sku: productData.sku,
      nombre: productData.nombre,
      descripcion: productData.descripcion || '',
      categoria: productData.categoria || '',
      precioVenta: Number(productData.precioVenta || 0),
      stock: Number(productData.stock || 0)
    };

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar el producto');
    }
    return await response.json();
  },

  remove: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al eliminar el producto');
    }
    return await response.json();
  }
};