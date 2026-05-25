import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "bootstrap-icons/font/bootstrap-icons.css";

// Lista ampliada con permisos de "Lectura" y "Gestión Total"
const DEFAULT_PERMISSIONS = [
  { code: "dashboard:read", nombre: "Ver Dashboard", modulo: "Lectura", icon: "bi-speedometer2", desc: "Solo visualización de métricas y gráficas" },
  { code: "audit:read", nombre: "Ver Auditoría", modulo: "Lectura", icon: "bi-clipboard2-data", desc: "Ver el registro de movimientos del sistema" },
  { code: "users:read", nombre: "Ver Usuarios", modulo: "Lectura", icon: "bi-people", desc: "Solo ver la lista de usuarios del sistema" },
  { code: "users:create", nombre: "Gestión de Usuarios", modulo: "Control Total", icon: "bi-person-gear", desc: "Crear, editar y eliminar cuentas de usuario" },
  { code: "products:read", nombre: "Ver Productos", modulo: "Lectura", icon: "bi-box-seam", desc: "Solo consultar el catálogo de productos" },
  { code: "products:create", nombre: "Gestión de Productos", modulo: "Control Total", icon: "bi-boxes", desc: "Agregar, editar y eliminar productos" },
  { code: "inventory:read", nombre: "Ver Inventario", modulo: "Lectura", icon: "bi-archive", desc: "Solo consultar niveles de stock actual" },
  { code: "inventory:create", nombre: "Gestión Inventario", modulo: "Control Total", icon: "bi-box-arrow-in-down", desc: "Ajustar, ingresar y retirar mercancía" },
  { code: "clients:read", nombre: "Ver Clientes", modulo: "Lectura", icon: "bi-person-vcard", desc: "Solo consultar el directorio de clientes" },
  { code: "clients:create", nombre: "Gestión de Clientes", modulo: "Control Total", icon: "bi-person-plus", desc: "Registrar, editar y eliminar clientes" },
  { code: "suppliers:read", nombre: "Ver Proveedores", modulo: "Lectura", icon: "bi-truck", desc: "Solo consultar la lista de proveedores" },
  { code: "suppliers:create", nombre: "Gestión Proveedores", modulo: "Control Total", icon: "bi-building-gear", desc: "Registrar, editar y dar de baja proveedores" },
];

export default function EditUserModal({ isOpen, onClose, onUpdate, user }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    password: "",
    role: "USER",
    permissions: [],
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        usuario: user.usuario || "",
        password: "",
        role: user.role || "USER",
        permissions: user.permissions || [],
        activo: user.activo ?? true,
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // LOGICA MEJORADA DE PERMISOS
  const togglePermission = (code) => {
    setFormData((prev) => {
      let newPerms = [...prev.permissions];

      if (newPerms.includes(code)) {
        // Desmarcar el permiso
        newPerms = newPerms.filter((p) => p !== code);
        
        // Si quita un permiso de lectura (read), quitar también el de creación (create)
        if (code.includes(":read")) {
          const createCode = code.replace(":read", ":create");
          newPerms = newPerms.filter((p) => p !== createCode);
        }
      } else {
        // Marcar el permiso
        newPerms.push(code);
        
        // Si marca un permiso de creación (create), asignar automáticamente el de lectura (read)
        if (code.includes(":create")) {
          const readCode = code.replace(":create", ":read");
          if (!newPerms.includes(readCode)) {
            newPerms.push(readCode);
          }
        }
      }

      return { ...prev, permissions: newPerms };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dataToSend = { ...formData };
      const isActivo = dataToSend.activo;
      delete dataToSend.activo;
      if (!dataToSend.password) delete dataToSend.password;

      // Hacemos el envío de los permisos al backend
      await api.patch(`/users/${user.id}`, dataToSend);

      if (user.activo !== isActivo) {
        await api.patch(`/users/${user.id}/toggle-active`, { activo: isActivo });
      }

      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Error al actualizar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] border border-[#E6EBDA] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-[fadeIn_.25s_ease] my-auto">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-[#8d9b70] via-[#95a67a] to-[#7c8b61]" />
        
        <div className="relative z-10">
          {/* HEADER */}
          <div className="px-6 sm:px-10 pt-8 pb-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <i className="bi bi-pencil-square text-white text-4xl"></i>
                </div>
                <div>
                  <p className="text-white/80 uppercase tracking-[0.25em] text-xs font-semibold mb-2">Administración</p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">Editar Usuario</h2>
                  <p className="text-sm text-white/75 mt-2">Modifica las credenciales y accesos del sistema</p>
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
              <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* STATUS & ROLE BAR */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-5 rounded-3xl border border-[#DDE5CD] shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-1/2">
                  <span className="text-xs font-bold text-[#7c8b61] uppercase tracking-wider">Estado:</span>
                  <label className="flex items-center cursor-pointer gap-3 select-none">
                    <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="toggle toggle-success toggle-md" />
                    <span className={`font-bold text-sm ${formData.activo ? 'text-green-600' : 'text-gray-400'}`}>
                      {formData.activo ? 'Activo (Con Acceso)' : 'Inactivo (Bloqueado)'}
                    </span>
                  </label>
                </div>
                <div className="w-full sm:w-1/2 flex items-center gap-4">
                  <span className="text-xs font-bold text-[#7c8b61] uppercase tracking-wider">Rol:</span>
                  <select name="role" value={formData.role} onChange={handleChange} className="select select-bordered w-full rounded-2xl bg-white border-[#DDE5CD] text-gray-700 font-medium focus:border-[#8d9b70] outline-none">
                    <option value="USER">Usuario Estándar</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>

              {/* INPUTS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Nombre</label>
                  <div className="relative">
                    <input required name="nombre" placeholder="Juan" value={formData.nombre} onChange={handleChange} className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10" />
                    <i className="bi bi-person absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Apellido</label>
                  <div className="relative">
                    <input required name="apellido" placeholder="Pérez" value={formData.apellido} onChange={handleChange} className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10" />
                    <i className="bi bi-person-badge absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Usuario</label>
                  <div className="relative">
                    <input required name="usuario" placeholder="usuario123" value={formData.usuario} onChange={handleChange} className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10" />
                    <i className="bi bi-at absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Contraseña</label>
                  <div className="relative">
                    <input type="password" name="password" placeholder="•••••••• (En blanco para mantener)" value={formData.password} onChange={handleChange} className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10" />
                    <i className="bi bi-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Correo Electrónico</label>
                <div className="relative">
                  <input required type="email" name="email" placeholder="correo@empresa.com" value={formData.email} onChange={handleChange} className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10" />
                  <i className="bi bi-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              {/* PERMISSIONS */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937]">Permisos</h3>
                    <p className="text-sm text-gray-500">Ajusta los accesos de lectura o control total</p>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-[#8d9b70]/10 text-[#8d9b70] text-sm font-semibold">
                    {formData.permissions.length} activos
                  </div>
                </div>

                {/* Contenedor con Scroll */}
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
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#DDE5CD]">
                <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md">
                  <div className="flex items-center justify-center gap-2">
                    <i className="bi bi-x-circle text-lg"></i>
                    Cancelar
                  </div>
                </button>

                <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#8d9b70] to-[#7c8b61] text-white font-semibold uppercase tracking-wider text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95">
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <i className="bi bi-check-circle-fill text-lg"></i>
                      Guardar Cambios
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