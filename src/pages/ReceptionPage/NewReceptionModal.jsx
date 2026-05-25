import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function NewReceptionModal({ isOpen, onClose, onSuccess }) {
  // --- ESTADO DE PROVEEDORES DE LA BASE DE DATOS ---
  const [proveedores, setProveedores] = useState([]);
  
  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    proveedorId: "",
    documento: "",
    estado: "ENTREGADO",
    notas: ""
  });

  // Lista dinámica de productos
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // --- CARGAR PROVEEDORES AL ABRIR ---
  useEffect(() => {
    if (isOpen) {
      cargarProveedores();
      setFormData({ proveedorId: "", documento: "", estado: "ENTREGADO", notas: "" });
      setItems([{ id: Date.now(), nombreProducto: "", cantidad: 1, costoUnitario: 0 }]);
      setError(null);
    }
  }, [isOpen]);

  const cargarProveedores = async () => {
    setFetching(true);
    try {
      const response = await api.get("/suppliers").catch(() => ({ data: [] }));
      const listaProv = response.data?.items || response.data || [];
      setProveedores(listaProv);
    } catch (error) {
      console.error("Error al cargar proveedores de la base de datos:", error);
    } finally {
      setFetching(false);
    }
  };

  // --- MANEJO DEL FORMULARIO GENERAL ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- MANEJO DE LA LISTA DE PRODUCTOS MANUALES ---
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

  // --- CÁLCULOS EN TIEMPO REAL ---
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

  // --- ENVIAR DATOS AL BACKEND ---
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-[fadeIn_.2s_ease] my-auto">
        
        {/* DECORACIÓN SUPERIOR */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#8d9b70] via-[#95a67a] to-[#7c8b61]" />
        
        <div className="relative z-10">
          {/* HEADER */}
          <div className="px-6 sm:px-10 pt-8 pb-6 flex justify-between items-start">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <i className="bi bi-box-arrow-in-down text-white text-3xl"></i>
              </div>
              <div>
                <p className="text-white/80 uppercase tracking-[0.25em] text-xs font-semibold mb-1">Entrada de Mercancía</p>
                <h2 className="text-3xl font-bold text-white">Nueva Recepción</h2>
              </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#8d9b70] transition-all">
              <i className="bi bi-x-lg text-lg"></i>
            </button>
          </div>

          {/* CUERPO DEL MODAL */}
          <div className="bg-[#F8FAF5] rounded-t-[2.5rem] px-6 sm:px-10 py-8">
            {error && (
              <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            {fetching ? (
              <div className="flex flex-col items-center justify-center py-20">
                <span className="loading loading-spinner loading-lg text-[#8d9b70]"></span>
                <p className="mt-4 text-gray-500 font-medium">Sincronizando proveedores de la base de datos...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECCIÓN 1: DATOS GENERALES */}
                <div className="bg-white p-6 rounded-[2rem] border border-[#DDE5CD] shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-5 flex items-center gap-2">
                    <i className="bi bi-info-circle text-[#8d9b70]"></i> Datos del Documento
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Proveedor Base de Datos */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Proveedor (Desde Base de Datos) *</label>
                      <div className="relative">
                        <select 
                          required 
                          name="proveedorId" 
                          value={formData.proveedorId} 
                          onChange={handleFormChange}
                          // Cambiamos el padding: pl-5 pr-12
                          className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-[#F8FAF5] border border-[#DDE5CD] text-gray-700 font-medium outline-none focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10 appearance-none"
                        >
                          <option value="" disabled>Selecciona un proveedor registrado...</option>
                          {proveedores.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                          ))}
                        </select>
                        {/* Ícono a la derecha */}
                        <i className="bi bi-building absolute right-5 top-1/2 -translate-y-1/2 text-[#8d9b70] text-lg pointer-events-none"></i>
                      </div>
                      {proveedores.length === 0 && (
                         <p className="text-xs text-red-500 mt-2 font-medium">No hay proveedores registrados. Ve al módulo de proveedores para crear uno.</p>
                      )}
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Estado de Recepción</label>
                      <div className="relative">
                        <select 
                          name="estado" 
                          value={formData.estado} 
                          onChange={handleFormChange}
                          // Cambiamos el padding: pl-5 pr-12
                          className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-[#F8FAF5] border border-[#DDE5CD] text-gray-700 font-bold outline-none focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10 appearance-none"
                        >
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="PENDIENTE">PENDIENTE DE LLEGAR</option>
                        </select>
                        {/* Ícono a la derecha */}
                        <i className="bi bi-flag absolute right-5 top-1/2 -translate-y-1/2 text-[#8d9b70] text-lg pointer-events-none"></i>
                      </div>
                    </div>

                    {/* Documento */}
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#7c8b61] mb-2 block">Factura o Nota de Remisión (Opcional)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          name="documento" 
                          placeholder="Ej. REM-55432" 
                          value={formData.documento} 
                          onChange={handleFormChange}
                          // Cambiamos el padding: pl-5 pr-12
                          className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-[#F8FAF5] border border-[#DDE5CD] text-gray-700 outline-none transition-all focus:border-[#8d9b70] focus:ring-4 focus:ring-[#8d9b70]/10"
                        />
                        {/* Ícono a la derecha */}
                        <i className="bi bi-receipt absolute right-5 top-1/2 -translate-y-1/2 text-[#8d9b70] text-lg pointer-events-none"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 2: PRODUCTOS MANUALES */}
                <div className="bg-white p-6 rounded-[2rem] border border-[#DDE5CD] shadow-sm">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                      <i className="bi bi-pen text-[#8d9b70]"></i> Captura Manual de Productos
                    </h3>
                  </div>

                  <div className="hidden md:grid grid-cols-12 gap-3 px-4 pb-2 border-b border-[#EEF2E7] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="col-span-5">Descripción / Nombre del Producto</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Costo Unit.</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                    <div className="col-span-1 text-center"></div>
                  </div>

                  <div className="space-y-3 mt-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-[#FAFBF8] p-3 md:p-2 rounded-2xl border border-[#EEF2E7] transition-all hover:border-[#DDE5CD]">
                        
                        {/* PRODUCTO */}
                        <div className="col-span-1 md:col-span-5 relative">
                          <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Producto</label>
                          <input 
                            type="text"
                            required
                            placeholder="Ej. Estambre rojo..."
                            value={item.nombreProducto}
                            onChange={(e) => handleItemChange(item.id, 'nombreProducto', e.target.value)}
                            // Padding ajustado
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-[#DDE5CD] text-sm text-gray-700 outline-none focus:border-[#8d9b70]"
                          />
                          <i className="bi bi-box-seam absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none md:top-1/2 md:mt-0 mt-[12px]"></i>
                        </div>

                        {/* CANTIDAD */}
                        <div className="col-span-1 md:col-span-2 relative">
                          <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Cantidad</label>
                          <input 
                            type="number" 
                            min="1"
                            required
                            value={item.cantidad}
                            onChange={(e) => handleItemChange(item.id, 'cantidad', e.target.value)}
                            // Padding ajustado
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-[#DDE5CD] text-sm text-center text-gray-700 outline-none focus:border-[#8d9b70]"
                          />
                          <i className="bi bi-hash absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none md:top-1/2 md:mt-0 mt-[12px]"></i>
                        </div>

                        {/* COSTO UNITARIO */}
                        <div className="col-span-1 md:col-span-2 relative">
                          <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Costo Unitario</label>
                          <input 
                            type="number" 
                            min="0"
                            step="0.01"
                            required
                            value={item.costoUnitario}
                            onChange={(e) => handleItemChange(item.id, 'costoUnitario', e.target.value)}
                            // Padding ajustado
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-[#DDE5CD] text-sm text-right text-gray-700 outline-none focus:border-[#8d9b70]"
                          />
                          <i className="bi bi-currency-dollar absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none md:top-1/2 md:mt-0 mt-[12px]"></i>
                        </div>

                        {/* SUBTOTAL */}
                        <div className="col-span-1 md:col-span-2 text-right">
                          <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Subtotal</label>
                          <span className="font-bold text-[#5F6F52] bg-[#EEF2E7] px-3 py-2.5 rounded-xl block">
                            {formatMoney((Number(item.cantidad) || 0) * (Number(item.costoUnitario) || 0))}
                          </span>
                        </div>

                        {/* ELIMINAR */}
                        <div className="col-span-1 md:col-span-1 flex justify-center mt-2 md:mt-0">
                          <button 
                            type="button" 
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={items.length === 1}
                            className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-30"
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
                    className="mt-4 text-sm font-bold text-[#7c8b61] flex items-center gap-2 hover:text-[#5F6F52] transition-colors bg-[#F8FAF5] px-4 py-2 rounded-xl"
                  >
                    <i className="bi bi-plus-circle-fill"></i> Agregar otro producto
                  </button>
                </div>

                {/* SECCIÓN 3: TOTALES Y ACCIONES */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-end border-t border-[#DDE5CD] pt-6">
                  
                  <div className="flex gap-6 bg-[#EEF2E7] px-6 py-4 rounded-3xl border border-[#DDE5CD] w-full md:w-auto">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#7E8B63] font-bold">Total Artículos</p>
                      <p className="text-2xl font-black text-gray-800">{totales.articulos}</p>
                    </div>
                    <div className="w-px bg-[#DDE5CD] mx-2"></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#7E8B63] font-bold">Monto de Entrada</p>
                      <p className="text-2xl font-black text-[#5F6F52]">{formatMoney(totales.monto)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      type="button" 
                      onClick={onClose} 
                      className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-white border border-[#DDE5CD] text-gray-700 font-bold hover:bg-gray-50 transition-all"
                    >
                      Cancelar
                    </button>

                    <button 
                      type="submit" 
                      disabled={loading || proveedores.length === 0} 
                      className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8d9b70] to-[#7c8b61] text-white font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill"></i> Registrar Entrada
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}