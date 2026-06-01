import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAudit } from "../../context/AuditContext";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Can } from "../can.jsx";
import SettingsModal from "./SettingsModal.jsx";

export default function Navbar({ onMenuClick, isMobile }) {
  const { user, logout } = useAuth();
  const auditContext = useAudit();
  const latestLogs = auditContext?.latestLogs || [];

  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false); 
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ─── NUEVO ESTADO: Lee si las notificaciones están activas en memoria ───
  const [showNotifications, setShowNotifications] = useState(
    localStorage.getItem('erp_notifications') !== 'false'
  );

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const userRole = user?.role?.toUpperCase() || "USER";
  const roleLabel = userRole === "ADMIN" ? "Administrador/a" : "Usuario Estándar";

  const searchablePages = [
    // --- DASHBOARD ---
    { name: "Dashboard (Resumen)", path: "/dashboard", icon: "bi-speedometer2", permissions: ["dashboard:read"] },

    // --- AUDITORÍA ---
    { name: "Auditoría (Registro de eventos)", path: "/audit", icon: "bi-clipboard2-data-fill", permissions: ["audit:read"] },

    // --- USUARIOS ---
    { name: "Directorio de Usuarios", path: "/users", icon: "bi-people-fill", permissions: ["users:read"] },
    { name: "Agregar Nuevo Usuario", path: "/users", icon: "bi-person-plus-fill", permissions: ["users:create"] },
    { name: "Editar Usuario", path: "/users", icon: "bi-person-gear", permissions: ["users:create"] },
    { name: "Eliminar Usuario", path: "/users", icon: "bi-person-dash-fill", permissions: ["users:create"] },

    // --- PRODUCTOS ---
    { name: "Catálogo de Productos", path: "/products", icon: "bi-bag-fill", permissions: ["products:read"] },
    { name: "Agregar Nuevo Producto", path: "/products", icon: "bi-bag-plus-fill", permissions: ["products:create"] },
    { name: "Editar Producto", path: "/products", icon: "bi-pencil-square", permissions: ["products:create"] },
    { name: "Eliminar Producto", path: "/products", icon: "bi-trash3-fill", permissions: ["products:create"] },

    // --- PROVEEDORES ---
    { name: "Directorio de Proveedores", path: "/suppliers", icon: "bi-shop", permissions: ["suppliers:read"] },
    { name: "Agregar Nuevo Proveedor", path: "/suppliers", icon: "bi-building-add", permissions: ["suppliers:create"] },
    { name: "Editar Proveedor", path: "/suppliers", icon: "bi-building-gear", permissions: ["suppliers:create"] },
    { name: "Eliminar Proveedor", path: "/suppliers", icon: "bi-building-dash", permissions: ["suppliers:create"] },

    // --- CLIENTES ---
    { name: "Directorio de Clientes", path: "/clients", icon: "bi-person-vcard", permissions: ["clients:read"] },
    { name: "Agregar Nuevo Cliente", path: "/clients", icon: "bi-person-plus-fill", permissions: ["clients:create"] },
    { name: "Editar Cliente", path: "/clients", icon: "bi-person-lines-fill", permissions: ["clients:create"] },
    { name: "Eliminar Cliente", path: "/clients", icon: "bi-person-x-fill", permissions: ["clients:create"] },

    // --- INVENTARIO ---
    { name: "Control de Inventario", path: "/inventory", icon: "bi-inboxes-fill", permissions: ["inventory:read"] },
    { name: "Actualizar Stock (Inventario)", path: "/inventory", icon: "bi-arrow-repeat", permissions: ["inventory:create"] },

    // --- RECEPCIONES ---
    { name: "Historial de Recepciones", path: "/receptions", icon: "bi-truck", permissions: ["recepciones:read"] },
    { name: "Registrar Nueva Recepción", path: "/receptions", icon: "bi-box-arrow-in-down", permissions: ["recepciones:create"] },
    { name: "Confirmar Entrega (Recepción)", path: "/receptions", icon: "bi-check2-all", permissions: ["recepciones:update"] },
    { name: "Eliminar Recepción", path: "/receptions", icon: "bi-trash", permissions: ["recepciones:delete"] },
  ];

  const filteredPages = searchablePages.filter((page) => {
    if (searchQuery.trim() === "") return false;
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    const matchesSearch = searchTerms.every((term) => 
      page.name.toLowerCase().includes(term)
    );
    if (!matchesSearch) return false;
    if (userRole === "ADMIN") return true;
    const hasPermission = page.permissions.some((p) => user?.permissions?.includes(p));
    return hasPermission;
  });

  // ─── NUEVO EFECTO: Escucha en tiempo real si el modal apaga las notificaciones ───
  useEffect(() => {
    const handleNotifChange = () => {
      setShowNotifications(localStorage.getItem('erp_notifications') !== 'false');
    };
    window.addEventListener('notificationsChanged', handleNotifChange);
    return () => window.removeEventListener('notificationsChanged', handleNotifChange);
  }, []);

  useEffect(() => {
    if (latestLogs.length > 0) setHasUnread(true);
  }, [latestLogs]);

  const getPageTitle = () => {
    const path = location.pathname.replace("/", "");
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        if (isMobile) setShowSearchBar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const handleSearchNavigate = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowSuggestions(false);
    setShowSearchBar(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredPages.length > 0) {
      handleSearchNavigate(filteredPages[0].path);
    }
  };

  const iconBtn = {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.12)",
    color: "#FFFFFF",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  };

  return (
    <>
      <header style={{
        height: "74px",
        padding: isMobile ? "0 16px" : "0 40px",
        background: "linear-gradient(90deg, #8d9b70 0%, #7c8b61 50%, #6f7d55 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        gap: "12px",
      }}>

        {/* ── LEFT ──────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "12px" : "28px", minWidth: 0 }}>

          {isMobile && (
            <button
              onClick={onMenuClick}
              style={{ ...iconBtn, border: "none", flexShrink: 0 }}
              aria-label="Abrir menú"
              type="button"
            >
              <i className="bi bi-list" style={{ fontSize: "22px" }} />
            </button>
          )}

          <div
            onClick={() => navigate("/dashboard")}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", minWidth: 0 }}
          >
            <div style={{
              width: "40px", height: "40px", flexShrink: 0,
              borderRadius: "14px",
              background: "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <i className="bi bi-grid-fill" style={{ color: "#fff", fontSize: "16px" }} />
            </div>

            {!isMobile && (
              <div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#FFFFFF", lineHeight: 1 }}>Panel ERP</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", marginTop: "4px" }}>{getPageTitle()}</div>
              </div>
            )}
            {isMobile && (
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", whiteSpace: "nowrap" }}>
                {getPageTitle()}
              </div>
            )}
          </div>

          {!isMobile && (
            <div ref={searchRef} style={{ position: "relative", width: "290px" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8d9b70", pointerEvents: "none" }}>
                <i className="bi bi-search" />
              </div>
              <input
                type="text"
                placeholder="Buscar módulo..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                style={{ padding: "11px 16px 11px 40px", borderRadius: "14px", border: "none", backgroundColor: "rgba(255,255,255,0.95)", fontSize: "14px", width: "100%", outline: "none", color: "#1F2937", transition: "all 0.2s", boxSizing: "border-box" }}
              />
              {showSuggestions && searchQuery.trim() !== "" && (
                <SearchDropdown filteredPages={filteredPages} onNavigate={handleSearchNavigate} />
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT ─────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "20px", flexShrink: 0 }}>

          {isMobile && (
            <div ref={searchRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowSearchBar((v) => !v)}
                style={{ ...iconBtn, border: "none" }}
                aria-label="Buscar"
              >
                <i className="bi bi-search" />
              </button>

              {showSearchBar && (
                <div style={{
                  position: "fixed",
                  top: "74px",
                  left: 0,
                  right: 0,
                  backgroundColor: "#6f7d55",
                  padding: "12px 16px",
                  zIndex: 200,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8d9b70", pointerEvents: "none" }}>
                      <i className="bi bi-search" />
                    </div>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Buscar módulo..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleKeyDown}
                      style={{ padding: "12px 16px 12px 40px", borderRadius: "12px", border: "none", backgroundColor: "rgba(255,255,255,0.95)", fontSize: "14px", width: "100%", outline: "none", color: "#1F2937", boxSizing: "border-box" }}
                    />
                  </div>
                  {showSuggestions && searchQuery.trim() !== "" && (
                    <SearchDropdown filteredPages={filteredPages} onNavigate={handleSearchNavigate} style={{ position: "relative", top: "8px", borderRadius: "12px" }} />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── CONDICIÓN PARA OCULTAR O MOSTRAR LA CAMPANITA DE NOTIFICACIONES ── */}
          {showNotifications && (
            <Can I="audit:read">
              <div ref={notifRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => { setIsNotifOpen(!isNotifOpen); setHasUnread(false); }}
                  style={{ ...iconBtn, position: "relative" }}
                >
                  <i className="bi bi-bell-fill" />
                  {hasUnread && (
                    <span style={{ position: "absolute", top: "8px", right: "8px", width: "10px", height: "10px", borderRadius: "50%", background: "#F87171", border: "2px solid #8d9b70" }} />
                  )}
                </button>

                {isNotifOpen && (
                  <div style={{
                    position: "absolute", top: "60px", right: "0",
                    width: isMobile ? "calc(100vw - 32px)" : "320px",
                    maxWidth: "320px",
                    background: "#fff", borderRadius: "16px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    padding: "15px", zIndex: 1000,
                  }}>
                    <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold", color: "#1F2937" }}>Actividad Reciente</h4>
                    {latestLogs.length > 0 ? latestLogs.map((l) => (
                      <div key={l.id || l._id} style={{ padding: "10px", borderBottom: "1px solid #f3f4f6" }}>
                        <p style={{ margin: 0, fontSize: "12px", fontWeight: "bold", color: "#8d9b70" }}>{l.action}</p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>{l.resource} • {new Date(l.createdAt || l.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    )) : (
                      <p style={{ fontSize: "12px", color: "#999", textAlign: "center" }}>No hay actividad reciente</p>
                    )}
                    <button type="button" onClick={() => { navigate("/audit"); setIsNotifOpen(false); }} style={{ width: "100%", marginTop: "10px", fontSize: "12px", fontWeight: "bold", color: "#8d9b70", background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "8px" }}>
                      Ver historial completo
                    </button>
                  </div>
                )}
              </div>
            </Can>
          )}
          {/* ─────────────────────────────────────────────────────────────────── */}

          {/* BOTÓN DE ESCRITORIO CON stopPropagation() */}
          {!isMobile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                setIsSettingsOpen(true);
              }}
              style={{ ...iconBtn, border: "none" }}
            >
              <i className="bi bi-gear-fill" />
            </button>
          )}

          <div ref={profileRef} style={{ position: "relative" }}>
            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                display: "flex", alignItems: "center",
                gap: isMobile ? "0" : "10px",
                padding: isMobile ? "0" : "6px 14px",
                borderRadius: "20px",
                background: isMobile ? "transparent" : "rgba(255,255,255,0.12)",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => { if (!isMobile) e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
              onMouseOut={(e) => { if (!isMobile) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            >
              {!isMobile && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#FFF" }}>{user?.nombre || "Usuario"}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)" }}>{roleLabel}</div>
                </div>
              )}
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#fff", color: "#8d9b70",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "bold", fontSize: "14px", flexShrink: 0,
                overflow: "hidden", // Importante para que la imagen no se salga del círculo
              }}>
                {user?.fotoPerfil ? (
                  <img 
                    src={user.fotoPerfil} 
                    alt="Perfil" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                ) : (
                  (user?.nombre?.charAt(0) || "U").toUpperCase()
                )}
              </div>
            </div>

            {isProfileOpen && (
              <div style={{
                position: "absolute", top: "60px", right: "0",
                width: isMobile ? "calc(100vw - 32px)" : "260px",
                maxWidth: "260px",
                background: "#fff", borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                zIndex: 1000,
              }}>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", color: "#1F2937" }}>{user?.nombre} {user?.apellido}</h4>
                <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "15px" }}>{user?.email}</p>

                {/* BOTÓN MÓVIL DENTRO DEL PERFIL CON stopPropagation() */}
                {isMobile && (
                  <button
                    type="button"
                    onClick={(e) => { 
                      e.stopPropagation();
                      setIsSettingsOpen(true); 
                      setIsProfileOpen(false); 
                    }}
                    style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px", background: "#F9F7F2", border: "1px solid #E8E4DE", borderRadius: "10px", color: "#4A453E", fontWeight: "600", cursor: "pointer", marginBottom: "10px", fontSize: "13px" }}
                  >
                    <i className="bi bi-gear-fill" style={{ fontSize: "16px" }} />
                    Ajustes Rápidos
                  </button>
                )}

                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "12px", marginBottom: "15px" }}>
                  <p style={{ fontSize: "10px", fontWeight: "bold", color: "#8d9b70", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Permisos Activos
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {userRole === "ADMIN" ? (
                      <span style={{ fontSize: "10px", background: "#EEF2E7", color: "#5F6F52", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold" }}>Acceso Total (Admin)</span>
                    ) : (
                      <>
                        {user?.permissions?.slice(0, 5).map((p) => (
                          <span key={p} style={{ fontSize: "10px", background: "#F3F4F6", color: "#4B5563", padding: "4px 8px", borderRadius: "6px", fontWeight: "500" }}>
                            {p.split(":")[0]}
                          </span>
                        ))}
                        {user?.permissions?.length > 5 && (
                          <span style={{ fontSize: "10px", padding: "4px", color: "#9CA3AF" }}>+{user.permissions.length - 5} más</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "10px", background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: "10px", color: "#DC2626", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#FEE2E2"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#FEF2F2"}
                >
                  <i className="bi bi-box-arrow-right" style={{ fontSize: "16px" }} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── AQUÍ AGREGAMOS EL MODAL DE AJUSTES FUERA DEL HEADER ── */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}

function SearchDropdown({ filteredPages, onNavigate, style = {} }) {
  if (filteredPages.length === 0) return null;

  return (
    <div style={{
      position: "absolute", top: "110%", left: 0, right: 0,
      background: "#fff", borderRadius: "14px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      overflow: "hidden", zIndex: 1000,
      ...style,
    }}>
      {filteredPages.map((page) => (
        <div
          key={page.name}
          onClick={() => onNavigate(page.path)}
          style={{ padding: "12px 15px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#4B5563" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.color = "#8d9b70"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4B5563"; }}
        >
          <i className={`bi ${page.icon}`} style={{ fontSize: "16px" }} />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>{page.name}</span>
        </div>
      ))}
    </div>
  );
}