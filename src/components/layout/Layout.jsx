import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import fondo from "../../assets/fondo.png";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta si es mobile y reacciona al resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false); // Cierra el drawer al expandir
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Bloquea el scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, sidebarOpen]);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      backgroundColor: "var(--bg)",
      position: "relative",
    }}>

      {/* OVERLAY — solo visible en móvil cuando el sidebar está abierto */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(2px)",
            zIndex: 40,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* SIDEBAR — en móvil se convierte en drawer lateral */}
      <div style={{
        position: isMobile ? "fixed" : "relative",
        top: 0,
        left: 0,
        height: "100%",
        zIndex: isMobile ? 50 : 10,
        transform: isMobile
          ? sidebarOpen ? "translateX(0)" : "translateX(-100%)"
          : "translateX(0)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        position: "relative",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        // En móvil ocupa todo el ancho (el sidebar está sobre él)
        width: isMobile ? "100%" : undefined,
      }}>

        {/* Brillo sutil sobre el fondo */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Navbar recibe el handler para abrir el sidebar en móvil */}
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          isMobile={isMobile}
        />

        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "24px 16px" : "40px 48px",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
