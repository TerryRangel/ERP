import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/dashboard';
import UsersPage from '../pages/Users/UsersPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Cualquier otra ruta te manda al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}