import { useState, useEffect, useRef } from 'react';
import { getAuditLogs } from '../../services/auditService';
import { useAudit } from '../../context/AuditContext';
import "bootstrap-icons/font/bootstrap-icons.css";

// ─── FUNCIONES AUXILIARES (Movidas afuera para poder compartirlas) ──────────
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getEventStyle = (action) => {
  const act = (action || '').toUpperCase();
  if (act.includes('CREA') || act.includes('POST')) return { color: 'text-emerald-700', bg: 'bg-emerald-100' };
  if (act.includes('ELIMIN') || act.includes('DELETE')) return { color: 'text-red-700', bg: 'bg-red-100' };
  if (act.includes('LOGIN')) return { color: 'text-purple-700', bg: 'bg-purple-100' };
  return { color: 'text-blue-700', bg: 'bg-blue-100' };
};


// ─── COMPONENTE PRINCIPAL DE LA PÁGINA ──────────────────────────────────────
export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const [selectedLog, setSelectedLog] = useState(null);

  const { setLatestLogs } = useAudit();

  const fetchLogs = async (isManualReload = false) => {
    if (isManualReload) setIsReloading(true);
    try {
      const data = await getAuditLogs();
      const sortedData = (data.items || data || []).sort(
        (a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha)
      );
      setLogs(sortedData);
      setLatestLogs(sortedData.slice(0, 3));
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const uniqueModules = [...new Set(logs.map((l) => l.resource).filter(Boolean))];
  const uniqueActions = [...new Set(logs.map((l) => l.action).filter(Boolean))];

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchSearch = search
      ? (log.usuario || '').toLowerCase().includes(q) ||
        (log.details?.mensaje || log.details?.nombre || '').toLowerCase().includes(q) ||
        (log.resourceId || '').toLowerCase().includes(q)
      : true;

    const matchModule = moduleFilter !== 'ALL' ? log.resource === moduleFilter : true;
    const matchAction = actionFilter !== 'ALL' ? log.action === actionFilter : true;

    return matchSearch && matchModule && matchAction;
  });

  const totalLogs = logs.length;
  const createLogs = logs.filter((l) => {
    const a = (l.action || '').toUpperCase();
    return a.includes('CREA') || a.includes('POST');
  }).length;
  const deleteLogs = logs.filter((l) => {
    const a = (l.action || '').toUpperCase();
    return a.includes('ELIMIN') || a.includes('DELETE');
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7F2]">
        <div className="w-20 h-20 rounded-[28px] bg-white border border-[#E7ECDD] shadow-sm flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#7E8B63]"></span>
        </div>
        <p className="mt-5 text-gray-500 font-medium tracking-wide">Cargando auditoría...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F2] px-2 md:px-4 py-8 w-full relative">
      <div className="max-w-[2200px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-5 mb-4">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#DDE8CF] to-[#8FA878] text-[#5F6F52] flex items-center justify-center shadow-md border border-[#D4DFC5]">
                <i className="bi bi-shield-check text-2xl"></i>
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#7E8B63]">Gestión ERP</p>
                <h1 className="text-5xl font-black text-[#1F2937] leading-none mt-1">Auditoría</h1>
              </div>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl">Consulta eventos, acciones y trazabilidad del ERP.</p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto">
            {/* SEARCH */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar evento, usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full lg:w-[360px] h-[58px] rounded-2xl border border-[#E5EBDD] bg-white pl-5 pr-14 text-sm font-medium text-gray-700 outline-none transition-all shadow-sm focus:border-[#7E8B63] focus:ring-4 focus:ring-[#7E8B63]/10"
              />
              <i className="bi bi-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg"></i>
            </div>

            {/* FILTROS */}
            <div className="relative">
              <button onClick={() => setShowFilters(!showFilters)} className="h-[58px] px-6 rounded-2xl bg-white border border-[#E5EBDD] text-gray-700 font-semibold flex items-center gap-3 shadow-sm hover:border-[#7E8B63] hover:bg-[#FAFBF8] transition-all">
                <i className="bi bi-sliders text-lg"></i> Filtrar
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-3 w-[280px] bg-white border border-[#E8EDE0] rounded-3xl shadow-xl p-6 z-50">
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Módulo</label>
                      <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="w-full rounded-2xl border border-[#E5EBDD] bg-[#EEF2E7] px-4 py-3 text-sm font-medium text-gray-700 outline-none">
                        <option value="ALL">Todos los módulos</option>
                        {uniqueModules.map((m) => (<option key={m} value={m}>{m}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Acción</label>
                      <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="w-full rounded-2xl border border-[#E5EBDD] bg-[#EEF2E7] px-4 py-3 text-sm font-medium text-gray-700 outline-none">
                        <option value="ALL">Todas las acciones</option>
                        {uniqueActions.map((a) => (<option key={a} value={a}>{a}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RECARGAR */}
            <button onClick={() => fetchLogs(true)} disabled={isReloading} className={`h-[58px] px-6 rounded-2xl bg-[#1F2937] text-white font-semibold flex items-center gap-3 shadow-lg hover:opacity-90 transition-all ${isReloading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <i className={`bi bi-arrow-clockwise text-lg ${isReloading ? 'animate-spin' : ''}`}></i> Recargar
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Total Eventos</p>
              <h3 className="text-5xl font-black mt-2 text-gray-700">{totalLogs}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100">
              <i className="bi bi-journal-text text-2xl text-gray-700"></i>
            </div>
          </div>
          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Creaciones</p>
              <h3 className="text-5xl font-black mt-2 text-green-700">{createLogs}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-100">
              <i className="bi bi-plus-circle-fill text-2xl text-green-700"></i>
            </div>
          </div>
          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Eliminaciones</p>
              <h3 className="text-5xl font-black mt-2 text-red-600">{deleteLogs}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-100">
              <i className="bi bi-trash3-fill text-2xl text-red-600"></i>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#E5EBDD] rounded-[36px] shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-[#EEF2E7]">
            <h2 className="text-xl font-black text-gray-800">Registro de eventos</h2>
            <p className="text-sm text-gray-400 mt-1">{filteredLogs.length} eventos registrados</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFBF8] border-b border-[#EEF2E7]">
                  <th className="text-left pl-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Fecha</th>
                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Evento</th>
                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Recurso</th>
                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Usuario</th>
                  <th className="text-center py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const style = getEventStyle(log.action);
                  return (
                    <tr key={log.id || log._id} className="border-b border-[#F3F5EF] hover:bg-[#FAFBF8] transition-all">
                      <td className="pl-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#E8F0DD] text-[#5F6F52] flex items-center justify-center shadow-sm border border-[#D7E4C0]">
                            <i className="bi bi-clock-history text-lg"></i>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm">{formatDate(log.createdAt || log.fecha)}</h3>
                            <p className="text-xs text-gray-400 mt-1">ID: {(log.id || log._id || '').toString().slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${style.bg} ${style.color}`}>
                          {log.action || 'SISTEMA'}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-gray-800">{log.resource || '-'}</span>
                      </td>
                      <td>
                        <span className="font-medium text-gray-700">{log.usuario || 'Sistema'}</span>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                            title="Ver detalles completos"
                          >
                            <i className="bi bi-eye text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RENDERIZADO DEL MODAL */}
      <AuditDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}


// ─── SUBCOMPONENTE DEL MODAL (Asegura el z-index superior con <dialog>) ────
function AuditDetailsModal({ log, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (log) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [log]);

  return (
    <dialog ref={dialogRef} className="modal modal-middle backdrop-blur-sm" data-theme="light" onCancel={onClose}>
      {log && (
        <div className="modal-box w-[calc(100%-32px)] sm:w-11/12 !max-w-2xl !bg-white rounded-[2.5rem] p-0 shadow-2xl relative !text-[#1F2937] overflow-hidden flex flex-col !max-h-[90dvh]">
          
          <div className="shrink-0 px-8 py-6 border-b border-[#EEF2E7] flex justify-between items-center bg-[#FAFBF8]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0DD] text-[#5F6F52] flex items-center justify-center shadow-sm border border-[#D7E4C0]">
                <i className="bi bi-file-earmark-text text-xl"></i>
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-800">Detalles del Evento</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">
                  ID: {log.id || log._id}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 flex items-center justify-center transition-all"
            >
              <i className="bi bi-x-lg text-lg"></i>
            </button>
          </div>

          <div className="flex-1 min-h-0 p-8 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 gap-6 bg-[#F4F6F0] p-6 rounded-3xl border border-[#E5EBDD]">
                <div>
                  <span className="block text-[10px] font-bold text-[#7E8B63] uppercase tracking-widest mb-1">Usuario / Actor</span>
                  <span className="block text-base font-bold text-gray-800 flex items-center gap-2">
                    <i className="bi bi-person-badge text-gray-400"></i>
                    {log.usuario || 'Sistema'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-[#7E8B63] uppercase tracking-widest mb-1">Fecha y Hora</span>
                  <span className="block text-base font-bold text-gray-800 flex items-center gap-2">
                    <i className="bi bi-calendar3 text-gray-400"></i>
                    {formatDate(log.createdAt || log.fecha)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-[#7E8B63] uppercase tracking-widest mb-1">Acción Registrada</span>
                  <span className="block text-base font-bold text-gray-800 flex items-center gap-2">
                    <i className="bi bi-activity text-gray-400"></i>
                    {log.action}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-[#7E8B63] uppercase tracking-widest mb-1">Módulo / Recurso</span>
                  <span className="block text-base font-bold text-gray-800 flex items-center gap-2">
                    <i className="bi bi-box text-gray-400"></i>
                    {log.resource || '-'}
                  </span>
                </div>
              </div>

              {log.details?.mensaje && (
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i className="bi bi-chat-left-text"></i> Mensaje del Evento
                  </span>
                  <div className="bg-[#FAFBF8] p-5 rounded-3xl border border-[#E5EBDD] text-gray-700 text-sm shadow-sm font-medium">
                    {log.details.mensaje}
                  </div>
                </div>
              )}

              <div>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <i className="bi bi-code-slash"></i> Información Técnica
                </span>
                <div className="bg-[#1F2937] p-5 rounded-3xl shadow-inner border border-gray-800">
                  <pre className="text-xs font-mono text-[#A7F3D0] overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}