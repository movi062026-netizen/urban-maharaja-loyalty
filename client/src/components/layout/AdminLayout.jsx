import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Crown, LayoutDashboard, Users, Stamp, Gift, ShoppingBag,
  Settings, BarChart3, ScrollText, UserCog, Menu, X, LogOut,
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  { to: '/admin/staff', label: 'Staff Credentials', icon: UserCog },
  { to: '/admin/rewards', label: 'Rewards Manager', icon: Gift },
  { to: '/admin/analytics', label: 'Palace Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Platform Settings', icon: Settings },
  { to: '/admin/audit-logs', label: 'Security & Audit', icon: ScrollText },
  { to: '/admin/guests', label: 'Patrons Registry', icon: Users },
  { to: '/admin/stamps', label: 'Master Stamp Desk', icon: Stamp },
  { to: '/admin/redemptions', label: 'Master Redemptions', icon: ShoppingBag },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen min-h-dvh bg-background text-on-surface flex overflow-x-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 glass-sidebar text-on-surface transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        role="navigation"
        aria-label="Admin Navigation"
      >
        {/* Brand */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/30">
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c99a4e] via-[#deb268] to-[#996d2b] p-[2px] shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center border border-[#d4a66a]/40">
                  <Crown className="w-4 h-4 text-[#9b284e]" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-serif text-sm font-bold text-on-surface tracking-wider group-hover:text-primary transition-colors truncate">
                  URBAN MAHARAJA
                </div>
                <div className="text-[10px] text-secondary font-mono tracking-[0.2em] uppercase font-bold">
                  Imperial Admin
                </div>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              aria-label="Close sidebar"
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-bold no-underline transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-[0_6px_20px_-3px_rgba(155,40,78,0.4)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/80 border border-transparent hover:border-outline-variant/40'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-secondary'}`} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low/70">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-on-surface truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-primary font-mono uppercase tracking-wider truncate font-semibold">{user?.role || 'Imperial Master'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary cursor-pointer border border-transparent hover:border-outline-variant/40"
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
        <header className="glass-navbar px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-30" role="banner">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-serif tracking-wider text-primary uppercase font-semibold">
                Admin Governance Terminal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg glass-surface text-[10px] sm:text-xs text-on-surface-variant hover:text-secondary transition-colors no-underline font-medium"
            >
              <span>Main Site</span>
              <span className="text-[10px]" aria-hidden="true">↗</span>
            </Link>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full glass-chip-rose flex items-center justify-center">
              <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
