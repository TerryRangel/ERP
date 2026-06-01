import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { clientService } from '../../services/clientService';
import "bootstrap-icons/font/bootstrap-icons.css";
import ClientFormModal from '../../components/ui/ClientFormModal.jsx';
import interiorStyleScene from "../../assets/interior-style-scene.jpg";
import logotipo from "../../assets/Logotipo.png";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // ─── ESTADO PARA RECORDAR USUARIO ───────────────────────────────────────
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ─── ESTADOS PARA RECUPERAR CONTRASEÑA ────────────────────────────────
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  // ─── CARGAR USUARIO GUARDADO AL INICIAR ───────────────────────────────
  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      setUsuario(savedUser);
      setRememberMe(true); // Dejamos la casilla marcada
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(usuario, password);

      // NUEVO: Guardar o borrar el usuario según la casilla
      if (rememberMe) {
        localStorage.setItem("rememberedUser", usuario);
      } else {
        localStorage.removeItem("rememberedUser");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── FUNCIÓN PARA ENVIAR EL CORREO DE RECUPERACIÓN ───────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);

    try {

      const baseUrl = import.meta.env.VITE_API_URL || 'https://erp-backend-crchet.onrender.com'; 
      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar la solicitud');
      }

      setResetMessage(data.message); // "Si el correo existe, hemos enviado las instrucciones..."
    } catch (err) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[#F6F1E8]">

      {/* FRASE CENTRAL DIVIDIDA */}
      <div
        className="
          hidden
          lg:flex
          absolute
          top-16
          left-1/2
          -translate-x-1/2
          z-30
          pointer-events-none
          items-start
        "
      >
        {/* LADO LOGIN */}
        <div className="">
          <span
            className="
            pr-50 text-right
              text-6xl
              font-serif
              leading-[0.95]
              text-[#4B3429]
              drop-shadow-sm
            "
          >
            Cada puntada
          </span>

          <span
            className="
              block
              mt-3
              text-4xl
              italic
              text-[#8D9472]
            "
          >
            lleva dedicación
          </span>
        </div>

        {/* LINEA CENTRAL */}
        <div
          className="
            w-px
            h-40
            bg-gradient-to-b
            from-transparent
            via-[#CFC6B8]
            to-transparent
            opacity-70
          "
        ></div>

        {/* LADO IMAGEN */}
        <div className="text-center px-10">
            <span className="text-6xl font-serif leading-[0.95] text-white drop-shadow-md">
              Cada tejido
            </span>
            <span className="block mt-3 text-4xl italic text-[#F2EBDD]">
              lleva amor
            </span>
          </div>
      </div>

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
                w-50
                h-50
                rounded-full
                border
                border-[#B8BE9C]
                flex
                items-center
                justify-center
                overflow-hidden
              "
            >
              <img
                src={logotipo}
                alt="Logo Tejidos"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* TITLE */}
          <div className="mb-10 mt-24">
            <h1
              className="
                text-6xl
                leading-[1]
                font-serif
                text-[#4B3429]
              "
            >
              ¡Bienvenid@ de nuevo!
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
                  !pl-4
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
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="
                  flex-1
                  h-[72px]
                  !pl-4
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
                onClick={() => setShowPassword(!showPassword)}
                className="px-6 text-[#8F7E70] hover:text-[#4B3429] transition-colors focus:outline-none"
              >
                <i className={`text-2xl bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 text-[#6E6257]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
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

              {/* ENLACE RECUPERAR CONTRASEÑA */}
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="
                  text-[#7E8565]
                  underline
                  hover:text-[#62684E]
                  transition
                  bg-transparent
                  border-none
                  cursor-pointer
                "
              >
                ¿Olvidaste tu contraseña?
              </button>
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
                hover:scale-[1.01]
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

        {/* EXTRA DEPTH */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#4B3429]/40
            via-[#2F241D]/45
            to-[#000000]/55
          "
        ></div>

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
          <div className="text-center transition-all duration-300 hover:-translate-y-2">
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-[#EEF1E7]
                shadow-lg
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

          <div className="text-center transition-all duration-300 hover:-translate-y-2">
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-[#EEF1E7]
                shadow-lg
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

          <div className="text-center transition-all duration-300 hover:-translate-y-2">
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-[#EEF1E7]
                shadow-lg
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

      <ClientFormModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        initialData={null}
        onSubmit={async (data) => {
          try {
            await clientService.registerClient(data)
            setRegisterOpen(false);
            alert("Cliente creado correctamente")
          } catch (error) {
            console.error(error);
            alert("Error al Crear cliente")
          }
        }}
      />

      {/* ─── MODAL DE RECUPERAR CONTRASEÑA ───────────────────────────── */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-[#F6F1E8] w-full max-w-md rounded-[32px] p-8 shadow-2xl relative border border-[#D9D1C7] animate-fade-in">
            {/* Botón Cerrar */}
            <button
              onClick={() => {
                setForgotPasswordOpen(false);
                setResetMessage("");
                setResetError("");
                setResetEmail("");
              }}
              className="absolute top-6 right-6 text-[#A69A8E] hover:text-[#4B3429] transition-colors bg-transparent border-none cursor-pointer"
            >
              <i className="bi bi-x-lg text-xl"></i>
            </button>

            {/* Cabecera del Modal */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#DCE3CF] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="bi bi-envelope-paper text-2xl text-[#62684E]"></i>
              </div>
              <h2 className="text-3xl font-serif text-[#4B3429]">Recuperar Acceso</h2>
              <p className="text-[#7B6A58] mt-2 text-sm px-2">
                Ingresa tu correo electrónico registrado y te enviaremos las instrucciones paso a paso.
              </p>
            </div>

            {/* Mensajes de Éxito o Error */}
            {resetMessage && (
              <div className="mb-5 bg-[#EEF1E7] border border-[#B8BE9C] text-[#62684E] px-4 py-3 rounded-2xl text-sm text-center">
                <i className="bi bi-check-circle mr-2"></i>{resetMessage}
              </div>
            )}

            {resetError && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-2xl text-sm text-center">
                <i className="bi bi-exclamation-circle mr-2"></i>{resetError}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="flex items-center overflow-hidden rounded-2xl border border-[#D9D1C7] bg-white shadow-sm">
                <div className="w-16 h-[60px] bg-[#9EA384] flex items-center justify-center">
                  <i className="bi bi-envelope text-white text-xl"></i>
                </div>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="flex-1 h-[60px] pl-4 text-md outline-none bg-transparent text-[#4B3429] placeholder:text-[#A69A8E]"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="
                  w-full h-[60px] rounded-2xl bg-[#4B3429] hover:bg-[#3A2820] 
                  text-white text-lg font-semibold shadow-lg transition-all 
                  flex items-center justify-center gap-3 hover:scale-[1.02]
                "
              >
                {resetLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar Enlace <i className="bi bi-send"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
