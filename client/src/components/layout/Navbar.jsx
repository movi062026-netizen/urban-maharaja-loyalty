import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/about', label: 'Our Story' },
  { to: '/menu', label: 'Royal Menu' },
  { to: '/loyalty', label: 'Maharaja Card' },
  { to: '/contact', label: 'Contact & Reservations' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleUserClick = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'ADMIN' || user.role === 'STAFF') {
      navigate('/admin/dashboard');
    } else {
      navigate('/guest/card');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-md shadow-[0_16px_36px_-8px_rgba(24,10,12,0.8),0_0_24px_0_rgba(222,107,144,0.18)] border-b border-outline-variant/30">
      <div className="h-20 max-w-[1200px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-4 group no-underline" aria-label="Urban Maharaja Home">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1.5 rounded-full bg-primary-container/30 blur-md group-hover:bg-primary/50 transition-all"></div>
            <img
              alt="Urban Maharaja logo"
              className="relative h-11 w-11 object-cover rounded-full border border-primary/40 shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcf8UOcN3_RUOnQhyxQhP2ixS08rMuoDfsKJGu59mnvG3HcqH_qs-FH3y4xM--xZ-45mAtObqgjZQRyJl9cHBE8hqzAiz59PvgfwvFLLuISA_UBWPHMMO1KqosgQ3d0J8iGNRewiGlSQR6eEDsAp9GCssgRPpnSxlt62cdJuOZ5LSeUW1-IY500nVNnMupWUNAeivZl3IVxpuZx9Oz_0FRzUojPZrvGMsVzad6lN_R_rAepPUIBLjXog"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm uppercase tracking-[0.22em] text-primary font-bold drop-shadow-[0_2px_12px_rgba(222,107,144,0.4)]">
              URBAN MAHARAJA
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.24em] text-secondary font-semibold">
              A FINE DINE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6" aria-label="Primary Navigation">
          {navLinks.map(({ to, label }, index) => {
            const isActive = location.pathname === to;
            return (
              <span key={to} className="flex items-center gap-6">
                <Link
                  to={to}
                  className={`font-label-lg text-label-lg uppercase tracking-[0.14em] transition-all py-1.5 px-3 rounded-lg no-underline ${
                    isActive
                      ? 'bg-surface-container-high text-primary font-semibold shadow-inner'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'
                  }`}
                >
                  {label}
                </Link>
                {index < navLinks.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                )}
              </span>
            );
          })}
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center font-label-md text-label-md uppercase tracking-[0.16em] px-5 py-2.5 rounded-full bg-surface-container-high/80 text-primary hover:bg-primary hover:text-on-primary border border-primary/30 shadow-lg transition-all duration-300 no-underline font-semibold"
          >
            Reserve Table
          </Link>

          {!user ? (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center justify-center font-label-md text-label-md uppercase tracking-[0.16em] px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest font-bold shadow-[0_4px_18px_rgba(222,107,144,0.35)] hover:brightness-110 transition-all duration-300 no-underline"
            >
              Maharaja Card Login
            </Link>
          ) : (
            <Link
              to={user.role === 'ADMIN' || user.role === 'STAFF' ? '/admin/dashboard' : '/guest/card'}
              className="hidden md:inline-flex items-center justify-center font-label-md text-label-md uppercase tracking-[0.16em] px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest font-bold shadow-[0_4px_18px_rgba(222,107,144,0.35)] hover:brightness-110 transition-all duration-300 no-underline"
            >
              {user.role === 'ADMIN' ? 'Admin Portal' : user.role === 'STAFF' ? 'Staff Portal' : 'My Maharaja Card'}
            </Link>
          )}

          {/* User Profile Avatar / Action Button */}
          <button
            onClick={handleUserClick}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer border border-primary-fixed"
            title={user ? `${user.name} (${user.role})` : 'Log In'}
            aria-label="User Account"
          >
            <span className="material-symbols-outlined text-on-primary text-[19px]">person</span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-xl bg-surface-container-high/60 text-primary border border-primary/20 hover:bg-surface-container-high transition-colors"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="xl:hidden bg-surface-container-low/95 backdrop-blur-2xl border-t border-outline-variant/30 px-6 py-6 space-y-4 animate-slideUp">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-xl font-label-lg text-label-lg uppercase tracking-wider no-underline transition-colors ${
                location.pathname === '/' ? 'bg-surface-container-high text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Home
            </Link>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl font-label-lg text-label-lg uppercase tracking-wider no-underline transition-colors ${
                  location.pathname === to ? 'bg-surface-container-high text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 rounded-full bg-surface-container-high text-primary font-label-md uppercase tracking-[0.16em] font-semibold border border-primary/30 no-underline"
            >
              Reserve Table
            </Link>
            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest font-label-md uppercase tracking-[0.16em] font-bold shadow-lg no-underline"
              >
                Maharaja Card Login
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  to={user.role === 'ADMIN' || user.role === 'STAFF' ? '/admin/dashboard' : '/guest/card'}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-3 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest font-label-md uppercase tracking-[0.16em] font-bold shadow-lg no-underline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="px-5 py-3 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm uppercase tracking-wider hover:text-error"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
