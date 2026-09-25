import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import GuestLayout from '../components/layout/GuestLayout';
import StaffLayout from '../components/layout/StaffLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import MenuPage from '../pages/public/MenuPage';
import ContactPage from '../pages/public/ContactPage';
import LoyaltyLandingPage from '../pages/public/LoyaltyLandingPage';
import LoginPage from '../pages/public/LoginPage';
import AdminLoginPage from '../pages/public/AdminLoginPage';

// Guest Pages
import MaharajaCardPage from '../pages/guest/MaharajaCardPage';
import RewardsPage from '../pages/guest/RewardsPage';
import ProfilePage from '../pages/guest/ProfilePage';
import HistoryPage from '../pages/guest/HistoryPage';
import ReviewPage from '../pages/guest/ReviewPage';

// Staff Pages
import StaffDashboardPage from '../pages/staff/StaffDashboardPage';
import StaffStampsPage from '../pages/staff/StaffStampsPage';
import StaffRedemptionsPage from '../pages/staff/StaffRedemptionsPage';
import StaffGuestsPage from '../pages/staff/StaffGuestsPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/DashboardPage';
import AdminStaffPage from '../pages/admin/StaffPage';
import AdminAnalyticsPage from '../pages/admin/AnalyticsPage';
import AdminRewardsPage from '../pages/admin/RewardsPage';
import AdminSettingsPage from '../pages/admin/SettingsPage';
import AdminAuditLogsPage from '../pages/admin/AuditLogsPage';
import AdminGuestsPage from '../pages/admin/GuestsPage';
import AdminStampsPage from '../pages/admin/StampsPage';
import AdminRedemptionsPage from '../pages/admin/RedemptionsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/loyalty" element={<LoyaltyLandingPage />} />
      </Route>

      {/* Authentication Portals (Distinct for Customers & Staff/Admin) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/staff/login" element={<AdminLoginPage defaultRole="STAFF" />} />

      {/* ── GUEST / PATRON ROUTES (Distinguished under /guest/*) ── */}
      <Route
        element={
          <ProtectedRoute roles={['GUEST']}>
            <GuestLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/guest" element={<Navigate to="/guest/card" replace />} />
        <Route path="/guest/dashboard" element={<Navigate to="/guest/card" replace />} />
        <Route path="/guest/card" element={<MaharajaCardPage />} />
        <Route path="/guest/rewards" element={<RewardsPage />} />
        <Route path="/guest/history" element={<HistoryPage />} />
        <Route path="/guest/profile" element={<ProfilePage />} />
        <Route path="/guest/review" element={<ReviewPage />} />

        {/* Backward Compatibility & Convenience Aliases */}
        <Route path="/guest/stamps" element={<MaharajaCardPage />} />
        <Route path="/guest/stamp" element={<MaharajaCardPage />} />
        <Route path="/guest/stemp" element={<MaharajaCardPage />} />
        <Route path="/guest/step" element={<MaharajaCardPage />} />
        <Route path="/stamps" element={<Navigate to="/guest/card" replace />} />
        <Route path="/stemp" element={<Navigate to="/guest/card" replace />} />
        <Route path="/maharaja-card" element={<Navigate to="/guest/card" replace />} />
        <Route path="/rewards" element={<Navigate to="/guest/rewards" replace />} />
        <Route path="/history" element={<Navigate to="/guest/history" replace />} />
        <Route path="/profile" element={<Navigate to="/guest/profile" replace />} />
        <Route path="/review" element={<Navigate to="/guest/review" replace />} />
      </Route>

      {/* ── FLOOR STAFF CONCIERGE ROUTES (Distinguished under /staff/*) ── */}
      <Route
        element={
          <ProtectedRoute roles={['STAFF']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
        <Route path="/staff/stamps" element={<StaffStampsPage />} />
        <Route path="/staff/stemp" element={<Navigate to="/staff/stamps" replace />} />
        <Route path="/staff/redemptions" element={<StaffRedemptionsPage />} />
        <Route path="/staff/guests" element={<StaffGuestsPage />} />
      </Route>

      {/* ── SUPER ADMIN GOVERNANCE ROUTES (Distinguished under /admin/*) ── */}
      <Route
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/staff" element={<AdminStaffPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/rewards" element={<AdminRewardsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="/admin/guests" element={<AdminGuestsPage />} />
        <Route path="/admin/stamps" element={<AdminStampsPage />} />
        <Route path="/admin/stemp" element={<Navigate to="/admin/stamps" replace />} />
        <Route path="/admin/redemptions" element={<AdminRedemptionsPage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
