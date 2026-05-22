import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { clientService } from '../../services/clientService';
import "bootstrap-icons/font/bootstrap-icons.css";
import fondoLogin from '../../assets/fondo-login.jpg';
import ClientFormModal from '../../components/ui/ClientFormModal.jsx';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usuario, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full !bg-[#f8f8f6] border border-[#ECECE7] rounded-2xl py-3.5 !pl-12 pr-4 !text-[#1F2937] text-sm focus:ring-2 focus:ring-[#8d9b70]/30 outline-none transition-all placeholder:!text-gray-400";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none";

  return (
    <div 
      className="flex min-h-screen w-full items-center justify-center p-4 font-sans relative" 
      data-theme="light"
      style={{
        backgroundImage: `url(${fondoLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-[#f8f8f6]/70 backdrop-blur-[2px]"></div> {/*Opacidad de la imagen de fondo */}
      <div className="w-full max-w-md !bg-white p-10 shadow-2xl rounded-3xl border border-[#ECECE7] relative z-10">
        
        <div className="mb-8 text-center">
          <div className="mx-auto w-16 h-16 !bg-[#EEF1E7] rounded-2xl flex items-center justify-center mb-6 border border-[#DCE3CF]">
            <i className="bi bi-shop text-3xl !text-[#8d9b70]"></i>
          </div>
          <h2 className="text-3xl font-extrabold !text-[#1F2937] tracking-tight">¡Bienvenido!</h2>
          <p className="mt-2 text-sm !text-gray-500 font-medium">
            Ingresa tus credenciales para acceder al sistema.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 mb-6 !bg-[#FFF1F1] border border-[#FEE2E2] !text-[#E25B5B] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm">
            <i className="bi bi-exclamation-octagon-fill text-lg"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="form-control w-full relative">
            <label className="block pb-2 ml-1">
              <span className="text-[11px] font-bold uppercase tracking-widest !text-[#8d9b70]">Usuario</span>
            </label>
            <div className="relative w-full">
              <i className={`${iconClass} bi bi-person`}></i>
              <input 
                type="text" 
                placeholder="Admin" 
                className={inputClass} 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-control w-full relative">
            <label className="block pb-2 ml-1">
              <span className="text-[11px] font-bold uppercase tracking-widest !text-[#8d9b70]">Contraseña</span>
            </label>
            <div className="relative w-full">
              <i className={`${iconClass} bi bi-lock`}></i>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={inputClass} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 !bg-[#8d9b70] hover:!bg-[#74845a] !text-white text-sm font-bold rounded-2xl shadow-lg shadow-[#8d9b70]/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm text-white"></span>
                  Accediendo...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <i className="bi bi-box-arrow-in-right text-lg"></i>
                </>
              )}
            </button>
          </div>
          <div className = "text-center pt-4">
            <p className = "text-sm text-gray-400">
              ¿No tienes cuenta? 
            </p>
            <button 
              type = "button"
              className = "mt-2 text-[#8FA878] font-semibold hover:underline"
              onClick={() => setRegisterOpen(true)}
              >
                Registrate
            </button>
          </div>
        </form>
      </div>
      <ClientFormModal 
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        initialData= {null}
        onSubmit= {async (data) => {
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
    </div>
    

  );
}