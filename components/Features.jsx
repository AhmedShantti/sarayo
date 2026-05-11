'use client';

import {useEffect, useRef} from 'react';
import {useLanguage} from '@/lib/LanguageContext';

const FEATURES = [
    {
        titleKey: 'feat.1.title',
        textKey:  'feat.1.text',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M16 6 Q22 8 24 14 Q26 22 18 26 Q10 22 8 14 Q12 8 16 6 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 10 Q15 16 12 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
    {
        titleKey: 'feat.2.title',
        textKey:  'feat.2.text',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M16 26 C9 21 4 17 4 12 A5 5 0 0 1 13 9 L16 12 L19 9 A5 5 0 0 1 28 12 C28 17 23 21 16 26 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        titleKey: 'feat.3.title',
        textKey:  'feat.3.text',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M16 4 L26 8 L26 16 Q26 23 16 28 Q6 23 6 16 L6 8 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M11 16 L15 19 L21 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        titleKey: 'feat.4.title',
        textKey:  'feat.4.text',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="13" r="1.4" fill="currentColor" />
                <circle cx="20" cy="13" r="1.4" fill="currentColor" />
                <path
                    d="M11 19 Q16 24 21 19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
];

export default function Features() {
    const sectionRef = useRef(null);
    const {t} = useLanguage();

    // Reveal-on-scroll for feature blocks
    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;
        const els = root.querySelectorAll('.feature');
        els.forEach((c) => c.classList.add('reveal'));

        if (!('IntersectionObserver' in window)) {
            els.forEach((c) => c.classList.add('is-revealed'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        io.unobserve(entry.target);
                    }
                });
            },
            {threshold: 0.05, rootMargin: '0px 0px 80px 0px'}
        );
        els.forEach((c) => io.observe(c));

        const t = setTimeout(() => {
            els.forEach((c) => c.classList.add('is-revealed'));
        }, 1500);

        return () => {
            clearTimeout(t);
            io.disconnect();
        };
    }, []);

    return (
        <section className="features" aria-label={t('feat.aria')} ref={sectionRef}>
            <div className="container features-grid">
                {FEATURES.map((f) => (
                    <div className="feature" key={f.titleKey}>
                        <span className="feature-icon">{f.icon}</span>
                        <h3 className="feature-title">{t(f.titleKey)}</h3>
                        <p className="feature-text">{t(f.textKey)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
