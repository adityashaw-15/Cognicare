import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { LanguageCode, translations } from '../i18n/translations';

interface I18nContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem('jarvis-language') as LanguageCode | null;
    return stored ?? 'en';
  });

  const value = useMemo<I18nContextValue>(() => {
    const setLanguage = (next: LanguageCode) => {
      localStorage.setItem('jarvis-language', next);
      setLanguageState(next);
    };
    const t = (key: string) => translations[language][key] ?? translations.en[key] ?? key;
    return { language, setLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
}

