'use client';

import {useLanguage} from '@/lib/LanguageContext';

// Two visually distinct glyphs per locale so the toggle changes shape — not
// just text — when the user flips languages.
const ICONS = {
    en: '🌐',
    ar: '🇪🇬',
};

export default function LangToggle({className = ''}) {
    const {toggle, t, locale, hydrated} = useLanguage();
    const icon = hydrated ? (locale === 'ar' ? ICONS.ar : ICONS.en) : ICONS.en;
    return (
        <button
            type="button"
            onClick={toggle}
            className={'lang-toggle ' + className}
            aria-label={hydrated ? t('a11y.toggleLang') : 'Toggle language'}
        >
            <span aria-hidden="true">{icon}</span>
            <span>{hydrated ? t('lang.toggle') : 'العربية'}</span>
        </button>
    );
}
