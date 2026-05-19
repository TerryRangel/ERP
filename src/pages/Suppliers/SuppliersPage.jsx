import { useState, useEffect } from 'react';
import { suppliersService } from '../../services/suppliersService';
import SupplierFormModal from './SupplierFormModal';
import { Can } from '../../components/can';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersService.getSuppliers();
      setSuppliers(data.items || data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSaveSupplier = async (supplierData) => {
    try {
      if (supplierToEdit) {
        const id = supplierToEdit.id || supplierToEdit._id;
        await suppliersService.updateSupplier(id, supplierData);
      } else {
        await suppliersService.createSupplier(supplierData);
      }
      closeModal();
      fetchSuppliers();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    try {
      await suppliersService.deleteSupplier(supplierToDelete.id || supplierToDelete._id);
      setSupplierToDelete(null);
      fetchSuppliers();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const openNewModal = () => { setSupplierToEdit(null); setIsModalOpen(true); };
  const openEditModal = (s) => { setSupplierToEdit(s); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSupplierToEdit(null); };

  const filteredSuppliers = suppliers.filter((s) => {
    const isActivo = s.activo !== false;
    const matchStatus =
      statusFilter === 'ALL' ? true : statusFilter === 'ACTIVE' ? isActivo : !isActivo;
    const q = search.toLowerCase();
    const matchSearch = search
      ? (s.nombre || s.name || '').toLowerCase().includes(q) ||
        (s.contacto || s.contactName || '').toLowerCase().includes(q) ||
        (s.rfc || '').toLowerCase().includes(q)
      : true;
    return matchStatus && matchSearch;
  });

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.activo !== false).length;
  const inactiveSuppliers = totalSuppliers - activeSuppliers;

  const getInitials = (name) => {
    if (!name) return 'SP';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7F2]">
        <div className="w-20 h-20 rounded-[28px] bg-white border border-[#E7ECDD] shadow-sm flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#7E8B63]"></span>
        </div>
        <p className="mt-5 text-gray-500 font-medium tracking-wide">Cargando proveedores...</p>
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
                <i className="bi bi-truck text-2xl"></i>
              </div>
              <div>
                <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#7E8B63]">
                  Gestión ERP
                </p>
                <h1 className="text-5xl font-black text-[#1F2937] leading-none mt-1">
                  Proveedores
                </h1>
              </div>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl">
              Administra las empresas asociadas, contactos y estatus operativo desde una interfaz limpia y centralizada.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto">

            {/* SEARCH */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar proveedores..."
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
                <div className="absolute right-0 mt-3 w-[260px] bg-white border border-[#E8EDE0] rounded-3xl shadow-xl p-6 z-50">
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">
                        Estado
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-2xl border border-[#E5EBDD] bg-[#EEF2E7] px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#7E8B63]/20"
                      >
                        <option value="ALL">Todos</option>
                        <option value="ACTIVE">Activos</option>
                        <option value="INACTIVE">Inactivos</option>
                      </select>
                    </div>
                    <button
                      onClick={() => { setStatusFilter('ALL'); setShowFilters(false); }}
                      className="w-full py-2.5 rounded-2xl border border-[#E5EBDD] text-sm font-semibold text-gray-500 hover:bg-[#F4F6F0] transition-all"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* NUEVO */}
            <Can I="suppliers:create">
              <button
                onClick={openNewModal}
                className="
                  h-[58px] px-7 rounded-2xl bg-[#1F2937] text-white
                  font-semibold flex items-center gap-3 shadow-lg
                  hover:opacity-90 transition-all
                "
              >
                <i className="bi bi-plus-circle-fill"></i>
                Nuevo Proveedor
              </button>
            </Can>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Total</p>
              <h3 className="text-5xl font-black mt-2 text-gray-700">{totalSuppliers}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100">
              <i className="bi bi-truck text-2xl text-gray-700"></i>
            </div>
          </div>

          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Activos</p>
              <h3 className="text-5xl font-black mt-2 text-green-700">{activeSuppliers}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-100">
              <i className="bi bi-check-circle-fill text-2xl text-green-700"></i>
            </div>
          </div>

          <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Inactivos</p>
              <h3 className="text-5xl font-black mt-2 text-red-600">{inactiveSuppliers}</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-100">
              <i className="bi bi-person-x-fill text-2xl text-red-600"></i>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#E5EBDD] rounded-[36px] shadow-sm overflow-hidden">

          <div className="px-8 py-6 border-b border-[#EEF2E7]">
            <h2 className="text-xl font-black text-gray-800">Directorio de proveedores</h2>
            <p className="text-sm text-gray-400 mt-1">{filteredSuppliers.length} resultados encontrados</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFBF8] border-b border-[#EEF2E7]">
                  <th className="text-left pl-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Empresa</th>
                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Contacto</th>
                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Teléfono</th>
                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Estado</th>
                  <Can I="suppliers:create">
                    <th className="text-center pr-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">Acciones</th>
                  </Can>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((s) => (
                    <tr key={s.id || s._id} className="border-b border-[#F3F5EF] hover:bg-[#FAFBF8] transition-all">

                      {/* EMPRESA */}
                      <td className="pl-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#E8F0DD] text-[#5F6F52] flex items-center justify-center font-bold shadow-sm border border-[#D7E4C0]">
                            {getInitials(s.nombre || s.name)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{s.nombre || s.name || 'Sin nombre'}</h3>
                            <p className="text-xs text-gray-400 mt-1">RFC: {s.rfc || 'N/A'}</p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACTO */}
                      <td>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-700">{s.contacto || s.contactName || 'Sin contacto'}</span>
                          <span className="text-xs text-gray-400">{s.email || 'Sin email'}</span>
                        </div>
                      </td>

                      {/* TELÉFONO */}
                      <td>
                        <span className="font-medium text-gray-700">{s.telefono || s.phone || '-'}</span>
                      </td>

                      {/* ESTADO */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${s.activo !== false ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={`text-sm font-bold ${s.activo !== false ? 'text-gray-800' : 'text-gray-400'}`}>
                            {s.activo !== false ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </div>
                      </td>

                      {/* ACCIONES */}
                      <Can I="suppliers:create">
                        <td className="pr-10">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => openEditModal(s)}
                              className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              onClick={() => setSupplierToDelete(s)}
                              className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </td>
                      </Can>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-28 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-[#F4F6F0] flex items-center justify-center mb-5">
                          <i className="bi bi-search text-4xl text-gray-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">Sin resultados</h3>
                        <p className="text-gray-400 mt-2">No existen proveedores que coincidan con el filtro.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL FORMULARIO */}
      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveSupplier}
        editData={supplierToEdit}
      />

      {/* MODAL DELETE */}
      {supplierToDelete && (
        <div className="modal modal-open">
          <div className="modal-box rounded-3xl">
            <h3 className="font-black text-2xl text-gray-800">Eliminar proveedor</h3>
            <p className="py-4 text-gray-500">
              ¿Deseas eliminar a <strong>{supplierToDelete.nombre || supplierToDelete.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="modal-action">
              <button className="btn rounded-2xl" onClick={() => setSupplierToDelete(null)}>Cancelar</button>
              <button className="btn btn-error rounded-2xl" onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
