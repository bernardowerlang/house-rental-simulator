export type Language = 'pt' | 'en';

export interface TranslationParams {
  [key: string]: string | number;
}

export interface Translations {
  [key: string]: string | Translations;
}
