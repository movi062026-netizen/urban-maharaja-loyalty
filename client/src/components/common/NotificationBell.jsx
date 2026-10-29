import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Volume2, VolumeX, CheckCheck, Trash2, BellRing } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const timeAgo = (iso, t) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return t('notif.justNow');
  if (mins < 60) return t('notif.minutesAgo', { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('notif.hoursAgo', { count: hours });
  return new Date(iso).toLocaleDateString();
};

export default function NotificationBell() {
  const {
    items, unreadCount, connected, soundEnabled, setSoundEnabled, pushPermission,
    markAllRead, markRead, clearAll, localize, requestBrowserPermission,
  } = useNotifications();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleItemClick = (n) => {
    markRead(n.id);
    if (n.link) {
      setOpen(false);
      navigate(n.link);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full glass-surface flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
        aria-label={`${t('notif.title')}${unreadCount ? ` (${unreadCount})` : ''}`}
        aria-expanded={open}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        <span
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-white ${connected ? 'bg-emerald-500' : 'bg-amber-400'}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-auto sm:mt-2 sm:w-[360px] max-h-[70vh] flex flex-col rounded-2xl bg-white border border-outline-variant/40 shadow-[0_24px_60px_-12px_rgba(46,26,20,0.3)] z-[60] overflow-hidden animate-slideUp"
          role="dialog"
          aria-label={t('notif.title')}
        >
          <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="font-serif text-sm font-bold text-on-surface">{t('notif.title')}</h2>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {connected ? `● ${t('notif.live')}` : t('notif.offline')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container cursor-pointer"
                title={soundEnabled ? t('notif.soundOn') : t('notif.soundOff')}
                aria-label={soundEnabled ? t('notif.soundOn') : t('notif.soundOff')}
                aria-pressed={soundEnabled}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={markAllRead}
                disabled={!unreadCount}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container cursor-pointer disabled:opacity-40 disabled:cursor-default"
                title={t('notif.markAllRead')}
                aria-label={t('notif.markAllRead')}
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={!items.length}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-surface-container cursor-pointer disabled:opacity-40 disabled:cursor-default"
                title={t('notif.clear')}
                aria-label={t('notif.clear')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {pushPermission === 'default' && (
            <button
              type="button"
              onClick={requestBrowserPermission}
              className="mx-3 mt-3 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-xs font-semibold text-primary flex items-center gap-2 cursor-pointer hover:bg-primary/10"
            >
              <BellRing className="w-4 h-4" />
              {t('notif.enableBrowser')}
            </button>
          )}

          <div className="flex-1 overflow-y-auto p-2">
            {items.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-10 px-6 leading-relaxed">{t('notif.empty')}</p>
            ) : (
              <ul className="space-y-1">
                {items.map((n) => {
                  const { title, body } = localize(n);
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => handleItemClick(n)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex gap-3 transition-colors cursor-pointer ${
                          n.read ? 'hover:bg-surface-container/60' : 'bg-primary/5 hover:bg-primary/10'
                        }`}
                      >
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-on-surface">{title}</span>
                          <span className="block text-xs text-on-surface-variant leading-snug mt-0.5">{body}</span>
                          <span className="block text-[10px] text-outline mt-1">{timeAgo(n.createdAt, t)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
