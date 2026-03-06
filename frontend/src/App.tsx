import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeesPage from './pages/employees/EmployeesPage';
import CropsPage from './pages/crops/CropsPage';
import CropDetailPage from './pages/crops/CropDetailPage';
import LivestockPage from './pages/livestock/LivestockPage';
import LivestockDetailPage from './pages/livestock/LivestockDetailPage';
import MachineryPage from './pages/machinery/MachineryPage';
import MachineryDetailPage from './pages/machinery/MachineryDetailPage';
import MilkProductionPage from './pages/production/MilkProductionPage';
import EggProductionPage from './pages/production/EggProductionPage';
import HelpPage from './pages/help/HelpPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AuthenticatedApp() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected routes inside AppLayout */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/crops/:id" element={<CropDetailPage />} />
          <Route path="/livestock" element={<LivestockPage />} />
          <Route path="/livestock/:id" element={<LivestockDetailPage />} />
          <Route path="/machinery" element={<MachineryPage />} />
          <Route path="/machinery/:plate" element={<MachineryDetailPage />} />
          <Route path="/milk-production" element={<MilkProductionPage />} />
          <Route path="/egg-production" element={<EggProductionPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<AuthenticatedApp />} />
      </Routes>
    </BrowserRouter>
  );
}
