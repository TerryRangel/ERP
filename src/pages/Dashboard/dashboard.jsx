import { useDashboard } from "../../hooks/useDashboard";

import texturaTelaNaranja from "../../assets/textura-tela-naranja.png";
import texturaTelaRosa from "../../assets/textura-tela-rosa.png";
import texturaTelaVerde from "../../assets/textura-tela-verde.png";
import texturaLino from "../../assets/textura-lino.png";

import texturaMadera from "../../assets/textura-madera.jpg";
import texturaMaderaRosa from "../../assets/textura-madera-rosa.png";
import texturaMaderaVerde from "../../assets/textura-madera-verde.png";
import texturaMaderaAbeto from "../../assets/textura-madera-abeto.png";

import iconoGrupo from "../../assets/icono-grupo.png";
import iconoLibreta from "../../assets/icono-libreta.png";
import iconoCasa from "../../assets/icono-casa.png";
import iconoEstambre from "../../assets/icono-estambre.png";

const metrics = [
  {
    key: "totalUsers", label: "Total Usuarios", sublabel: "Usuarios Totales",
    texturaInterior: texturaTelaNaranja, texturaMarco: texturaMaderaAbeto,
    colorText: "#fff", 
    imageIcon: iconoGrupo,
  },
  {
    key: "totalClients", label: "Total Clientes", sublabel: "Clientes Registrados",
    texturaInterior: texturaTelaRosa, texturaMarco: texturaMaderaRosa,
    colorText: "#fff", 
    imageIcon: iconoLibreta,
  },
  {
    key: "totalSuppliers", label: "Proveedores", sublabel: "Proveedores Activos",
    texturaInterior: texturaMadera, texturaMarco: texturaMadera,
    colorText: "#2a1d11", 
    imageIcon: iconoCasa,
  },
  {
    key: "totalProducts", label: "Productos Tejidos", sublabel: "Productos de Crochet",
    texturaInterior: texturaTelaVerde, texturaMarco: texturaMaderaVerde,
    colorText: "#1b2e21", 
    imageIcon: iconoEstambre,
  }
];

function MetricCard({ metric, value }) {
  return (
    <div style={{
      padding: "8px", 
      backgroundImage: `url(${metric.texturaMarco})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "16px",
      boxShadow: "inset 0 1px 3px rgba(255,255,255,0.4), inset 0 -2px 5px rgba(0,0,0,0.5), 0 8px 15px rgba(0,0,0,0.2)",
    }}>
      <div style={{
        backgroundImage: `url(${metric.texturaInterior})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px",
        boxShadow: "inset 0 3px 8px rgba(0,0,0,0.4)",
        padding: "10px 16px",
        height: "auto",
        display: "flex", flexDirection: "column", justifyContent: "center",
        color: metric.colorText,
        textShadow: metric.colorText === "#fff" ? "0 1px 3px rgba(0,0,0,0.4)" : "none" 
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 900 }}>{metric.label}</div>
            <div style={{ fontSize: "11px", opacity: 0.9, fontWeight: 700 }}>{metric.sublabel}</div>
          </div>
          <div style={{ 
            fontSize: "26px",
            fontWeight: 900, 
            display: "flex", 
            alignItems: "center", 
            gap: "10px"
          }}>
            <img 
                src={metric.imageIcon} 
                alt={metric.label} 
                style={{ 
                    width: "35px",
                    height: "auto", 
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                }} 
            />
            {value ?? 0}
          </div>
        </div>
        <svg viewBox="0 0 100 20" style={{ width: "100%", height: "18px", marginTop: "4px", stroke: metric.colorText, strokeWidth: 2.5, fill: "none", strokeLinecap: "round" }}>
            <path d="M0 15 Q 15 5, 25 12 T 45 10 T 65 5 T 85 15 T 100 8" opacity="0.7"/>
        </svg>
      </div>
    </div>
  );
}

