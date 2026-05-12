import { useAuth } from "../../context/AuthContext";
import texturaMadera from "../../assets/textura-madera.jpg";
import iconoGanchillo from "../../assets/icono-ganchillo.png";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header style={{
      height: "64px",
      margin: "24px 32px 0 32px",
      borderRadius: "16px",
      backgroundColor: "#d4b595",
      backgroundImage: `url(${texturaMadera})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      fontFamily: "'Nunito', sans-serif",
      position: "sticky",
      top: "24px",
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "18px", color: "#3d2a18", fontWeight: 800, textShadow: "0 1px 1px rgba(255,255,255,0.4)" }}>
          Panel de Administración
        </span>
        <i className="ti ti-menu-2" style={{ color: "#3d2a18", fontSize: "20px", cursor: "pointer" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button style={{
          width: "38px", height: "38px", borderRadius: "10px",
          background: "linear-gradient(to bottom, #e37e7e, #c44747)",
          border: "none", cursor: "pointer", color: "#fff", fontSize: "18px",
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)",
        }} aria-label="Notificaciones">
          <i className="ti ti-bell-filled" />
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "4px 4px 4px 16px", borderRadius: "24px",
          backgroundImage: `url(${texturaMadera})`,
          backgroundSize: "cover",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(255,255,255,0.2)",
          border: "1px solid rgba(0,0,0,0.1)"
        }}>
          <div style={{ textAlign: "right", lineHeight: 1.1 }}>
            <div style={{ fontSize: "11px", fontWeight: 900, color: "#3d2a18" }}>Administradora</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#4a3320" }}>{user?.usuario || "Ana"}</div>
          </div>
          <img src="https://i.pravatar.cc/150?img=5" alt="Perfil Ana" style={{
            width: "32px", height: "32px", borderRadius: "50%",
            border: "2px solid #5c4028", objectFit: "cover"
          }} />
        </div>

        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px 16px", borderRadius: "12px",
          backgroundImage: `url(${texturaMadera})`,
          backgroundSize: "cover",
          border: "1px solid rgba(0,0,0,0.1)",
          cursor: "pointer", color: "#3d2a18", fontSize: "14px", fontWeight: 900,
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), 0 3px 6px rgba(0,0,0,0.1)",
        }}>
          <img 
            src={iconoGanchillo} 
            alt="Salir" 
            style={{ 
                width: "24px", 
                height: "auto", 
                transform: "rotate(-15deg)",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
            }} 
          />
          Salir
        </button>
      </div>
    </header>
  );
}