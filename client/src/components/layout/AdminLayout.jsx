import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Crown, LayoutDashboard, Users, Stamp, Gift, ShoppingBag,
  Settings, BarChart3, ScrollText, UserCog, Menu, X, LogOut,
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/guests', label: 'Guests', icon: Users },
  { to: '/admin/stamps', label: 'Stamps', icon: Stamp },
  { to: '/admin/rewards', label: 'Rewards', icon: Gift },
  { to: '/admin/redemptions', label: 'Redemptions', icon: ShoppingBag },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
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
    <div className="min-h-screen bg-cream-dark flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 admin-sidebar text-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link to="/admin/dashboard" className="flex items-center gap-2 no-underline">
                <Crown className="w-6 h-6 text-royal-gold" />
                <div>
                  <div className="font-serif text-sm text-white tracking-wide">URBAN MAHARAJA</div>
                  <div className="text-[10px] text-royal-gold/70 tracking-[0.15em]">ADMIN PANEL</div>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sidebarLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-all ${
                    isActive
                      ? 'bg-royal-gold/20 text-royal-gold font-medium'
                      : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">{user?.name}</p>
                <p className="text-xs text-white/40">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-warm-beige px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-warm-beige/30"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-deep-brown" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-8 h-8 rounded-full bg-royal-rose/10 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-royal-rose" />
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
