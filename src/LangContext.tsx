import React, { createContext, useContext, useState } from 'react';
import { Lang, translations, Translations } from './i18n';

interface LangContextType {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: 'pt',
  t: translations.pt,
  setLang: () => {},
});

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    // Detectar idioma do browser automaticamente
    const browserLang = navigator.language?.toLowerCase();
    if (browserLang && !browserLang.startsWith('pt')) return 'en';
    return 'pt';
  });

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
