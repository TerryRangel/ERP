import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Can } from "../../components/can.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Sidebar({ onClose, isMobile }) {
  const { logout } = useAuth();

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: isActive ? "600" : "400",
    color: isActive ? "#8B9467" : "#4A453E",
    backgroundColor: isActive ? "#F4F6EE" : "transparent",
    transition: "all 0.2s ease",
  });

  // En móvil cerramos el drawer al hacer clic en un enlace
  const handleNavClick = () => {
    if (isMobile && onClose) onClose();
  };

  return (
    <aside style={{
      width: "260px",
      minWidth: "260px",
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRight: "1px solid #E8E4DE",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', sans-serif",
      zIndex: 10,
      overflowY: "auto",
    }}>

      {/* ── Logo + botón de cierre (móvil) ── */}
      <div style={{
        padding: "32px 24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}>
        {/* Fila superior: logo + botón X en móvil */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#4A453E" }}>
            <span style={{ fontSize: "24px" }}>🧶</span>
            <h2 style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "500",
              fontFamily: "'Lora', serif",
              letterSpacing: "0.5px",
            }}>
              Tejidos
            </h2>
          </div>

          {/* Botón cerrar — solo en móvil */}
          {isMobile && (
            <button
              onClick={onClose}
              aria-label="Cerrar menú"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid #E8E4DE",
                backgroundColor: "#F9F7F2",
                color: "#4A453E",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>

        <p style={{
          margin: 0,
          fontSize: "10px",
          fontWeight: "600",
          color: "#8C867E",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          paddingLeft: "36px",
        }}>
          Hecho a mano
        </p>
      </div>

      {/* ── Navegación ── */}
      <nav style={{
        padding: "0 16px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        flex: 1,
      }}>

        <Can I="dashboard:read">
          <NavLink to="/dashboard" style={linkStyle} onClick={handleNavClick}>
            <i className="bi bi-speedometer2" style={{ fontSize: "18px" }} />
            <span>Dashboard</span>
          </NavLink>
        </Can>

        <Can I="products:read">
          <NavLink to="/products" style={linkStyle} onClick={handleNavClick}>
            <i className="bi bi-bag-fill" style={{ fontSize: "18px" }} />
            <span>Productos</span>
          </NavLink>
        </Can>

        <Can I="suppliers:read">
          <NavLink to="/suppliers" style={linkStyle} onClick={handleNavClick}>
            <i className="bi bi-shop" style={{ fontSize: "18px" }} />
            <span>Proveedores</span>
          </NavLink>
        </Can>

        <Can I="audit:read">
          <NavLink to="/audit" style={linkStyle} onClick={handleNavClick}>
            <i className="bi bi-clipboard2-data-fill" style={{ fontSize: "18px" }} />
            <span>Auditoría</span>
          </NavLink>
        </Can>

        <Can I="users:read">
          <NavLink to="/users" style={linkStyle} onClick={handleNavClick}>
            <i className="bi bi-people-fill" style={{ fontSize: "18px" }} />
            <span>Usuarios</span>
          </NavLink>
        </Can>

        <Can I="clients:read">
          <NavLink to="/clients" style={linkStyle} onClick={handleNavClick}>
            <i className="bi bi-person-fill" style={{ fontSize: "18px" }} />
            <span>Clientes</span>
          </NavLink>
        </Can>

        <Can I="inventory:read">
          <NavLink to="/inventory" style={linkStyle} onClick={handleNavClick}>
            <i className="bi bi-inboxes-fill" style={{ fontSize: "18px" }} />
            <span>Inventario</span>
          </NavLink>
        </Can>

        <Can I="receptions:read">
          <NavLink to="/receptions" style={linkStyle} onClick={handleNavClick}>
            <i className="bi bi-truck" style={{ fontSize: "18px" }} />
            <span>Recepciones</span>
          </NavLink>
        </Can>

      </nav>

      {/* ── Sección inferior ── */}
      <div style={{
        padding: "24px 16px",
        borderTop: "1px solid #F9F7F2",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        {/* Indicador de status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#F9F7F2",
          borderRadius: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: "#86efac",
              boxShadow: "0 0 8px rgba(134, 239, 172, 0.6)",
            }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#4A453E" }}>Sistema Online</span>
          </div>
          <span style={{ fontSize: "16px" }}>🧵</span>
        </div>

        {/* Botón cerrar sesión */}
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
            gap: "8px",
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#F9F7F2"; e.currentTarget.style.color = "#4A453E"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8C867E"; }}
        >
          <i className="bi bi-box-arrow-left" style={{ fontSize: "18px" }} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
