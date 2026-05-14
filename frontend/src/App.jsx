import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PetsPage from './pages/PetsPage';
import ChatPage from './pages/ChatPage';
import ShopPage from './pages/ShopPage';
import FreshFoodPage from './pages/FreshFoodPage';
import AdminPage from './pages/AdminPage';
import VetsPage from './pages/VetsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import ConsultationPage from './pages/ConsultationPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="pets" element={<PetsPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="fresh-food" element={<FreshFoodPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="vets" element={<VetsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="doctor-dashboard" element={<DoctorDashboardPage />} />
        <Route path="consultation/:appointmentId" element={<ConsultationPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

