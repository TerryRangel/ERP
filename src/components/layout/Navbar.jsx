import { useAuth } from "../../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        height: "74px",
        padding: "0 40px",

        /* NAVBAR VERDE */
        background:
          "linear-gradient(90deg, #8d9b70 0%, #7c8b61 50%, #6f7d55 100%)",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        fontFamily: "'Inter', sans-serif",

        position: "sticky",
        top: 0,
        zIndex: 100,

        borderBottom: "1px solid rgba(255,255,255,0.08)",

        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",

              borderRadius: "14px",

              background: "rgba(255,255,255,0.12)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backdropFilter: "blur(10px)",

              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <i
              className="bi bi-grid-fill"
              style={{
                color: "#fff",
                fontSize: "18px",
              }}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#FFFFFF",
                lineHeight: 1,
              }}
            >
              Admin Panel
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.75)",
                marginTop: "4px",
              }}
            >
              Dashboard
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i
            className="bi bi-search"
            style={{
              position: "absolute",
              left: "14px",
              color: "#8C867E",
              fontSize: "15px",
            }}
          />

          <input
            type="text"
            placeholder="Buscar..."
            style={{
              padding: "11px 16px 11px 42px",

              borderRadius: "14px",

              border: "1px solid rgba(255,255,255,0.08)",

              backgroundColor: "rgba(255,255,255,0.95)",

              fontSize: "14px",

              width: "290px",

              outline: "none",

              color: "#4A453E",

              transition: "all 0.25s ease",

              boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow =
                "0 0 0 4px rgba(255,255,255,0.18)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow =
                "0 2px 4px rgba(0,0,0,0.03)";
            }}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* ICONOS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {/* NOTIFICACIONES */}
          <button
            style={{
              width: "42px",
              height: "42px",

              borderRadius: "14px",

              border: "1px solid rgba(255,255,255,0.08)",

              background: "rgba(255,255,255,0.12)",

              color: "#FFFFFF",

              cursor: "pointer",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              transition: "all 0.25s ease",

              backdropFilter: "blur(10px)",

              position: "relative",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.2)";
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.12)";
              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            <i
              className="bi bi-bell-fill"
              style={{
                fontSize: "17px",
              }}
            />

            {/* DOT */}
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",

                width: "8px",
                height: "8px",

                borderRadius: "50%",

                backgroundColor: "#EF4444",

                border: "2px solid white",
              }}
            />
          </button>

          {/* SETTINGS */}
          <button
            style={{
              width: "42px",
              height: "42px",

              borderRadius: "14px",

              border: "1px solid rgba(255,255,255,0.08)",

              background: "rgba(255,255,255,0.12)",

              color: "#FFFFFF",

              cursor: "pointer",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              transition: "all 0.25s ease",

              backdropFilter: "blur(10px)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.2)";
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.12)";
              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            <i
              className="bi bi-gear-fill"
              style={{
                fontSize: "17px",
              }}
            />
          </button>

          {/* LOGOUT */}
          <button
            onClick={logout}
            style={{
              width: "42px",
              height: "42px",

              borderRadius: "14px",

              border: "1px solid rgba(255,255,255,0.08)",

              background: "rgba(255,255,255,0.12)",

              color: "#FFFFFF",

              cursor: "pointer",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              transition: "all 0.25s ease",

              backdropFilter: "blur(10px)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#E25B5B";
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.12)";
              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            <i
              className="bi bi-box-arrow-right"
              style={{
                fontSize: "17px",
              }}
            />
          </button>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "1px",
            height: "26px",

            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        />

        {/* USER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",

            padding: "6px 8px 6px 14px",

            borderRadius: "20px",

            background: "rgba(255,255,255,0.12)",

            border: "1px solid rgba(255,255,255,0.08)",

            backdropFilter: "blur(10px)",

            transition: "all 0.25s ease",

            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background =
              "rgba(255,255,255,0.18)";
            e.currentTarget.style.transform =
              "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background =
              "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform =
              "translateY(0px)";
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",

                color: "#FFFFFF",
              }}
            >
              {user?.usuario || "Ana"}
            </div>

            <div
              style={{
                fontSize: "11px",

                color: "rgba(255,255,255,0.8)",

                display: "flex",
                alignItems: "center",
                gap: "4px",
                justifyContent: "flex-end",

                marginTop: "3px",
              }}
            >
              <i className="bi bi-patch-check-fill"></i>

              Administradora
            </div>
          </div>

          {/* AVATAR */}
          <div
            style={{
              position: "relative",
            }}
          >
            <img
              src="https://i.pravatar.cc/150?img=5"
              alt="Perfil"
              style={{
                width: "38px",
                height: "38px",

                borderRadius: "50%",

                objectFit: "cover",

                border: "2px solid rgba(255,255,255,0.3)",
              }}
            />

            {/* STATUS */}
            <span
              style={{
                position: "absolute",

                bottom: "1px",
                right: "1px",

                width: "10px",
                height: "10px",

                borderRadius: "50%",

                backgroundColor: "#22C55E",

                border: "2px solid white",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}