import { useClients } from "../../hooks/useClients";
import { useState } from "react";
import ClientFormModal from "../../components/ui/ClientFormModal";

export default function ClientsPage() {
  const { clients, loading, createClient, updateClient, deleteClient, toggleClient } = useClients();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6">

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Clientes</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedClient(null);
            setModalOpen(true);
          }}
        >
          + Nuevo Cliente
        </button>
      </div>

      <table className="table w-full bg-base-100 rounded-xl shadow">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td> 
              <td>{c.email}</td>
              <td>
                <span className={`badge gap-2 ${c.activo ? "badge-success" : "badge-error"}`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {c.activo ? "Activo" : "Inactivo"}
                </span>
              </td>

              <td className="flex gap-2">

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setSelectedClient(c);
                    setModalOpen(true);
                  }}
                >
                  Editar
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => toggleClient(c)}
                >
                  Estado
                </button>

                <button
                  className="btn btn-error btn-sm"
                  onClick={() => deleteClient(c.id)}
                >
                  Eliminar
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ClientFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedClient}
        onSubmit={(data) => {
          if (selectedClient) {
            updateClient(selectedClient.id, data);
          } else {
            createClient(data);
          }
        }}
      />
    </div>
  );
}