import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "chart-bar" },
  { name: "Proveedores", path: "/suppliers", icon: "building-store" },
  { name: "Auditoría", path: "/audit", icon: "clipboard-list" },
  { name: "Usuarios", path: "/users", icon: "users" },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: "250px",
      minWidth: "250px",
      background: "linear-gradient(180deg, #fff0f6 0%, #ffe8f2 40%, #ffd9ec 100%)",
      borderRight: "1.5px solid rgba(232,120,160,0.2)",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      fontFamily: "'Nunito', sans-serif",
      position: "relative",
      overflow: "hidden",
      boxShadow: "4px 0 24px rgba(232,120,160,0.08)",
      zIndex: 2,
    }}>
      {/* Background floral decoration */}
      <div style={{
        position: "absolute",
        bottom: "80px",
        right: "-30px",
        width: "160px",
        height: "160px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,168,201,0.3) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: "100px",
        left: "-40px",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,182,213,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{
        height: "72px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1.5px solid rgba(232,120,160,0.15)",
        gap: "12px",
        position: "relative",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #f9a8c9 0%, #e879a0 50%, #c0386b 100%)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          boxShadow: "0 6px 20px rgba(232,121,160,0.45), 0 0 0 4px rgba(249,168,201,0.3)",
          border: "2px solid rgba(255,255,255,0.6)",
        }}>🌸</div>
        <div>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#8b2252", letterSpacing: "-0.02em" }}>
            Crochet ERP
          </p>
          <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, color: "#d4789e", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: "20px 20px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(232,120,160,0.4), transparent)" }} />
          <span style={{ fontSize: "10px", fontWeight: 800, color: "#d4789e", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Menú
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(232,120,160,0.4))" }} />
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: isActive ? 800 : 600,
              transition: "all 0.2s ease",
              color: isActive ? "#fff" : "#c084a0",
              background: isActive
                ? "linear-gradient(135deg, #f472b6 0%, #e879a0 50%, #db2777 100%)"
                : "transparent",
              border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
              boxShadow: isActive ? "0 4px 18px rgba(232,121,160,0.45), inset 0 1px 0 rgba(255,255,255,0.2)" : "none",
              transform: isActive ? "translateX(2px)" : "translateX(0)",
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9px",
                  background: isActive
                    ? "rgba(255,255,255,0.2)"
                    : "linear-gradient(135deg, #fff0f6 0%, #ffe4ef 100%)",
                  color: isActive ? "#fff" : "#e879a0",
                  fontSize: "15px",
                  border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(232,120,160,0.2)",
                  boxShadow: isActive ? "none" : "0 2px 6px rgba(232,120,160,0.1)",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}>
                  <i className={`ti ti-${item.icon}`} aria-hidden="true" />
                </span>
                <span style={{ flex: 1 }}>{item.name}</span>
                {isActive && (
                  <span style={{ fontSize: "14px" }}>✦</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Decorative flowers row */}
      <div style={{
        textAlign: "center",
        fontSize: "16px",
        padding: "4px 0 2px",
        letterSpacing: "4px",
        opacity: 0.5,
        color: "#e879a0",
      }}>
        ✿ ✾ ✿
      </div>

      {/* Bottom status */}
      <div style={{
        margin: "10px 12px 16px",
        padding: "12px 14px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,240,250,0.9) 100%)",
        border: "1.5px solid rgba(232,120,160,0.2)",
        boxShadow: "0 2px 12px rgba(232,120,160,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4ade80, #22c55e)",
            boxShadow: "0 0 8px rgba(74,222,128,0.6)",
            flexShrink: 0,
          }} />
          <span style={{ fontSize: "12px", color: "#c084a0", fontWeight: 600 }}>Sistema activo</span>
          <span style={{ marginLeft: "auto", fontSize: "12px" }}>🌷</span>
        </div>
      </div>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" rel="stylesheet" />
    </aside>
  );
}
