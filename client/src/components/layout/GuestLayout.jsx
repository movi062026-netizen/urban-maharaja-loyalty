import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Crown, CreditCard, Gift, User, History, Star, LogOut } from 'lucide-react';

const guestLinks = [
  { to: '/maharaja-card', label: 'Maharaja Card', icon: CreditCard },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/review', label: 'Review', icon: Star },
];

export default function GuestLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Bar */}
      <header className="bg-deep-brown text-white sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Crown className="w-5 h-5 text-royal-gold" />
            <span className="font-serif text-sm text-white tracking-wide">URBAN MAHARAJA</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60">{user?.name || 'Guest'}</span>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-beige z-50" role="navigation" aria-label="Guest navigation">
        <div className="max-w-lg mx-auto flex justify-around">
          {guestLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center py-2 px-2 text-xs no-underline transition-colors ${
                  isActive ? 'text-royal-rose' : 'text-deep-brown/40 hover:text-deep-brown/70'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-royal-rose' : ''}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
