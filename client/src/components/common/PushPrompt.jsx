import { useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const DISMISS_KEY = 'um_push_prompt_dismissed';

const wasDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * One-tap banner asking to turn on phone/desktop notifications.
 * Browsers only allow the permission prompt from a user tap, so this is the entry point.
 */
export default function PushPrompt() {
  const { pushPermission, requestBrowserPermission } = useNotifications();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [busy, setBusy] = useState(false);

  if (pushPermission !== 'default' || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Non-fatal
    }
  };

  const enable = async () => {
    setBusy(true);
    await requestBrowserPermission();
    setBusy(false);
  };

  return (
    <div className="mb-5 p-3 sm:p-4 rounded-2xl bg-white border border-primary/25 shadow-sm flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <BellRing className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-on-surface">{t('notif.promptTitle')}</p>
        <p className="text-xs text-on-surface-variant">{t('notif.promptDesc')}</p>
      </div>
      <button
        type="button"
        onClick={enable}
        disabled={busy}
        className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shrink-0 cursor-pointer hover:brightness-110 disabled:opacity-60"
      >
        {t('notif.promptEnable')}
      </button>
      <button
        type="button"
        onClick={dismiss}
        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer shrink-0"
        aria-label={t('common.close')}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
