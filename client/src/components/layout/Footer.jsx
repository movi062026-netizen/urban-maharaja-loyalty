import { Crown, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-deep-brown text-white/80" role="contentinfo">
      {/* Gold divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-royal-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-royal-gold" />
              <div>
                <h3 className="font-serif text-lg text-white">URBAN MAHARAJA</h3>
                <p className="text-xs text-royal-gold tracking-[0.2em]">A FINE DINE</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Where royalty meets culinary excellence. Experience the grandeur of Indian fine dining
              in a setting fit for kings.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm text-royal-gold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'Our Story' },
                { to: '/menu', label: 'Royal Menu' },
                { to: '/loyalty', label: 'Maharaja Card' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/60 hover:text-royal-gold transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-sm text-royal-gold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 text-royal-rose shrink-0" />
                <span>REPLACE_WITH_RESTAURANT_ADDRESS</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-royal-rose shrink-0" />
                <span>REPLACE_WITH_PHONE</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-royal-rose shrink-0" />
                <span>REPLACE_WITH_EMAIL</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-sm text-royal-gold uppercase tracking-wider mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-royal-rose shrink-0" />
                <span>Mon – Sun: 12:00 PM – 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Urban Maharaja — A Fine Dine. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-royal-gold transition-colors no-underline">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-white/40 hover:text-royal-gold transition-colors no-underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
