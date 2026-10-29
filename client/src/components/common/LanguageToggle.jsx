import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Compact EN / हि segmented switch used in every header.
 */
export default function LanguageToggle({ className = '' }) {
  const { lang, setLang, languages, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-full bg-surface-container-high/70 border border-outline-variant/40 shrink-0 ${className}`}
      role="group"
      aria-label={t('common.language')}
    >
      <Languages className="w-3.5 h-3.5 text-secondary mx-1 hidden sm:block" aria-hidden="true" />
      {languages.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            className={`min-w-[30px] px-2 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              active
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            aria-pressed={active}
            title={l.label}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