function ActivityRow({ icon, iconColor, title, date, label, btnText, noBorder }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "16px 12px",
      borderBottom: noBorder ? "none" : "1px solid rgba(139, 98, 66, 0.2)"
    }}>
      <div style={{
        width: "38px", height: "38px", borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${iconColor}, #333)`, 
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        marginRight: "16px"
      }}>
        <i className={`ti ti-${icon}`} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "15px", fontWeight: 900, color: "#2a1d11" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#5c4028", fontWeight: 700 }}>{date}</div>
      </div>
      <div style={{ width: "140px", fontSize: "15px", fontWeight: 800, color: "#2a1d11" }}>{label}</div>
      <button style={{
        backgroundImage: `url(${texturaMadera})`,
        backgroundSize: "cover",
        border: "1px solid rgba(0,0,0,0.2)", padding: "8px 16px", borderRadius: "8px",
        color: "#2a1d11", fontWeight: 900, fontSize: "13px", cursor: "pointer",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.2)"
      }}>
        {btnText}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { data } = useDashboard();

  return (
    <div style={{ 
      fontFamily: "'Nunito', sans-serif", 
      maxWidth: "800px",
      margin: "0 auto",
      paddingTop: "10px"
    }}>

      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "18px", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.2))" }}>🌸</span>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "#4a3320" }}>Vista general / Dashboard</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "42px", fontWeight: 900, color: "#2a1d11", letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: "16px", color: "#4a3320", fontWeight: 700 }}>
          ¡Hola de nuevo, Ana! Aquí tienes el resumen de hoy, hilado a la perfección.
        </p>
      </div>

      <div style={{ display: "flex", gap: "24px", marginBottom: "32px", alignItems: "stretch" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", flex: 1 }}>
          {metrics.map((m) => (
            <MetricCard key={m.key} metric={m} value={data?.[m.key] || m.value} />
          ))}
        </div>

        <div style={{
          width: "110px", padding: "6px",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${texturaMaderaAbeto})`,
          backgroundSize: "cover",
          borderRadius: "16px",
          boxShadow: "inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -2px 5px rgba(0,0,0,0.6), 0 8px 15px rgba(0,0,0,0.2)",
        }}>
          <div style={{
              backgroundImage: `url(${texturaLino})`, 
              backgroundSize: "cover",
              borderRadius: "8px",
              boxShadow: "inset 0 3px 8px rgba(0,0,0,0.3)",
              padding: "12px 8px", height: "100%",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#2a1d11", textAlign: "center"
          }}>
            <div style={{ fontSize: "13px", fontWeight: 900, marginBottom: "8px", lineHeight: 1.1 }}>Pedidos<br/>Pendientes</div>
            <div style={{ fontSize: "16px", fontWeight: 800 }}>Total: 15</div>
            <span style={{ fontSize: "24px", filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.3))", marginTop: "8px" }}>🧺</span>
          </div>
        </div>
      </div>

      <div style={{
        backgroundImage: `url(${texturaMadera})`,
        backgroundSize: "cover",
        padding: "10px",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4)"
      }}>
        <div style={{
          backgroundImage: `url(${texturaLino})`, 
          backgroundSize: "cover",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)"
        }}>
          <div style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${texturaMadera})`,
            backgroundSize: "cover",
            padding: "16px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            color: "#fff",
            borderBottom: "3px solid #2a1d11",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", fontWeight: 900 }}>
              Actividad Reciente <i className="ti ti-list-details" />
            </div>
            <button style={{
              backgroundImage: `url(${texturaMadera})`,
              backgroundSize: "cover",
              border: "1px solid rgba(0,0,0,0.3)", padding: "8px 20px", borderRadius: "8px",
              color: "#2a1d11", fontWeight: 900, fontSize: "14px", cursor: "pointer",
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.2)",
              textShadow: "none"
            }}>
              Ver todo
            </button>
          </div>

          <div style={{ padding: "8px 16px" }}>
            <ActivityRow icon="check" iconColor="#4ade80" title="Nuevo usuario registrado: Pedro G." date="22 april, 2023, 08:24" label="Pedro G." btnText="Ver Detalles" />
            <ActivityRow icon="info-small" iconColor="#60a5fa" title="Pedido completado #1234" date="23 april, 2023, 08:24" label="#1234" btnText="Ver Detalles" />
            <ActivityRow icon="building-store" iconColor="#f43f5e" title="Proveedor actualizado: Hilos Finos" date="23 april, 2023, 08:24" label="Hilos Finos" btnText="Archivar" noBorder />
          </div>
        </div>
      </div>

    </div>
  );
}