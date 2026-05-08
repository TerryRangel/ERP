import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      {/* Menú Lateral Fijo */}
      <Sidebar />

      {/* Contenedor Derecho */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Barra Superior */}
        <Navbar />
        
        {/* Contenido Dinámico (Dashboard, Proveedores, etc.) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}