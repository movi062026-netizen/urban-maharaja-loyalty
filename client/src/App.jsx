import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import GuestLayout from './components/layout/GuestLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import MenuPage from './pages/public/MenuPage';
import ContactPage from './pages/public/ContactPage';
import LoyaltyLandingPage from './pages/public/LoyaltyLandingPage';
import LoginPage from './pages/public/LoginPage';
import AdminLoginPage from './pages/public/AdminLoginPage';

// Guest Pages
import MaharajaCardPage from './pages/guest/MaharajaCardPage';
import RewardsPage from './pages/guest/RewardsPage';
import ProfilePage from './pages/guest/ProfilePage';
import HistoryPage from './pages/guest/HistoryPage';
import ReviewPage from './pages/guest/ReviewPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import GuestsPage from './pages/admin/GuestsPage';
import StampsPage from './pages/admin/StampsPage';
import AdminRewardsPage from './pages/admin/RewardsPage';
import RedemptionsPage from './pages/admin/RedemptionsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import StaffPage from './pages/admin/StaffPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#3E2723',
              color: '#FFF8F0',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
            success: {
              iconTheme: { primary: '#C5A572', secondary: '#FFF8F0' },
            },
            error: {
              iconTheme: { primary: '#E53935', secondary: '#FFF8F0' },
            },
          }}
        />

        <Routes>
          {/* ── Public Routes ────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/loyalty" element={<LoyaltyLandingPage />} />
          </Route>

          {/* Auth (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ── Guest Routes ─────────────────────────── */}
          <Route element={
            <ProtectedRoute roles={['GUEST']}>
              <GuestLayout />
            </ProtectedRoute>
          }>
            <Route path="/maharaja-card" element={<MaharajaCardPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/review" element={<ReviewPage />} />
          </Route>

          {/* ── Admin/Staff Routes ────────────────────── */}
          <Route element={
            <ProtectedRoute roles={['ADMIN', 'STAFF']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/guests" element={<GuestsPage />} />
            <Route path="/admin/stamps" element={<StampsPage />} />
            <Route path="/admin/rewards" element={<AdminRewardsPage />} />
            <Route path="/admin/redemptions" element={<RedemptionsPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/staff" element={<StaffPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
