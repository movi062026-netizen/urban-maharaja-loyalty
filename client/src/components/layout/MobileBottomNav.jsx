import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

/**
 * App-style bottom tab bar shown below the lg breakpoint.
 * Each item: { label, icon, to?, onClick?, match?: string[], featured?: boolean }
 * `match` lists path prefixes that mark the tab active (defaults to `to`, exact for "/").
 */
const isItemActive = (pathname, { to, match }) => {
  const prefixes = match || (to ? [to] : []);
  return prefixes.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(`${p}/`)));
};

export default function MobileBottomNav({ items }) {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-outline-variant/40 shadow-[0_-8px_24px_-12px_rgba(46,26,16,0.25)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom Navigation"
    >
      <ul className="grid h-16 max-w-lg mx-auto" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const { label, icon: Icon, to, onClick, featured } = item;
          const active = isItemActive(pathname, item);
          const content = featured ? (
            <>
              <span
                className={`-mt-6 w-13 h-13 rounded-full flex items-center justify-center border-4 border-white shadow-[0_6px_16px_-4px_rgba(155,40,78,0.55)] bg-gradient-to-br from-primary to-primary-container text-white transition-transform ${
                  active ? 'scale-105' : ''
                }`}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
              </span>
              <span className={`text-[10px] font-bold leading-none ${active ? 'text-primary' : 'text-on-surface-variant'}`}>{t(label)}</span>
            </>
          ) : (
            <>
              <span
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-colors ${
                  active ? 'bg-primary/12 text-primary' : 'text-on-surface-variant'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
              </span>
              <span className={`text-[10px] leading-none truncate max-w-full px-0.5 ${active ? 'text-primary font-bold' : 'text-on-surface-variant font-semibold'}`}>
                {t(label)}
              </span>
            </>
          );
          const className = 'w-full h-full flex flex-col items-center justify-center gap-1 no-underline cursor-pointer select-none active:scale-95 transition-transform';

          return (
            <li key={label} className="min-w-0">
              {to ? (
                <Link to={to} className={className} aria-current={active ? 'page' : undefined}>
                  {content}
                </Link>
              ) : (
                <button type="button" onClick={onClick} className={className}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
