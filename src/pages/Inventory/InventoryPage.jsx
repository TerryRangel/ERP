import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import ConfirmAlert from "../../components/ui/Alert"; 

export default function InventoryPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Estados simplificados para el Modal de Stock
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoStock, setNuevoStock] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [successAlert, setSuccessAlert] = useState({
    isOpen: false,
    message: ""
  });

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      setCargando(true);
      const data = await productService.getAll();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalStock = (producto) => {
    setProductoSeleccionado(producto);
    setNuevoStock(producto.stock);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
    setNuevoStock("");
  };

  const handleGuardarStock = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const stockActualizado = Number(nuevoStock);

      if (stockActualizado < 0) {
        throw new Error("El stock no puede ser negativo.");
      }

      await productService.update(productoSeleccionado.id, {
        ...productoSeleccionado,
        stock: stockActualizado
      });
      
      setSuccessAlert({ 
        isOpen: true, 
        message: "¡El stock se ha actualizado correctamente en el inventario!" 
      });

      await cargarInventario();
      cerrarModal();
    } catch (error) {
      alert("Error al actualizar stock: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.sku.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7F2]">
        <div className="w-20 h-20 rounded-[28px] bg-white border border-[#E7ECDD] shadow-sm flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#7E8B63]"></span>
        </div>
        <p className="mt-5 text-gray-500 font-medium tracking-wide">Cargando existencias...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F2] px-2 md:px-4 py-8 w-full relative">
      <div className="max-w-[2200px] mx-auto">
      
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-5 mb-4">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#DDE8CF] to-[#8FA878] text-[#5F6F52] flex items-center justify-center shadow-md border border-[#D4DFC5]">
                <i className="bi bi-inboxes-fill text-2xl"></i>
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#7E8B63]">
                  Gestión ERP
                </p>
                <h1 className="text-5xl font-black text-[#1F2937] leading-none mt-1">
                  Inventario
                </h1>
              </div>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl">
              Gestiona las existencias físicas y actualiza tu stock rápidamente para mantener tu almacén al día.
            </p>
          </div>

          {/* BUSCADOR */}
          <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar por nombre o SKU..." 
                className="
                  w-full lg:w-[360px] h-[58px] rounded-2xl
                  border border-[#E5EBDD] bg-white
                  !pl-5 !pr-14 text-sm font-medium text-gray-700
                  outline-none transition-all shadow-sm
                  focus:border-[#7E8B63] focus:ring-4 focus:ring-[#7E8B63]/10
                "
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <i className="bi bi-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg"></i>
            </div>
          </div>
        </div>

        {/* TABLA DE INVENTARIO */}
        <div className="bg-white border border-[#E5EBDD] rounded-[36px] shadow-sm overflow-hidden">
          
          <div className="px-8 py-6 border-b border-[#EEF2E7] flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-gray-800">Control de Existencias</h2>
              <p className="text-sm text-gray-400 mt-1">{productosFiltrados.length} artículos listados</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFBF8] border-b border-[#EEF2E7]">
                  <th className="pl-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">SKU</th>
                  <th className="py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Producto</th>
                  <th className="py-5 text-xs uppercase tracking-widest text-gray-400 font-black text-center">Stock Actual</th>
                  <th className="py-5 text-xs uppercase tracking-widest text-gray-400 font-black text-center">Estado</th>
                  <th className="pr-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#1F2937]">
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-28 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-[#F4F6F0] flex items-center justify-center mb-5">
                          <i className="bi bi-search text-4xl text-gray-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">Sin resultados</h3>
                        <p className="text-gray-400 mt-2">No se encontraron productos que coincidan con tu búsqueda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((prod) => (
                    <tr key={prod.id} className="border-b border-[#F3F5EF] hover:bg-[#FAFBF8] transition-all">
                      <td className="pl-10 py-5 font-mono text-xs text-gray-500 font-bold">{prod.sku}</td>
                      <td className="py-5">
                        <span className="font-bold text-gray-800 block">{prod.nombre}</span>
                        <span className="text-xs text-gray-400 block mt-0.5">{prod.categoria || "General"}</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="inline-block bg-[#F4F6F0] border border-[#E5EBDD] text-[#5F6F52] px-4 py-1.5 rounded-xl font-black text-lg">
                          {prod.stock}
                        </span>
                      </td>
                      <td className="py-5 text-center">
                        {prod.stock <= (prod.stockMinimo || 5) ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">Bajo</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">Óptimo</span>
                          </div>
                        )}
                      </td>
                      <td className="pr-10 py-5">
                        <div className="flex justify-end">
                          {/* BOTÓN DE ACTUALIZAR */}
                          <button 
                            onClick={() => abrirModalStock(prod)}
                            className="px-5 py-2.5 rounded-xl bg-[#EEF2E7] text-[#7E8B63] hover:bg-[#7E8B63] hover:text-white transition-all font-bold flex items-center justify-center gap-2" 
                          >
                            <i className="bi bi-arrow-repeat text-lg"></i>
                            Actualizar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="!bg-white rounded-[32px] p-8 md:p-10 max-w-md w-full shadow-2xl relative flex flex-col gap-6">
            
            <button onClick={cerrarModal} className="absolute top-6 right-6 w-10 h-10 rounded-full !bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:!bg-gray-200 transition-colors">
              <i className="bi bi-x-lg"></i>
            </button>

            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[24px] mb-5 border-2 !bg-[#EEF2E7] text-[#7E8B63] !border-[#DDE8CF]">
                <i className="bi bi-boxes text-3xl"></i>
              </div>
              <h3 className="text-3xl font-black !text-[#1F2937] leading-tight">
                Actualizar Stock
              </h3>
              <p className="text-sm !text-gray-500 mt-2">
                Producto: <strong className="!text-gray-900 text-base">{productoSeleccionado?.nombre}</strong>
              </p>
            </div>

            <form onSubmit={handleGuardarStock} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest !text-gray-400 font-bold ml-1">
                  Nuevo Stock Total
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <i className="bi bi-hash !text-gray-400 text-xl"></i>
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full !bg-[#FAFBF8] !border-2 !border-[#E5EBDD] rounded-2xl py-4 !pl-14 pr-4 !text-[#1F2937] font-bold text-lg focus:!border-[#7E8B63] focus:!bg-white outline-none transition-all"
                    placeholder="Ej. 10"
                    value={nuevoStock}
                    onChange={(e) => setNuevoStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={guardando}
                className="w-full py-4 mt-2 rounded-2xl font-bold !text-white text-lg transition-all shadow-lg flex items-center justify-center gap-3 !bg-[#1F2937] hover:!bg-black shadow-gray-400/20"
              >
                {guardando ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <>
                    <i className="bi bi-check-circle-fill text-xl"></i>
                    Guardar Cambios
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmAlert
        isOpen={successAlert.isOpen}
        onConfirm={() => setSuccessAlert({ isOpen: false, message: "" })}
        onClose={() => setSuccessAlert({ isOpen: false, message: "" })}
        title="¡Excelente!"
        message={successAlert.message}
        confirmText="Aceptar"
        type="success"
        showCancel={false} 
      />

    </div>
  );
}