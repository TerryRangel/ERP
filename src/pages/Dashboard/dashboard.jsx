import { useDashboard } from "../../hooks/useDashboard";

const metrics = [
  {
    label: "Total Usuarios",
    key: "totalUsers",
    icon: "users",
    gradient: "linear-gradient(135deg, #f9a8c9 0%, #e879a0 100%)",
    glow: "rgba(232,121,160,0.35)",
    emoji: "👥",
    accent: "#c0386b",
  },
  {
    label: "Total Clientes",
    key: "totalClients",
    icon: "address-book",
    gradient: "linear-gradient(135deg, #ffc8dd 0%, #ff85a1 100%)",
    glow: "rgba(255,133,161,0.35)",
    emoji: "💌",
    accent: "#d63460",
  },
  {
    label: "Proveedores",
    key: "totalSuppliers",
    icon: "building-store",
    gradient: "linear-gradient(135deg, #ffb3d1 0%, #ff6b9e 100%)",
    glow: "rgba(255,107,158,0.35)",
    emoji: "🏪",
    accent: "#c0386b",
  },
  {
    label: "Productos Tejidos",
    key: "totalProducts",
    icon: "needle-thread",
    gradient: "linear-gradient(135deg, #ffd6e8 0%, #ffadd2 100%)",
    glow: "rgba(255,173,210,0.4)",
    emoji: "🧶",
    accent: "#d4789e",
  },
];

function MetricCard({ label, value, icon, gradient, glow, emoji, accent, loading }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid rgba(232,120,160,0.15)",
        borderRadius: "20px",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "default",
        boxShadow: "0 2px 16px rgba(232,120,160,0.08)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px) rotate(0.3deg)";
        e.currentTarget.style.boxShadow = `0 16px 40px ${glow}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0) rotate(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(232,120,160,0.08)";
      }}
    >
      {/* Gradient top band */}
      <div style={{
        height: "6px",
        background: gradient,
        width: "100%",
      }} />

      <div style={{ padding: "20px 22px 22px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
          <span style={{
            fontSize: "11px",
            fontWeight: 800,
            color: "#d4789e",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {label}
          </span>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            boxShadow: `0 4px 14px ${glow}`,
            border: "2px solid rgba(255,255,255,0.8)",
          }}>
            {emoji}
          </div>
        </div>

        {/* Value */}
        {loading ? (
          <div style={{
            height: "44px",
            width: "80px",
            borderRadius: "8px",
            background: "linear-gradient(90deg, #ffe4ef, #ffd1e8, #ffe4ef)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s linear infinite",
          }} />
        ) : (
          <div>
            <span style={{
              fontSize: "40px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              background: gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {value ?? 0}
            </span>
          </div>
        )}

        {/* Decorative bottom */}
        <div style={{
          marginTop: "14px",
          height: "3px",
          borderRadius: "99px",
          background: `linear-gradient(90deg, ${glow}, transparent)`,
        }} />
      </div>
    </div>
  );
}

function ActivityRow({ loading, index }) {
  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 0",
        borderBottom: "1px dashed rgba(232,120,160,0.15)",
        animation: "fadeIn 0.3s ease forwards",
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px",
          background: "linear-gradient(135deg, #ffe4ef, #ffd1e8)",
          flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ width: "45%", height: "12px", borderRadius: "6px", background: "linear-gradient(90deg, #ffe4ef, #ffd1e8)", marginBottom: "7px" }} />
          <div style={{ width: "28%", height: "10px", borderRadius: "6px", background: "#fff0f6" }} />
        </div>
        <div style={{ width: "64px", height: "10px", borderRadius: "6px", background: "#fff0f6" }} />
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const { data, loading } = useDashboard();

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: "1200px" }}>

      {/* Page header */}
      <div style={{ marginBottom: "36px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {["🌸", "✿", "🌷"].map((f, i) => (
              <span key={i} style={{
                fontSize: "14px",
                animation: `float 2.5s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
                display: "inline-block",
              }}>{f}</span>
            ))}
          </div>
          <span style={{
            fontSize: "11px",
            fontWeight: 800,
            color: "#d4789e",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #f9a8c9, #e879a0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Vista general
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
          <h1 style={{
            margin: 0,
            fontSize: "38px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            background: "linear-gradient(135deg, #8b2252 0%, #c0386b 40%, #e879a0 80%, #f9a8c9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Dashboard
          </h1>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#c084a0", fontWeight: 500 }}>
          Bienvenida de vuelta — aquí tienes el resumen de hoy ✨
        </p>

        {/* Decorative line */}
        <div style={{
          marginTop: "20px",
          height: "2px",
          borderRadius: "99px",
          background: "linear-gradient(90deg, #f9a8c9, #e879a0, #ffd6e8, transparent)",
          maxWidth: "320px",
        }} />
      </div>

      {/* Metric cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px",
        marginBottom: "36px",
      }}>
        {metrics.map((m) => (
          <MetricCard
            key={m.key}
            label={m.label}
            value={data?.[m.key]}
            icon={m.icon}
            gradient={m.gradient}
            glow={m.glow}
            emoji={m.emoji}
            accent={m.accent}
            loading={loading}
          />
        ))}
      </div>

      {/* Activity panel */}
      <div style={{
        background: "#fff",
        border: "1.5px solid rgba(232,120,160,0.18)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(232,120,160,0.08)",
      }}>
        {/* Panel header */}
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: "1.5px dashed rgba(232,120,160,0.15)",
          background: "linear-gradient(135deg, #fff8fb 0%, #fff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #fce4f0, #f9a8c9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              border: "1.5px solid rgba(232,120,160,0.2)",
            }}>
              📋
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#8b2252" }}>
                Actividad reciente
              </h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#d4789e", fontWeight: 500 }}>
                Últimas acciones registradas
              </p>
            </div>
          </div>
          <button style={{
            padding: "8px 16px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #fff0f6, #ffe4ef)",
            border: "1.5px solid rgba(232,120,160,0.25)",
            color: "#c084a0",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, #fce4f0, #f9a8c9)";
              e.currentTarget.style.color = "#8b2252";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(232,120,160,0.25)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, #fff0f6, #ffe4ef)";
              e.currentTarget.style.color = "#c084a0";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <i className="ti ti-refresh" style={{ fontSize: "13px" }} />
            Ver todo
          </button>
        </div>

        <div style={{ padding: "4px 24px 8px" }}>
          {loading ? (
            [0, 1, 2].map(i => <ActivityRow key={i} loading={true} index={i} />)
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 0",
              gap: "12px",
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #fce4f0, #ffe4f3)",
                border: "1.5px solid rgba(232,120,160,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}>
                🌸
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#c084a0" }}>
                  Sin actividad registrada
                </p>
                <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#d4789e", opacity: 0.7 }}>
                  Las acciones aparecerán aquí
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    </div>
  );
}
