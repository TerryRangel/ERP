import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Can } from "../../components/can.jsx";
import "bootstrap-icons/font/bootstrap-icons.css"; // <-- Importamos Bootstrap Icons

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "chart-bar" },
  { name: "Productos", path: "/products", icon: "shopping-bag" },
  { name: "Proveedores", path: "/suppliers", icon: "building-store" },
  { name: "Auditoría", path: "/audit", icon: "clipboard-list" },
  { name: "Usuarios", path: "/users", icon: "users" },
  { name: "Clientes", path: "/clients", icon: "user" },
];

export default function Sidebar() {
  const { logout } = useAuth();

  // Función auxiliar para no repetir los estilos de NavLink en cada renglón
  const linkStyle = ({ isActive }) => ({
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
  });

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
      {/* Sección del Logo */}
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

      {/* Navegación - ESCRITA MANUALMENTE CON BOOTSTRAP ICONS */}
      <nav style={{ 
        padding: "0 16px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "4px", 
        flex: 1 
      }}>
        
        {/* 1. DASHBOARD */}
        <Can I="dashboard:read">
          <NavLink to="/dashboard" style={linkStyle}>
            <i className="bi bi-speedometer2" style={{ fontSize: "18px" }} />
            <span>Dashboard</span>
          </NavLink>
        </Can>

        {/* 2. PRODUCTOS */}
        <Can I="products:read">
          <NavLink to="/products" style={linkStyle}>
            <i className="bi bi-bag-fill" style={{ fontSize: "18px" }} />
            <span>Productos</span>
          </NavLink>
        </Can>

        {/* 3. PROVEEDORES */}
        <Can I="suppliers:read">
          <NavLink to="/suppliers" style={linkStyle}>
            <i className="bi bi-shop" style={{ fontSize: "18px" }} />
            <span>Proveedores</span>
          </NavLink>
        </Can>

        {/* 4. AUDITORÍA */}
        <Can I="audit:read">
          <NavLink to="/audit" style={linkStyle}>
            <i className="bi bi-clipboard2-data-fill" style={{ fontSize: "18px" }} />
            <span>Auditoría</span>
          </NavLink>
        </Can>

        {/* 5. USUARIOS (Sección Crítica) */}
        <Can I="users:read">
          <NavLink to="/users" style={linkStyle}>
            <i className="bi bi-people-fill" style={{ fontSize: "18px" }} />
            <span>Usuarios</span>
          </NavLink>
        </Can>

        {/* 6. CLIENTES */}
        <Can I="clients:read">
          <NavLink to="/clients" style={linkStyle}>
            <i className="bi bi-person-fill" style={{ fontSize: "18px" }} />
            <span>Clientes</span>
          </NavLink>
        </Can>

        {/* 7. INVENTARIO */}
        <Can I="inventory:read">
          <NavLink to="/inventory" style={linkStyle}>
            <i className="bi bi-inboxes-fill" style={{ fontSize: "18px" }} />
            <span>Inventario</span>
          </NavLink>
        </Can>

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
          <i className="bi bi-box-arrow-left" style={{ fontSize: "18px" }} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}