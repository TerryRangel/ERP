import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "chart-bar" },
  { name: "Productos", path: "/products", icon: "shopping-bag" },
  { name: "Proveedores", path: "/suppliers", icon: "building-store" },
  { name: "Auditoría", path: "/audit", icon: "clipboard-list" },
  { name: "Usuarios", path: "/users", icon: "users" },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside style={{
      width: "260px",
      minWidth: "260px",
      backgroundColor: "#FFFFFF", // Fondo blanco limpio
      borderRight: "1px solid #E8E4DE", // Borde sutil color lino
      display: "flex", 
      flexDirection: "column",
      fontFamily: "'Inter', sans-serif", // Tipografía moderna
      zIndex: 10,
    }}>
      {/* Sección del Logo - Basado en la estética de la imagen */}
      <div style={{
        padding: "48px 24px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "4px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#4A453E"
        }}>
          <span style={{ fontSize: "24px" }}>🧶</span>
          <h2 style={{ 
            margin: 0, 
            fontSize: "22px", 
            fontWeight: "500", 
            fontFamily: "'Lora', serif", // Toque artesanal
            letterSpacing: "0.5px"
          }}>
            Tejidos
          </h2>
        </div>
        <p style={{ 
          margin: 0, 
          fontSize: "10px", 
          fontWeight: "600", 
          color: "#8C867E", 
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          paddingLeft: "36px"
        }}>
          Hecho a mano
        </p>
      </div>

      {/* Navegación - Estilo Minimalista */}
      <nav style={{ 
        padding: "0 16px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "4px", 
        flex: 1 
      }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: isActive ? "600" : "400",
              color: isActive ? "#8B9467" : "#4A453E", // Verde Oliva si está activo
              backgroundColor: isActive ? "#F4F6EE" : "transparent", // Fondo suave oliva
              transition: "all 0.2s ease",
            })}
          >
            <i className={`ti ti-${item.icon}`} style={{ fontSize: "18px" }} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sección Inferior - Estado y Acción */}
      <div style={{ 
        padding: "24px 16px", 
        borderTop: "1px solid #F9F7F2",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        {/* Indicador de Status Minimalista */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#F9F7F2",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#86efac",
              boxShadow: "0 0 8px rgba(134, 239, 172, 0.6)"
            }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#4A453E" }}>Sistema Online</span>
          </div>
          <span style={{ fontSize: "16px" }}>🧵</span>
        </div>

        {/* Botón de Salida Minimalista */}
        <button 
          onClick={logout}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #E8E4DE",
            backgroundColor: "transparent",
            color: "#8C867E",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#F9F7F2";
            e.currentTarget.style.color = "#4A453E";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#8C867E";
          }}
        >
          <i className="ti ti-logout" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}