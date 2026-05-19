import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

import interiorStyleScene from "../../assets/interior-style-scene.jpg";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(usuario, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#F6F1E8]">
      {/* LEFT PANEL */}
      <div
        className="
          relative
          w-full
          lg:w-1/2
          flex
          items-center
          justify-center
          px-8
          lg:px-20
          py-16
          overflow-hidden
          bg-[#F6F1E8]
        "
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/linen.png')",
        }}
      >
        {/* DECORATIVE SHAPES */}
        <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] bg-[#DCE3CF] rounded-full opacity-70"></div>

        <div className="absolute top-10 left-0 opacity-20">
          <svg
            width="220"
            height="420"
            viewBox="0 0 220 420"
            fill="none"
          >
            <path
              d="M20 20C100 120 50 300 180 400"
              stroke="#9EA384"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 w-full max-w-xl">
          {/* LOGO */}
          <div className="flex items-center gap-4 mb-16">
            <div
              className="
                w-16
                h-16
                rounded-full
                border
                border-[#B8BE9C]
                flex
                items-center
                justify-center
                bg-[#EEF1E7]
              "
            >
              <i className="bi bi-flower1 text-3xl text-[#8D9472]"></i>
            </div>

            <div>
              <h2 className="text-5xl font-serif text-[#4B3429]">
                Tejidos
              </h2>

              <p className="uppercase tracking-[0.3em] text-sm text-[#8D9472] mt-1">
                Hecho a mano
              </p>
            </div>
          </div>

          {/* TITLE */}
          <div className="mb-10">
            <h1
              className="
                text-6xl
                leading-[1]
                font-serif
                text-[#4B3429]
              "
            >
              ¡Bienvenida de nuevo!
            </h1>

            <p className="mt-6 text-[#7B6A58] text-xl leading-relaxed max-w-lg">
              Ingresa tus credenciales para acceder
              a tu panel administrativo.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                mb-6
                bg-red-50
                border
                border-red-200
                text-red-500
                px-5
                py-4
                rounded-2xl
              "
            >
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* USER */}
            <div
              className="
                flex
                items-center
                overflow-hidden
                rounded-2xl
                border
                border-[#D9D1C7]
                bg-white
                shadow-sm
              "
            >
              <div
                className="
                  w-20
                  h-[72px]
                  bg-[#9EA384]
                  flex
                  items-center
                  justify-center
                "
              >
                <i className="bi bi-person text-white text-2xl"></i>
              </div>

              <input
                type="text"
                placeholder="Usuario"
                className="
                  flex-1
                  h-[72px]
                  px-6
                  text-lg
                  outline-none
                  bg-transparent
                  text-[#4B3429]
                  placeholder:text-[#A69A8E]
                "
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div
              className="
                flex
                items-center
                overflow-hidden
                rounded-2xl
                border
                border-[#D9D1C7]
                bg-white
                shadow-sm
              "
            >
              <div
                className="
                  w-20
                  h-[72px]
                  bg-[#9EA384]
                  flex
                  items-center
                  justify-center
                "
              >
                <i className="bi bi-lock text-white text-2xl"></i>
              </div>

              <input
                type="password"
                placeholder="Contraseña"
                className="
                  flex-1
                  h-[72px]
                  px-6
                  text-lg
                  outline-none
                  bg-transparent
                  text-[#4B3429]
                  placeholder:text-[#A69A8E]
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="px-6 text-[#8F7E70]"
              >
                <i className="bi bi-eye text-2xl"></i>
              </button>
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 text-[#6E6257]">
                <input
                  type="checkbox"
                  className="
                    w-5
                    h-5
                    rounded
                    border-[#B8BE9C]
                    text-[#9EA384]
                  "
                />

                Recordarme
              </label>

              <a
                href="/forgot-password"
                className="
                  text-[#7E8565]
                  underline
                  hover:text-[#62684E]
                  transition
                "
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-[72px]
                rounded-2xl
                bg-[#9EA384]
                hover:bg-[#8C926F]
                transition-all
                duration-300
                text-white
                text-2xl
                font-semibold
                shadow-lg
                flex
                items-center
                justify-center
                gap-4
              "
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Accediendo...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <i className="bi bi-arrow-right text-3xl"></i>
                </>
              )}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-5 py-4">
              <div className="flex-1 h-px bg-[#D8D0C6]"></div>

              <span className="text-[#8A7B6C]">
                o continúa con
              </span>

              <div className="flex-1 h-px bg-[#D8D0C6]"></div>
            </div>

            {/* GOOGLE */}
            <button
              type="button"
              className="
                w-full
                h-[72px]
                rounded-2xl
                bg-white
                border
                border-[#D9D1C7]
                shadow-sm
                flex
                items-center
                justify-center
                gap-4
                text-xl
                text-[#4B3429]
                hover:bg-[#FAF8F4]
                transition
              "
            >
              <i className="bi bi-google text-2xl"></i>

              Continuar con Google
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-14 flex items-center gap-4">
            <i className="bi bi-hearts text-4xl text-[#A5AD88]"></i>

            <p className="text-[#7A6A5A] text-lg">
              Tejemos momentos, creamos historias.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* IMAGE */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${interiorStyleScene})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#7B8464]/20
            via-[#4B3429]/20
            to-[#000000]/35
          "
        ></div>

        {/* QUOTE CARD */}
        <div
          className="
            absolute
            top-24
            right-0
            w-[280px]
            bg-[#9EA384]/90
            backdrop-blur-md
            rounded-[40px]
            p-10
            text-white
            border
            border-white/20
            shadow-2xl
          "
        >
          <div className="flex justify-center mb-6">
            <i className="bi bi-heart text-5xl"></i>
          </div>

          <p className="text-3xl leading-relaxed text-center font-light">
            Cada puntada lleva dedicación,
            cada tejido lleva amor.
          </p>
        </div>

        {/* BOTTOM CARD */}
        <div
          className="
            absolute
            bottom-12
            left-1/2
            -translate-x-1/2
            w-[80%]
            bg-white/80
            backdrop-blur-xl
            rounded-[40px]
            p-8
            flex
            justify-around
            shadow-2xl
          "
        >
          <div className="text-center">
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-[#EEF1E7]
                flex
                items-center
                justify-center
                mx-auto
                mb-4
              "
            >
              <i className="bi bi-flower1 text-4xl text-[#8D9472]"></i>
            </div>

            <h3 className="text-xl text-[#4B3429]">
              Artesanía
            </h3>

            <p className="text-[#7A6A5A] mt-2">
              100% artesanal
            </p>
          </div>

          <div className="text-center">
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-[#EEF1E7]
                flex
                items-center
                justify-center
                mx-auto
                mb-4
              "
            >
              <i className="bi bi-leaf text-4xl text-[#8D9472]"></i>
            </div>

            <h3 className="text-xl text-[#4B3429]">
              Materiales
            </h3>

            <p className="text-[#7A6A5A] mt-2">
              de calidad
            </p>
          </div>

          <div className="text-center">
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-[#EEF1E7]
                flex
                items-center
                justify-center
                mx-auto
                mb-4
              "
            >
              <i className="bi bi-heart text-4xl text-[#8D9472]"></i>
            </div>

            <h3 className="text-xl text-[#4B3429]">
              Hecho con
            </h3>

            <p className="text-[#7A6A5A] mt-2">
              amor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}