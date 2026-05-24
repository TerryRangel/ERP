import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAudit } from "../../context/AuditContext";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Can } from "../can.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const auditContext = useAudit(); 
  const latestLogs = auditContext?.latestLogs || []; 
  
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const userRole = user?.role?.toUpperCase() || "USER";
  const roleLabel = userRole === "ADMIN" ? "Administrador/a" : "Usuario Estándar";

  // Lista de páginas disponibles para buscar en el ERP con sus permisos
  const searchablePages = [
    { name: "Dashboard", path: "/dashboard", icon: "bi-speedometer2", permissions: ["dashboard:read"] },
    { name: "Productos", path: "/products", icon: "bi-bag-fill", permissions: ["products:read"] },
    { name: "Proveedores", path: "/suppliers", icon: "bi-shop", permissions: ["suppliers:read"] },
    { name: "Auditoría", path: "/audit", icon: "bi-clipboard2-data-fill", permissions: ["audit:read"] },
    { name: "Usuarios", path: "/users", icon: "bi-people-fill", permissions: ["users:read"] },
    { name: "Clientes", path: "/clients", icon: "bi-person-fill", permissions: ["clients:read"] },
    { name: "Inventario", path: "/inventory", icon: "bi-inboxes-fill", permissions: ["inventory:read"] }
  ];

  // Filtramos las páginas según el texto escrito Y los permisos del usuario
  const filteredPages = searchablePages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (userRole === "ADMIN") return matchesSearch; // Admin ve todo
    
    // Si no es admin, validamos que tenga el permiso en su arreglo de permisos
    const hasPermission = page.permissions.some(perm => user?.permissions?.includes(perm));
    
    return matchesSearch && hasPermission;
  });

  useEffect(() => {
    if (latestLogs.length > 0) setHasUnread(true);
  }, [latestLogs]);

  const getPageTitle = () => {
    const path = location.pathname.replace("/", "");
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Cierre de menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchNavigate = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredPages.length > 0) {
      handleSearchNavigate(filteredPages[0].path);
    }
  };

  return (
    <header style={{ height: "74px", padding: "0 40px", background: "linear-gradient(90deg, #8d9b70 0%, #7c8b61 50%, #6f7d55 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      
      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        <div onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
          
          <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <i className="bi bi-grid-fill" style={{ color: "#fff", fontSize: "18px" }} />
          </div>
          
          {/* Textos originales con título dinámico */}
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#FFFFFF", lineHeight: 1 }}>Panel ERP</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", marginTop: "4px" }}>{getPageTitle()}</div>
          </div>
        </div>

        {/* Buscador Inteligente con Sugerencias (Ahora respeta permisos) */}
        <div ref={searchRef} style={{ position: "relative", width: "290px" }}>
          <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8d9b70", pointerEvents: "none" }}>
            <i className="bi bi-search"></i>
          </div>
          <input 
            type="text" 
            placeholder="Buscar módulo..." 
            value={searchQuery} 
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }} 
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown} 
            style={{ padding: "11px 16px 11px 40px", borderRadius: "14px", border: "none", backgroundColor: "rgba(255,255,255,0.95)", fontSize: "14px", width: "100%", outline: "none", color: "#1F2937", transition: "all 0.2s" }} 
          />
          
          {/* Menú de sugerencias de búsqueda */}
          {showSuggestions && searchQuery.trim() !== "" && (
            <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "#fff", borderRadius: "14px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", overflow: "hidden", zIndex: 1000 }}>
              {filteredPages.length > 0 ? (
                <div>
                  <div style={{ padding: "10px 15px", fontSize: "11px", fontWeight: "bold", color: "#9CA3AF", textTransform: "uppercase", borderBottom: "1px solid #F3F4F6" }}>Resultados sugeridos</div>
                  {filteredPages.map((page) => (
                    <div 
                      key={page.path}
                      onClick={() => handleSearchNavigate(page.path)}
                      style={{ padding: "12px 15px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "background 0.2s", color: "#4B5563" }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.color = "#8d9b70"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4B5563"; }}
                    >
                      <i className={`bi ${page.icon}`} style={{ fontSize: "16px" }}></i>
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>{page.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "15px", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
                  No se encontraron módulos permitidos
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: NOTIFICACIONES Y PERFIL */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
         
         <Can I="audit:read">
        {/* NOTIFICACIONES (Protegido por permisos) */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setHasUnread(false); }} 
            style={{ width: "42px", height: "42px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.12)", color: "#FFFFFF", cursor: "pointer", position: "relative" }}
          >
            <i className="bi bi-bell-fill" />
            {hasUnread && <span style={{ position: "absolute", top: "8px", right: "8px", width: "10px", height: "10px", borderRadius: "50%", background: "#F87171", border: "2px solid #8d9b70" }} />}
          </button>
          
          {isNotifOpen && (
            <div style={{ position: "absolute", top: "60px", right: "0", width: "320px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "15px", zIndex: 1000 }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold", color: "#1F2937" }}>Actividad Reciente</h4>
              {latestLogs.length > 0 ? latestLogs.map(l => (
                <div key={l.id || l._id} style={{ padding: "10px", borderBottom: "1px solid #f3f4f6" }}>
                  <p style={{ margin: 0, fontSize: "12px", fontWeight: "bold", color: "#8d9b70" }}>{l.action}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>{l.resource} • {new Date(l.createdAt || l.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              )) : <p style={{fontSize: "12px", color:"#999", textAlign:"center"}}>No hay actividad reciente</p>}
              <button onClick={() => navigate("/audit")} style={{ width: "100%", marginTop: "10px", fontSize: "12px", fontWeight: "bold", color: "#8d9b70", background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "8px" }} onMouseOver={(e) => e.currentTarget.style.background = "#F9FAFB"} onMouseOut={(e) => e.currentTarget.style.background = "none"}>Ver historial completo</button>
            </div>
          )}
        </div>
        </Can>

        {/* AJUSTES */}
        <button onClick={() => navigate("/settings")} style={{ width: "42px", height: "42px", borderRadius: "14px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
          <i className="bi bi-gear-fill" />
        </button>

        {/* PERFIL COMPACTO */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 14px", borderRadius: "20px", background: "rgba(255,255,255,0.12)", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#FFF" }}>{user?.nombre || "Usuario"}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)" }}>{roleLabel}</div>
            </div>
            <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#fff", color: "#8d9b70", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              {(user?.nombre?.charAt(0) || "U").toUpperCase()}
            </div>
          </div>

          {/* Menú desplegable del usuario */}
          {isProfileOpen && (
            <div style={{ position: "absolute", top: "60px", right: "0", width: "260px", background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 1000 }}>
              <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", color: "#1F2937" }}>{user?.nombre} {user?.apellido}</h4>
              <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "15px" }}>{user?.email}</p>
              
              {/* Sección compacta de Permisos */}
              <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "12px", marginBottom: "15px" }}>
                <p style={{ fontSize: "10px", fontWeight: "bold", color: "#8d9b70", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Permisos Activos
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {userRole === "ADMIN" ? (
                     <span style={{ fontSize: "10px", background: "#EEF2E7", color: "#5F6F52", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold" }}>Acceso Total (Admin)</span>
                  ) : (
                    <>
                      {user?.permissions?.slice(0, 5).map(p => (
                        <span key={p} style={{ fontSize: "10px", background: "#F3F4F6", color: "#4B5563", padding: "4px 8px", borderRadius: "6px", fontWeight: "500" }}>
                          {p.split(':')[0]}
                        </span>
                      ))}
                      {user?.permissions?.length > 5 && (
                        <span style={{ fontSize: "10px", padding: "4px 4px", color: "#9CA3AF" }}>+{user.permissions.length - 5} más</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Botón de Logout SOLO con icono */}
              <button 
                onClick={logout} 
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "10px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: "10px", color: "#DC2626", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.background = "#FEE2E2"}
                onMouseOut={(e) => e.currentTarget.style.background = "#FEF2F2"}
              >
                <i className="bi bi-box-arrow-right" style={{ fontSize: "16px" }}></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}