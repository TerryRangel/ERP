import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Can } from "../../components/can.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../../assets/Logotipoo.PNG"; 

export default function Sidebar({ onClose, isMobile }) {
  const [socials, setSocials] = useState({ facebook: '', instagram: '' });

  const loadSocials = () => {
    setSocials({
      facebook: localStorage.getItem('erp_facebook') || '',
      instagram: localStorage.getItem('erp_instagram') || ''
    });
  };

  useEffect(() => {
    loadSocials();
    window.addEventListener('storage', loadSocials);
    return () => window.removeEventListener('storage', loadSocials);
  }, []);

  const linkStyle = ({ isActive }) => ({
    display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
    borderRadius: "8px", textDecoration: "none", fontSize: "14px",
    fontWeight: isActive ? "600" : "400", color: isActive ? "#8B9467" : "#4A453E",
    backgroundColor: isActive ? "#F4F6EE" : "transparent", transition: "all 0.2s ease",
  });

  const handleNavClick = () => { if (isMobile && onClose) onClose(); };

  return (
    <aside style={{
      width: "260px", minWidth: "260px", height: "100%", backgroundColor: "#FFFFFF",
      borderRight: "1px solid #E8E4DE", display: "flex", flexDirection: "column",
      fontFamily: "'Inter', sans-serif", zIndex: 10, overflowY: "auto",
    }}>

      {/* LOGO */}
      <div style={{ padding: "32px 24px 28px", display: "flex", justifyContent: "center" }}>
        <img src={logo} alt="logo" style={{ width: "140px", height: "auto", objectFit: "contain" }} />
      </div>

      {/* NAVEGACIÓN */}
      <nav style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        <Can I="dashboard:read"><NavLink to="/dashboard" style={linkStyle} onClick={handleNavClick}><i className="bi bi-speedometer2" /><span>Dashboard</span></NavLink></Can>
        <Can I="products:read"><NavLink to="/products" style={linkStyle} onClick={handleNavClick}><i className="bi bi-bag-fill" /><span>Productos</span></NavLink></Can>
        <Can I="suppliers:read"><NavLink to="/suppliers" style={linkStyle} onClick={handleNavClick}><i className="bi bi-shop" /><span>Proveedores</span></NavLink></Can>
        <Can I="audit:read"><NavLink to="/audit" style={linkStyle} onClick={handleNavClick}><i className="bi bi-clipboard2-data-fill" /><span>Auditoría</span></NavLink></Can>
        <Can I="users:read"><NavLink to="/users" style={linkStyle} onClick={handleNavClick}><i className="bi bi-people-fill" /><span>Usuarios</span></NavLink></Can>
        <Can I="clients:read"><NavLink to="/clients" style={linkStyle} onClick={handleNavClick}><i className="bi bi-person-fill" /><span>Clientes</span></NavLink></Can>
        <Can I="inventory:read"><NavLink to="/inventory" style={linkStyle} onClick={handleNavClick}><i className="bi bi-inboxes-fill" /><span>Inventario</span></NavLink></Can>
        <Can I="receptions:read"><NavLink to="/receptions" style={linkStyle} onClick={handleNavClick}><i className="bi bi-truck" /><span>Recepciones</span></NavLink></Can>
      </nav>

      {/* SECCIÓN INFERIOR: STATUS + REDES */}
      <div style={{ padding: "24px 16px", borderTop: "1px solid #F9F7F2", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* Status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", gap: "8px", border: "1px solid #D7E4C0", borderRadius: "8px", backgroundColor: "#E8F0DD" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#5F6F52" }} />
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#5F6F52", textTransform: "uppercase" }}>En línea</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "8px 0" }}>
          {socials.facebook && (
            <a href={socials.facebook.startsWith('http') ? socials.facebook : `https://${socials.facebook}`} target="_blank" rel="noreferrer" style={{ color: "#8B9467", fontSize: "22px", transition: "transform 0.2s" }}>
              <i className="bi bi-facebook" />
            </a>
          )}
          {socials.instagram && (
            <a href={socials.instagram.startsWith('http') ? socials.instagram : `https://${socials.instagram}`} target="_blank" rel="noreferrer" style={{ color: "#8B9467", fontSize: "22px", transition: "transform 0.2s" }}>
              <i className="bi bi-instagram" />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}