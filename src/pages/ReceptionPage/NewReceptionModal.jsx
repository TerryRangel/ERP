import { useState, useEffect, useRef, useMemo } from "react";
import api from "../../services/api";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function NewReceptionModal({ isOpen, onClose, onSuccess }) {
  const [proveedores, setProveedores] = useState([]);
  
  const [formData, setFormData] = useState({
    proveedorId: "",
    documento: "",
    estado: "ENTREGADO",
    notas: ""
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      cargarProveedores();
      setFormData({ proveedorId: "", documento: "", estado: "ENTREGADO", notas: "" });
      setItems([{ id: Date.now(), nombreProducto: "", cantidad: 1, costoUnitario: 0 }]);
      setError(null);
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const cargarProveedores = async () => {
    setFetching(true);
    try {
      const response = await api.get("/suppliers").catch(() => ({ data: [] }));
      const listaProv = response.data?.items || response.data || [];
      setProveedores(listaProv);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), nombreProducto: "", cantidad: 1, costoUnitario: 0 }]);
  };

  const handleRemoveItem = (idToRemove) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== idToRemove));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const totales = useMemo(() => {
    return items.reduce((acc, item) => {
      const cant = Number(item.cantidad) || 0;
      const costo = Number(item.costoUnitario) || 0;
      return {
        articulos: acc.articulos + cant,
        monto: acc.monto + (cant * costo)
      };
    }, { articulos: 0, monto: 0 });
  }, [items]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.proveedorId) {
      setError("Por favor selecciona un proveedor.");
      return;
    }
    
    const validItems = items.filter(i => i.nombreProducto.trim() !== "" && Number(i.cantidad) > 0);
    if (validItems.length === 0) {
      setError("Agrega al menos un producto con un nombre y cantidad válidos.");
      return;
    }

    setLoading(true);
    setError(null);

    const provSeleccionado = proveedores.find(p => p.id === formData.proveedorId);

    const payload = {
      ...formData,
      proveedor: provSeleccionado ? provSeleccionado.nombre : "Proveedor Desconocido",
      productos: validItems.map(i => ({
        nombre: i.nombreProducto,
        cantidad: Number(i.cantidad),
        costoUnitario: Number(i.costoUnitario)
      })),
      totalArticulos: totales.articulos,
      costoTotal: totales.monto
    };

    try {
      await api.post("/recepciones", payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la recepción.");
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass = "w-full !bg-[#f8f8f6] border-none rounded-2xl py-3 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400";

  return (
    <dialog ref={dialogRef} className="modal modal-middle backdrop-blur-sm" data-theme="light" onCancel={onClose}>
    
      <div className="modal-box w-[calc(100%-32px)] sm:w-11/12 !max-w-4xl !bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative !text-[#1F2937] overflow-y-auto !max-h-[90dvh]">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors" disabled={loading}>
          <i className="bi bi-x-lg text-lg"></i>
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest !text-[#8d9b70] font-semibold mb-2">
            <i className="bi bi-box-arrow-in-down text-lg"></i>
            Entrada de Mercancía
          </div>
          <h3 className="text-xl font-medium !text-[#1F2937]">
            Nueva Recepción
          </h3>
        </div>

        {error && (
          <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-[#8d9b70]"></span>
            <p className="mt-4 text-gray-500 font-medium">Sincronizando proveedores...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* DATOS DEL DOCUMENTO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* PROVEEDOR */}
              <div className="form-control w-full relative md:col-span-2">
                <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Proveedor *</label>
                <div className="relative w-full">
                  <i className="bi bi-building absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none z-10"></i>
                  <select 
                    required 
                    name="proveedorId" 
                    value={formData.proveedorId} 
                    onChange={handleFormChange}
                    className={`${inputBaseClass} appearance-none cursor-pointer`}
                    disabled={loading}
                  >
                    <option value="" disabled>Selecciona un proveedor...</option>
                    {proveedores.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                  <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs z-10"></i>
                </div>
              </div>

              {/* ESTADO */}
              <div className="form-control w-full relative">
                <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Estado</label>
                <div className="relative w-full">
                  <i className="bi bi-flag absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none z-10"></i>
                  <select 
                    name="estado" 
                    value={formData.estado} 
                    onChange={handleFormChange}
                    className={`${inputBaseClass} appearance-none cursor-pointer`}
                    disabled={loading}
                  >
                    <option value="ENTREGADO">ENTREGADO</option>
                    <option value="PENDIENTE">PENDIENTE DE LLEGAR</option>
                  </select>
                  <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs z-10"></i>
                </div>
              </div>

              {/* DOCUMENTO */}
              <div className="form-control w-full relative">
                <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Factura/Nota (Opcional)</label>
                <div className="relative w-full">
                  <i className="bi bi-receipt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                  <input 
                    type="text" 
                    name="documento" 
                    placeholder="Ej: REM-55432" 
                    className={inputBaseClass} 
                    value={formData.documento} 
                    onChange={handleFormChange} 
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* PRODUCTOS MANUALES */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-4 ml-1 block">Artículos Recibidos</label>
              
              <div className="hidden md:grid grid-cols-12 gap-2 px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="col-span-5">Producto</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Costo Unit.</div>
                <div className="col-span-2 text-right">Subtotal</div>
                <div className="col-span-1"></div>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    
                    <div className="col-span-1 md:col-span-5 relative">
                      <input 
                        type="text"
                        required
                        placeholder="Nombre del artículo"
                        value={item.nombreProducto}
                        onChange={(e) => handleItemChange(item.id, 'nombreProducto', e.target.value)}
                        className="w-full !bg-[#f8f8f6] border-none rounded-2xl !py-3 !px-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none"
                        disabled={loading}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 relative">
                      <input 
                        type="number" 
                        min="1"
                        required
                        placeholder="Cant."
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(item.id, 'cantidad', e.target.value)}
                        className="w-full !bg-[#f8f8f6] border-none rounded-2xl py-3 px-4 !text-[#2D2D2D] text-sm text-center focus:ring-2 focus:ring-[#8d9b70]/30 outline-none"
                        disabled={loading}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 relative">
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        required
                        placeholder="Costo"
                        value={item.costoUnitario}
                        onChange={(e) => handleItemChange(item.id, 'costoUnitario', e.target.value)}
                        className="w-full !bg-[#f8f8f6] border-none rounded-2xl py-3 px-4 !text-[#2D2D2D] text-sm text-right focus:ring-2 focus:ring-[#8d9b70]/30 outline-none"
                        disabled={loading}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 text-right px-2">
                      <span className="font-medium text-[#1F2937] text-sm block py-3">
                        {formatMoney((Number(item.cantidad) || 0) * (Number(item.costoUnitario) || 0))}
                      </span>
                    </div>

                    <div className="col-span-1 md:col-span-1 flex justify-center">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1 || loading}
                        className="w-10 h-10 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center disabled:opacity-30"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={handleAddItem}
                className="mt-3 text-sm font-medium text-[#8d9b70] hover:text-[#6A734D] flex items-center gap-2 transition-colors ml-2"
                disabled={loading}
              >
                <i className="bi bi-plus-circle"></i> Añadir otro artículo
              </button>
            </div>

            {/* TOTALES Y BOTONES DE ACCIÓN */}
            <div className="border-t border-gray-100 pt-6 mt-8">
              <div className="flex justify-between items-center mb-6 px-4 py-4 bg-[#f8f8f6] rounded-2xl">
                <span className="text-sm font-semibold text-gray-500">Total Artículos: {totales.articulos}</span>
                <span className="text-lg font-bold text-[#8d9b70]">{formatMoney(totales.monto)}</span>
              </div>

              <div className="modal-action mt-4 flex justify-center gap-8 border-none pt-0">
                <button type="button" className="flex items-center gap-2 px-6 py-2 rounded-full !text-gray-500 font-medium hover:!bg-gray-100 hover:!text-gray-800 transition-all duration-300" onClick={onClose} disabled={loading}>
                  <i className="bi bi-x-circle text-lg"></i> Cancelar
                </button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-full !text-[#1F2937] font-medium hover:!bg-[#EEF1E7] hover:!text-[#6A734D] transition-all duration-300" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span> Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill text-lg"></i> Guardar Recepción
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}