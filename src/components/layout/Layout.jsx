import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

//import texturaLino from "../../assets/textura-lino.png";
import texturaLinoDiseno from "../../assets/textura-lino-diseño.png";
import texturaLinoDiseñoHerramientas from "../../assets/textura-lino-diseño-herramientas.png";

export default function Layout() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      position: "relative",
    }}>
      <Sidebar />

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        flex: 1, 
        overflow: "hidden", 
        position: "relative",
        backgroundImage: `url(${texturaLinoDiseñoHerramientas})`,
        backgroundSize: "cover"
      }}>
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${texturaLinoDiseno})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <Navbar />

        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 32px",
          position: "relative",
          zIndex: 1,
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}