import { useState, useEffect, useRef } from "react";
import { productService } from "../../services/productService";

export default function ProductModal({ isOpen, onClose, onProductSaved, productToEdit }) {
  const [sku, setSku] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("Flores");
  
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      if (productToEdit) {
        setSku(productToEdit.sku || "");
        setNombre(productToEdit.nombre || "");
        setDescripcion(productToEdit.descripcion || "");
        setPrecioVenta(productToEdit.precioVenta || "");
        setStock(productToEdit.stock || "");
        setCategoria(productToEdit.categoria || "Flores");
      } else {
        setSku(""); setNombre(""); setDescripcion(""); setPrecioVenta(""); setStock(""); setCategoria("Flores");
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, productToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { sku, nombre, descripcion, precioVenta, stock, categoria };

      if (productToEdit) {
        await productService.update(productToEdit.id, productData);
      } else {
        await productService.create(productData);
      }

      onProductSaved();
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const inputBaseClass = "w-full !bg-[#f8f8f6] border-none rounded-full py-3 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400";

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle backdrop-blur-sm" data-theme="light" onCancel={onClose}>
      <div className="modal-box !bg-white rounded-3xl p-8 max-w-lg shadow-2xl relative !text-[#1F2937]">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors">
          <i className="bi bi-x-lg text-lg"></i>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest !text-[#8d9b70] font-semibold mb-2">
            <i className="bi bi-box-seam-fill"></i>
            Gestión de Inventario
          </div>
          <h3 className="text-xl font-medium !text-[#1F2937]">
            {productToEdit ? "Editar Producto" : "Nuevo Producto"}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full relative">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Nombre</label>
              <div className="relative w-full">
                <i className="bi bi-tag absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                <input type="text" placeholder="Ej: Rosa Eterna" className={inputBaseClass} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
            </div>
            <div className="form-control w-full relative">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Categoría</label>
              <div className="relative w-full">
                <i className="bi bi-collection absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none z-10"></i>
                <select className={`${inputBaseClass} appearance-none cursor-pointer`} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="Flores">Flores</option>
                  <option value="Amigurumis">Amigurumis</option>
                </select>
                <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
              </div>
            </div>
          </div>

          <div className="form-control w-full relative">
            <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">SKU (Código)</label>
            <div className="relative w-full">
              <i className="bi bi-upc-scan absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
              <input type="text" placeholder="Ej: AMIG-01" className={inputBaseClass} value={sku} onChange={(e) => setSku(e.target.value)} required />
            </div>
          </div>

          <div className="form-control w-full relative">
            <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Descripción</label>
            <div className="relative w-full">
              <i className="bi bi-text-paragraph absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none"></i>
              <textarea placeholder="Detalles sobre el producto..." className="w-full !bg-[#f8f8f6] border-none rounded-2xl py-3 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400 h-24 resize-none" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full relative">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Precio Venta</label>
              <div className="relative w-full">
                <i className="bi bi-currency-dollar absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                <input type="number" step="0.01" placeholder="0.00" className={inputBaseClass} value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required />
              </div>
            </div>
            <div className="form-control w-full relative">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Stock Inicial</label>
              <div className="relative w-full">
                <i className="bi bi-boxes absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                <input type="number" placeholder="0" className={inputBaseClass} value={stock} onChange={(e) => setStock(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="modal-action mt-8 flex justify-center gap-8 border-none pt-2">
            <button type="button" className="flex items-center gap-2 px-6 py-2 rounded-full !text-gray-500 font-medium hover:!bg-gray-100 hover:!text-gray-800 transition-all duration-300" onClick={onClose}>
              <i className="bi bi-x-circle text-lg"></i> Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-full !text-[#1F2937] font-medium hover:!bg-[#EEF1E7] hover:!text-[#6A734D] transition-all duration-300">
              <i className="bi bi-check-circle-fill text-lg"></i> {productToEdit ? "Guardar Cambios" : "Guardar"}
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