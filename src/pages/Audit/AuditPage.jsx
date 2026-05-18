import { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/auditService';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  // Estados del Formulario (Lo que el usuario está seleccionando)
  const [formSearch, setFormSearch] = useState('');
  const [formModule, setFormModule] = useState('Todos');
  const [formAction, setFormAction] = useState('Todas');

  // Estados Aplicados (Lo que realmente filtra la tabla tras darle a "Aplicar")
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedModule, setAppliedModule] = useState('Todos');
  const [appliedAction, setAppliedAction] = useState('Todas');

  const fetchLogs = async (isManualReload = false) => {
    if (isManualReload) setIsReloading(true);
    try {
      const data = await getAuditLogs();
      // Ordenar por fecha descendente (más recientes primero) por si el backend no lo hace
      const sortedData = (data.items || data || []).sort((a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha));
      setLogs(sortedData);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  // Opciones dinámicas para los selects basadas en los datos reales
  const uniqueModules = ['Todos', ...new Set(logs.map(l => l.resource).filter(Boolean))];
  const uniqueActions = ['Todas', ...new Set(logs.map(l => l.action).filter(Boolean))];

  // Funciones de los Botones
  const handleApplyFilters = () => {
    setAppliedSearch(formSearch);
    setAppliedModule(formModule);
    setAppliedAction(formAction);
  };

  const handleClearFilters = () => {
    setFormSearch('');
    setFormModule('Todos');
    setFormAction('Todas');
    setAppliedSearch('');
    setAppliedModule('Todos');
    setAppliedAction('Todas');
  };

  const handleReload = () => {
    fetchLogs(true);
  };

  // Lógica de Filtrado con los estados aplicados
  const filteredLogs = logs.filter(log => {
    const searchLower = appliedSearch.toLowerCase();
    const matchSearch = appliedSearch ? (
      (log.usuario || '').toLowerCase().includes(searchLower) ||
      (log.details?.mensaje || log.details?.nombre || '').toLowerCase().includes(searchLower) ||
      (log.resourceId || '').toLowerCase().includes(searchLower)
    ) : true;

    const matchModule = appliedModule !== 'Todos' ? log.resource === appliedModule : true;
    const matchAction = appliedAction !== 'Todas' ? log.action === appliedAction : true;

    return matchSearch && matchModule && matchAction;
  });

  // Utilidades de renderizado
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' 
    });
  };

  const getEventStyle = (action) => {
    const act = action?.toUpperCase() || '';
    if (act.includes('CREA') || act.includes('POST')) return { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: 'M12 4v16m8-8H4' };
    if (act.includes('ELIMIN') || act.includes('DELETE')) return { color: 'text-rose-700', bg: 'bg-rose-100', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' };
    if (act.includes('LOGIN')) return { color: 'text-purple-700', bg: 'bg-purple-100', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' };
    return { color: 'text-blue-700', bg: 'bg-blue-100', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' };
  };

  return (
    <div className="space-y-4">
      
      {/* 1. CABECERA (Al estilo de la referencia) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span>/ Auditoría</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Auditoría del Sistema</h1>
        <p className="text-slate-500 text-sm mt-1">Consulta eventos, acciones y trazabilidad del ERP Crochet.</p>
      </div>

      {/* 2. BARRA DE FILTROS AVANZADA */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Buscar Evento</label>
            <div className="relative flex items-center">
              <input type="text" placeholder="Buscar folio, nombre, usuario, recurso..." 
                value={formSearch} onChange={(e) => setFormSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5E4B] text-slate-700" />
              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Módulo</label>
            <select value={formModule} onChange={(e) => setFormModule(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5E4B] text-slate-700">
              {uniqueModules.map(mod => <option key={mod} value={mod}>{mod === 'Todos' ? 'Todos los módulos' : mod}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Acción</label>
            <select value={formAction} onChange={(e) => setFormAction(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5E4B] text-slate-700">
              {uniqueActions.map(act => <option key={act} value={act}>{act === 'Todas' ? 'Todas las acciones' : act}</option>)}
            </select>
          </div>

          <div className="md:col-span-3 flex gap-2">
            <button onClick={handleApplyFilters} className="flex-1 bg-[#4B5E4B] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#3a493a] transition-colors shadow-sm">
              Aplicar
            </button>
            <button onClick={handleClearFilters} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
              Limpiar
            </button>
            <button onClick={handleReload} disabled={isReloading} className={`px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors ${isReloading ? 'opacity-50 cursor-not-allowed' : ''}`} title="Recargar">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isReloading ? 'animate-spin text-[#4B5E4B]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABLA DE DATOS (Estilo Denso y Profesional) */}
      <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-md text-[#4B5E4B]"></span>
          </div>
        ) : filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Evento</th>
                    <th className="px-4 py-3">Recurso</th>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Detalle</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredLogs.map((log) => {
                    const style = getEventStyle(log.action);
                    return (
                      <tr key={log.id || log._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors even:bg-slate-50/40">
                        <td className="px-4 py-3 text-slate-600 font-medium text-xs">
                          {formatDate(log.createdAt || log.fecha)}
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${style.bg} ${style.color}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={style.icon} /></svg>
                            {log.action || 'SISTEMA'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 text-xs">{log.resource || '-'}</div>
                          {log.resourceId && <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {log.resourceId.substring(0, 8)}...</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 text-xs">{log.usuario || 'Sistema'}</div>
                          {log.userId && <div className="text-[10px] text-slate-400 font-mono mt-0.5">UID: {log.userId.substring(0, 8)}...</div>}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate" title={JSON.stringify(log.details)}>
                          {log.details?.mensaje || log.details?.nombre || 'Registro de transacción general'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        ) : (
            <div className="p-16 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-sm font-bold text-slate-700">No hay registros</h3>
                <p className="text-slate-500 text-xs mt-1">Ajusta los filtros o presiona "Limpiar" para ver resultados.</p>
            </div>
        )}
      </div>
      <div className="text-right text-xs text-slate-400 pr-2">Mostrando {filteredLogs.length} eventos registrados</div>
    </div>
  );
}