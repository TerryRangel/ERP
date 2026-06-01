import { useState, useEffect, useRef } from "react";
import { productService } from "../../services/productService";
import "bootstrap-icons/font/bootstrap-icons.css";

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
        setSku(""); setNombre(""); setDescripcion("");
        setPrecioVenta(""); setStock(""); setCategoria("Flores");
        setImagenPreview(null); setImagenArchivo(null);
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
        sku, nombre, descripcion,
        precioVenta: Number(precioVenta),
        stock: Number(stock),
        categoria,
        imagenUrl: finalImagenUrl,
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

  const inputBaseClass = "w-full !bg-[#f8f8f6] border-none rounded-full py-3 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-middle backdrop-blur-sm"
      data-theme="light"
      onCancel={onClose}
    >
      <div className="modal-box w-[calc(100%-32px)] sm:w-11/12 !max-w-lg !bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative !text-[#1F2937] overflow-y-auto !max-h-[90dvh]">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          disabled={subiendo}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all flex items-center justify-center"
        >
          <i className="bi bi-x-lg text-base" />
        </button>

        {/* Header */}
        <div className="mb-7 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest !text-[#8d9b70] font-semibold mb-2">
            <i className="bi bi-tags-fill" />
            Gestión Comercial
          </div>
          <h3 className="text-xl font-medium !text-[#1F2937]" style={{ fontFamily: "'Lora', serif" }}>
            {productToEdit ? "Editar Producto" : "Nuevo Producto"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Upload imagen */}
          <div className="flex flex-col items-center pb-1">
            <label
              htmlFor="file-input-modal"
              className="group"
            style={{
                width: "120px",
                height: "120px",
                opacity: subiendo ? 0.7 : 1,
                border: "2px dashed #C8D4B0",
                borderRadius: "20px",
                backgroundColor: "#f8f8f6",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: subiendo ? "default" : "pointer",
                transition: "border-color 0.2s",
                position: "relative",
              }}
            >
              {imagenPreview ? (
                <img src={imagenPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <i className="bi bi-camera-fill" style={{ fontSize: "28px", color: "#8d9b70" }} />
                  <p style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: "700", color: "#9CA3AF", margin: "6px 0 0", letterSpacing: "0.05em" }}>Subir Foto</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="bi bi-pencil-fill text-white text-lg" />
              </div>
            </label>
            <input id="file-input-modal" type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={subiendo} />
          </div>

          {/* Nombre + Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1 block">Nombre</label>
              <div className="relative">
                <i className="bi bi-tag absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input type="text" placeholder="Ej: Rosa Eterna" className={inputBaseClass} value={nombre} onChange={(e) => setNombre(e.target.value)} required disabled={subiendo} />
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1 block">Categoría</label>
              <div className="relative">
                <i className="bi bi-collection absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <select
                  className={`${inputBaseClass} appearance-none cursor-pointer`}
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  disabled={subiendo}
                >
                  <option value="Flores">Flores</option>
                  <option value="Amigurumis">Amigurumis</option>
                </select>
                <i className="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1 block">SKU (Código)</label>
            <div className="relative">
              <i className="bi bi-upc-scan absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
              <input
                type="text"
                placeholder="Ej: AMIG-01"
                className={inputBaseClass}
                style={{ opacity: (subiendo || !!productToEdit) ? 0.6 : 1, cursor: !!productToEdit ? "not-allowed" : "text" }}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                disabled={subiendo || !!productToEdit}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1 block">Descripción</label>
            <div className="relative">
              <i className="bi bi-text-paragraph absolute left-4 top-3.5 text-gray-400 text-base pointer-events-none" />
              <textarea
                placeholder="Detalles sobre el producto..."
                className="w-full !bg-[#f8f8f6] border-none rounded-3xl py-3 !pl-12 pr-4 !text-[#2D2D2D] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:text-gray-400 h-20 resize-none disabled:opacity-60"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={subiendo}
              />
            </div>
          </div>

          {/* Precio + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1 block">Precio Venta</label>
              <div className="relative">
                <i className="bi bi-currency-dollar absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input type="number" step="0.01" placeholder="0.00" className={inputBaseClass} value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required disabled={subiendo} />
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider !text-[#8d9b70] font-semibold mb-2 ml-1 block">
                {productToEdit ? "Stock Actual" : "Stock Inicial"}
              </label>
              <div className="relative">
                <i className="bi bi-boxes absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type="number"
                  placeholder="0"
                  className={inputBaseClass}
                  style={{ opacity: (subiendo || !!productToEdit) ? 0.6 : 1, cursor: !!productToEdit ? "not-allowed" : "text" }}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  disabled={subiendo || !!productToEdit}
                  title={productToEdit ? "Usa la página de Inventario para modificar el stock." : "Ingresa el inventario inicial."}
                />
              </div>
              {productToEdit && (
                <p className="text-[10px] text-gray-400 mt-1 ml-1">Modificar en Inventario</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="modal-action mt-6 flex justify-end gap-4 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={subiendo}
              className="px-6 py-2.5 rounded-full !text-gray-500 font-medium hover:!bg-gray-100 transition-all flex items-center gap-2"
            >
              <i className="bi bi-x-circle text-base" /> Cancelar
            </button>
            <button
              type="submit"
              disabled={subiendo}
              className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#EEF1E7] !text-[#1F2937] font-semibold hover:bg-[#DDE6CC] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {subiendo ? (
                <><span className="loading loading-spinner loading-xs"></span> Guardando...</>
              ) : (
                <><i className="bi bi-check-circle-fill text-base" /> {productToEdit ? "Guardar Cambios" : "Guardar"}</>
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
