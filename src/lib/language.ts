// Language support configuration
export type SupportedLanguage = 'pt-br' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'zh';

export const LANGUAGE_OPTIONS: { value: SupportedLanguage; label: string }[] = [
  { value: 'pt-br', label: 'Português (Brasil)' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

// Language management functions
export function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'pt-br';
  const stored = window.localStorage.getItem('lg:chat:language');
  if (stored && LANGUAGE_OPTIONS.find(lang => lang.value === stored)) {
    return stored as SupportedLanguage;
  }
  return 'pt-br';
}

export function setStoredLanguage(language: SupportedLanguage) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('lg:chat:language', language);
  }
}