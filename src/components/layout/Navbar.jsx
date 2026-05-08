import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Espacio izquierdo (podría ser para un buscador global en el futuro) */}
      <div className="flex-1">
        <span className="text-gray-500 font-medium text-sm">
          Panel de Administración
        </span>
      </div>

      {/* Perfil y Logout */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right hidden sm:block">
          <span className="text-sm font-bold text-gray-700">
            {user?.usuario || "Usuario del Sistema: "}
          </span>
          <span className="text-xs text-pink-500 font-medium">Administrador</span>
        </div>
        
        {/* Avatar por defecto */}
        <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold border border-pink-200">
          {(user?.usuario?.charAt(0) || "U").toUpperCase()}
        </div>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <button
          onClick={logout}
          className="btn btn-sm btn-outline btn-error rounded-md"
        >
          Salir
        </button>
      </div>
    </header>
  );
}