import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Crown, LayoutDashboard, Users, Stamp, Gift, ShoppingBag,
  Settings, BarChart3, ScrollText, UserCog, Menu, X, LogOut,
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/guests', label: 'Guests & Patrons', icon: Users },
  { to: '/admin/stamps', label: 'Stamp Desk', icon: Stamp },
  { to: '/admin/rewards', label: 'Reward Catalog', icon: Gift },
  { to: '/admin/redemptions', label: 'Redemptions', icon: ShoppingBag },
  { to: '/admin/analytics', label: 'Analytics & Trends', icon: BarChart3 },
  { to: '/admin/staff', label: 'Staff Credentials', icon: UserCog, adminOnly: true },
  { to: '/admin/settings', label: 'Platform Settings', icon: Settings, adminOnly: true },
  { to: '/admin/audit-logs', label: 'Audit Trail', icon: ScrollText, adminOnly: true },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex overflow-x-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-container-lowest/95 border-r border-outline-variant/30 backdrop-blur-2xl text-on-surface transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-outline-variant/30">
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-primary/40 flex items-center justify-center shadow-[0_4px_16px_rgba(222,107,144,0.25)]">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-serif text-sm font-bold text-on-surface tracking-wider group-hover:text-primary transition-colors">
                  URBAN MAHARAJA
                </div>
                <div className="text-[10px] text-secondary font-mono tracking-[0.2em] uppercase">
                  Terminal 2026
                </div>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          {sidebarLinks
            .filter((item) => !item.adminOnly || user?.role === 'ADMIN')
            .map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold no-underline transition-all ${
                  isActive
                    ? 'bg-primary-container/25 text-primary border border-primary/30 shadow-[0_4px_14px_rgba(222,107,144,0.2)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container/50">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-on-surface truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-secondary font-mono uppercase tracking-wider truncate">{user?.role || 'Staff'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-primary cursor-pointer"
              title="Sign Out"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-primary" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant hover:text-secondary transition-colors no-underline"
            >
              <span>Main Site</span>
              <span className="text-[10px]">↗</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
