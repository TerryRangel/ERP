import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RequirePermission from '../components/RequirePermission.jsx'; 
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/dashboard';
import UsersPage from '../pages/Users/UsersPage';
import AuditPage from '../pages/Audit/AuditPage';
import SuppliersPage from '../pages/Suppliers/SuppliersPage';
import ProductsPage from '../pages/Products/ProductsPage';
import ClientsPage from '../pages/Clients/ClientsPage'; 
import NoAutorizado from '../components/layout/nopermission';
import InventoryPage from '../pages/Inventory/InventoryPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* --- RUTAS BLINDADAS POR PERMISOS --- */}
          <Route 
            path="/users" 
            element={
              <RequirePermission I="users:read">
                <UsersPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/audit" 
            element={
              <RequirePermission I="audit:read">
                <AuditPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/suppliers" 
            element={
              <RequirePermission I="suppliers:read">
                <SuppliersPage />
              </RequirePermission>
            } 
          />
          
          <Route 
            path="/products" 
            element={
              <RequirePermission I="products:read">
                <ProductsPage />
              </RequirePermission>
            } 
          />

          <Route 
            path='/clients'
            element={
              <RequirePermission I="clients:read">
                <ClientsPage />
              </RequirePermission>
            }
          />

          <Route 
            path='/inventory'
            element={
              <RequirePermission I="inventory:read">
                <InventoryPage />
              </RequirePermission>
            }
          />
          {/* ------------------------------------ */}

          <Route path="/no-autorizado" element={<NoAutorizado />} />

          {/* El comodín (*) SIEMPRE debe ir al final de la lista */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Cualquier otra ruta te manda al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}