import { useDashboard } from "../../hooks/useDashboard";

export default function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner loading-lg text-pink-600"></span>
      </div>
    );
  }

  console.log("Dashboard renderizado");

  return (
    <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
    
    {/* Tarjetas de métricas */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium">Total Usuarios</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{data?.totalUsers || 0}</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium">Total Clientes</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{data?.totalClients || 0}</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium">Proveedores</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{data?.totalSuppliers || 0}</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium">Productos Tejidos</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{data?.totalProducts || 0}</p>
      </div>
    </div>
  </div>
  );  
}