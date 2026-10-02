import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cookie, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem('um_cookie_consent');
    if (!consent) {
      // Show after a slight delay so it doesn't clash with initial render
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('um_cookie_consent', 'accepted_all');
    localStorage.setItem('um_cookie_consent_date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('um_cookie_consent', 'essential_only');
    localStorage.setItem('um_cookie_consent_date', new Date().toISOString());
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-[#e0c8b0] shadow-[0_20px_50px_-10px_rgba(46,26,16,0.25)] p-5 text-on-surface"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
              <Cookie className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#1d0f09]">
                  Cookie Preferences
                </h3>
                <button
                  onClick={handleEssentialOnly}
                  className="text-[#5e3810] hover:text-[#1d0f09] p-1 rounded-lg transition-colors cursor-pointer"
                  title="Close"
                  aria-label="Close cookie banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#2d1a10] leading-relaxed mt-1 font-medium">
                We use cookies to secure your sessions, remember your dining preferences, and power our digital loyalty rewards card.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleAcceptAll}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary text-white text-xs uppercase tracking-wider font-bold shadow-xs hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Cookies</span>
            </button>

            <button
              onClick={handleEssentialOnly}
              className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-[#fdfaf6] hover:bg-[#f3e7dc] border border-[#ede0d2] text-[#1d0f09] text-xs font-bold transition-all cursor-pointer"
            >
              Essential Only
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#eee0d2] flex items-center justify-between text-[10px] text-[#483328] font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-secondary" />
              <span>Privacy Compliant</span>
            </span>
            <Link
              to="/terms"
              className="text-primary hover:underline"
            >
              Read Terms &amp; Conditions
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
