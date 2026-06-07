import type { ReactElement, ReactNode } from 'react';

export type Locale = 'en' | 'ar';

export interface LanguageContextValue {
    locale: Locale;
    dir: 'rtl' | 'ltr';
    hydrated: boolean;
    setLocale: (next: Locale) => void;
    toggle: () => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
}

export function LanguageProvider(props: { children: ReactNode }): ReactElement;
export function useLanguage(): LanguageContextValue;
