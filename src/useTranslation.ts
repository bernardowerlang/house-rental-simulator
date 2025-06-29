import { useState } from 'react';
import { translations } from './translations';

type Language = 'pt' | 'en';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      console.warn(`Translation key "${key}" not found for language "${language}"`);
      return key;
    }
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) => str.replace(`{${paramKey}}`, paramValue),
        value
      );
    }
    
    return value;
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return { t, language, changeLanguage };
};
