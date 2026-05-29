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

  // Bloquea scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
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
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, productToEdit]);

  // Cierra con Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  // ── Estilos base para inputs ────────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    backgroundColor: "#f8f8f6",
    border: "none",
    borderRadius: "999px",
    padding: "12px 16px 12px 44px",
    color: "#2D2D2D",
    fontSize: "14px",
    outline: "none",
    transition: "box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#8d9b70",
    fontWeight: "600",
    marginBottom: "8px",
    marginLeft: "4px",
  };

  const iconStyle = {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9CA3AF",
    fontSize: "16px",
    pointerEvents: "none",
  };

  return (
    // Overlay
    <div
      onClick={(e) => { if (e.target === e.currentTarget && !subiendo) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Caja del modal */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "28px",
          padding: "32px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          disabled={subiendo}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#F3F4F6",
            color: "#6B7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          <i className="bi bi-x-lg" />
        </button>

        {/* Encabezado */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8d9b70", fontWeight: "600", marginBottom: "8px" }}>
            <i className="bi bi-tags-fill" />
            Gestión Comercial
          </div>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "500", color: "#1F2937", fontFamily: "'Lora', serif" }}>
            {productToEdit ? "Editar Producto" : "Nuevo Producto"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Upload de imagen */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "4px" }}>
            <div
              onClick={() => !subiendo && document.getElementById("file-input-modal").click()}
              style={{
                position: "relative",
                width: "120px",
                height: "120px",
                borderRadius: "24px",
                border: "2px dashed #DCE3CF",
                backgroundColor: "#f8f8f6",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: subiendo ? "default" : "pointer",
                transition: "border-color 0.2s",
                opacity: subiendo ? 0.7 : 1,
              }}
            >
              {imagenPreview ? (
                <img src={imagenPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <i className="bi bi-camera-fill" style={{ fontSize: "24px", color: "#8d9b70" }} />
                  <p style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: "700", color: "#9CA3AF", margin: "4px 0 0" }}>Subir Foto</p>
                </div>
              )}
              {/* Hover overlay */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundColor: "rgba(0,0,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
                onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
                onMouseOut={(e) => e.currentTarget.style.opacity = "0"}
              >
                <i className="bi bi-pencil-fill" style={{ color: "#fff", fontSize: "18px" }} />
              </div>
            </div>
            <input id="file-input-modal" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} disabled={subiendo} />
          </div>

          {/* Nombre + Categoría */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-tag" style={iconStyle} />
                <input type="text" placeholder="Ej: Rosa Eterna" style={inputStyle} value={nombre} onChange={(e) => setNombre(e.target.value)} required disabled={subiendo} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Categoría</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-collection" style={iconStyle} />
                <select
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer", paddingRight: "36px" }}
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  disabled={subiendo}
                >
                  <option value="Flores">Flores</option>
                  <option value="Amigurumis">Amigurumis</option>
                </select>
                <i className="bi bi-chevron-down" style={{ ...iconStyle, left: "auto", right: "14px", fontSize: "11px" }} />
              </div>
            </div>
          </div>

          {/* SKU */}
          <div>
            <label style={labelStyle}>SKU (Código)</label>
            <div style={{ position: "relative" }}>
              <i className="bi bi-upc-scan" style={iconStyle} />
              <input
                type="text"
                placeholder="Ej: AMIG-01"
                style={{ ...inputStyle, opacity: (subiendo || !!productToEdit) ? 0.6 : 1, cursor: !!productToEdit ? "not-allowed" : "text" }}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                disabled={subiendo || !!productToEdit}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label style={labelStyle}>Descripción</label>
            <div style={{ position: "relative" }}>
              <i className="bi bi-text-paragraph" style={{ ...iconStyle, top: "14px", transform: "none" }} />
              <textarea
                placeholder="Detalles sobre el producto..."
                style={{
                  ...inputStyle,
                  borderRadius: "16px",
                  padding: "12px 16px 12px 44px",
                  height: "88px",
                  resize: "none",
                }}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={subiendo}
              />
            </div>
          </div>

          {/* Precio + Stock */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Precio Venta</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-currency-dollar" style={iconStyle} />
                <input type="number" step="0.01" placeholder="0.00" style={inputStyle} value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required disabled={subiendo} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>
                {productToEdit ? "Stock Actual" : "Stock Inicial"}
              </label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-boxes" style={iconStyle} />
                <input
                  type="number"
                  placeholder="0"
                  style={{
                    ...inputStyle,
                    opacity: (subiendo || !!productToEdit) ? 0.6 : 1,
                    cursor: !!productToEdit ? "not-allowed" : "text",
                  }}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  disabled={subiendo || !!productToEdit}
                  title={productToEdit ? "Usa la página de Inventario para modificar el stock." : "Ingresa el inventario inicial."}
                />
              </div>
              {productToEdit && (
                <p style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "4px", marginLeft: "4px" }}>
                  Modificar en Inventario
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", paddingTop: "8px", borderTop: "1px solid #F3F4F6", marginTop: "4px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={subiendo}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "10px 20px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "transparent",
                color: "#6B7280",
                fontWeight: "500",
                fontSize: "14px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-x-circle" style={{ fontSize: "16px" }} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={subiendo}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "10px 20px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: subiendo ? "#F3F4F6" : "#EEF1E7",
                color: subiendo ? "#9CA3AF" : "#1F2937",
                fontWeight: "600",
                fontSize: "14px",
                cursor: subiendo ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { if (!subiendo) e.currentTarget.style.backgroundColor = "#DDE6CC"; }}
              onMouseOut={(e) => { if (!subiendo) e.currentTarget.style.backgroundColor = "#EEF1E7"; }}
            >
              {subiendo ? (
                <>
                  <span style={{ width: "14px", height: "14px", border: "2px solid #9CA3AF", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill" style={{ fontSize: "16px" }} />
                  {productToEdit ? "Guardar Cambios" : "Guardar"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
