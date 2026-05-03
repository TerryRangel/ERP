import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Usamos el usuario "proyecto" y el password "Hello2U"
      await authService.login(usuario, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 p-4">
      <div className="card w-full max-w-md bg-gray-800 p-10 shadow-2xl rounded-2xl border border-gray-700">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-gray-400">
            Ingresa tus credenciales para acceder.
          </p>
        </div>
        {error && (
          <div className="alert alert-error mb-6 rounded-none p-3 text-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="label-text text-xs font-semibold uppercase tracking-wider text-gray-400">Usuario</span>
            </label>
            <input 
              type="text" 
              placeholder="Ingresa tu usuario" 
              className="input input-bordered w-full bg-gray-900 text-white placeholder-gray-600 focus:border-primary rounded-none" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required 
            />
          </div>

          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="label-text text-xs font-semibold uppercase tracking-wider text-gray-400">Contraseña</span>
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input input-bordered w-full bg-gray-900 text-white placeholder-gray-600 focus:border-primary rounded-none" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="btn btn-primary w-full text-base font-bold rounded-none" 
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}