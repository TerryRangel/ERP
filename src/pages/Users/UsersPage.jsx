import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { Can } from "../../components/can.jsx";
import AddUserModal from "../../components/ui/AddUserModal.jsx";
import EditPermissionsModal from "../../components/ui/EditPermissionsModal.jsx";
import ConfirmAlert from "../../components/ui/Alert.jsx";

import "bootstrap-icons/font/bootstrap-icons.css";

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* SEARCH */
  const [searchTerm, setSearchTerm] = useState("");

  /* FILTROS */
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  /* MODALES */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditPermsOpen, setIsEditPermsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /* ALERT */
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      const lista = response.data?.items || response.data || [];

      setUsuarios(lista);
    } catch (err) {
      setError("No se pudo sincronizar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  /* FILTRADO */
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const texto =
        `${u.nombre} ${u.apellido} ${u.email} ${u.usuario}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const estado =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? u.activo
          : !u.activo;

      const rol =
        roleFilter === "ALL"
          ? true
          : u.role === roleFilter;

      return texto && estado && rol;
    });
  }, [usuarios, searchTerm, statusFilter, roleFilter]);

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    setIsEditPermsOpen(true);
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setIsAlertOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);

    try {
      await api.delete(`/users/${userToDelete.id}`);

      cargarUsuarios();

      setIsAlertOpen(false);
    } catch (err) {
      setError("Error al eliminar el usuario.");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7F2]">
        <div className="w-20 h-20 rounded-[28px] bg-white border border-[#E7ECDD] shadow-sm flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#7E8B63]"></span>
        </div>

        <p className="mt-5 text-gray-500 font-medium tracking-wide">
          Cargando usuarios...
        </p>
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

              {/* ICONO PRINCIPAL */}
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#DDE8CF] to-[#8FA878] text-[#5F6F52] flex items-center justify-center shadow-md border border-[#D4DFC5]">
               <i className="bi bi-shield-lock-fill text-2xl"></i>
              </div>

              <div>
                <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#7E8B63]">
                  Gestión ERP
                </p>

                <h1 className="text-5xl font-black text-[#1F2937] leading-none mt-1">
                  Usuarios
                </h1>
              </div>
            </div>

            <p className="text-gray-500 text-lg max-w-2xl">
              Administra usuarios, roles y permisos del sistema desde una
              interfaz limpia y centralizada.
            </p>
          </div>

          {/* SEARCH + ACTIONS */}
          <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto">

            {/* SEARCH */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full lg:w-[360px]
                  h-[58px]
                  rounded-2xl
                  border border-[#E5EBDD]
                  bg-white
                  pl-5 pr-14
                  text-sm
                  font-medium
                  text-gray-700
                  outline-none
                  transition-all
                  shadow-sm
                  focus:border-[#7E8B63]
                  focus:ring-4
                  focus:ring-[#7E8B63]/10
                "
              />

              <i className="bi bi-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg"></i>
            </div>

            {/* FILTRO */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="
                  h-[58px]
                  px-6
                  rounded-2xl
                  bg-white
                  border border-[#E5EBDD]
                  text-gray-700
                  font-semibold
                  flex items-center gap-3
                  shadow-sm
                  hover:border-[#7E8B63]
                  hover:bg-[#FAFBF8]
                  transition-all
                "
              >
                <i className="bi bi-sliders text-lg"></i>
                Filtrar
              </button>

              {/* DROPDOWN */}
              {showFilters && (
                <div
                  className="
                    absolute right-0 mt-3 w-[320px]
                    bg-white
                    border border-[#E8EDE0]
                    rounded-3xl
                    shadow-xl
                    p-6
                    z-50
                  "
                >
                  <div className="space-y-5">

                    {/* ESTADO */}
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">
                        Estado
                      </label>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="
                          w-full
                          rounded-2xl
                          border border-[#E5EBDD]
                          bg-[#EEF2E7]
                          px-4 py-3
                          outline-none
                          text-sm
                          font-medium
                        "
                      >
                        <option value="ALL">Todos</option>
                        <option value="ACTIVE">Activos</option>
                        <option value="INACTIVE">Inactivos</option>
                      </select>
                    </div>

                    {/* ROL */}
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">
                        Rol
                      </label>

                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="
                          w-full
                          rounded-2xl
                          border border-[#E5EBDD]
                          bg-[#FAFBF8]
                          px-4 py-3
                          outline-none
                          text-sm
                          font-medium
                        "
                      >
                        <option value="ALL">Todos</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="USER">Usuario</option>
                      </select>
                    </div>

                    {/* BOTONES */}
                    <div className="flex gap-3 pt-2">

                      <button
                        onClick={() => {
                          setStatusFilter("ALL");
                          setRoleFilter("ALL");
                        }}
                        className="
                          flex-1
                          py-3
                          rounded-2xl
                          border border-[#E5EBDD]
                          text-gray-600
                          font-semibold
                          hover:bg-gray-50
                          transition-all
                        "
                      >
                        Limpiar
                      </button>

                      <button
                        onClick={() => setShowFilters(false)}
                        className="
                          flex-1
                          py-3
                          rounded-2xl
                          bg-[#7E8B63]
                          text-white
                          font-semibold
                          hover:opacity-90
                          transition-all
                        "
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NUEVO */}
            <Can I="users:create">
              <button
                onClick={() => setIsModalOpen(true)}
                className="
                  h-[58px]
                  px-7
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#8FA878]
                  to-[#718355]
                  text-white
                  font-semibold
                  flex items-center gap-3
                  shadow-lg
                  hover:opacity-90
                  transition-all
                "
              >
                <i className="bi bi-person-plus-fill text-lg"></i>
                Nuevo Usuario
              </button>
            </Can>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Usuarios",
              val: usuarios.length,
              icon: "bi-people",
              color: "text-gray-700",
              bg: "bg-gray-100",
            },
            {
              label: "Activos",
              val: usuarios.filter((u) => u.activo).length,
              icon: "bi-check-circle-fill",
              color: "text-green-700",
              bg: "bg-green-100",
            },
            {
              label: "Admin",
              val: usuarios.filter((u) => u.role === "ADMIN").length,
              icon: "bi-shield-lock-fill",
              color: "text-[#7E8B63]",
              bg: "bg-[#EEF2E7]",
            },
            {
              label: "Inactivos",
              val: usuarios.filter((u) => !u.activo).length,
              icon: "bi-person-x-fill",
              color: "text-red-600",
              bg: "bg-red-100",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="
                bg-white
                border border-[#E5EBDD]
                rounded-[32px]
                p-7
                flex items-center justify-between
                shadow-sm
              "
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                  {stat.label}
                </p>

                <h3 className={`text-5xl font-black mt-2 ${stat.color}`}>
                  {stat.val}
                </h3>
              </div>

              <div
                className={`
                  w-16 h-16 rounded-2xl
                  flex items-center justify-center
                  ${stat.bg}
                `}
              >
                <i className={`bi ${stat.icon} text-2xl ${stat.color}`}></i>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#E5EBDD] rounded-[36px] shadow-sm overflow-hidden">

          {/* TOP BAR */}
          <div className="px-8 py-6 border-b border-[#EEF2E7] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-800">
                Lista de usuarios
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                {usuariosFiltrados.length} resultados encontrados
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFBF8] border-b border-[#EEF2E7]">
                  <th className="text-left pl-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Usuario
                  </th>

                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Contacto
                  </th>

                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Rol
                  </th>

                  <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Estado
                  </th>
                   <Can I="users:create">
                  <th className="text-center pr-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                    Acciones
                  </th>
                </Can>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-[#F3F5EF] hover:bg-[#FAFBF8] transition-all"
                    >

                      {/* USER */}
                      <td className="pl-10 py-6">
                        <div className="flex items-center gap-4">

                          <div
                           className="
                            w-14 h-14
                            rounded-2xl
                            bg-[#E8F0DD]
                            text-[#5F6F52]
                            flex items-center justify-center
                            font-bold
                            shadow-sm
                            border border-[#D7E4C0]
"
                          >
                            {u.nombre?.[0]}
                            {u.apellido?.[0]}
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-800">
                              {u.nombre} {u.apellido}
                            </h3>

                            <p className="text-xs text-gray-400 mt-1">
                              ID: {u.id.toString().slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACTO */}
                      <td>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-700">
                            {u.email}
                          </span>

                          <span className="text-xs text-gray-400">
                            @{u.usuario}
                          </span>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td>
                        <span
                          className={`
                            px-4 py-2 rounded-full text-xs font-bold border
                            ${
                              u.role === "ADMIN"
                                ? "bg-[#E8F0DD] text-[#5F6F52] border-[#D7E4C0]"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }
                          `}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* ESTADO */}
                      <td>
                        <div className="flex items-center gap-3">

                          <div
                            className={`
                              w-2.5 h-2.5 rounded-full
                              ${
                                u.activo
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }
                            `}
                          />

                          <span
                            className={`
                              text-sm font-bold
                              ${
                                u.activo
                                  ? "text-gray-800"
                                  : "text-gray-400"
                              }
                            `}
                          >
                            {u.activo ? "ACTIVO" : "INACTIVO"}
                          </span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="pr-10">

                         <Can I="users:create"> 
                        <div className="flex items-center justify-center gap-3">

                          <button
                            onClick={() => handleEditPermissions(u)}
                            className="
                              w-11 h-11
                              rounded-2xl
                              bg-blue-50
                              text-blue-600
                              hover:bg-blue-600
                              hover:text-white
                              transition-all
                            "
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          <button
                            onClick={() => confirmDelete(u)}
                            className="
                              w-11 h-11
                              rounded-2xl
                              bg-red-50
                              text-red-600
                              hover:bg-red-600
                              hover:text-white
                              transition-all
                            "
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                        </Can>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-28 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-[#F4F6F0] flex items-center justify-center mb-5">
                          <i className="bi bi-search text-4xl text-gray-300"></i>
                        </div>

                        <h3 className="text-xl font-bold text-gray-700">
                          Sin resultados
                        </h3>

                        <p className="text-gray-400 mt-2">
                          No existen usuarios que coincidan con el filtro.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODALES */}
        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUserAdded={cargarUsuarios}
        />

        {selectedUser && (
          <EditPermissionsModal
            isOpen={isEditPermsOpen}
            onClose={() => setIsEditPermsOpen(false)}
            user={selectedUser}
            onUpdate={cargarUsuarios}
          />
        )}

        <ConfirmAlert
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          onConfirm={handleDelete}
          title="Eliminar Usuario"
          message={`¿Deseas eliminar a ${userToDelete?.nombre}?`}
          confirmText="Eliminar"
          type="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}