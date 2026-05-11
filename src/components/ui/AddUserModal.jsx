import React, { useState } from "react";
import api from "../../services/api";

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    password: "",
    role: "USER",
    // IMPORTANTE: Incluimos los permisos base que el backend exige para loguearse
    permissions: ["auth:me", "dashboard:read"], 
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // El backend recibirá el objeto con los permisos incluidos
      await api.post("/users", formData);
      onUserAdded();
      onClose();
      // Reset del formulario
      setFormData({
        nombre: "", apellido: "", email: "", usuario: "",
        password: "", role: "USER", permissions: ["auth:me", "dashboard:read"],
        activo: true
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-pink-100 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Nuevo Usuario</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-pink-500 text-xl">✕</button>
          </div>

          {error && <div className="p-3 mb-4 text-red-600 bg-red-50 rounded-xl text-sm border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input required name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="input input-bordered bg-pink-50/30 border-pink-100 rounded-2xl w-full" />
              <input required name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className="input input-bordered bg-pink-50/30 border-pink-100 rounded-2xl w-full" />
            </div>
            <input required name="email" type="email" placeholder="Correo" value={formData.email} onChange={handleChange} className="input input-bordered bg-pink-50/30 border-pink-100 rounded-2xl w-full" />
            <input required name="usuario" placeholder="Nombre de Usuario" value={formData.usuario} onChange={handleChange} className="input input-bordered bg-pink-50/30 border-pink-100 rounded-2xl w-full" />
            <input required name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="input input-bordered bg-pink-50/30 border-pink-100 rounded-2xl w-full" />
            
            <div className="form-control">
              <label className="label text-xs font-bold text-pink-400 uppercase">Rol</label>
              <select name="role" value={formData.role} onChange={handleChange} className="select select-bordered bg-pink-50/30 border-pink-100 rounded-2xl w-full">
                <option value="USER">Usuario (USER)</option>
                <option value="ADMIN">Administrador (ADMIN)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn flex-1 bg-gray-100 border-none rounded-2xl">Cancelar</button>
              <button type="submit" disabled={loading} className="btn flex-1 bg-pink-500 border-none text-white hover:bg-pink-600 rounded-2xl">
                {loading ? <span className="loading loading-spinner"></span> : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}