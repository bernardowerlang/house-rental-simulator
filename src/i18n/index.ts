import { ptTranslations } from './pt/pt';
import { enTranslations } from './en/en';
import { Language, Translations } from './types';

export const translations: Record<Language, Translations> = {
  pt: ptTranslations,
  en: enTranslations,
};

export * from './types';
export { ptTranslations, enTranslations };
