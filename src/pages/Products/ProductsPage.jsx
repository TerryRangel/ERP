import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';

export default function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados del formulario
  const [sku, setSku] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('Flores');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.create({ sku, nombre, descripcion, precioVenta, stock, categoria });
      alert("¡Producto guardado en Firebase!");
      setSku(''); setNombre(''); setDescripcion(''); setPrecioVenta(''); setStock('');
      document.getElementById('modal_agregar_producto').close();
      obtenerProductos(); // Recarga la lista inmediatamente
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-end mb-10 border-b border-pink-50 pb-6">
        <div>
          <nav className="text-xs uppercase tracking-widest text-pink-400 mb-2 font-bold">Inventario / Catálogo</nav>
          <h1 className="text-4xl font-serif text-gray-800">Mis Productos</h1>
        </div>
        <button 
          className="btn rounded-none bg-pink-500 hover:bg-pink-600 border-none text-white px-8 shadow-lg"
          onClick={() => document.getElementById('modal_agregar_producto').showModal()}
        >
          + AGREGAR PRODUCTO
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner text-pink-500"></span></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {productos.map((prod) => (
            <div key={prod.id} className="group">
              <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-3xl bg-pink-50 flex items-center justify-center border border-gray-100">
                <span className="text-pink-200 font-serif italic text-sm">Diseño de Crochet</span>
                <div className="absolute top-4 left-4 badge bg-white/90 border-none text-pink-500 font-bold">{prod.categoria}</div>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase">SKU: {prod.sku}</p>
                <h3 className="text-gray-800 font-medium text-lg">{prod.nombre}</h3>
                <p className="text-pink-500 font-bold text-xl">${parseFloat(prod.precioVenta || 0).toFixed(2)}</p>
                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">Stock: {prod.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <dialog id="modal_agregar_producto" className="modal">
        <div className="modal-box bg-white rounded-3xl p-8 max-w-lg">
          <h3 className="font-serif text-2xl text-gray-800 mb-6 border-b border-pink-50 pb-2">Nuevo Producto</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="SKU (Ej: AMIG-01)" className="input input-bordered bg-gray-50 rounded-xl" value={sku} onChange={(e) => setSku(e.target.value)} required />
              <select className="select select-bordered bg-gray-50 rounded-xl" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="Flores">Flores</option>
                <option value="Amigurumis">Amigurumis</option>
              </select>
            </div>
            <input type="text" placeholder="Nombre" className="input input-bordered w-full bg-gray-50 rounded-xl" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <textarea placeholder="Descripción" className="textarea textarea-bordered w-full bg-gray-50 rounded-xl" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Precio Venta" className="input input-bordered bg-gray-50 rounded-xl" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required />
              <input type="number" placeholder="Stock" className="input input-bordered bg-gray-50 rounded-xl" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => document.getElementById('modal_agregar_producto').close()}>Cancelar</button>
              <button type="submit" className="btn bg-pink-500 border-none text-white px-10 rounded-xl">Guardar</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}