'use client';

import {useLanguage} from '@/lib/LanguageContext';

// PNG logo — gradientId arg kept for backwards-compat with old call sites.
export default function BrandLogo() {
    const {t, hydrated} = useLanguage();
    return (
        <img
            src="/images.png"
            alt={hydrated ? t('a11y.brandAlt') : 'Sarayo Alwadiya'}
            className="brand-img"
        />
    );
}
