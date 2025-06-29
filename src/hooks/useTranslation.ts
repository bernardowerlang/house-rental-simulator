import { useState } from 'react';
import { translations, Language, TranslationParams } from '../i18n';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string, params?: TranslationParams): string => {
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
        (str, [paramKey, paramValue]) => str.replace(`{${paramKey}}`, String(paramValue)),
        value as string
      );
    }
    
    return value as string;
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return { t, language, changeLanguage };
};
