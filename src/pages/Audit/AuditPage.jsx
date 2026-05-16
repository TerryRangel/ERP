import { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/auditService';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Auditoría</h1>
        <p className="text-slate-500 mt-1">Consulta eventos, acciones y trazabilidad del sistema de la tienda.</p>
      </div>

      {/* Tarjeta de Filtros (Basado en tu imagen) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap lg:flex-nowrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Buscar evento</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar folio, recurso, usuario..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all text-sm"
            />
          </div>
        </div>

        <div className="w-full lg:w-48">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Módulo</label>
          <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 text-sm text-slate-600">
            <option>Todos los módulos</option>
            <option>Proveedores</option>
            <option>Usuarios</option>
            <option>Productos</option>
          </select>
        </div>

        <div className="w-full lg:w-48">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Acción</label>
          <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 text-sm text-slate-600">
            <option>Todas las acciones</option>
            <option>Creación</option>
            <option>Actualización</option>
            <option>Eliminación</option>
            <option>Inicio de sesión</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button className="px-5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors shadow-sm">
            Aplicar
          </button>
          <button className="px-5 py-2 bg-white text-slate-600 border border-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
            Limpiar
          </button>
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-md text-pink-500"></span>
          </div>
        ) : error ? (
           <div className="p-8 text-center text-red-500 bg-red-50">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-bold">Fecha</th>
                  <th className="p-4 font-bold">Evento</th>
                  <th className="p-4 font-bold">Recurso</th>
                  <th className="p-4 font-bold">Usuario</th>
                  <th className="p-4 font-bold text-center">Detalle</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          log.action === 'UPDATE' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          log.action === 'DELETE' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {log.action}
                        </span>
                        <div className="text-xs text-slate-400 mt-1">{log.module}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {log.resourceId || 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{log.user?.name || 'Sistema'}</div>
                        <div className="text-xs text-slate-400">{log.user?.email || '-'}</div>
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-slate-400 hover:text-pink-500 transition-colors p-2">
                          {/* Ícono de ojo genérico */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mx-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">
                      No se encontraron eventos de auditoría.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}