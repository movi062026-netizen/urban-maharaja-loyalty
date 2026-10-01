import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid imperial email address');
      return;
    }
    toast.success('Your imperial invitation to the Maharaja Gazette has been dispatched!');
    setEmail('');
  };

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 text-on-surface-variant" role="contentinfo" aria-label="Site Footer">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand & Provenance */}
          <div className="flex flex-col space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 no-underline group" aria-label="Urban Maharaja Home">
              <img
                alt="Urban Maharaja logo"
                className="h-9 w-9 sm:h-10 sm:w-10 object-cover rounded-full border border-primary/40 shadow-sm"
                src="/logo.png"
              />
              <div className="flex flex-col">
                <span className="font-serif text-base sm:text-lg uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary font-bold">
                  Urban Maharaja
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-secondary font-semibold">
                  Imperial Gastronomy
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed max-w-xs">
              An ultra-luxurious dining sanctuary breathing the majestic grandeur of Rajasthan and imperial Mughal courts into modern culinary artistry.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-chip w-fit">
                <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-secondary" aria-hidden="true">workspace_premium</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-bold text-secondary">Michelin Standard 2026</span>
              </div>
              <a
                href="https://share.google/2nmScZz1II7jKmnKO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-black transition-all text-[9px] sm:text-[10px] uppercase tracking-[0.14em] font-bold w-fit no-underline"
              >
                <span>⭐ Google Reviews</span>
              </a>
            </div>
          </div>

          {/* Imperial Portals */}
          <nav className="flex flex-col space-y-3" aria-label="Footer Navigation">
            <h4 className="text-sm sm:text-base text-primary uppercase tracking-widest font-bold">
              Imperial Portals
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm list-none p-0 m-0">
              <li>
                <Link to="/about" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  Our Royal Heritage
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  The Degustation Menu
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  Maharaja Privileges
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  The Royal Chef's Table
                </Link>
              </li>
              <li>
                <a
                  href="https://share.google/2nmScZz1II7jKmnKO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300/90 hover:text-amber-200 transition-colors no-underline font-medium inline-flex items-center gap-1"
                >
                  <span>Leave Google Review ⭐</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Palace & Hours */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm sm:text-base text-primary uppercase tracking-widest font-bold">
              Palace & Hours
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-on-surface-variant">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[16px] sm:text-[18px] mt-0.5 shrink-0" aria-hidden="true">schedule</span>
                <div className="min-w-0">
                  <p className="text-on-surface font-medium mb-0.5">Royal Dining Hours</p>
                  <p className="text-on-surface-variant/80">Mon – Sun: 12:00 PM – 11:00 PM</p>
                </div>
              </div>
              <address className="flex items-start gap-2.5 not-italic">
                <span className="material-symbols-outlined text-primary text-[16px] sm:text-[18px] mt-0.5 shrink-0" aria-hidden="true">location_on</span>
                <div className="min-w-0">
                  <p className="text-on-surface font-medium mb-0.5">Imperial Pavilion</p>
                  <p className="text-on-surface-variant/80 break-safe">Plot No. AC-209, Central Spine, Mahal Road, Jagatpura, Jaipur, Rajasthan 302017</p>
                </div>
              </address>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[16px] sm:text-[18px] mt-0.5 shrink-0" aria-hidden="true">call</span>
                <div className="min-w-0">
                  <p className="text-on-surface font-medium mb-0.5">VIP Concierge</p>
                  <a href="tel:+918001234567" className="text-on-surface-variant/80 no-underline hover:text-primary transition-colors">+91 (800) MAHARAJA</a>
                </div>
              </div>
            </div>
          </div>

          {/* Maharaja Gazette */}
          <div className="flex flex-col space-y-3 sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base text-primary uppercase tracking-widest font-bold">
              Maharaja Gazette
            </h4>
            <p className="text-xs sm:text-sm text-on-surface-variant/80">
              Receive confidential invitations to seasonal royal tastings and rare vintage releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <label htmlFor="footer-email" className="sr-only">Your email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your imperial address..."
                className="w-full px-4 py-2.5 rounded-lg glass-input text-on-surface placeholder-on-surface-variant/50 text-xs sm:text-sm focus:outline-none"
                autoComplete="email"
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg glass-btn-primary text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] font-bold"
              >
                Subscribe to Gazette
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-xs text-on-surface-variant/70 border-t border-outline-variant/20">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Urban Maharaja — A Fine Dine. All Imperial Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-bold">
            <Link to="/about" className="hover:text-primary transition-colors no-underline">
              Privacy Policy
            </Link>
            <span className="text-outline-variant hidden sm:inline" aria-hidden="true">•</span>
            <Link to="/about" className="hover:text-primary transition-colors no-underline">
              Terms of Royal Service
            </Link>
            <span className="text-outline-variant hidden sm:inline" aria-hidden="true">•</span>
            <Link to="/about" className="hover:text-primary transition-colors no-underline">
              Guest Dress Code
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
