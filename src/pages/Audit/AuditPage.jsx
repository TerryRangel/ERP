import { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/auditService';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async (isManualReload = false) => {
    if (isManualReload) setIsReloading(true);
    try {
      const data = await getAuditLogs();
      const sortedData = (data.items || data || []).sort(
        (a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha)
      );
      setLogs(sortedData);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getEventStyle = (action) => {
    const act = (action || '').toUpperCase();
    if (act.includes('CREA') || act.includes('POST'))
      return { color: 'text-emerald-700', bg: 'bg-emerald-100' };
    if (act.includes('ELIMIN') || act.includes('DELETE'))
      return { color: 'text-red-700', bg: 'bg-red-100' };
    if (act.includes('LOGIN'))
      return { color: 'text-purple-700', bg: 'bg-purple-100' };
    return { color: 'text-blue-700', bg: 'bg-blue-100' };
  };

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
    <div className="min-h-screen bg-[#F5F7F2] px-2 md:px-4 py-8 w-full">
      <div className="max-w-[2200px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-5 mb-4">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#DDE8CF] to-[#8FA878] text-[#5F6F52] flex items-center justify-center shadow-md border border-[#D4DFC5]">
                <i className="bi bi-shield-check text-2xl"></i>
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#7E8B63]">
                  Gestión ERP
                </p>
                <h1 className="text-5xl font-black text-[#1F2937] leading-none mt-1">
                  Auditoría
                </h1>
              </div>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl">
              Consulta eventos, acciones y trazabilidad del ERP desde una interfaz limpia y centralizada.
            </p>
          </div>

          {/* SEARCH + ACTIONS */}
          <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto">

            {/* SEARCH */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar evento, usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full lg:w-[360px] h-[58px] rounded-2xl
                  border border-[#E5EBDD] bg-white
                  pl-5 pr-14 text-sm font-medium text-gray-700
                  outline-none transition-all shadow-sm
                  focus:border-[#7E8B63] focus:ring-4 focus:ring-[#7E8B63]/10
                "
              />
              <i className="bi bi-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg"></i>
            </div>

            {/* FILTRAR */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="
                  h-[58px] px-6 rounded-2xl bg-white border border-[#E5EBDD]
                  text-gray-700 font-semibold flex items-center gap-3 shadow-sm
                  hover:border-[#7E8B63] hover:bg-[#FAFBF8] transition-all
                "
              >
                <i className="bi bi-sliders text-lg"></i>
                Filtrar
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-3 w-[280px] bg-white border border-[#E8EDE0] rounded-3xl shadow-xl p-6 z-50">
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Módulo</label>
                      <select
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                        className="w-full rounded-2xl border border-[#E5EBDD] bg-[#EEF2E7] px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#7E8B63]/20"
                      >
                        <option value="ALL">Todos los módulos</option>
                        {uniqueModules.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Acción</label>
                      <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="w-full rounded-2xl border border-[#E5EBDD] bg-[#EEF2E7] px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#7E8B63]/20"
                      >
                        <option value="ALL">Todas las acciones</option>
                        {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <button
                      onClick={() => { setModuleFilter('ALL'); setActionFilter('ALL'); setShowFilters(false); }}
                      className="w-full py-2.5 rounded-2xl border border-[#E5EBDD] text-sm font-semibold text-gray-500 hover:bg-[#F4F6F0] transition-all"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RECARGAR */}
            <button
              onClick={() => fetchLogs(true)}
              disabled={isReloading}
              className={`h-[58px] px-6 rounded-2xl bg-[#1F2937] text-white font-semibold flex items-center gap-3 shadow-lg hover:opacity-90 transition-all ${isReloading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <i className={`bi bi-arrow-clockwise text-lg ${isReloading ? 'animate-spin' : ''}`}></i>
              Recargar
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
                  <th className="text-left pr-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Detalle</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const style = getEventStyle(log.action);
                    return (
                      <tr key={log.id || log._id} className="border-b border-[#F3F5EF] hover:bg-[#FAFBF8] transition-all">

                        {/* FECHA */}
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

                        {/* EVENTO */}
                        <td>
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${style.bg} ${style.color}`}>
                            {log.action || 'SISTEMA'}
                          </span>
                        </td>

                        {/* RECURSO */}
                        <td>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-800">{log.resource || '-'}</span>
                            {log.resourceId && (
                              <span className="text-xs text-gray-400 font-mono">ID: {log.resourceId.substring(0, 8)}...</span>
                            )}
                          </div>
                        </td>

                        {/* USUARIO */}
                        <td>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-700">{log.usuario || 'Sistema'}</span>
                            {log.userId && (
                              <span className="text-xs text-gray-400 font-mono">UID: {log.userId.substring(0, 8)}...</span>
                            )}
                          </div>
                        </td>

                        {/* DETALLE */}
                        <td className="pr-10">
                          <span className="text-sm text-gray-500 max-w-xs truncate block" title={JSON.stringify(log.details)}>
                            {log.details?.mensaje || log.details?.nombre || 'Registro de transacción general'}
                          </span>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-28 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-[#F4F6F0] flex items-center justify-center mb-5">
                          <i className="bi bi-search text-4xl text-gray-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">Sin resultados</h3>
                        <p className="text-gray-400 mt-2">No existen eventos que coincidan con el filtro.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
