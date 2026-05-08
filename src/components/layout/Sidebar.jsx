import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Proveedores", path: "/suppliers", icon: "🧶" },
    { name: "Auditoría", path: "/audit", icon: "📋" },
    { name: "Usuarios", path: "/users", icon: "👥" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full border-r border-gray-800 shadow-xl transition-all">
      {/* Cabecera del Sidebar / Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800 px-4 bg-gray-950">
        <h2 className="text-xl font-bold tracking-wider text-pink-300 flex items-center gap-2">
          <span>🌸</span> Crochet ERP
        </h2>
      </div>

      {/* Enlaces de Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                isActive
                  ? "bg-pink-600 text-white shadow-md" // Color cálido para el activo
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}