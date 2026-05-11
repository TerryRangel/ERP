import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100%",
      background: "#fdf0f5",
      overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
      position: "relative",
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "fixed",
        top: "-120px",
        right: "-80px",
        width: "420px",
        height: "420px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,182,213,0.45) 0%, rgba(255,143,188,0.2) 60%, transparent 100%)",
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div style={{
        position: "fixed",
        bottom: "-100px",
        left: "180px",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,200,230,0.5) 0%, rgba(253,160,205,0.2) 60%, transparent 100%)",
        filter: "blur(50px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,220,240,0.4) 0%, transparent 70%)",
        filter: "blur(30px)",
        pointerEvents: "none",
        zIndex: 0,
        transform: "translate(-50%, -50%)",
      }} />

      <Sidebar />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>
        <Navbar />

        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
          background: "transparent",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(232,120,160,0.3) transparent",
        }}>
          <Outlet />
        </main>
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet" />
    </div>
  );
}
