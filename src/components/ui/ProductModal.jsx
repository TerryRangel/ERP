import { useState, useEffect, useRef } from "react";
import { productService } from "../../services/productService";

export default function ProductModal({ isOpen, onClose, onProductSaved, productToEdit }) {
  const [sku, setSku] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("Flores");
  
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      if (productToEdit) {
        setSku(productToEdit.sku || "");
        setNombre(productToEdit.nombre || "");
        setDescripcion(productToEdit.descripcion || "");
        setPrecioVenta(productToEdit.precioVenta || "");
        setStock(productToEdit.stock || "0");
        setCategoria(productToEdit.categoria || "Flores");
        setImagenPreview(productToEdit.imagenUrl || null); 
        setImagenArchivo(null);
      } else {
        setSku(""); setNombre(""); setDescripcion(""); setPrecioVenta(""); setStock(""); setCategoria("Flores");
        setImagenPreview(null); 
        setImagenArchivo(null);
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, productToEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenArchivo(file);
      setImagenPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);

    try {
      let finalImagenUrl = imagenPreview;

      if (imagenArchivo) {
        const formData = new FormData();
        formData.append("file", imagenArchivo);
        formData.append("upload_preset", "erp_productos");
        formData.append("cloud_name", "dsbwrorlk");

        const res = await fetch("https://api.cloudinary.com/v1_1/dsbwrorlk/image/upload", {
          method: "POST",
          body: formData,
        });

        const cloudData = await res.json();
        
        if (cloudData.secure_url) {
          finalImagenUrl = cloudData.secure_url;
        } else {
          throw new Error("No se pudo obtener la URL de la imagen");
        }
      }

      const productData = { 
        sku, 
        nombre, 
        descripcion, 
        precioVenta: Number(precioVenta), 
        stock: Number(stock), 
        categoria,
        imagenUrl: finalImagenUrl
      };

      if (productToEdit) {
        await productService.update(productToEdit.id, productData);
      } else {
        await productService.create(productData);
      }

      onProductSaved();
      onClose();
    } catch (error) {
      alert("Error al guardar: " + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  const inputBaseClass = "w-full !bg-[#f8f8f6] border-none rounded-full py-3 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400";

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle backdrop-blur-sm" data-theme="light" onCancel={onClose}>
      <div className="modal-box !bg-white rounded-3xl p-8 max-w-lg shadow-2xl relative !text-[#1F2937]">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors" disabled={subiendo}>
          <i className="bi bi-x-lg text-lg"></i>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest !text-[#8d9b70] font-semibold mb-2">
            <i className="bi bi-tags-fill"></i>
            Gestión Comercial
          </div>
          <h3 className="text-xl font-medium !text-[#1F2937]">
            {productToEdit ? "Editar Producto" : "Nuevo Producto"}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex flex-col items-center justify-center py-2">
            <div 
              className={`group relative w-32 h-32 rounded-[2rem] border-2 border-dashed border-[#DCE3CF] bg-[#f8f8f6] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${!subiendo ? 'cursor-pointer hover:border-[#8d9b70]' : 'opacity-70'}`}
              onClick={() => !subiendo && document.getElementById("file-input").click()}
            >
              {imagenPreview ? (
                <img src={imagenPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <i className="bi bi-camera-fill text-2xl text-[#8d9b70]"></i>
                  <p className="text-[9px] uppercase font-bold text-gray-400 mt-1">Subir Foto</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="bi bi-pencil-fill text-white"></i>
              </div>
            </div>
            <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={subiendo} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full relative">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Nombre</label>
              <div className="relative w-full">
                <i className="bi bi-tag absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                <input type="text" placeholder="Ej: Rosa Eterna" className={inputBaseClass} value={nombre} onChange={(e) => setNombre(e.target.value)} required disabled={subiendo}/>
              </div>
            </div>
            <div className="form-control w-full relative">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Categoría</label>
              <div className="relative w-full">
                <i className="bi bi-collection absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none z-10"></i>
                <select className={`${inputBaseClass} appearance-none cursor-pointer`} value={categoria} onChange={(e) => setCategoria(e.target.value)} disabled={subiendo}>
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
              <input type="text" placeholder="Ej: AMIG-01" className={inputBaseClass} value={sku} onChange={(e) => setSku(e.target.value)} required disabled={subiendo || !!productToEdit}/>
            </div>
          </div>

          <div className="form-control w-full relative">
            <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Descripción</label>
            <div className="relative w-full">
              <i className="bi bi-text-paragraph absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none"></i>
              <textarea placeholder="Detalles sobre el producto..." className="w-full !bg-[#f8f8f6] border-none rounded-2xl py-3 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400 h-24 resize-none" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} disabled={subiendo}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full relative">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">Precio Venta</label>
              <div className="relative w-full">
                <i className="bi bi-currency-dollar absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                <input type="number" step="0.01" placeholder="0.00" className={inputBaseClass} value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required disabled={subiendo}/>
              </div>
            </div>
            
            <div className="form-control w-full relative">
              <label className="label-text text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1">
                {productToEdit ? "Stock Actual (Ir a Inventario)" : "Stock Inicial"}
              </label>
              <div className="relative w-full">
                <i className="bi bi-boxes absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                <input 
                  type="number" 
                  placeholder="0" 
                  className={`${inputBaseClass} ${productToEdit ? "opacity-60 cursor-not-allowed" : ""}`} 
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                  required 
                  disabled={subiendo || !!productToEdit} 
                  title={productToEdit ? "Para modificar el stock, utiliza los botones de la página de Inventario." : "Ingresa el inventario inicial."}
                />
              </div>
            </div>
          </div>

          <div className="modal-action mt-8 flex justify-center gap-8 border-none pt-2">
            <button type="button" className="flex items-center gap-2 px-6 py-2 rounded-full !text-gray-500 font-medium hover:!bg-gray-100 hover:!text-gray-800 transition-all duration-300" onClick={onClose} disabled={subiendo}>
              <i className="bi bi-x-circle text-lg"></i> Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-full !text-[#1F2937] font-medium hover:!bg-[#EEF1E7] hover:!text-[#6A734D] transition-all duration-300" disabled={subiendo}>
              {subiendo ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span> Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill text-lg"></i> {productToEdit ? "Guardar Cambios" : "Guardar"}
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