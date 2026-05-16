import { useState, useEffect } from 'react';

export default function SupplierFormModal({ isOpen, onClose, onSave, editData }) {
  const [formData, setFormData] = useState({
    nombre: '', contacto: '', email: '', telefono: '', rfc: '', direccion: ''
  });

  // Este useEffect vigila si le pasamos datos para editar. Si sí, llena el formulario.
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      // Si no hay editData, limpiamos el formulario para uno nuevo
      setFormData({ nombre: '', contacto: '', email: '', telefono: '', rfc: '', direccion: '' });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isEditing = !!editData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm md:pl-72">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative animate-fade-in">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-full z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-slate-50/50 pt-8 pb-6 flex flex-col items-center justify-center border-b border-slate-100">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 border border-slate-200 shadow-sm text-slate-600">
            {isEditing ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 text-center">
            {isEditing ? 'Editar Proveedor' : 'Registrar Proveedor'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold text-center">Módulo de Suministros</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Nombre de la Empresa / Proveedor</label>
                <input required name="nombre" value={formData.nombre || formData.name || ''} onChange={handleChange} type="text" placeholder="Ej. Estambres El Gato" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all text-sm text-slate-700" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Persona de Contacto</label>
                  <input required name="contacto" value={formData.contacto || formData.contactName || ''} onChange={handleChange} type="text" placeholder="Nombre completo" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all text-sm text-slate-700" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">RFC</label>
                  <input name="rfc" value={formData.rfc || ''} onChange={handleChange} type="text" placeholder="Opcional" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all text-sm text-slate-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Correo Electrónico</label>
                  <input required name="email" value={formData.email || ''} onChange={handleChange} type="email" placeholder="correo@ejemplo.com" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all text-sm text-slate-700" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Teléfono</label>
                  <input required name="telefono" value={formData.telefono || formData.phone || ''} onChange={handleChange} type="tel" placeholder="10 dígitos" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all text-sm text-slate-700" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm">
                Cancelar
              </button>
              <button type="submit"
                className="flex-1 px-4 py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 shadow-lg transition-all text-sm">
                {isEditing ? 'Guardar Cambios' : '+ Guardar Proveedor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}