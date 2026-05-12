import { NavLink } from "react-router-dom";
import texturaMadera from "../../assets/textura-madera.jpg";
import texturaLino from "../../assets/textura-lino.png";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "chart-bar" },
  { name: "Proveedores", path: "/suppliers", icon: "building-store" },
  { name: "Auditoría", path: "/audit", icon: "clipboard-list" },
  { name: "Usuarios", path: "/users", icon: "users" },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: "260px", minWidth: "260px",
      backgroundImage: `url(${texturaLino})`,
      backgroundSize: "cover",
      backgroundPosition: "left center",
      borderRight: "2px solid #8b6242",
      boxShadow: "5px 0 20px rgba(0,0,0,0.15)",
      display: "flex", flexDirection: "column",
      fontFamily: "'Nunito', sans-serif", zIndex: 2,
    }}>
      <div style={{
        padding: "36px 20px 24px", display: "flex", flexDirection: "column", 
        alignItems: "center", gap: "10px", textShadow: "0 1px 1px rgba(255,255,255,0.4)"
      }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "12px",
          background: "linear-gradient(135deg, #f3a6b6, #de7a90)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px", 
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.2)",
          marginBottom: "4px"
        }}>🌸</div>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#2a1d11" }}>Crochet ERP</h2>
        <p style={{ margin: 0, fontSize: "12px", fontWeight: 800, color: "#4a3320" }}>Panel de Administración</p>
      </div>

      <nav style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px",
              textDecoration: "none", fontSize: "15px", fontWeight: 800,
              color: isActive ? "#2a1d11" : "#4a3320",
              backgroundImage: isActive 
                ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${texturaMadera})` 
                : `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url(${texturaMadera})`,
              backgroundSize: "cover",
              boxShadow: isActive
                ? "inset 0 3px 6px rgba(0,0,0,0.3)"
                : "inset 0 1px 3px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.1)",
            })}
          >
            <i className={`ti ti-${item.icon}`} style={{ fontSize: "20px" }} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: "24px 20px" }}>
         <div style={{ textAlign: "center", marginBottom: "16px", color: "#2a1d11", fontWeight: 900, fontSize: "14px" }}>Status</div>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", marginBottom: "20px" }}>
            <div style={{ fontSize: "28px", filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.25))" }}>🧶</div>
            <div style={{ fontSize: "28px", filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.25))" }}>🧵</div>
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #86efac, #22c55e)",
              boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.4), 0 0 12px rgba(34,197,94,0.6)",
              border: "2px solid #5c4028"
            }} />
         </div>
         <div style={{ textAlign: "center", fontSize: "13px", color: "#166534", fontWeight: 900, marginBottom: "24px" }}>
           Estado: Perfecto
         </div>

         <button style={{
           width: "100%", padding: "14px", borderRadius: "12px",
           backgroundImage: `url(${texturaMadera})`,
           backgroundSize: "cover",
           border: "none", cursor: "pointer", color: "#2a1d11", fontSize: "15px", fontWeight: 900,
           boxShadow: "inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)",
         }}>
           Crear Nuevo...
         </button>
      </div>
    </aside>
  );
}