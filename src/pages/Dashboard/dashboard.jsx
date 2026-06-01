import { useDashboard } from "../../hooks/useDashboard";
import { getAuditLogs } from "../../services/auditService";
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, CartesianGrid, BarChart, Bar, LineChart, Line
} from 'recharts';

// --- COMPONENTES UI REUTILIZABLES ---
function MetricCard({ label, sublabel, value, icon, iconColor, isCurrency }) {
  const safeValue = typeof value === 'object' && value !== null ? (Array.isArray(value) ? value.length : 0) : value;
  return (
    <div style={{
      backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)", border: "1px solid #E8E4DE",
      display: "flex", alignItems: "center", gap: "20px",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "16px",
        backgroundColor: `${iconColor}15`, color: iconColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "24px", flexShrink: 0
      }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "#8C867E", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
          {label}
        </div>
        <div style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: "600", fontFamily: "'Lora', serif", color: "#4A453E", lineHeight: 1 }}>
          {isCurrency ? `$${Number(safeValue || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : (safeValue || 0)}
        </div>
        <div style={{ fontSize: "12px", color: "#B4B0AB", marginTop: "6px" }}>{sublabel}</div>
      </div>
    </div>
  );
}

function ActivityRow({ icon, iconColor, title, date, label, btnText, noBorder, onView }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: noBorder ? "none" : "1px solid #F1F0E8", gap: "12px", flexWrap: "wrap" }}>
      <div style={{ width: "40px", height: "40px", flexShrink: 0, borderRadius: "12px", backgroundColor: `${iconColor}15`, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, fontSize: "18px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div style={{ flex: 1, minWidth: "120px" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#4A453E", lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#8C867E", marginTop: "2px" }}>{date}</div>
      </div>
      <div style={{ fontSize: "12px", fontWeight: "600", color: "#8B9467", backgroundColor: "#F4F6EE", padding: "4px 10px", borderRadius: "20px", whiteSpace: "nowrap", display: "flex", alignSelf: "center" }}>
        {label}
      </div>
      <button onClick={onView} style={{ backgroundColor: "transparent", border: "1px solid #E8E4DE", padding: "7px 14px", borderRadius: "8px", color: "#4A453E", fontWeight: "600", fontSize: "12px", cursor: "pointer", transition: "all 0.2s ease", whiteSpace: "nowrap", flexShrink: 0 }}>
        {btnText}
      </button>
    </div>
  );
}

// --- DASHBOARD PRINCIPAL ---
export default function Dashboard() {
  const { data, refetch } = useDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [allLogs, setAllLogs] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => { loadRecentLogs(); }, []);

  const loadRecentLogs = async () => {
    try {
      const response = await getAuditLogs();
      const logs = Array.isArray(response) ? response : response.items || [];
      const sorted = logs.sort((a,b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha));
      setAllLogs(sorted);
      setRecentLogs(sorted.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch && refetch(), loadRecentLogs()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // --- PROCESAMIENTO EXTREMO DE DATOS ---
  const totals = data?.totals || data || {};
  
  const getSafeCount = (val) => {
    if (Array.isArray(val)) return val.length;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return Number(val) || 0;
    return 0;
  };
  
  const totalProducts = getSafeCount(totals.activeProducts ?? totals.products ?? totals.totalProducts ?? data?.products);
  const lowStockCount = getSafeCount(data?.lowStockCount ?? totals.lowStockCount);
  const healthyStockCount = Math.max(0, totalProducts - lowStockCount);
  
  const totalSuppliers = getSafeCount(totals.activeSuppliers ?? totals.suppliers ?? totals.totalSuppliers ?? data?.suppliers);
  const activeClients = getSafeCount(totals.activeClients ?? totals.clients ?? totals.totalClients ?? data?.clients);
  const totalRecepciones = getSafeCount(totals.recepciones ?? totals.totalRecepciones ?? data?.recepciones);

  const recepciones = Array.isArray(data?.recepcionesRecientes) ? data.recepcionesRecientes : 
                      Array.isArray(data?.recepciones) ? data.recepciones : [];
  
  const totalGastadoReciente = recepciones.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  // --- DATOS PARA GRÁFICAS ---

  // 1. Dona: Salud de Inventario
  const inventoryHealthData = [
    { name: 'Stock Sano', value: healthyStockCount },
    { name: 'Stock Bajo', value: lowStockCount },
  ];
  
  // 2. Área: Gastos
  const gastosData = [...recepciones]
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .map(r => ({
      fecha: new Date(r.fecha || r.createdAt).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      gasto: Number(r.total || 0),
    }));

  // 3. Barras: Comparativa de Red Comercial
  const networkData = [
    { name: 'Clientes', cantidad: activeClients },
    { name: 'Proveedores', cantidad: totalSuppliers },
  ];

  // 4. Línea: Frecuencia de Actividad
  const activityByDate = allLogs.reduce((acc, log) => {
    const date = new Date(log.createdAt || log.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  const activityData = Object.entries(activityByDate)
    .slice(0, 7) // Últimos 7 días con actividad
    .map(([date, count]) => ({ fecha: date, eventos: count }))
    .reverse();

  return (
    <>
      <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: "1200px", margin: "0 auto", padding: "20px 0" }}>

        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#8B9467", textTransform: "uppercase", letterSpacing: "1px" }}>Panel de Control Integrado</span>
              <div style={{ height: "1px", width: "40px", backgroundColor: "#8B9467" }} />
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 48px)", fontWeight: "400", color: "#4A453E", fontFamily: "'Lora', serif", letterSpacing: "-1px" }}>Dashboard</h1>
          </div>
          <button onClick={handleManualRefresh} disabled={isRefreshing} style={{ backgroundColor: isRefreshing ? "#F4F6EE" : "#8B9467", color: isRefreshing ? "#8B9467" : "#FFFFFF", border: isRefreshing ? "1px solid #E8E4DE" : "none", padding: "12px 24px", borderRadius: "14px", fontWeight: "600", fontSize: "14px", cursor: isRefreshing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s ease", boxShadow: isRefreshing ? "none" : "0 4px 14px rgba(139, 148, 103, 0.3)" }}>
            <i className={`bi bi-arrow-clockwise ${isRefreshing ? "spin-animation" : ""}`}></i>
            {isRefreshing ? "Sincronizando..." : "Actualizar Datos"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <MetricCard label="Total Invertido" sublabel="En últimas compras" value={totalGastadoReciente} icon="bi-currency-dollar" iconColor="#D97706" isCurrency />
          <MetricCard label="Alertas de Stock" sublabel="Materiales por agotarse" value={lowStockCount} icon="bi-exclamation-triangle" iconColor="#DC2626" />
          <MetricCard label="Productos Totales" sublabel="Catálogo activo" value={totalProducts} icon="bi-box-seam" iconColor="#8B9467" />
          <MetricCard label="Clientes Activos" sublabel="Cartera de clientes" value={activeClients} icon="bi-people" iconColor="#4F46E5" />
          <MetricCard label="Entradas (Recepciones)" sublabel="Histórico de compras" value={totalRecepciones} icon="bi-truck" iconColor="#0284C7" />
          <MetricCard label="Proveedores" sublabel="Socios comerciales activos" value={totalSuppliers} icon="bi-building" iconColor="#7C3AED" />
        </div>

        {/* --- SECCIÓN DINÁMICA DE GRÁFICAS (4 GRÁFICAS MINIMALISTAS) --- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          
          {/* GRÁFICA 1: ÁREA (Inversión) */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "30px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontFamily: "'Lora', serif", color: "#4A453E" }}>Tendencia de Inversión</h3>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#8C867E" }}>Gastos en mercancía a lo largo del tiempo</p>
            </div>
            <div style={{ width: "100%", height: "260px" }}>
              {gastosData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gastosData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0E8" />
                    <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8C867E' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8C867E' }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
                    <Area type="monotone" dataKey="gasto" stroke="#D97706" strokeWidth={3} fill="url(#colorGasto)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#B4B0AB", fontSize: "13px" }}>Sin datos suficientes.</div>
              )}
            </div>
          </div>

          {/* GRÁFICA 2: BARRAS (Red Comercial) */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "30px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontFamily: "'Lora', serif", color: "#4A453E" }}>Red Comercial</h3>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#8C867E" }}>Comparativa de entidades operativas</p>
            </div>
            <div style={{ width: "100%", height: "260px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={networkData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0E8" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8C867E' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8C867E' }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#F9F7F2' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="cantidad" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRÁFICA 3: DONA (Salud de Inventario) */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "30px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontFamily: "'Lora', serif", color: "#4A453E" }}>Estado del Inventario</h3>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#8C867E" }}>Proporción de productos en riesgo vs sanos</p>
            </div>
            <div style={{ width: "100%", height: "260px", position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={inventoryHealthData} innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value" stroke="none">
                    <Cell fill="#8B9467" />
                    <Cell fill="#DC2626" />
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                 <span style={{ display: "block", fontSize: "28px", fontWeight: "700", color: "#4A453E", lineHeight: 1 }}>{totalProducts}</span>
                 <span style={{ fontSize: "11px", color: "#8C867E", textTransform: "uppercase", letterSpacing: "1px" }}>Total</span>
              </div>
            </div>
          </div>

          {/* GRÁFICA 4: LÍNEA (Actividad del Sistema) */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "30px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontFamily: "'Lora', serif", color: "#4A453E" }}>Frecuencia de Uso</h3>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#8C867E" }}>Eventos y movimientos diarios</p>
            </div>
            <div style={{ width: "100%", height: "260px" }}>
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0E8" />
                    <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8C867E' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8C867E' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
                    <Line type="monotone" dataKey="eventos" stroke="#0284C7" strokeWidth={3} dot={{ r: 4, fill: "#0284C7", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#B4B0AB", fontSize: "13px" }}>Sin registros de actividad.</div>
              )}
            </div>
          </div>

        </div>

        {/* TABLAS DE OPERACIÓN Y AUDITORÍA */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F0E8", backgroundColor: "#FCFCFA" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontFamily: "'Lora', serif", color: "#DC2626", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="bi bi-exclamation-circle-fill"></i> Urgente: Comprar Material
              </h3>
            </div>
            <div style={{ padding: "12px 24px" }}>
              {data?.lowStockProducts?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
                  {data.lowStockProducts.map(prod => (
                    <div key={prod.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ fontWeight: "600", color: "#4A453E", fontSize: "14px" }}>{prod.nombre}</div><div style={{ fontSize: "12px", color: "#8C867E" }}>SKU: {prod.sku}</div></div>
                      <div style={{ textAlign: "right" }}><div style={{ fontWeight: "700", color: "#DC2626", fontSize: "15px" }}>{prod.stock} / {prod.stockMinimo}</div><div style={{ fontSize: "11px", color: "#8C867E" }}>En stock</div></div>
                    </div>
                  ))}
                </div>
              ) : (<p style={{ color: "#8B9467", fontSize: "14px", padding: "20px 0", textAlign: "center", fontWeight: "600" }}><i className="bi bi-check-circle-fill"></i> ¡Inventario completo!</p>)}
            </div>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F0E8", backgroundColor: "#FCFCFA" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontFamily: "'Lora', serif", color: "#4A453E", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="bi bi-box-arrow-in-down" style={{ color: "#D97706" }}></i> Entradas Recientes
              </h3>
            </div>
            <div style={{ padding: "12px 24px" }}>
              {data?.recepcionesRecientes?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
                  {data.recepcionesRecientes.slice(0, 5).map(rec => (
                    <div key={rec.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ fontWeight: "600", color: "#4A453E", fontSize: "14px" }}>{rec.supplierNombre || 'Proveedor'}</div><div style={{ fontSize: "12px", color: "#8C867E" }}>Folio: {rec.folio} • {new Date(rec.fecha).toLocaleDateString('es-MX')}</div></div>
                      <div style={{ fontWeight: "700", color: "#D97706", fontSize: "15px" }}>${Number(rec.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>
                  ))}
                </div>
              ) : (<p style={{ color: "#B4B0AB", fontSize: "14px", padding: "20px 0", textAlign: "center" }}>Aún no hay compras.</p>)}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "#FFFFFF", padding: "clamp(20px, 4vw, 30px)", borderRadius: "24px", boxShadow: "0 4px 30px rgba(0,0,0,0.02)", border: "1px solid #E8E4DE" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #F1F0E8", paddingBottom: "20px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "400", fontFamily: "'Lora', serif", color: "#4A453E" }}>Auditoría del Sistema</h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#8C867E" }}>Últimos movimientos realizados por los usuarios</p>
            </div>
          </div>
          <div>
            {recentLogs.length > 0 ? recentLogs.map((log, index) => {
              const action = (log.action || "").toUpperCase();
              let icon = "bi-activity";
              let color = "#8B9467";
              if (action.includes("CREA")) { icon = "bi-plus-circle"; color = "#16A34A"; }
              if (action.includes("DELETE") || action.includes("ELIMIN")) { icon = "bi-trash"; color = "#DC2626"; }
              if (action.includes("UPDATE") || action.includes("EDIT")) { icon = "bi-pencil-square"; color = "#D97706"; }

              return (
                <ActivityRow key={log.id || log._id || index} icon={icon} iconColor={color} title={log.details?.mensaje || `${log.action} en ${log.resource}`} date={new Date(log.createdAt || log.fecha).toLocaleString("es-MX")} label={log.resource || "Sistema"} btnText="Ver detalles" noBorder={index === recentLogs.length - 1} onView={() => setSelectedLog(log)} />
              );
            }) : (<p style={{ color: "#B4B0AB", fontSize: "14px", padding: "10px 0", textAlign: "center" }}>No hay registros de auditoría recientes.</p>)}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedLog && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedLog(null); }}>
          <div style={{ width: "100%", maxWidth: "700px", maxHeight: "90vh", backgroundColor: "#FFFFFF", borderRadius: "24px", overflow: "hidden", border: "1px solid #E8E4DE", boxShadow: "0 20px 50px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F0E8", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div><div style={{ fontSize: "12px", fontWeight: "700", color: "#8B9467", textTransform: "uppercase", letterSpacing: "1px" }}>Auditoría</div><h2 style={{ margin: "8px 0 0", fontSize: "clamp(20px, 4vw, 28px)", fontFamily: "'Lora', serif", color: "#4A453E" }}>Detalles del Evento</h2></div>
              <button onClick={() => setSelectedLog(null)} style={{ width: "42px", height: "42px", borderRadius: "12px", border: "none", backgroundColor: "#F4F6EE", cursor: "pointer", fontSize: "16px", flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ padding: "28px", overflowY: "auto" }}>
              <div style={{ marginBottom: "20px" }}><strong>Usuario:</strong> {selectedLog.usuario || "Sistema"}</div>
              <div style={{ marginBottom: "20px" }}><strong>Acción:</strong> {selectedLog.action}</div>
              <div style={{ marginBottom: "20px" }}><strong>Recurso:</strong> {selectedLog.resource}</div>
              <div style={{ marginBottom: "20px" }}><strong>Fecha:</strong> {new Date(selectedLog.createdAt || selectedLog.fecha).toLocaleString("es-MX")}</div>
              <div><strong>Información técnica:</strong><pre style={{ marginTop: "12px", backgroundColor: "#1F2937", color: "#A7F3D0", padding: "16px", borderRadius: "14px", overflowX: "auto", fontSize: "12px", lineHeight: 1.5 }}>{JSON.stringify(selectedLog.details, null, 2)}</pre></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}