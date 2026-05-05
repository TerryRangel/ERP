import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data, loading } = useDashboard();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }


  if (loading) return <div>CARGAAAA...</div>;


  console.log("Dashboard renderizado");

  return (
     <div className="p-6">
      <button
        onClick={handleLogout}
        className="btn btn-error mb-4"
      >
        Cerrar sesión
      </button>

      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
   
  );  
}