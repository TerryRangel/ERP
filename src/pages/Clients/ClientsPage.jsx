import { useClients } from "../../hooks/useClients";
import { useState } from "react";
import ClientFormModal from "../../components/ui/ClientFormModal";
import {Can }from "../../components/can.jsx";
import { includes } from "zod";
import  ConfirmAlert from "../../components/ui/Alert.jsx"; 

export default function ClientsPage() {
  const { clients, meta, loading, setFilters, createClient, updateClient, deleteClient, toggleClient } = useClients();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [search, setSearch] = useState("");
  const [clientToDelete, setClientToDelete] = useState(null);
  if (loading) return <div>Cargando...</div>;

  const filtredClients = clients.filter(c => {
    const text = `
    ${c.nombre || ""} 
    ${c.email || ""} 
    ${c.telefono || ""}
    `
    .toLowerCase();

    return text.includes(search.toLowerCase());
    
  });

  return (
  <div className="min-h-screen bg-[#F5F7F2] px-2 md:px-4 py-8 w-full">

    <div className="max-w-[2200px] mx-auto">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">

        <div>
          <div className="flex items-center gap-5 mb-4">

            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#DDE8CF] to-[#8FA878] text-[#5F6F52] flex items-center justify-center shadow-md border border-[#D4DFC5]">
              <i className="bi bi-people-fill text-2xl"></i>
            </div>

            <div>
              <p className="uppercase tracking-[0.35em] text-xs font-bold text-[#7E8B63]">
                Gestión ERP
              </p>

              <h1 className="text-5xl font-black text-[#1F2937] leading-none mt-1">
                Clientes
              </h1>
            </div>
          </div>

          <p className="text-gray-500 text-lg max-w-2xl">
            Administra y controla todos los clientes registrados en el sistema.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto">

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full lg:w-[460px]
                h-[58px]
                rounded-2xl
                border border-[#E5EBDD]
                bg-white
                !pl-5 !pr-14
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

          {/* NUEVO */}
          <Can I= "client:create">
          <button
            onClick={() => {
              setSelectedClient(null);
              setModalOpen(true);
            }}
            className="
              h-[58px]
              px-7
              rounded-2xl
              bg-[#1F2937]
              text-white
              font-semibold
              flex items-center gap-3
              shadow-lg
              hover:opacity-90
              transition-all
            "
            onClick = {() => {
              setSelectedClient(null)
              setModalOpen(true)
            }}
          >
            <i className="bi bi-plus-circle-fill"></i>
            Nuevo Cliente
          </button>
          </Can>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
              Total
            </p>

            <h3 className="text-5xl font-black mt-2 text-gray-700">
              {meta.total || 0}
            </h3>
          </div>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100">
            <i className="bi bi-people text-2xl text-gray-700"></i>
          </div>
        </div>

        <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
              Activos
            </p>

            <h3 className="text-5xl font-black mt-2 text-green-700">
              {clients.filter(c => c.activo).length}
            </h3>
          </div>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-100">
            <i className="bi bi-check-circle-fill text-2xl text-green-700"></i>
          </div>
        </div>

        <div className="bg-white border border-[#E5EBDD] rounded-[32px] p-7 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
              Inactivos
            </p>

            <h3 className="text-5xl font-black mt-2 text-red-600">
              {clients.filter(c => !c.activo).length}
            </h3>
          </div>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-100">
            <i className="bi bi-person-x-fill text-2xl text-red-600"></i>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#E5EBDD] rounded-[36px] shadow-sm overflow-hidden">

        <div className="px-8 py-6 border-b border-[#EEF2E7]">
          <h2 className="text-xl font-black text-gray-800">
            Lista de clientes
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            {filtredClients.length} resultados encontrados
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-[#FAFBF8] border-b border-[#EEF2E7]">

                <th className="text-left pl-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                  Cliente
                </th>

                <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                  Contacto
                </th>

                <th className="text-left py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                  Estado
                </th>
              <Can I= "client:create">
                <th className="text-center pr-10 py-5 text-xs uppercase tracking-widest text-gray-400 font-black">
                  Acciones
                </th>
              </Can>

              </tr>
            </thead>

            <tbody>

              {filtredClients.map((c) => (

                <tr
                  key={c.id}
                  className="border-b border-[#F3F5EF] hover:bg-[#FAFBF8] transition-all"
                >

                  {/* CLIENTE */}
                  <td className="pl-10 py-6">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-[#E8F0DD] text-[#5F6F52] flex items-center justify-center font-bold shadow-sm border border-[#D7E4C0]">
                        {c.nombre?.[0]}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800">
                          {c.nombre}
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                          ID: {c.id?.slice(0, 8)}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* CONTACTO */}
                  <td>
                    <div className="flex flex-col gap-1">

                      <span className="font-medium text-gray-700">
                        {c.email || "Sin email"}
                      </span>

                      <span className="text-xs text-gray-400">
                        {c.telefono || "Sin teléfono"}
                      </span>

                    </div>
                  </td>

                  {/* ESTADO */}
                  <td>

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          c.activo
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />

                      <span
                        className={`text-sm font-bold ${
                          c.activo
                            ? "text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {c.activo ? "ACTIVO" : "INACTIVO"}
                      </span>

                    </div>

                  </td>

                  {/* ACTIONS */}
                  <Can I= "client:create">
                  <td className="pr-10">

                    <div className="flex items-center justify-center gap-3">

                      <button
                        onClick={() => {
                          setSelectedClient(c);
                          setModalOpen(true);
                        }}
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
                        onClick={() => toggleClient(c)}
                        className="
                          w-11 h-11
                          rounded-2xl
                          bg-yellow-50
                          text-yellow-600
                          hover:bg-yellow-500
                          hover:text-white
                          transition-all
                        "
                      >
                        <i className="bi bi-arrow-repeat"></i>
                      </button>

                      <button
                        onClick={() => setClientToDelete(c)}
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

                  </td>
                  </Can>

                </tr>

              ))}
             

            </tbody>

          </table>

        </div>

      </div>
    </div>

          {/* MODAL FORMULARIO */}
      <ClientFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedClient(null);
        }}
        initialData={selectedClient}
        onSubmit={async (data) => {
          if (selectedClient) {
            await updateClient(selectedClient.id, data);
          } else {
            await createClient(data);
          }

          setModalOpen(false);
          setSelectedClient(null);
        }}
      />

      {/* MODAL DELETE */}
      {clientToDelete && (
        <ConfirmAlert
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={async () => {
          if (clientToDelete) {
            await deleteClient(clientToDelete.id);
            setClientToDelete(null);
          }
        }}
        title="Eliminar cliente"
        message={`¿Deseas eliminar a ${clientToDelete?.nombre}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
      )}
  </div>
);
}