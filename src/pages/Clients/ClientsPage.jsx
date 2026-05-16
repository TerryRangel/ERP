import { useClients } from "../../hooks/useClients";

export default function ClientsPage() {
    const { clients, loading } = useClients();

    if (loading) {
        return (
        <div> Cargando Clientes... </div>
        );
    }

     return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>
                {c.active ? "Activo" : "Inactivo"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
    
