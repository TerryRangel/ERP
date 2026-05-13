import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import fondo from "../../assets/fondo.png";

export default function Layout() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      backgroundColor: "var(--bg)", 
      position: "relative",
    }}>
    
      <Sidebar />

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        flex: 1, 
        overflow: "hidden", 
        position: "relative",
        backgroundImage: `url(${fondo})`, // Fondo texturizado
        backgroundSize: "cover"
      
      }}>
        
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Brillo sutil sobre el crema
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <Navbar />

        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 48px", // Aumentamos el padding para que el contenido respire
          position: "relative",
          zIndex: 1,
        }}>
          {/* Contenedor con ancho máximo para mantener el orden visual */}
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
