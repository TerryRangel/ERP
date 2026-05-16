import React, { useState } from "react";
import api from "../../services/api";
import "bootstrap-icons/font/bootstrap-icons.css";

// Lista ampliada con permisos de "Lectura" y "Gestión Total"
const DEFAULT_PERMISSIONS = [
  // DASHBOARD & AUDITORÍA
  { code: "dashboard:read", nombre: "Ver Dashboard", modulo: "Lectura", icon: "bi-speedometer2", desc: "Solo visualización de métricas y gráficas" },
  { code: "audit:read", nombre: "Ver Auditoría", modulo: "Lectura", icon: "bi-clipboard2-data", desc: "Ver el registro de movimientos del sistema" },

  // USUARIOS
  { code: "users:read", nombre: "Ver Usuarios", modulo: "Lectura", icon: "bi-people", desc: "Solo ver la lista de usuarios del sistema" },
  { code: "users:create", nombre: "Gestión de Usuarios", modulo: "Control Total", icon: "bi-person-gear", desc: "Crear, editar y eliminar cuentas de usuario" },

  // PRODUCTOS
  { code: "products:read", nombre: "Ver Productos", modulo: "Lectura", icon: "bi-box-seam", desc: "Solo consultar el catálogo de productos" },
  { code: "products:create", nombre: "Gestión de Productos", modulo: "Control Total", icon: "bi-boxes", desc: "Agregar, editar y eliminar productos" },

  // INVENTARIO
  { code: "inventory:read", nombre: "Ver Inventario", modulo: "Lectura", icon: "bi-archive", desc: "Solo consultar niveles de stock actual" },
  { code: "inventory:create", nombre: "Gestión Inventario", modulo: "Control Total", icon: "bi-box-arrow-in-down", desc: "Ajustar, ingresar y retirar mercancía" },

  // CLIENTES
  { code: "clients:read", nombre: "Ver Clientes", modulo: "Lectura", icon: "bi-person-vcard", desc: "Solo consultar el directorio de clientes" },
  { code: "clients:create", nombre: "Gestión de Clientes", modulo: "Control Total", icon: "bi-person-plus", desc: "Registrar, editar y eliminar clientes" },

  // PROVEEDORES
  { code: "suppliers:read", nombre: "Ver Proveedores", modulo: "Lectura", icon: "bi-truck", desc: "Solo consultar la lista de proveedores" },
  { code: "suppliers:create", nombre: "Gestión Proveedores", modulo: "Control Total", icon: "bi-building-gear", desc: "Registrar, editar y dar de baja proveedores" },
];

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    password: "",
    role: "USER",
    permissions: ["auth:me", "dashboard:read"], // Permisos por defecto
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (code) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(code)
        ? prev.permissions.filter((p) => p !== code)
        : [...prev.permissions, code],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/users", formData);
      onUserAdded();
      onClose();
      // Reiniciar formulario
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        usuario: "",
        password: "",
        role: "USER",
        permissions: ["auth:me", "dashboard:read"],
        activo: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] border border-[#E6EBDA] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-[fadeIn_.25s_ease] my-auto">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-[#8d9b70] via-[#95a67a] to-[#7c8b61]" />
        
        <div className="relative z-10">
          {/* HEADER */}
          <div className="px-6 sm:px-10 pt-8 pb-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <i className="bi bi-person-plus-fill text-white text-4xl"></i>
                </div>
                <div>
                  <p className="text-white/80 uppercase tracking-[0.25em] text-xs font-semibold mb-2">Administración</p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">Nuevo Usuario</h2>
                  <p className="text-sm text-white/90 mt-2">Configura credenciales y nivel de acceso</p>
                </div>
              </div>
              <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-[#8d9b70] hover:scale-105">
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="bg-[#F8FAF5] rounded-t-[2.5rem] px-6 sm:px-10 py-8">
            {error && (
              <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                <i className="bi bi-exclamation-circle-fill text-lg"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* INPUTS PERSONALES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* NOMBRE */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Nombre</label>
                  <div className="relative">
                    <input
                      required
                      name="nombre"
                      placeholder="Ej. Ana"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10"
                    />
                    <i className="bi bi-person absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* APELLIDO */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Apellido</label>
                  <div className="relative">
                    <input
                      required
                      name="apellido"
                      placeholder="Ej. Pérez"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10"
                    />
                    <i className="bi bi-person-badge absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* USERNAME */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Usuario</label>
                  <div className="relative">
                    <input
                      required
                      name="usuario"
                      placeholder="ana_perez"
                      value={formData.usuario}
                      onChange={handleChange}
                      className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10"
                    />
                    <i className="bi bi-at absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Contraseña</label>
                  <div className="relative">
                    <input
                      required
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10"
                    />
                    <i className="bi bi-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Correo Electrónico</label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="correo@taller.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10"
                  />
                  <i className="bi bi-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              {/* PERMISOS */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937]">Nivel de Acceso y Permisos</h3>
                    <p className="text-sm text-gray-500">Otorga accesos de solo lectura o control total por módulo</p>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-[#8d9b70]/10 text-[#8d9b70] text-sm font-bold">
                    {formData.permissions.length} seleccionados
                  </div>
                </div>

                {/* Contenedor con Scroll para la nueva cantidad de permisos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto p-2 pr-4 custom-scrollbar">
                  {DEFAULT_PERMISSIONS.map((perm) => {
                    const active = formData.permissions.includes(perm.code);
                    return (
                      <label 
                        key={perm.code} 
                        className={`relative p-5 rounded-3xl border cursor-pointer transition-all duration-300 flex items-start gap-4 
                        ${active ? "bg-[#8d9b70] border-[#8d9b70] text-white shadow-lg scale-[1.02]" : "bg-white border-[#DDE5CD] hover:border-[#8d9b70]/50 hover:shadow-md"}`}
                      >
                        <input type="checkbox" className="hidden" checked={active} onChange={() => togglePermission(perm.code)} />
                        
                        {/* ICONO */}
                        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl ${active ? "bg-white/20 text-white" : "bg-[#EEF1E7] text-[#8d9b70]"}`}>
                          <i className={`bi ${perm.icon}`}></i>
                        </div>

                        {/* TEXTOS */}
                        <div className="flex-1 pt-0.5">
                          <div className="flex justify-between items-start">
                            <span className="block text-base font-bold">{perm.nombre}</span>
                            {active && <i className="bi bi-check-circle-fill text-xl"></i>}
                          </div>
                          
                          <span className={`inline-block mt-1 mb-1.5 text-[9px] uppercase font-bold tracking-[0.15em] px-2.5 py-1 rounded-full ${active ? "bg-white/20 text-white" : "bg-[#8d9b70]/10 text-[#8d9b70]"}`}>
                            {perm.modulo}
                          </span>
                          
                          <p className={`text-xs leading-relaxed mt-1 pr-4 ${active ? "text-white/80" : "text-gray-500"}`}>
                            {perm.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#DDE5CD]">
                <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md">
                  <div className="flex items-center justify-center gap-2">
                    <i className="bi bi-x-circle text-lg"></i>
                    Cancelar
                  </div>
                </button>

                <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#8d9b70] to-[#7c8b61] text-white font-bold uppercase tracking-wider text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95">
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <i className="bi bi-check-circle-fill text-lg"></i>
                      Crear Usuario
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}