import { useDashboard } from "../../hooks/useDashboard";
import { getAuditLogs } from "../../services/auditService";
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

const metrics = [
  { key: "totalUsers",     label: "Total Usuarios",   sublabel: "Usuarios registrados" },
  { key: "totalClients",   label: "Total Clientes",   sublabel: "Cartera de clientes" },
  { key: "totalSuppliers", label: "Proveedores",       sublabel: "Socios comerciales" },
  { key: "totalProducts",  label: "Productos Tejidos", sublabel: "Inventario de crochet" },
];

function MetricCard({ label, sublabel, value }) {
  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      padding: "20px 24px",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
      border: "1px solid #E8E4DE",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      transition: "transform 0.2s ease",
    }}>
      <div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#8C867E", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {label}
        </div>
        <div style={{ fontSize: "11px", color: "#B4B0AB" }}>{sublabel}</div>
      </div>

      <div style={{
        fontSize: "clamp(28px, 5vw, 36px)",
        fontWeight: "500",
        fontFamily: "'Lora', serif",
        color: "#4A453E",
        display: "flex",
        alignItems: "baseline",
        gap: "8px",
        flexWrap: "wrap",
      }}>
        {value ?? 0}
        <span style={{ fontSize: "14px", color: "#8B9467", fontWeight: "400" }}>unidades</span>
      </div>

      <div style={{ height: "2px", width: "40px", backgroundColor: "#8B9467", borderRadius: "2px" }} />
    </div>
  );
}

function ActivityRow({ icon, iconColor, title, date, label, btnText, noBorder, onView }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: noBorder ? "none" : "1px solid #F1F0E8",
      gap: "12px",
      flexWrap: "wrap",
    }}>
      {/* Icono */}
      <div style={{
        width: "40px", height: "40px", flexShrink: 0,
        borderRadius: "12px",
        backgroundColor: `${iconColor}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: iconColor, fontSize: "18px",
      }}>
        <i className={`ti ti-${icon}`} />
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: "120px" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#4A453E", lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#8C867E", marginTop: "2px" }}>{date}</div>
      </div>

      {/* Badge — se oculta en pantallas muy pequeñas */}
      <div style={{
        fontSize: "12px",
        fontWeight: "600",
        color: "#8B9467",
        backgroundColor: "#F4F6EE",
        padding: "4px 10px",
        borderRadius: "20px",
        whiteSpace: "nowrap",
        display: "flex",
        alignSelf: "center",
      }}>
        {label}
      </div>

      {/* Botón */}
      <button
        onClick={onView}
        style={{
          backgroundColor: "transparent",
          border: "1px solid #E8E4DE",
          padding: "7px 14px",
          borderRadius: "8px",
          color: "#4A453E",
          fontWeight: "600",
          fontSize: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F9F7F2"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        {btnText}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { data } = useDashboard();
  const [recentLogs, setRecentLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => { loadRecentLogs(); }, []);

  const loadRecentLogs = async () => {
    try {
      const data = await getAuditLogs();
      const sorted = (data.items || data || [])
        .sort((a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha))
        .slice(0, 3);
      setRecentLogs(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: "1100px", margin: "0 auto", padding: "20px 0" }}>

        {/* Cabecera */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#8B9467", textTransform: "uppercase", letterSpacing: "1px" }}>
              Resumen General
            </span>
            <div style={{ height: "1px", width: "40px", backgroundColor: "#8B9467" }} />
          </div>
          <h1 style={{
            margin: 0,
            fontSize: "clamp(32px, 6vw, 48px)",
            fontWeight: "400",
            color: "#4A453E",
            fontFamily: "'Lora', serif",
            letterSpacing: "-1px",
          }}>
            Dashboard
          </h1>
        </div>

        {/* MÉTRICAS — 2 columnas en desktop, 1 columna en móvil */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}>
          {metrics.map((m) => (
            <MetricCard key={m.key} label={m.label} sublabel={m.sublabel} value={data?.[m.key]} />
          ))}
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div style={{
          backgroundColor: "#FFFFFF",
          padding: "clamp(20px, 4vw, 40px)",
          borderRadius: "24px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.02)",
          border: "1px solid #E8E4DE",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            borderBottom: "1px solid #F1F0E8",
            paddingBottom: "24px",
          }}>
            <h3 style={{ margin: 0, fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "400", fontFamily: "'Lora', serif", color: "#4A453E" }}>
              Actividad Reciente
            </h3>
          </div>

          <div>
            {recentLogs.map((log, index) => {
              const action = (log.action || "").toUpperCase();
              let icon = "activity";
              let color = "#8B9467";
              if (action.includes("CREA")) { icon = "user-plus"; color = "#8B9467"; }
              if (action.includes("DELETE")) { icon = "trash"; color = "#dc2626"; }
              if (action.includes("UPDATE")) { icon = "refresh"; color = "#A3AD85"; }

              return (
                <ActivityRow
                  key={log.id || log._id}
                  icon={icon}
                  iconColor={color}
                  title={log.details?.mensaje || `${log.action} en ${log.resource}`}
                  date={new Date(log.createdAt || log.fecha).toLocaleString("es-MX")}
                  label={log.resource || "Sistema"}
                  btnText="Ver"
                  noBorder={index === recentLogs.length - 1}
                  onView={() => setSelectedLog(log)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL — responsivo con scroll interno */}
      {selectedLog && (
        <div
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedLog(null); }}
        >
          <div style={{
            width: "100%",
            maxWidth: "700px",
            maxHeight: "90vh",
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid #E8E4DE",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Header del modal */}
            <div style={{
              padding: "24px 28px",
              borderBottom: "1px solid #F1F0E8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8B9467", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Auditoría
                </div>
                <h2 style={{ margin: "8px 0 0", fontSize: "clamp(20px, 4vw, 28px)", fontFamily: "'Lora', serif", color: "#4A453E" }}>
                  Detalles del Evento
                </h2>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ width: "42px", height: "42px", borderRadius: "12px", border: "none", backgroundColor: "#F4F6EE", cursor: "pointer", fontSize: "16px", flexShrink: 0 }}
              >
                ✕
              </button>
            </div>

            {/* Body del modal con scroll */}
            <div style={{ padding: "28px", overflowY: "auto" }}>
              <div style={{ marginBottom: "20px" }}><strong>Usuario:</strong> {selectedLog.usuario || "Sistema"}</div>
              <div style={{ marginBottom: "20px" }}><strong>Acción:</strong> {selectedLog.action}</div>
              <div style={{ marginBottom: "20px" }}><strong>Recurso:</strong> {selectedLog.resource}</div>
              <div style={{ marginBottom: "20px" }}>
                <strong>Fecha:</strong> {new Date(selectedLog.createdAt || selectedLog.fecha).toLocaleString("es-MX")}
              </div>
              <div>
                <strong>Información técnica:</strong>
                <pre style={{
                  marginTop: "12px",
                  backgroundColor: "#1F2937",
                  color: "#A7F3D0",
                  padding: "16px",
                  borderRadius: "14px",
                  overflowX: "auto",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}>
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
