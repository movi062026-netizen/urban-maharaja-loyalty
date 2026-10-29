import { lazy, Suspense } from 'react';
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
import TermsPage from '../pages/public/TermsPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import AdminLoginPage from '../pages/public/AdminLoginPage';
import StaffLoginPage from '../pages/public/StaffLoginPage';

// Guest Pages
const MaharajaCardPage = lazy(() => import('../pages/guest/MaharajaCardPage'));
const GuestStampsPage = lazy(() => import('../pages/guest/GuestStampsPage'));
const RewardsPage = lazy(() => import('../pages/guest/RewardsPage'));
const ProfilePage = lazy(() => import('../pages/guest/ProfilePage'));
const HistoryPage = lazy(() => import('../pages/guest/HistoryPage'));
const ReviewPage = lazy(() => import('../pages/guest/ReviewPage'));
const MyBookingsPage = lazy(() => import('../pages/guest/MyBookingsPage'));

// Staff Pages
const StaffDashboardPage = lazy(() => import('../pages/staff/StaffDashboardPage'));
const StaffBookingsPage = lazy(() => import('../pages/staff/StaffBookingsPage'));
const StaffStampsPage = lazy(() => import('../pages/staff/StaffStampsPage'));
const StaffRedemptionsPage = lazy(() => import('../pages/staff/StaffRedemptionsPage'));
const StaffGuestsPage = lazy(() => import('../pages/staff/StaffGuestsPage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const AdminBookingsPage = lazy(() => import('../pages/admin/BookingsPage'));
const AdminStaffPage = lazy(() => import('../pages/admin/StaffPage'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage'));
const AdminRewardsPage = lazy(() => import('../pages/admin/RewardsPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
const AdminAuditLogsPage = lazy(() => import('../pages/admin/AuditLogsPage'));
const AdminGuestsPage = lazy(() => import('../pages/admin/GuestsPage'));
const AdminStampsPage = lazy(() => import('../pages/admin/StampsPage'));
const AdminRedemptionsPage = lazy(() => import('../pages/admin/RedemptionsPage'));

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* ── Public Routes ────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/loyalty" element={<LoyaltyLandingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
      </Route>

      {/* Authentication Portals (Distinct for Customers, Staff, and Admin) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/staff/login" element={<StaffLoginPage />} />

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
        <Route path="/guest/bookings" element={<MyBookingsPage />} />

        {/* Dedicated Stamp & Seal Tracker Desk */}
        <Route path="/guest/stamps" element={<GuestStampsPage />} />
        <Route path="/guest/stamp" element={<GuestStampsPage />} />
        <Route path="/guest/stemp" element={<GuestStampsPage />} />
        <Route path="/guest/step" element={<GuestStampsPage />} />
        <Route path="/stamps" element={<Navigate to="/guest/stamps" replace />} />
        <Route path="/stemp" element={<Navigate to="/guest/stamps" replace />} />
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
        <Route path="/staff/bookings" element={<StaffBookingsPage />} />
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
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
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
    </Suspense>
  );
}
