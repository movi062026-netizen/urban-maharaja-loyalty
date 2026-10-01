import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/about', label: 'Our Story' },
  { to: '/menu', label: 'Royal Menu' },
  { to: '/loyalty', label: 'Maharaja Card' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleUserClick = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (user.role === 'STAFF') {
      navigate('/staff/dashboard');
    } else {
      navigate('/guest/card');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-navbar shadow-lg'
          : 'bg-surface/80 backdrop-blur-md border-b border-outline-variant/20'
      }`}
      role="banner"
    >
      <nav className="h-16 sm:h-18 lg:h-20 max-w-[1280px] mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between gap-2 sm:gap-4" aria-label="Main Navigation">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group no-underline shrink-0" aria-label="Urban Maharaja Home">
          <div className="relative flex items-center justify-center shrink-0">
            <div className="absolute -inset-1.5 rounded-full bg-primary-container/30 blur-md group-hover:bg-primary/50 transition-all" />
            <img
              alt="Urban Maharaja logo"
              className="relative h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 object-cover rounded-full border border-primary/40 shadow-sm"
              src="/logo.png"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-xs sm:text-sm lg:text-base uppercase tracking-[0.12em] sm:tracking-[0.16em] text-primary font-bold whitespace-nowrap">
              URBAN MAHARAJA
            </span>
            <span className="text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-secondary font-semibold whitespace-nowrap">
              A FINE DINE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-3 shrink" aria-label="Primary Navigation">
          {navLinks.map(({ to, label }, index) => {
            const isActive = location.pathname === to;
            return (
              <span key={to} className="flex items-center gap-1 xl:gap-3">
                <Link
                  to={to}
                  className={`text-[11px] xl:text-xs uppercase tracking-[0.1em] xl:tracking-[0.12em] transition-all py-1.5 px-2 xl:px-3 rounded-lg no-underline font-semibold whitespace-nowrap ${
                    isActive
                      ? 'glass-chip-rose text-primary font-bold'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
                {index < navLinks.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-outline-variant/60 hidden xl:block" aria-hidden="true" />
                )}
              </span>
            );
          })}
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.14em] px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-full glass-btn-secondary no-underline whitespace-nowrap"
          >
            Reserve Table
          </Link>

          {!user ? (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center justify-center text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.14em] px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-full glass-btn-primary no-underline whitespace-nowrap"
            >
              Card Login
            </Link>
          ) : (
            <Link
              to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'STAFF' ? '/staff/dashboard' : '/guest/card'}
              className="hidden md:inline-flex items-center justify-center text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.14em] px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-full glass-btn-primary no-underline whitespace-nowrap"
            >
              {user.role === 'ADMIN' ? 'Admin Portal' : user.role === 'STAFF' ? 'Staff Portal' : 'My Card'}
            </Link>
          )}

          {/* User Profile Avatar / Action Button */}
          <button
            onClick={handleUserClick}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer border border-primary-fixed shrink-0"
            title={user ? `${user.name} (${user.role})` : 'Log In'}
            aria-label="User Account"
          >
            <span className="material-symbols-outlined text-on-primary text-[16px] sm:text-[19px]">person</span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-surface-container-high/60 text-primary border border-primary/20 hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden glass-sidebar border-t border-outline-variant/30 px-4 sm:px-6 py-5 sm:py-6 space-y-4 animate-slideUp max-h-[calc(100vh-4rem)] max-h-[calc(100dvh-4rem)] overflow-y-auto"
          role="navigation"
          aria-label="Mobile Navigation"
        >
          <div className="flex flex-col space-y-1.5">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-xl text-xs uppercase tracking-wider no-underline transition-colors font-bold ${
                location.pathname === '/' ? 'glass-chip-rose text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-xs uppercase tracking-wider no-underline transition-colors font-bold ${
                  location.pathname === to ? 'glass-chip-rose text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
                aria-current={location.pathname === to ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 rounded-full glass-btn-secondary text-xs uppercase tracking-[0.16em] font-bold no-underline"
            >
              Reserve Table
            </Link>
            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-full glass-btn-primary text-xs uppercase tracking-[0.16em] font-bold no-underline"
              >
                Maharaja Card Login
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'STAFF' ? '/staff/dashboard' : '/guest/card'}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-3 rounded-full glass-btn-primary text-xs uppercase tracking-[0.16em] font-bold no-underline"
                >
                  {user.role === 'ADMIN' ? 'Admin Portal' : user.role === 'STAFF' ? 'Staff Portal' : 'My Maharaja Card'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 rounded-full glass-surface text-on-surface-variant text-xs uppercase tracking-wider hover:text-error cursor-pointer font-bold"
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
