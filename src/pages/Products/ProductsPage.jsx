import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import ProductModal from "../../components/ui/ProductModal";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const obtenerProductos = async () => {
    try {
      const items = await productService.getAll();
      setProductos(items);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleOpenNew = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prod) => {
    setProductToEdit(prod);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) {
      try {
        await productService.remove(id);
        obtenerProductos();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#f8f8f6]">
        <span className="loading loading-spinner loading-lg text-[#8d9b70]"></span>
        <p className="text-sm tracking-wide text-gray-400 animate-pulse">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-6 md:p-10 font-sans text-[#2D2D2D] transition-all duration-300">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8d9b70] font-semibold mb-3">
            <i className="bi bi-box-seam-fill"></i>
            Inventario y Catálogo
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2937]">Productos</h1>
          <p className="text-gray-400 mt-2 text-sm">Administra los productos de crochet y su stock.</p>
        </div>

        <button
          onClick={handleOpenNew}
          className="
            group relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-2xl
            bg-gradient-to-r from-[#8d9b70] to-[#74845a] text-white font-semibold
            shadow-lg shadow-[#8d9b70]/20 transition-all duration-300
            hover:scale-[1.02] hover:shadow-xl active:scale-95
          "
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <i className="bi bi-plus-circle-fill text-lg relative z-10"></i>
          <span className="relative z-10">Nuevo Producto</span>
        </button>
      </div>

      {productos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productos.map((prod) => (
            <div key={prod.id} className="group relative bg-white border border-[#ECECE7] rounded-3xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(141,155,112,0.1)] hover:-translate-y-1">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button onClick={() => handleEdit(prod)} className="w-9 h-9 rounded-xl bg-white text-[#6A734D] flex items-center justify-center hover:bg-[#8d9b70] hover:text-white shadow-md transition-colors border border-[#ECECE7]">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button onClick={() => handleDelete(prod.id)} className="w-9 h-9 rounded-xl bg-white text-[#E25B5B] flex items-center justify-center hover:bg-[#E25B5B] hover:text-white shadow-md transition-colors border border-[#ECECE7]">
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </div>

              <div className="relative aspect-[4/3] bg-[#f8f8f6] flex items-center justify-center border-b border-[#ECECE7]">
                <i className="bi bi-box2 text-4xl text-[#DCE3CF]"></i>
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold bg-[#EEF1E7] text-[#6A734D] border border-[#DCE3CF] shadow-sm uppercase tracking-wider">
                  {prod.categoria || "General"}
                </div>
              </div>

              <div className="p-6 bg-white">
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-1">SKU: {prod.sku}</p>
                <h3 className="text-[#1F2937] font-semibold text-base mb-2 line-clamp-1">{prod.nombre}</h3>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Precio</p>
                    <p className="text-[#8d9b70] font-bold text-xl">${parseFloat(prod.precioVenta || 0).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Stock</p>
                    <span className="inline-flex items-center justify-center bg-[#F9FAF6] text-[#6A734D] border border-[#DCE3CF] px-3 py-1 rounded-xl text-sm font-semibold">
                      {prod.stock}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#ECECE7] rounded-3xl p-24 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#EEF1E7] to-[#DDE5CD] flex items-center justify-center mb-6 shadow-sm">
              <i className="bi bi-box2-heart-fill text-4xl text-[#8d9b70]"></i>
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No hay productos</h3>
            <p className="text-sm text-gray-400 max-w-sm">Agrega un nuevo producto para comenzar a gestionar tu catálogo e inventario.</p>
          </div>
        </div>
      )}

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProductSaved={obtenerProductos} 
        productToEdit={productToEdit} 
      />
    </div>
  );
}