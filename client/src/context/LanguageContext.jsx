import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translations, LANGUAGES } from '../i18n/translations';

const STORAGE_KEY = 'um_lang';
const LanguageContext = createContext(null);

const readStoredLang = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;
  } catch {
    // Storage unavailable (private mode) — fall through to default
  }
  return 'en';
};

const interpolate = (text, vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? '').toString()) : text;

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!translations[next]) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Non-fatal
    }
  }, []);

  const t = useCallback(
    (key, vars) => interpolate(translations[lang][key] ?? translations.en[key] ?? key, vars),
    [lang]
  );

  const value = useMemo(() => ({
    lang,
    setLang,
    t,
    languages: LANGUAGES,
  }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
