'use client';

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {dictionaries} from '@/lib/i18n/dictionaries';

const STORAGE_KEY = 'sarayo_locale';
// Arabic is the site's primary language — first-time visitors land in Arabic.
// A previously chosen locale in localStorage still wins.
const DEFAULT_LOCALE = 'ar';
const LanguageContext = createContext(null);

function readStoredLocale() {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === 'ar' || v === 'en' ? v : DEFAULT_LOCALE;
    } catch {
        return DEFAULT_LOCALE;
    }
}

export function LanguageProvider({children}) {
    const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const stored = readStoredLocale();
        setLocaleState(stored);
        setHydrated(true);
    }, []);

    // Mirror locale onto <html lang/dir> so CSS and screen readers pick it up.
    useEffect(() => {
        if (!hydrated) return;
        const root = document.documentElement;
        root.setAttribute('lang', locale);
        root.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    }, [locale, hydrated]);

    const setLocale = useCallback((next) => {
        setLocaleState(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    }, []);

    const toggle = useCallback(() => {
        setLocale(locale === 'en' ? 'ar' : 'en');
    }, [locale, setLocale]);

    const dict = dictionaries[locale] || dictionaries.en;

    const t = useCallback((key, vars) => {
        const raw = dict[key] ?? dictionaries.en[key] ?? key;
        if (!vars) return raw;
        return raw.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
    }, [dict]);

    const value = useMemo(() => ({
        locale,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
        hydrated,
        setLocale,
        toggle,
        t,
    }), [locale, hydrated, setLocale, toggle, t]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
    return ctx;
}
