import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfirmAlert from "../../components/ui/Alert"; 
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ClientFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { user } = useAuth();
  const isEditing = !!initialData;
  
  // Verificación de permisos
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const hasCreatePerm = user?.permissions?.includes("clients:create");
  const hasFullAccess = isAdmin || hasCreatePerm;
  
  // LA REGLA CLAVE: Puede interactuar si es un registro NUEVO o si tiene ACCESO TOTAL
  const canInteract = !isEditing || hasFullAccess;
  
  const [form, setForm] = useState({
    nombre: "",
    rfc: "",
    email: "",
    telefono: "",
    direccion: "",
    contacto: "",
    notas: "",
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  
  // Estado para controlar tu ConfirmAlert
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning"
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        nombre: "",
        rfc: "",
        email: "",
        telefono: "",
        direccion: "",
        contacto: "",
        notas: "",
        activo: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    // Usamos canInteract en lugar de canEdit
    if (!canInteract) return;

    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Usamos canInteract en lugar de canEdit
    if (!canInteract) return;

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Ya existe un registro con estos datos o hubo un error de conexión.";
      
      setAlertConfig({
        isOpen: true,
        title: "No se pudo guardar",
        message: errorMsg,
        type: "warning" 
      });
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => setAlertConfig({ ...alertConfig, isOpen: false });

  return (
    <>
      <ConfirmAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText="Entendido"
        cancelText="Revisar datos"
        onConfirm={closeAlert}
        onClose={closeAlert}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] border border-[#E6EBDA] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-[fadeIn_.25s_ease] my-auto">
          
          {/* Aquí también cambiamos canEdit por canInteract */}
          <div className={`absolute top-0 left-0 right-0 h-40 ${canInteract ? 'bg-gradient-to-r from-[#8d9b70] via-[#95a67a] to-[#7c8b61]' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`} />
          
          <div className="relative z-10">
            {/* HEADER */}
            <div className="px-6 sm:px-10 pt-8 pb-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                    <i className={`bi ${!canInteract ? 'bi-eye' : (isEditing ? 'bi-person-vcard' : 'bi-person-plus')} text-white text-4xl`}></i>
                  </div>
                  <div>
                    <p className="text-white/80 uppercase tracking-[0.25em] text-xs font-semibold mb-2">Directorio</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">
                      {!canInteract ? "Detalles del Cliente" : (isEditing ? "Editar Cliente" : "Nuevo Cliente")}
                    </h2>
                    <p className="text-sm text-white/75 mt-2">
                      {!canInteract ? "Modo de solo lectura" : (isEditing ? "Modifica los datos comerciales" : "Registra un nuevo contacto comercial")}
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={onClose} 
                  className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-gray-800 hover:scale-105"
                >
                  <i className="bi bi-x-lg text-lg"></i>
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="bg-[#F8FAF5] rounded-t-[2.5rem] px-6 sm:px-10 py-8">
              
              {/* Solo muestra el mensaje si está editando y NO tiene permisos */}
              {!canInteract && isEditing && (
                <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium">
                  <i className="bi bi-info-circle-fill text-lg"></i>
                  <span>No tienes permisos para modificar este registro. Los datos se muestran en modo de solo lectura.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                
                {/* STATUS BAR */}
                {isEditing && (
                  <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#DDE5CD] shadow-sm">
                    <div className="flex items-center gap-4 w-full">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado Comercial:</span>
                      <label className={`flex items-center gap-3 select-none ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                        <input 
                          type="checkbox" 
                          name="activo" 
                          checked={form.activo} 
                          onChange={handleChange} 
                          disabled={!canInteract}
                          className="toggle toggle-success toggle-md" 
                        />
                        <span className={`font-bold text-sm ${form.activo ? 'text-green-600' : 'text-gray-400'}`}>
                          {form.activo ? 'Cliente Activo' : 'Cliente Inactivo'}
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* INPUTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Nombre / Razón Social *</label>
                    <div className="relative">
                      <input 
                        required 
                        name="nombre" 
                        placeholder="Ej. Comercializadora Textiles S.A." 
                        value={form.nombre} 
                        onChange={handleChange} 
                        disabled={!canInteract}
                        className={`w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none font-semibold ${!canInteract ? 'opacity-80 bg-gray-50 cursor-not-allowed' : 'transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10'}`} 
                      />
                      <i className="bi bi-buildings absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">RFC</label>
                    <div className="relative">
                      <input 
                        name="rfc" 
                        placeholder="XAXX010101000" 
                        value={form.rfc || ""} 
                        onChange={handleChange} 
                        disabled={!canInteract}
                        className={`w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none uppercase ${!canInteract ? 'opacity-80 bg-gray-50 cursor-not-allowed' : 'transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10'}`} 
                      />
                      <i className="bi bi-upc-scan absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Teléfono</label>
                    <div className="relative">
                      <input 
                        type="tel"
                        name="telefono" 
                        placeholder="(555) 123-4567" 
                        value={form.telefono || ""} 
                        onChange={handleChange} 
                        disabled={!canInteract}
                        className={`w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none ${!canInteract ? 'opacity-80 bg-gray-50 cursor-not-allowed' : 'transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10'}`} 
                      />
                      <i className="bi bi-telephone absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Correo Electrónico</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="contacto@empresa.com" 
                        value={form.email || ""} 
                        onChange={handleChange} 
                        disabled={!canInteract}
                        className={`w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none ${!canInteract ? 'opacity-80 bg-gray-50 cursor-not-allowed' : 'transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10'}`} 
                      />
                      <i className="bi bi-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Persona de Contacto</label>
                    <div className="relative">
                      <input 
                        name="contacto" 
                        placeholder="Ej. Roberto Sánchez" 
                        value={form.contacto || ""} 
                        onChange={handleChange} 
                        disabled={!canInteract}
                        className={`w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none ${!canInteract ? 'opacity-80 bg-gray-50 cursor-not-allowed' : 'transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10'}`} 
                      />
                      <i className="bi bi-person-badge absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Dirección Fiscal / Entrega</label>
                    <div className="relative">
                      <input 
                        name="direccion" 
                        placeholder="Av. Principal #123, Col. Centro..." 
                        value={form.direccion || ""} 
                        onChange={handleChange} 
                        disabled={!canInteract}
                        className={`w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none ${!canInteract ? 'opacity-80 bg-gray-50 cursor-not-allowed' : 'transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10'}`} 
                      />
                      <i className="bi bi-geo-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Notas Adicionales</label>
                    <textarea 
                      name="notas" 
                      placeholder="Condiciones de crédito, horarios de recepción, etc." 
                      value={form.notas || ""} 
                      onChange={handleChange} 
                      disabled={!canInteract}
                      rows="3"
                      className={`w-full pl-5 pr-5 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 outline-none resize-none custom-scrollbar ${!canInteract ? 'opacity-80 bg-gray-50 cursor-not-allowed' : 'transition-all duration-300 focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10'}`} 
                    />
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#DDE5CD]">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="flex-1 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <i className={`bi ${canInteract ? 'bi-x-circle' : 'bi-arrow-left'} text-lg`}></i>
                      {canInteract ? "Cancelar" : "Regresar"}
                    </div>
                  </button>

                  {canInteract && (
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#8d9b70] to-[#7c8b61] text-white font-semibold uppercase tracking-wider text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <i className="bi bi-check-circle-fill text-lg"></i>
                          {isEditing ? "Guardar Cambios" : "Crear Cliente"}
                        </div>
                      )}
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}