import { useState, useEffect, useRef } from 'react';
import { suppliersService } from '../../services/suppliersService';
import SupplierFormModal from './SupplierFormModal';
import { Can } from '../../components/can'; 

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal y Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  
  // Estados del Formulario de Filtros
  const [formSearch, setFormSearch] = useState('');
  const [formStatus, setFormStatus] = useState('Todos');
  
  // Estados Aplicados (los que realmente cambian la tabla)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('Todos');

  // Estado para nuestro Dropdown Personalizado
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Cierra el dropdown si haces clic afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      alert("Error al guardar: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.')) {
      try {
        await suppliersService.deleteSupplier(id);
        fetchSuppliers();
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      }
    }
  };

  const openNewModal = () => {
    setSupplierToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setSupplierToEdit(supplier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSupplierToEdit(null);
  };

  // Funciones de la barra de filtros
  const handleApplyFilters = () => {
    setAppliedSearch(formSearch);
    setAppliedStatus(formStatus);
  };

  const handleClearFilters = () => {
    setFormSearch('');
    setFormStatus('Todos');
    setAppliedSearch('');
    setAppliedStatus('Todos');
  };

  // Lógica de Filtrado Aplicado
  const filteredSuppliers = suppliers.filter(supplier => {
    const isActivo = supplier.activo !== false;
    const matchesStatus = appliedStatus === 'Todos' ? true : appliedStatus === 'Activo' ? isActivo : !isActivo;
    
    const searchLower = appliedSearch.toLowerCase();
    const matchesSearch = appliedSearch ? (
      (supplier.nombre || supplier.name || '').toLowerCase().includes(searchLower) ||
      (supplier.contacto || supplier.contactName || '').toLowerCase().includes(searchLower) ||
      (supplier.rfc || '').toLowerCase().includes(searchLower)
    ) : true;
    
    return matchesStatus && matchesSearch;
  });

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.activo !== false).length;
  const inactiveSuppliers = totalSuppliers - activeSuppliers;

  const getInitials = (name) => {
    if (!name) return 'SP';
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. CABECERA */}
      <div className="flex items-center gap-4 mb-2">
        <div className="text-[#4B5E4B]">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.5 1.5A1.5 1.5 0 0 1 10 0h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h6c-.314.418-.5.937-.5 1.5v6h-2a.5.5 0 0 0-.354.854l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5A.5.5 0 0 0 10.5 7.5h-2v-6z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Módulo de Suministros</h3>
          <h1 className="text-xl font-bold text-slate-800">Proveedores</h1>
        </div>
      </div>

      <p className="text-slate-600 text-base max-w-xl mb-4">
        Administra las empresas asociadas, contactos y estatus operativo desde una interfaz limpia y centralizada.
      </p>
      <br />

      {/* 2. BARRA DE FILTROS AVANZADA (Diseño con lupa corregida) */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 shadow-sm mb-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          <div className="md:col-span-5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Buscar Proveedor</label>
            <div className="relative flex items-center">
              <input type="text" placeholder="Buscar por nombre, RFC o contacto..." 
                value={formSearch} onChange={(e) => setFormSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5E4B] text-slate-700 shadow-sm" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* DROPDOWN PERSONALIZADO DE ESTADO */}
          <div className="md:col-span-3 relative" ref={dropdownRef}>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Estado Operativo</label>
            <button 
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4B5E4B]"
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${formStatus === 'Activo' ? 'bg-emerald-500' : formStatus === 'Inactivo' ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
                {formStatus === 'Todos' ? 'Todos los estados' : formStatus}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Menú Flotante del Dropdown */}
            {isStatusDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                <div className="py-1">
                  {['Todos', 'Activo', 'Inactivo'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setFormStatus(status); setIsStatusDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${formStatus === status ? 'bg-slate-50 font-bold text-[#4B5E4B]' : 'text-slate-600'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${status === 'Activo' ? 'bg-emerald-500' : status === 'Inactivo' ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
                      {status === 'Todos' ? 'Todos los estados' : status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-4 flex items-center justify-end gap-6">
            
            <button onClick={handleApplyFilters} className="text-sm text-[#4B5E4B] font-bold hover:text-[#3a493a] transition-colors">
              Aplicar
            </button>
            
            <button onClick={handleClearFilters} className="text-sm text-slate-600 font-bold hover:text-slate-900 transition-colors flex items-center gap-1.5">
              Limpiar
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <Can I="suppliers:create">
              {/* Línea divisoria sutil */}
              <div className="h-5 w-px bg-slate-300 mx-2"></div>
              
              <button onClick={openNewModal} className="text-sm text-slate-800 font-bold hover:text-[#4B5E4B] transition-colors flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Nuevo
              </button>
            </Can>
            
          </div>
        </div>
      </div>

      {/* 3. TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white px-8 py-6 rounded-[2rem] shadow-sm flex items-center justify-between border border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Proveedores</p>
            <p className="text-2xl font-bold text-slate-800">{totalSuppliers}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></svg>
          </div>
        </div>

        <div className="bg-white px-8 py-6 rounded-[2rem] shadow-sm flex items-center justify-between border border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Activos</p>
            <p className="text-2xl font-bold text-emerald-600">{activeSuppliers}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
          </div>
        </div>

        <div className="bg-white px-8 py-6 rounded-[2rem] shadow-sm flex items-center justify-between border border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Inactivos</p>
            <p className="text-2xl font-bold text-rose-500">{inactiveSuppliers}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>
          </div>
        </div>
      </div>

      {/* 4. TABLA */}
      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden min-h-[400px] p-6 pt-8 relative z-10 border border-slate-100">
        <div className="mb-6 px-2">
          <h2 className="text-lg font-bold text-slate-800">Directorio de proveedores</h2>
          <p className="text-sm text-slate-400">{filteredSuppliers.length} resultados encontrados</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-md text-[#4B5E4B]"></span>
          </div>
        ) : filteredSuppliers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4 pb-3">Empresa</th>
                    <th className="p-4 pb-3">Contacto</th>
                    <th className="p-4 pb-3">Teléfono</th>
                    <th className="p-4 pb-3">Estatus</th>
                    <Can I="suppliers:create"> <th className="p-4 pb-3 text-center">Acciones</th></Can>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id || supplier._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#166534] font-bold flex items-center justify-center text-xs">
                            {getInitials(supplier.nombre || supplier.name)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-700">{supplier.nombre || supplier.name || 'Sin nombre'}</div>
                            <div className="text-xs text-slate-400">RFC: {supplier.rfc || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-700 font-medium">{supplier.contacto || supplier.contactName || '-'}</div>
                        <div className="text-xs text-slate-400">{supplier.email || '-'}</div>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {supplier.telefono || supplier.phone || '-'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-xs ${
                          supplier.activo !== false ? 'text-emerald-600' : 'text-rose-500'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${supplier.activo !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {supplier.activo !== false ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td> 
                      <Can I="suppliers:create">
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => openEditModal(supplier)} 
                            className="text-slate-400 hover:text-blue-600 transition-colors" 
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(supplier.id || supplier._id)} 
                            className="text-slate-400 hover:text-rose-600 transition-colors" 
                            title="Eliminar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>
                          </button>
                        </div>
                      </td>
                      </Can>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        ) : (
            <div className="p-16 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-700">No hay coincidencias</h3>
                <p className="text-slate-500 text-sm max-w-sm mt-1">
                    No encontramos proveedores que coincidan con tu búsqueda o filtros actuales.
                </p>
            </div>
        )}
      </div>

      <SupplierFormModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveSupplier} 
        editData={supplierToEdit}
      />
    </div>
  );
}