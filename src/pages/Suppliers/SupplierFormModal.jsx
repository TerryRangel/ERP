import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfirmAlert from "../../components/ui/Alert"; 
import "bootstrap-icons/font/bootstrap-icons.css";

export default function SupplierFormModal({ isOpen, onClose, onSave, editData }) {
  const { user } = useAuth();
  const isEditing = !!editData;
  
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const hasCreatePerm = user?.permissions?.includes("suppliers:create");
  const hasFullAccess = isAdmin || hasCreatePerm;
  
  const canInteract = !isEditing || hasFullAccess;
  
  const [formData, setFormData] = useState({
    nombre: "",
    rfc: "",
    email: "",
    telefono: "",
    contacto: "",
    direccion: "",
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "warning" });
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      if (editData) {
        setFormData({
          ...editData,
          activo: editData.activo !== false 
        });
      } else {
        setFormData({ nombre: "", rfc: "", email: "", telefono: "", contacto: "", direccion: "", activo: true });
      }
    } else {
      dialogRef.current?.close();
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    if (!canInteract) return;
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canInteract) return;

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        title: "Error al guardar",
        message: error.message || "Ocurrió un error inesperado.",
        type: "warning" 
      });
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => setAlertConfig({ ...alertConfig, isOpen: false });

  const inputBaseClass = "w-full !bg-[#f8f8f6] border-none rounded-full py-3.5 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed";

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

      <dialog ref={dialogRef} className="modal modal-middle backdrop-blur-sm" data-theme="light" onCancel={onClose}>
        <div className="modal-box w-[calc(100%-32px)] sm:w-11/12 !max-w-4xl !bg-white rounded-3xl p-6 sm:p-10 shadow-2xl relative !text-[#1F2937] overflow-y-auto !max-h-[90dvh]">
          
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors" disabled={loading}>
            <i className="bi bi-x-lg text-xl"></i>
          </button>

          <div className="mb-8 border-b border-gray-100 pb-6">
            <div className={`flex items-center gap-2 text-xs uppercase tracking-widest font-semibold mb-2 ${canInteract ? '!text-[#8d9b70]' : 'text-gray-400'}`}>
              <i className={`bi ${!canInteract ? 'bi-eye' : (isEditing ? 'bi-buildings-fill' : 'bi-building-add')}`}></i>
              Módulo de Suministros
            </div>
            <h3 className="text-2xl font-bold !text-[#1F2937]">
              {!canInteract ? "Detalles del Proveedor" : (isEditing ? "Editar Proveedor" : "Nuevo Proveedor")}
            </h3>
            
            {!canInteract && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
                <i className="bi bi-info-circle-fill"></i> Modo de solo lectura
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TOGGLE ESTADO */}
            {isEditing && (
              <div className="flex items-center gap-4 w-full mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado Operativo:</span>
                <label className={`flex items-center gap-3 select-none ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} disabled={!canInteract} className="toggle toggle-success toggle-md" />
                  <span className={`font-bold text-sm ${formData.activo ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.activo ? 'Proveedor Activo' : 'Inactivo'}
                  </span>
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control w-full relative md:col-span-2">
                <label className="label-text text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1">Nombre de la Empresa / Proveedor *</label>
                <div className="relative w-full">
                  <i className="bi bi-buildings absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                  <input required name="nombre" placeholder="Ej: Estambres El Gato" className={inputBaseClass} value={formData.nombre || ""} onChange={handleChange} disabled={!canInteract}/>
                </div>
              </div>

              <div className="form-control w-full relative">
                <label className="label-text text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1">Persona de Contacto</label>
                <div className="relative w-full">
                  <i className="bi bi-person-badge absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                  <input required name="contacto" placeholder="Ej: Roberto Sánchez" className={inputBaseClass} value={formData.contacto || ""} onChange={handleChange} disabled={!canInteract}/>
                </div>
              </div>

              <div className="form-control w-full relative">
                <label className="label-text text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1">RFC</label>
                <div className="relative w-full">
                  <i className="bi bi-upc-scan absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                  <input name="rfc" placeholder="Opcional" className={`${inputBaseClass} uppercase`} value={formData.rfc || ""} onChange={handleChange} disabled={!canInteract}/>
                </div>
              </div>

              <div className="form-control w-full relative">
                <label className="label-text text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1">Correo Electrónico</label>
                <div className="relative w-full">
                  <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                  <input required type="email" name="email" placeholder="contacto@empresa.com" className={inputBaseClass} value={formData.email || ""} onChange={handleChange} disabled={!canInteract}/>
                </div>
              </div>

              <div className="form-control w-full relative">
                <label className="label-text text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1">Teléfono</label>
                <div className="relative w-full">
                  <i className="bi bi-telephone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                  <input required type="tel" name="telefono" placeholder="10 dígitos" className={inputBaseClass} value={formData.telefono || ""} onChange={handleChange} disabled={!canInteract}/>
                </div>
              </div>

              <div className="form-control w-full relative md:col-span-2">
                <label className="label-text text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1">Dirección de la empresa</label>
                <div className="relative w-full">
                  <i className="bi bi-geo-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                  <input name="direccion" placeholder="Av. Principal #123, Col. Centro" className={inputBaseClass} value={formData.direccion || ""} onChange={handleChange} disabled={!canInteract}/>
                </div>
              </div>
            </div>

            <div className="modal-action mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
              <button type="button" className="px-6 py-2.5 rounded-full !text-gray-500 font-medium hover:!bg-gray-100 transition-all" onClick={onClose} disabled={loading}>
                {canInteract ? "Cancelar" : "Cerrar"}
              </button>
              {canInteract && (
                <button type="submit" className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#8d9b70] text-white font-medium hover:bg-[#7c8b61] transition-all shadow-md hover:shadow-lg" disabled={loading}>
                  {loading ? <span className="loading loading-spinner loading-xs"></span> : <><i className="bi bi-check-circle-fill"></i> Guardar Proveedor</>}
                </button>
              )}
            </div>

          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
    </>
  );
}