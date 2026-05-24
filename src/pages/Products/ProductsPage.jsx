import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import ProductModal from "../../components/ui/ProductModal";
import ConfirmAlert from "../../components/ui/Alert"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import { Can } from "../../components/can.jsx";

export default function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Estados para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    productId: null,
    isDeleting: false
  });

  const [successAlert, setSuccessAlert] = useState({
    isOpen: false,
    message: ""
  });

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

  const handleClickEliminar = (id) => {
    setDeleteAlert({ isOpen: true, productId: id, isDeleting: false });
  };

  const executeDelete = async () => {
    setDeleteAlert(prev => ({ ...prev, isDeleting: true }));
    try {
      await productService.remove(deleteAlert.productId);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar:", error.message);
    } finally {
      setDeleteAlert({ isOpen: false, productId: null, isDeleting: false });
    }
  };

  const productosFiltrados = productos.filter(p => 
    (p.nombre?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
    (p.sku?.toLowerCase() || "").includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7F2]">
        <div className="w-20 h-20 rounded-[28px] bg-white border border-[#E7ECDD] shadow-sm flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#7E8B63]"></span>
        </div>
        <p className="mt-5 text-gray-500 font-medium tracking-wide">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F2] px-2 md:px-4 py-8 w-full">
      <div className="max-w-[2200px] mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-5 mb-4">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#DDE8CF] to-[#8FA878] text-[#5F6F52] flex items-center justify-center shadow-md border border-[#D4DFC5]">
                <i className="bi bi-bag-fill text-2xl"></i>
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#7E8B63]">
                  Gestión ERP
                </p>
                <h1 className="text-5xl font-black text-[#1F2937] leading-none mt-1">
                  Productos
                </h1>
              </div>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl">
              Administra la información comercial, precios y fotos de tus artículos desde una interfaz limpia y centralizada.
            </p>
          </div>

          {/* ACCIONES Y BUSCADOR */}
          <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto">
            
            {/* <-- COMPONENTE DEL BUSCADOR --> */}
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

            <Can I="products:create">
              <button
                onClick={handleOpenNew}
                className="
                  h-[58px] px-7 rounded-2xl bg-[#1F2937] text-white
                  font-semibold flex items-center justify-center gap-3 shadow-lg
                  hover:opacity-90 transition-all
                "
              >
                <i className="bi bi-plus-circle-fill"></i>
                Nuevo Producto
              </button>
            </Can>
          </div>
        </div> 
    
        {/* GRID DE PRODUCTOS */}
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((prod) => (
              <div key={prod.id} className="group relative bg-white border border-[#E5EBDD] rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                
                {/* IMAGEN Y CATEGORÍA */}
                <div className="relative aspect-[4/3] bg-[#f8f8f6] flex items-center justify-center border-b border-[#E5EBDD]">
                  {prod.imagenUrl ? (
                    <img 
                      src={prod.imagenUrl} 
                      alt={prod.nombre} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <i className="bi bi-box2 text-4xl text-[#DCE3CF]"></i>
                  )}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold bg-white text-[#7E8B63] border border-[#E5EBDD] shadow-sm uppercase tracking-wider">
                    {prod.categoria || "General"}
                  </div>
                </div>

                {/* INFORMACIÓN Y ACCIONES */}
                <div className="p-6 bg-white">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">SKU: {prod.sku}</p>
                  <h3 className="text-[#1F2937] font-bold text-lg mb-2 line-clamp-1">{prod.nombre}</h3>
                  
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#F5F7F2]">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5 font-medium">Precio de Venta</p>
                      <p className="text-[#7E8B63] font-black text-xl">${parseFloat(prod.precioVenta || 0).toFixed(2)}</p>
                    </div>
                    
                    {/* BOTONES */}
                    <Can I="products:create">
                      <div className="flex gap-2">
                        <Can I="products:update">
                          <button 
                            onClick={() => handleEdit(prod)} 
                            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all" 
                            title="Editar Producto"
                          >
                            <i className="bi bi-pencil-square text-lg"></i>
                          </button>
                        </Can>
                        <Can I="products:delete">
                          <button 
                            onClick={() => handleClickEliminar(prod.id)}
                            className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all" 
                            title="Eliminar Producto"
                          >
                            <i className="bi bi-trash3-fill text-lg"></i>
                          </button>
                        </Can>
                      </div>
                    </Can>

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5EBDD] rounded-[36px] p-24 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-[#F5F7F2] flex items-center justify-center mb-6">
                <i className="bi bi-search text-4xl text-gray-300"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Sin resultados</h3>
              <p className="text-sm text-gray-400 max-w-sm">
                {productos.length === 0 
                  ? "Agrega tu primer artículo para comenzar a armar tu catálogo comercial." 
                  : "No se encontraron productos que coincidan con tu búsqueda."}
              </p>
            </div>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProductSaved={async () => {
          await obtenerProductos();
          if (productToEdit) {
            setSuccessAlert({ 
              isOpen: true, 
              message: "¡Producto actualizado correctamente!" 
            });
          } else {
            setSuccessAlert({ 
              isOpen: true, 
              message: "¡Nuevo producto agregado con éxito!" 
            });
          }
          
        }} 
        productToEdit={productToEdit} 
      />

      <ConfirmAlert
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, productId: null, isDeleting: false })}
        onConfirm={executeDelete}
        title="¿Eliminar producto?"
        message="¿Estás seguro de que deseas eliminar este artículo permanentemente? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={deleteAlert.isDeleting}
      />
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