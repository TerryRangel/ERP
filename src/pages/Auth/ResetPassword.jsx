import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Atrapamos el token de la URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Si alguien entra a la página sin un token en la URL, le avisamos.
  useEffect(() => {
    if (!token) {
      setError("El enlace es inválido o no contiene un código de seguridad. que mal");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validaciones rápidas en el frontend
    if (newPassword !== confirmPassword) {
      return setError("Las contraseñas no coinciden. Inténtalo de nuevo.");
    }
    if (newPassword.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://erp-backend-crchet.onrender.com/'; 
      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      setMessage("¡Tu contraseña ha sido actualizada con éxito!");
      
      // Esperamos 3 segundos y lo mandamos al Login para que inicie sesión
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#F6F1E8]"
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/linen.png')",
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#DCE3CF] rounded-full opacity-60"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#E8E1D5] rounded-full opacity-60"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-[#D9D1C7] relative z-10 animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#9EA384] flex items-center justify-center mx-auto mb-6 shadow-md border border-[#8C926F]">
            <i className="bi bi-shield-lock text-3xl text-white"></i>
          </div>
          <h2 className="text-4xl font-serif text-[#4B3429] leading-tight">Nueva Contraseña</h2>
          <p className="text-[#7B6A58] mt-3">
            Ingresa tu nueva clave de acceso para tu cuenta.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-500 px-5 py-4 rounded-2xl flex items-start gap-3">
            <i className="bi bi-exclamation-triangle-fill mt-1"></i>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 bg-[#EEF1E7] border border-[#B8BE9C] text-[#62684E] px-5 py-4 rounded-2xl flex items-start gap-3">
            <i className="bi bi-check-circle-fill mt-1"></i>
            <span className="text-sm">{message} Serás redirigido al inicio de sesión...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nueva Contraseña */}
          <div className="flex items-center overflow-hidden rounded-2xl border border-[#D9D1C7] bg-white shadow-sm focus-within:border-[#9EA384] transition-colors">
            <div className="w-16 h-[64px] bg-[#F6F1E8] flex items-center justify-center border-r border-[#D9D1C7]">
              <i className="bi bi-key text-[#7B6A58] text-xl"></i>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              className="flex-1 h-[64px] pl-4 text-md outline-none bg-transparent text-[#4B3429] placeholder:text-[#A69A8E]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!token || message}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-5 text-[#8F7E70] hover:text-[#4B3429] transition-colors bg-transparent border-none cursor-pointer"
            >
              <i className={`text-xl bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>

          {/* Confirmar Contraseña */}
          <div className="flex items-center overflow-hidden rounded-2xl border border-[#D9D1C7] bg-white shadow-sm focus-within:border-[#9EA384] transition-colors">
            <div className="w-16 h-[64px] bg-[#F6F1E8] flex items-center justify-center border-r border-[#D9D1C7]">
              <i className="bi bi-check2-all text-[#7B6A58] text-xl"></i>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              className="flex-1 h-[64px] pl-4 text-md outline-none bg-transparent text-[#4B3429] placeholder:text-[#A69A8E]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!token || message}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token || message}
            className="w-full h-[64px] mt-4 rounded-2xl bg-[#9EA384] hover:bg-[#8C926F] text-white text-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Guardando...
              </>
            ) : (
              <>
                Actualizar Contraseña <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-[#7E8565] underline hover:text-[#4B3429] transition-colors bg-transparent border-none cursor-pointer text-sm font-medium"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
