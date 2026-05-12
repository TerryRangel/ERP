import React, { useEffect, useState } from "react";
import api from "../../services/api"; 
import { Can } from "../../components/can.jsx"; 
import AddUserModal from "../../components/ui/AddUserModal.jsx"; 

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [error, setError] = useState(null); 

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users"); 
      // Ajuste según tu API (items)
      const lista = response.data?.items || response.data || [];
      setUsuarios(lista);
    } catch (err) {
      setError("No se pudo sincronizar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50/20">
      <span className="loading loading-spinner loading-lg text-pink-400"></span>
    </div>
  );

  return (
    <div className="p-8 bg-pink-50/10 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
          <p className="text-gray-500 text-sm">Control de accesos Crochet ERP</p>
        </div>
        <Can perform="users:create">
          <button onClick={() => setIsModalOpen(true)} className="btn bg-pink-500 border-none text-white hover:bg-pink-600">
            + Nuevo Usuario
          </button>
        </Can>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-lg border border-pink-100">
        <table className="table w-full">
          <thead className="bg-pink-50/50">
            <tr>
              <th className="text-pink-400 px-6 py-4">Usuario</th>
              <th className="text-pink-400">Email</th>
              <th className="text-pink-400">Rol</th>
              <th className="text-pink-400 text-right px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id || u.usuario} className="hover:bg-pink-50/30 transition-colors border-b border-pink-50">
                <td className="px-6 py-4 font-bold text-gray-700">{u.nombre} {u.apellido}</td>
                <td className="text-gray-600">{u.email}</td>
                <td>
                  <span className={`badge border-none text-white font-bold ${u.role === 'ADMIN' ? 'bg-pink-600' : 'bg-pink-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <Can perform="users:update">
                      <button className="text-pink-400 hover:text-pink-600">📝</button>
                    </Can>
                    <Can perform="users:delete">
                      <button className="text-red-300 hover:text-red-500">🗑️</button>
                    </Can>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUserAdded={cargarUsuarios} />
    </div>
  );
}