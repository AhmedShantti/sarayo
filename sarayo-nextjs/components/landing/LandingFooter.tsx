'use client';

import Image from 'next/image';
import Chip from './Chip';
import { useLanguage } from '@/lib/LanguageContext';
import { PRODUCTS, localizeProduct } from '@/lib/landingData';

const SOCIALS = [
    {
        label: 'Instagram',
        href: 'https://instagram.com',
        path: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </>
        ),
    },
    {
        label: 'Facebook',
        href: 'https://facebook.com',
        path: <path d="M14 8.5h2.5V5.5H14c-2 0-3.2 1.3-3.2 3.3V11H8.5v3h2.3v6.5h3V14h2.4l.4-3h-2.8V9.3c0-.5.3-.8.9-.8Z" fill="currentColor" stroke="none" />,
    },
    {
        label: 'TikTok',
        href: 'https://tiktok.com',
        path: <path d="M14 4c.4 2.3 1.9 3.7 4 4v3c-1.4 0-2.8-.4-4-1.1V15a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V4h3Z" fill="currentColor" stroke="none" />,
    },
    {
        label: 'X',
        href: 'https://x.com',
        path: <path d="M4 4l16 16M20 4 4 20" strokeWidth="2" />,
    },
];

export default function LandingFooter() {
    const { t, locale } = useLanguage();

    // Shop column = first five flavors (localized); Company column = static links.
    const shopLinks = PRODUCTS.slice(0, 5).map((p) => localizeProduct(p, locale).name);
    const companyLinks = [
        t('lnd.footer.ourStory'),
        t('lnd.footer.careers'),
        t('lnd.footer.wholesale'),
        t('lnd.footer.press'),
    ];
    const contact = [
        { label: 'hello@sarayoalwadiya.com', href: 'mailto:hello@sarayoalwadiya.com' },
        { label: '+20 100 123 4567', href: 'tel:+201001234567' },
        { label: t('lnd.footer.location'), href: null as string | null },
    ];
    const columns = [
        { title: t('lnd.footer.shop'), links: shopLinks },
        { title: t('lnd.footer.company'), links: companyLinks },
    ];

    return (
        <footer className="border-t border-white/12 bg-brand-red-deep">
            <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-5 flex items-center gap-2">
                            <Image src="/images.png" alt="Sarayo Alwadiya logo" width={56} height={56} className="h-14 w-14 object-contain" />
                            <span className="landing-display text-lg text-white">Sarayo Alwadiya</span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-white/65">
                            {t('lnd.footer.desc')}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Chip variant="outline" size="sm" interactive={false}>{t('lnd.since')}</Chip>
                            <Chip variant="yellow" size="sm" interactive={false}>{t('lnd.tagline')}</Chip>
                        </div>

                        {/* Social */}
                        <div className="mt-6 flex items-center gap-3">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    data-cursor="hover"
                                    className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-brand-yellow hover:text-brand-red-deep"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        {s.path}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4 className="landing-display mb-4 text-sm uppercase tracking-wider text-brand-yellow">{col.title}</h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href="/products" className="text-sm text-white/65 transition-colors hover:text-white">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="landing-display mb-4 text-sm uppercase tracking-wider text-brand-yellow">{t('lnd.footer.contact')}</h4>
                        <ul className="space-y-2.5">
                            {contact.map((c) => (
                                <li key={c.label}>
                                    {c.href ? (
                                        <a href={c.href} data-cursor="hover" className="text-sm text-white/65 transition-colors hover:text-white">{c.label}</a>
                                    ) : (
                                        <span className="text-sm text-white/65">{c.label}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/12 pt-7 sm:flex-row">
                    <p className="text-xs text-white/50">{t('lnd.footer.rights')}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                        {t('lnd.word.crunchy')} · {t('lnd.word.flavorful')} · {t('lnd.word.irresistible')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
