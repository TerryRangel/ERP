import { useDashboard } from "../../hooks/useDashboard";
import { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, CartesianGrid 
} from 'recharts';

function MetricCard({ label, sublabel, value, icon, iconColor, isCurrency }) {
  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      padding: "24px",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
      border: "1px solid #E8E4DE",
      display: "flex",
      alignItems: "center",
      gap: "20px",
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
        <div style={{
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: "600",
          fontFamily: "'Lora', serif",
          color: "#4A453E",
          lineHeight: 1
        }}>
          {isCurrency ? `$${Number(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : (value || 0)}
        </div>
        <div style={{ fontSize: "12px", color: "#B4B0AB", marginTop: "6px" }}>{sublabel}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, refetch } = useDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- PROCESAMIENTO DE DATOS PARA EL NEGOCIO ---
  
  // 1. Datos Totales
  const totalProducts = data?.totals?.activeProducts || 0;
  const lowStockCount = data?.lowStockCount || 0;
  const healthyStockCount = Math.max(0, totalProducts - lowStockCount);
  const totalSuppliers = data?.totals?.activeSuppliers || 0;

  // 2. Gráfica de Dona: Salud del Inventario
  const inventoryHealthData = [
    { name: 'Stock Sano', value: healthyStockCount },
    { name: 'Stock Bajo', value: lowStockCount },
  ];
  const INVENTORY_COLORS = ['#8B9467', '#DC2626']; // Verde para sano, Rojo para bajo

  // 3. Gráfica de Área: Evolución de Gastos (Basado en Recepciones Recientes)
  const recepciones = data?.recepcionesRecientes || [];
  
  const totalGastadoReciente = recepciones.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  // Ordenamos por fecha para la gráfica
  const gastosData = [...recepciones]
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .map(r => ({
      fecha: new Date(r.fecha || r.createdAt).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      gasto: Number(r.total || 0),
      proveedor: r.supplierNombre || 'Desconocido'
    }));

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: "1200px", margin: "0 auto", padding: "20px 0" }}>

      {/* CABECERA */}
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#8B9467", textTransform: "uppercase", letterSpacing: "1px" }}>
              Visión de Negocio
            </span>
            <div style={{ height: "1px", width: "40px", backgroundColor: "#8B9467" }} />
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 48px)", fontWeight: "400", color: "#4A453E", fontFamily: "'Lora', serif", letterSpacing: "-1px" }}>
            Dashboard
          </h1>
        </div>

        <button 
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          style={{
            backgroundColor: isRefreshing ? "#F4F6EE" : "#8B9467",
            color: isRefreshing ? "#8B9467" : "#FFFFFF",
            border: isRefreshing ? "1px solid #E8E4DE" : "none",
            padding: "12px 24px",
            borderRadius: "14px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: isRefreshing ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s ease",
            boxShadow: isRefreshing ? "none" : "0 4px 14px rgba(139, 148, 103, 0.3)"
          }}
        >
          <i className={`bi bi-arrow-clockwise ${isRefreshing ? "spin-animation" : ""}`}></i>
          {isRefreshing ? "Sincronizando..." : "Actualizar Datos"}
        </button>
      </div>

      {/* 4 TARJETAS DE MÉTRICAS CLAVE (Business Metrics) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <MetricCard 
          label="Total Productos" sublabel="En catálogo activo" 
          value={totalProducts} icon="box-seam" iconColor="#8B9467" 
        />
        <MetricCard 
          label="Alertas de Stock" sublabel="Requieren reabastecimiento" 
          value={lowStockCount} icon="exclamation-triangle" iconColor="#DC2626" 
        />
        <MetricCard 
          label="Total Invertido" sublabel="En recepciones recientes" 
          value={totalGastadoReciente} icon="currency-dollar" iconColor="#D97706" isCurrency 
        />
        <MetricCard 
          label="Proveedores Activos" sublabel="Socios comerciales" 
          value={totalSuppliers} icon="truck" iconColor="#4F46E5" 
        />
      </div>

      {/* GRÁFICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        
        {/* Gráfica de Área: Compras/Gastos */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "30px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ margin: 0, fontSize: "20px", fontFamily: "'Lora', serif", color: "#4A453E" }}>Historial de Gastos</h3>
            <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#8C867E" }}>Inversión en entradas de mercancía</p>
          </div>
          
          <div style={{ width: "100%", height: 300 }}>
            {gastosData.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={gastosData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0E8" />
                  <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8C867E' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8C867E' }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${Number(value).toLocaleString('es-MX')}`, 'Inversión']}
                    labelStyle={{ fontWeight: 'bold', color: '#4A453E', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="gasto" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#colorGasto)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#B4B0AB", fontSize: "14px" }}>
                No hay compras recientes registradas.
              </div>
            )}
          </div>
        </div>

        {/* Gráfica de Dona: Salud del Inventario */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "30px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ margin: 0, fontSize: "20px", fontFamily: "'Lora', serif", color: "#4A453E" }}>Salud del Inventario</h3>
            <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#8C867E" }}>Proporción de productos en riesgo vs sanos</p>
          </div>

          <div style={{ width: "100%", height: 300, position: "relative" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={inventoryHealthData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {inventoryHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={INVENTORY_COLORS[index % INVENTORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#4A453E', fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Texto en el centro de la Dona */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
               <span style={{ display: "block", fontSize: "32px", fontWeight: "700", color: "#4A453E", lineHeight: 1 }}>{totalProducts}</span>
               <span style={{ fontSize: "12px", color: "#8C867E", textTransform: "uppercase", letterSpacing: "1px" }}>Total</span>
            </div>
          </div>
        </div>

      </div>

      {/* TABLAS DE ACCIÓN (Bajo Stock y Últimas Compras) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
        
        {/* TABLA 1: Productos con Bajo Stock */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
          <div style={{ padding: "24px", borderBottom: "1px solid #F1F0E8", backgroundColor: "#FCFCFA" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontFamily: "'Lora', serif", color: "#DC2626", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="bi bi-exclamation-circle-fill"></i> Atención: Bajo Stock
            </h3>
          </div>
          <div style={{ padding: "12px 24px" }}>
            {data?.lowStockProducts?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
                {data.lowStockProducts.map(prod => (
                  <div key={prod.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", color: "#4A453E", fontSize: "14px" }}>{prod.nombre}</div>
                      <div style={{ fontSize: "12px", color: "#8C867E" }}>SKU: {prod.sku}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "700", color: "#DC2626", fontSize: "15px" }}>{prod.stock} / {prod.stockMinimo}</div>
                      <div style={{ fontSize: "11px", color: "#8C867E" }}>En inventario</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#8B9467", fontSize: "14px", padding: "20px 0", textAlign: "center", fontWeight: "600" }}>
                <i className="bi bi-check-circle-fill"></i> ¡Todo tu inventario está sano!
              </p>
            )}
          </div>
        </div>

        {/* TABLA 2: Últimas Entradas/Compras */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E8E4DE", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
          <div style={{ padding: "24px", borderBottom: "1px solid #F1F0E8", backgroundColor: "#FCFCFA" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontFamily: "'Lora', serif", color: "#4A453E", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="bi bi-box-arrow-in-down" style={{ color: "#D97706" }}></i> Últimas Entradas
            </h3>
          </div>
          <div style={{ padding: "12px 24px" }}>
            {data?.recepcionesRecientes?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
                {data.recepcionesRecientes.slice(0, 5).map(rec => (
                  <div key={rec.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", color: "#4A453E", fontSize: "14px" }}>{rec.supplierNombre || 'Proveedor'}</div>
                      <div style={{ fontSize: "12px", color: "#8C867E" }}>Folio: {rec.folio} • {new Date(rec.fecha).toLocaleDateString('es-MX')}</div>
                    </div>
                    <div style={{ fontWeight: "700", color: "#D97706", fontSize: "15px" }}>
                      ${Number(rec.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#B4B0AB", fontSize: "14px", padding: "20px 0", textAlign: "center" }}>
                Aún no hay compras registradas.
              </p>
            )}
          </div>
        </div>

      </div>
      
    </div>
  );
}