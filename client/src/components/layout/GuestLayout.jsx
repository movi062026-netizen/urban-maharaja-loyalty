import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Crown, CreditCard, Gift, User, History, Star, LogOut } from 'lucide-react';

const guestLinks = [
  { to: '/maharaja-card', label: 'My Card', icon: CreditCard },
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
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Top Bar */}
      <header className="bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 text-on-surface sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-8 h-8 rounded-lg bg-surface-container border border-primary/40 flex items-center justify-center shadow-[0_2px_10px_rgba(222,107,144,0.25)]">
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-sm font-bold text-on-surface tracking-wider group-hover:text-primary transition-colors">
              URBAN MAHARAJA
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant font-medium">{user?.name || user?.phone || 'Guest Patron'}</span>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-28 flex-1 w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 z-50" role="navigation" aria-label="Guest navigation">
        <div className="max-w-lg mx-auto flex justify-around py-1">
          {guestLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center py-2 px-3 text-[11px] font-semibold tracking-wider uppercase no-underline transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant/70 hover:text-on-surface'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary scale-110' : 'text-on-surface-variant/60'} transition-transform`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
