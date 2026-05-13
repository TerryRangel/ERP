import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Can } from "../../components/can.jsx";
import AddUserModal from "../../components/ui/AddUserModal.jsx";

import "bootstrap-icons/font/bootstrap-icons.css";

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");
      const lista = response.data?.items || response.data || [];

      setUsuarios(lista);
    } catch (err) {
      setError(
        "No se pudo sincronizar la lista de usuarios. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#f8f8f6]">
        <span className="loading loading-spinner loading-lg text-[#8d9b70]"></span>

        <p className="text-sm tracking-wide text-gray-400 animate-pulse">
          Cargando usuarios...
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#f8f8f6]
        p-6 md:p-10
        font-sans
        text-[#2D2D2D]
        transition-all duration-300
      "
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8d9b70] font-semibold mb-3">
            <i className="bi bi-shield-lock-fill"></i>
            Gestión de accesos
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1F2937]">
            Usuarios
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Administra usuarios y permisos del sistema.
          </p>
        </div>

        {/* BOTÓN NUEVO USUARIO */}
        <Can perform="users:create">
          <button
            onClick={() => setIsModalOpen(true)}
            className="
              group
              relative
              overflow-hidden
              flex items-center gap-3
              px-6 py-3
              rounded-2xl
              bg-gradient-to-r from-[#8d9b70] to-[#74845a]
              text-white
              font-semibold
              shadow-lg shadow-[#8d9b70]/20
              border border-white/10
              transition-all duration-300
              hover:scale-[1.02]
              hover:shadow-xl
              active:scale-95
            "
          >
            {/* Glow */}
            <span
              className="
                absolute inset-0
                bg-white/10
                opacity-0
                group-hover:opacity-100
                transition-opacity duration-300
              "
            ></span>

            <i className="bi bi-person-plus-fill text-lg relative z-10"></i>

            <span className="relative z-10">
              Nuevo Usuario
            </span>
          </button>
        </Can>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 flex items-center gap-3 shadow-sm">
          <i className="bi bi-exclamation-circle-fill text-lg"></i>

          <span className="text-sm">
            {error}
          </span>
        </div>
      )}

      {/* CONTENEDOR TABLA */}
      <div
        className="
          bg-white/90
          backdrop-blur-md
          border border-[#ECECE7]
          rounded-3xl
          overflow-hidden
          shadow-[0_10px_30px_rgba(0,0,0,0.04)]
          transition-all duration-300
          hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* HEAD */}
            <thead className="bg-[#F4F5F1]">
              <tr>
                <th className="px-8 py-5 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Usuario
                </th>

                <th className="px-8 py-5 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Email
                </th>

                <th className="px-8 py-5 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Rol
                </th>

                <th className="px-8 py-5 text-right text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <tr
                    key={u.id || u.usuario}
                    className="
                      border-t border-[#F1F1ED]
                      transition-all duration-300
                      hover:bg-[#F9FAF6]
                    "
                  >
                    {/* USER */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            w-11 h-11
                            rounded-2xl
                            bg-gradient-to-br
                            from-[#EEF1E7]
                            to-[#DDE5CD]
                            flex items-center justify-center
                            text-[#6A734D]
                            font-semibold
                            text-sm
                            uppercase
                            shadow-sm
                          "
                        >
                          {u.nombre?.charAt(0)}
                          {u.apellido?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-[#1F2937]">
                            {u.nombre} {u.apellido}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {u.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-8 py-5 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-envelope text-gray-400"></i>
                        {u.email}
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-8 py-5">
                      <span
                        className={`
                          inline-flex items-center gap-2
                          px-4 py-2
                          rounded-full
                          text-xs font-semibold
                          border
                          transition-all duration-300
                          ${
                            u.role === "ADMIN"
                              ? "bg-[#EEF1E7] text-[#6A734D] border-[#DCE3CF]"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }
                        `}
                      >
                        <i
                          className={
                            u.role === "ADMIN"
                              ? "bi bi-stars"
                              : "bi bi-person"
                          }
                        ></i>

                        {u.role}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-3">
                        <Can perform="users:update">
                          <button
                            title="Editar usuario"
                            className="
                              w-10 h-10
                              rounded-xl
                              bg-[#F4F5F1]
                              text-[#6A734D]
                              flex items-center justify-center
                              transition-all duration-300
                              hover:bg-[#8d9b70]
                              hover:text-white
                              hover:-translate-y-0.5
                              hover:shadow-md
                            "
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        </Can>

                        <Can perform="users:delete">
                          <button
                            title="Eliminar usuario"
                            className="
                              w-10 h-10
                              rounded-xl
                              bg-[#FFF1F1]
                              text-[#E25B5B]
                              flex items-center justify-center
                              transition-all duration-300
                              hover:bg-[#E25B5B]
                              hover:text-white
                              hover:-translate-y-0.5
                              hover:shadow-md
                            "
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* EMPTY STATE */
                <tr>
                  <td colSpan="4" className="py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="
                          w-24 h-24
                          rounded-3xl
                          bg-gradient-to-br
                          from-[#EEF1E7]
                          to-[#DDE5CD]
                          flex items-center justify-center
                          mb-6
                          shadow-sm
                        "
                      >
                        <i className="bi bi-people-fill text-4xl text-[#8d9b70]"></i>
                      </div>

                      <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                        No hay usuarios
                      </h3>

                      <p className="text-sm text-gray-400 max-w-sm">
                        Agrega un nuevo usuario para comenzar a gestionar
                        permisos y accesos.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={cargarUsuarios}
      />
    </div>
  );
}