import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Crown } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Our Story' },
  { to: '/menu', label: 'Menu' },
  { to: '/loyalty', label: 'Maharaja Card' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline" aria-label="Urban Maharaja Home">
            <Crown className="w-7 h-7 text-royal-gold" />
            <div className="leading-tight">
              <span className="font-serif text-lg font-bold text-deep-brown tracking-wide">URBAN MAHARAJA</span>
              <span className="hidden sm:block text-xs text-royal-rose tracking-[0.2em] uppercase">A Fine Dine</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 no-underline ${
                  location.pathname === to
                    ? 'text-royal-rose bg-royal-rose/10'
                    : 'text-deep-brown/70 hover:text-royal-rose hover:bg-royal-rose/5'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link to="/login" className="btn-royal ml-4 text-sm no-underline px-5 py-2">
              Login
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-warm-beige/30 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6 text-deep-brown" /> : <Menu className="w-6 h-6 text-deep-brown" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-cream border-t border-warm-beige animate-slideUp">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors ${
                  location.pathname === to
                    ? 'text-royal-rose bg-royal-rose/10'
                    : 'text-deep-brown/70 hover:text-royal-rose'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center btn-royal mt-2 no-underline text-sm"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
