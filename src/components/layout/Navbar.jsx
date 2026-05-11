import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const initial = (user?.usuario?.charAt(0) || "U").toUpperCase();

  return (
    <header style={{
      height: "68px",
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1.5px solid rgba(232,120,160,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      fontFamily: "'Nunito', sans-serif",
      boxShadow: "0 2px 20px rgba(232,120,160,0.08)",
      position: "relative",
      zIndex: 10,
    }}>
      {/* Decorative top line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "2px",
        background: "linear-gradient(90deg, #f9a8c9, #e879a0, #ff6eb4, #ffd6e8, #e879a0)",
        backgroundSize: "200% 100%",
        animation: "shimmer 3s linear infinite",
      }} />

      {/* Left: breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #fce4f0 0%, #f9a8c9 100%)",
          border: "1px solid rgba(232,120,160,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
        }}>
          <i className="ti ti-layout-dashboard" style={{ color: "#d6548a", fontSize: "13px" }} />
        </div>
        <span style={{ fontSize: "13px", color: "#c084a0", fontWeight: 600, letterSpacing: "0.01em" }}>
          Panel de Administración
        </span>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Bell */}
        <button style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #fff0f6 0%, #ffe4ef 100%)",
          border: "1.5px solid rgba(232,120,160,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#e879a0",
          fontSize: "15px",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 8px rgba(232,120,160,0.1)",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, #fce4f0 0%, #f9a8c9 100%)";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(232,120,160,0.3)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, #fff0f6 0%, #ffe4ef 100%)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(232,120,160,0.1)";
          }}
          aria-label="Notificaciones"
        >
          <i className="ti ti-bell" />
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "26px", background: "rgba(232,120,160,0.2)" }} />

        {/* User info */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#4a1535", lineHeight: 1.2 }}>
            {user?.usuario || "Usuario"}
          </div>
          <div style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "linear-gradient(90deg, #e879a0, #f9a8c9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Administradora
          </div>
        </div>

        {/* Avatar */}
        <div style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f9a8c9 0%, #e879a0 50%, #c0386b 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: 800,
          color: "#fff",
          boxShadow: "0 4px 14px rgba(232,121,160,0.4), 0 0 0 3px rgba(249,168,201,0.3)",
          flexShrink: 0,
          border: "2px solid #fff",
        }}>
          {initial}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "26px", background: "rgba(232,120,160,0.2)" }} />

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #fff0f6, #ffe4ef)",
            border: "1.5px solid rgba(232,120,160,0.25)",
            color: "#c084a0",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(232,120,160,0.08)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, #ffe4ef, #ffc7de)";
            e.currentTarget.style.borderColor = "rgba(232,120,160,0.5)";
            e.currentTarget.style.color = "#c0386b";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(232,120,160,0.25)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, #fff0f6, #ffe4ef)";
            e.currentTarget.style.borderColor = "rgba(232,120,160,0.25)";
            e.currentTarget.style.color = "#c084a0";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(232,120,160,0.08)";
          }}
        >
          <i className="ti ti-logout" style={{ fontSize: "14px" }} />
          Salir
        </button>
      </div>

      <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" rel="stylesheet" />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </header>
  );
}
