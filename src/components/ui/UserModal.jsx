import React, { useState, useEffect, useRef } from "react";
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

export default function UserFormModal({ isOpen, onClose, onUserSaved, userToEdit }) {
  const isEditing = !!userToEdit;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    password: "",
    role: "USER",
    permissions: ["auth:me", "dashboard:read"], 
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      setError(null);
      if (isEditing) {
        setFormData({
          nombre: userToEdit.nombre || "",
          apellido: userToEdit.apellido || "",
          email: userToEdit.email || "",
          usuario: userToEdit.usuario || "",
          password: "",
          role: userToEdit.role || "USER",
          permissions: userToEdit.permissions || ["auth:me", "dashboard:read"],
          activo: userToEdit.activo !== undefined ? userToEdit.activo : true,
        });
      } else {
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
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, userToEdit, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
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
      const payload = { ...formData };
      if (isEditing && !payload.password) {
        delete payload.password;
      }
      if (isEditing) {
        await api.patch(`/users/${userToEdit.id}`, payload);
      } else {
        await api.post("/users", payload);
      }
      
      onUserSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario.`);
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass = "w-full !bg-[#f8f8f6] border-none rounded-2xl py-3 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400";

  return (
    <dialog ref={dialogRef} className="modal modal-middle backdrop-blur-sm" data-theme="light" onCancel={onClose}>
      
      <div className="modal-box w-[calc(100%-32px)] sm:w-11/12 !max-w-5xl !bg-white rounded-3xl p-6 sm:p-10 shadow-2xl relative !text-[#1F2937] overflow-y-auto !max-h-[90dvh]">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors" disabled={loading}>
          <i className="bi bi-x-lg text-lg"></i>
        </button>

        {/* HEADER DINÁMICO */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest !text-[#8d9b70] font-semibold mb-2">
            <i className={`bi ${isEditing ? 'bi-person-gear' : 'bi-person-plus-fill'} text-lg`}></i>
            Administración
          </div>
          <h3 className="text-2xl font-bold !text-[#1F2937]">
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
          </h3>
          {isEditing && (
             <p className="text-sm text-gray-500 mt-1">Modifica los datos personales y privilegios del sistema.</p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium">
            <i className="bi bi-exclamation-circle-fill text-lg"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TOGGLE ESTADO (Solo visible al editar) */}
          {isEditing && (
            <div className="flex items-center gap-4 w-full mb-4 bg-[#f8f8f6] p-4 rounded-2xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado de la cuenta:</span>
              <label className="flex items-center gap-3 select-none cursor-pointer">
                <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="toggle toggle-success toggle-md" />
                <span className={`font-bold text-sm ${formData.activo ? 'text-green-600' : 'text-gray-400'}`}>
                  {formData.activo ? 'Usuario Activo' : 'Cuenta Suspendida'}
                </span>
              </label>
            </div>
          )}

          {/* DATOS PERSONALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1 block">Nombre</label>
              <div className="relative">
                <input
                  required
                  name="nombre"
                  placeholder="Ej. Ana"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={inputBaseClass}
                />
                <i className="bi bi-person absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1 block">Apellido</label>
              <div className="relative">
                <input
                  required
                  name="apellido"
                  placeholder="Ej. Pérez"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={inputBaseClass}
                />
                <i className="bi bi-person-badge absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1 block">Usuario</label>
              <div className="relative">
                <input
                  required
                  name="usuario"
                  placeholder="ana_perez"
                  value={formData.usuario}
                  onChange={handleChange}
                  className={inputBaseClass}
                />
                <i className="bi bi-at absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1 block">
                Contraseña {isEditing && <span className="text-gray-400 normal-case tracking-normal">(Opcional)</span>}
              </label>
              <div className="relative">
                <input
                  required={!isEditing}
                  type="password"
                  name="password"
                  placeholder={isEditing ? "Escribe solo para cambiarla..." : "••••••••"}
                  value={formData.password}
                  onChange={handleChange}
                  className={inputBaseClass}
                />
                <i className="bi bi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1 block">Correo Electrónico</label>
            <div className="relative">
              <input
                required
                type="email"
                name="email"
                placeholder="correo@empresa.com"
                value={formData.email}
                onChange={handleChange}
                className={inputBaseClass}
              />
              <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
            </div>
          </div>

          {/* PERMISOS */}
          <div className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Nivel de Acceso y Permisos</h3>
                <p className="text-xs text-gray-500 mt-1">Otorga accesos de solo lectura o control total</p>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-[#8d9b70]/10 text-[#8d9b70] text-xs font-bold w-fit">
                {formData.permissions.length} seleccionados
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {DEFAULT_PERMISSIONS.map((perm) => {
                const active = formData.permissions.includes(perm.code);
                return (
                  <label 
                    key={perm.code} 
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-3 
                    ${active ? "bg-[#8d9b70] border-[#8d9b70] text-white shadow-md scale-[1.01]" : "bg-[#f8f8f6] border-transparent hover:border-[#8d9b70]/30"}`}
                  >
                    <input type="checkbox" className="hidden" checked={active} onChange={() => togglePermission(perm.code)} />
                    
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg ${active ? "bg-white/20 text-white" : "bg-white text-[#8d9b70] shadow-sm"}`}>
                      <i className={`bi ${perm.icon}`}></i>
                    </div>

                    <div className="flex-1 pt-0.5">
                      <div className="flex justify-between items-start">
                        <span className="block text-sm font-bold leading-tight pr-2">{perm.nombre}</span>
                        {active && <i className="bi bi-check-circle-fill text-lg"></i>}
                      </div>
                      <span className={`inline-block mt-1 mb-1 text-[8px] uppercase font-bold tracking-[0.15em] px-2 py-0.5 rounded-md ${active ? "bg-white/20 text-white" : "bg-[#8d9b70]/10 text-[#8d9b70]"}`}>
                        {perm.modulo}
                      </span>
                      <p className={`text-[10px] leading-snug ${active ? "text-white/80" : "text-gray-500"}`}>
                        {perm.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* FOOTER Y BOTONES */}
          <div className="modal-action mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
            <button type="button" className="px-6 py-2.5 rounded-full !text-gray-500 font-medium hover:!bg-gray-100 transition-all" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#8d9b70] text-white font-medium hover:bg-[#7c8b61] transition-all shadow-md hover:shadow-lg" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span> Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill"></i> {isEditing ? "Guardar Cambios" : "Crear Usuario"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}