import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Crown, LayoutDashboard, Stamp, ShoppingBag, Users,
  Menu, X, LogOut, Sparkles, UserCheck
} from 'lucide-react';

const staffLinks = [
  { to: '/staff/dashboard', label: 'Floor Overview', icon: LayoutDashboard },
  { to: '/staff/stamps', label: 'Stamp & Seal Desk', icon: Stamp, badge: 'Live Desk' },
  { to: '/staff/redemptions', label: 'Voucher Redemptions', icon: ShoppingBag },
  { to: '/staff/guests', label: 'Patron Directory', icon: Users },
];

export default function StaffLayout() {
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
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Staff Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-container-lowest/95 border-r border-outline-variant/30 backdrop-blur-2xl text-on-surface transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-outline-variant/30">
          <div className="flex items-center justify-between">
            <Link to="/staff/dashboard" className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-secondary/40 flex items-center justify-center shadow-[0_4px_16px_rgba(228,193,148,0.25)] group-hover:scale-105 transition-transform">
                <Crown className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="font-serif text-sm font-bold text-on-surface tracking-wider group-hover:text-secondary transition-colors">
                  URBAN MAHARAJA
                </div>
                <div className="text-[10px] text-secondary font-mono tracking-[0.2em] uppercase font-semibold">
                  Floor Concierge
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

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          {staffLinks.map(({ to, label, icon: Icon, badge }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold no-underline transition-all ${
                  isActive
                    ? 'bg-secondary/20 text-secondary border border-secondary/35 shadow-[0_4px_14px_rgba(228,193,148,0.2)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/25 text-secondary border border-secondary/30 font-bold lowercase">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Staff User Card */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container/50">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-on-surface truncate">{user?.name || 'Floor Officer'}</p>
              <p className="text-[10px] text-secondary font-mono uppercase tracking-wider truncate flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-secondary" />
                <span>Active Floor Staff</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-secondary cursor-pointer"
              title="Sign Out"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 px-4 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-secondary" />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-serif tracking-wider text-secondary uppercase font-semibold">
                Floor Service &amp; Loyalty Terminal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant hover:text-secondary transition-colors no-underline font-medium"
            >
              <span>Palace Website</span>
              <span className="text-[10px]">↗</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-xs">
              {(user?.name || 'S').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 w-full flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
