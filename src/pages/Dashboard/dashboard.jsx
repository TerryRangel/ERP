import { useDashboard } from "../../hooks/useDashboard";
import { getAuditLogs } from "../../services/auditService";
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from 'recharts';

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
  const [allLogs, setAllLogs] = useState([]);

  
  const totalEvents = allLogs.length;


  const createEvents = recentLogs.filter(log => { const action = (log.action || "").toUpperCase()
    return (
      action.includes("CREA") || 
      action.includes("CREATE") || 
      action.includes("POST")
    )
  }).length;

  const updateEvents = allLogs.filter(log => { 
    const action = (log.action || "").toUpperCase()

    return (
      action.includes("UPDATE") ||
      action.includes("EDIT") ||
      action.includes("MODIFIC") ||
      action.includes("ACTUALIZ")
    )
  }).length;

  const deleteEvents = allLogs.filter(log => { 
    const action = (log.action || "").toUpperCase()

    return (
      action.includes("DELETE") ||
      action.includes("ELIMIN")
    )
  }).length;  

  const actionData = [
    { name: 'Creaciones', value: createEvents },
    { name: 'Actualizaciones', value: updateEvents },
    { name: 'Eliminaciones', value: deleteEvents },
  ]

  const moduleCount = {};

  recentLogs.forEach(log => {
    const resource = log.resource || "Sistema";
    moduleCount[resource] = (moduleCount[resource] || 0) + 1;
  });

  const moduleData = Object.entries(moduleCount).map(([name, value]) => ({ name, value }));

  const COLORS = ['#8B9467','#A3AD85', '#D97706', '#DC2626', '#6366F1'];  



  useEffect(() => { loadRecentLogs(); }, []);

  const loadRecentLogs = async () => {
    try {
      const response = await getAuditLogs()
      console.log("AUDIT LOGS:", response)

      const logs = Array.isArray(response)
      ? response
      : response.items || [];

      const sorted = logs.sort(
        (a,b) => 
          new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha)
      )
      setAllLogs(sorted)
      setRecentLogs(sorted.slice(0, 3));
    } catch (error) {
      console.error(error)
    }
  } 

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

        {/* ESTADÍSTICAS DE ACTIVIDAD */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          
          {/* TOTAL */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E4DE",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                backgroundColor: "#EEF2E7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <i className="bi bi-activity" style={{ fontSize: "22px", color: "#718355" }}></i>
            </div>

            <div style={{ fontSize: "14px", color: "#8C867E", fontWeight: "600" }}>
              Eventos Totales
            </div>

            <div
              style={{
                fontSize: "40px",
                fontWeight: "700",
                color: "#4A453E",
                marginTop: "8px",
              }}
            >
              {totalEvents}
            </div>
          </div>

          {/* CREACIONES */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E4DE",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                backgroundColor: "#ECFDF3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <i className="bi bi-plus-circle-fill" style={{ fontSize: "22px", color: "#16A34A" }}></i>
            </div>

            <div style={{ fontSize: "14px", color: "#8C867E", fontWeight: "600" }}>
              Creaciones
            </div>

            <div
              style={{
                fontSize: "40px",
                fontWeight: "700",
                color: "#4A453E",
                marginTop: "8px",
              }}
            >
              {createEvents}
            </div>
          </div>

          {/* UPDATES */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E4DE",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                backgroundColor: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <i className="bi bi-arrow-repeat" style={{ fontSize: "22px", color: "#D97706" }}></i>
            </div>

            <div style={{ fontSize: "14px", color: "#8C867E", fontWeight: "600" }}>
              Actualizaciones
            </div>

            <div
              style={{
                fontSize: "40px",
                fontWeight: "700",
                color: "#4A453E",
                marginTop: "8px",
              }}
            >
              {updateEvents}
            </div>
          </div>

          {/* DELETE */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E4DE",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                backgroundColor: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <i className="bi bi-trash-fill" style={{ fontSize: "22px", color: "#DC2626" }}></i>
            </div>

            <div style={{ fontSize: "14px", color: "#8C867E", fontWeight: "600" }}>
              Eliminaciones
            </div>

            <div
              style={{
                fontSize: "40px",
                fontWeight: "700",
                color: "#4A453E",
                marginTop: "8px",
              }}
            >
              {deleteEvents}
            </div>
          </div>

        </div>

        {/* GRÁFICAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >

          {/* BAR CHART */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid #E8E4DE",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontFamily: "'Lora', serif",
                  color: "#4A453E",
                }}
              >
                Actividad del Sistema
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "#8C867E",
                  marginTop: "6px",
                }}
              >
                Distribución de acciones recientes
              </p>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={actionData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    radius={[10, 10, 0, 0]}
                    fill="#8B9467"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid #E8E4DE",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontFamily: "'Lora', serif",
                  color: "#4A453E",
                }}
              >
                Eventos por Módulo
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "#8C867E",
                  marginTop: "6px",
                }}
              >
                Recursos más utilizados
              </p>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>

                  <Pie
                    data={moduleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    {moduleData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

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
