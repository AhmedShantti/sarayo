'use client';

import {useLanguage} from '@/lib/LanguageContext';

// Inline globe icon — renders identically on every OS (unlike flag emoji, which
// Windows draws as bare region letters like "EG"). The label shows the language
// you'll switch TO: "العربية" while in English, "English" while in Arabic.
function GlobeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
             className="h-4 w-4" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.6 2.4 2.6 15.6 0 18M12 3c-2.6 2.4-2.6 15.6 0 18" />
        </svg>
    );
}

export default function LangToggle({className = ''}) {
    const {toggle, t, hydrated} = useLanguage();
    return (
        <button
            type="button"
            onClick={toggle}
            className={'lang-toggle ' + className}
            aria-label={hydrated ? t('a11y.toggleLang') : 'Toggle language'}
        >
            <GlobeIcon />
            <span>{hydrated ? t('lang.toggle') : 'العربية'}</span>
        </button>
    );
}
