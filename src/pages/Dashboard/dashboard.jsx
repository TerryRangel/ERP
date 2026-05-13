import { useDashboard } from "../../hooks/useDashboard";

const metrics = [
  { key: "totalUsers", label: "Total Usuarios", sublabel: "Usuarios registrados" },
  { key: "totalClients", label: "Total Clientes", sublabel: "Cartera de clientes" },
  { key: "totalSuppliers", label: "Proveedores", sublabel: "Socios comerciales" },
  { key: "totalProducts", label: "Productos Tejidos", sublabel: "Inventario de crochet" }
];

function MetricCard({ label, sublabel, value }) {
  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
      border: "1px solid #E8E4DE",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      transition: "transform 0.2s ease"
    }}>
      <div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#8C867E", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {label}
        </div>
        <div style={{ fontSize: "11px", color: "#B4B0AB" }}>{sublabel}</div>
      </div>
      
      <div style={{ 
        fontSize: "36px", 
        fontWeight: "500", 
        fontFamily: "'Lora', serif", 
        color: "#4A453E",
        display: "flex",
        alignItems: "baseline",
        gap: "8px"
      }}>
        {value ?? 0}
        <span style={{ fontSize: "14px", color: "#8B9467", fontWeight: "400" }}>unidades</span>
      </div>

      <div style={{ height: "2px", width: "40px", backgroundColor: "#8B9467", borderRadius: "2px" }} />
    </div>
  );
}

function ActivityRow({ icon, iconColor, title, date, label, btnText, noBorder }) {
  return (
    <div style={{
      display: "flex", 
      alignItems: "center", 
      padding: "20px 0",
      borderBottom: noBorder ? "none" : "1px solid #F1F0E8"
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        backgroundColor: `${iconColor}15`, 
        display: "flex", alignItems: "center", justifyContent: "center",
        color: iconColor, fontSize: "20px",
        marginRight: "16px"
      }}>
        <i className={`ti ti-${icon}`} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "15px", fontWeight: "600", color: "#4A453E" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#8C867E" }}>{date}</div>
      </div>
      <div style={{ 
        width: "120px", 
        fontSize: "13px", 
        fontWeight: "600", 
        color: "#8B9467",
        textAlign: "center",
        backgroundColor: "#F4F6EE",
        padding: "4px 8px",
        borderRadius: "20px"
      }}>
        {label}
      </div>
      <button style={{
        marginLeft: "20px",
        backgroundColor: "transparent",
        border: "1px solid #E8E4DE",
        padding: "8px 16px", 
        borderRadius: "8px",
        color: "#4A453E", 
        fontWeight: "600", 
        fontSize: "12px", 
        cursor: "pointer",
        transition: "all 0.2s ease"
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

  return (
    <div style={{ 
      fontFamily: "'Inter', sans-serif", 
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "20px 0"
    }}>

      {/* Cabecera Editorial */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#8B9467", textTransform: "uppercase", letterSpacing: "1px" }}>
            Resumen General
          </span>
          <div style={{ height: "1px", width: "40px", backgroundColor: "#8B9467" }} />
        </div>
        <h1 style={{ 
          margin: 0, 
          fontSize: "48px", 
          fontWeight: "400", 
          color: "#4A453E", 
          fontFamily: "'Lora', serif",
          letterSpacing: "-1px" 
        }}>
          Dashboard
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: "16px", color: "#8C867E", maxWidth: "600px" }}>
          Bienvenida, Ana. Aquí tienes la vista actual de tu taller artesanal, organizada con el mismo cuidado que cada una de tus puntadas.
        </p>
      </div>

      <div style={{ display: "flex", gap: "32px", marginBottom: "48px", alignItems: "stretch" }}>
        
        {/* Grid de Métricas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", flex: 1 }}>
          {metrics.map((m) => (
            <MetricCard 
              key={m.key} 
              label={m.label} 
              sublabel={m.sublabel} 
              value={data?.[m.key]} 
            />
          ))}
        </div>

        {/* Tarjeta de Destacado / Pendientes */}
        <div style={{
          width: "240px", 
          padding: "32px 24px",
          backgroundColor: "#8B9467",
          borderRadius: "24px",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 10px 30px rgba(139, 148, 103, 0.3)"
        }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", opacity: 0.8, marginBottom: "8px" }}>Pendientes</div>
            <div style={{ fontSize: "28px", fontFamily: "'Lora', serif" }}>15 Pedidos</div>
            <p style={{ fontSize: "12px", opacity: 0.9, marginTop: "12px", lineHeight: "1.6" }}>
              Tienes órdenes listas para empaquetar y enviar hoy.
            </p>
          </div>
          <button style={{
            backgroundColor: "#FFFFFF",
            color: "#8B9467",
            border: "none",
            padding: "12px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer"
          }}>
            Ver Detalles 🧺
          </button>
        </div>
      </div>

      {/* Sección de Actividad */}
      <div style={{
        backgroundColor: "#FFFFFF",
        padding: "40px",
        borderRadius: "24px",
        boxShadow: "0 4px 30px rgba(0,0,0,0.02)",
        border: "1px solid #E8E4DE"
      }}>
        <div style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "12px",
          borderBottom: "1px solid #F1F0E8",
          paddingBottom: "24px"
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: "24px", 
            fontWeight: "400", 
            fontFamily: "'Lora', serif",
            color: "#4A453E" 
          }}>
            Actividad Reciente
          </h3>
          <button style={{
            backgroundColor: "transparent",
            color: "#8B9467",
            border: "none",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer"
          }}>
            Ver historial completo →
          </button>
        </div>

        <div>
          <ActivityRow icon="user-plus" iconColor="#8B9467" title="Nuevo usuario registrado: Pedro G." date="22 Mayo, 2026, 08:24" label="Cliente" btnText="Perfil" />
          <ActivityRow icon="package" iconColor="#A3AD85" title="Pedido completado #1234" date="23 Mayo, 2026, 09:15" label="Venta" btnText="Recibo" />
          <ActivityRow icon="refresh" iconColor="#B4B0AB" title="Proveedor actualizado: Hilos Finos" date="23 Mayo, 2026, 11:40" label="Suministros" btnText="Archivar" noBorder />
        </div>
      </div>

    </div>
  );
}