'use client';

import Image from 'next/image';
import Link from 'next/link';
import Chip from './Chip';
import { useLanguage } from '@/lib/LanguageContext';

type PanelImage = {
    src: string;
    alt: string;
    className: string;
    delay: number;
};

type Panel = {
    id: string;
    href: string;
    bgClass: string;
    glowClass: string;
    labelKey: string;
    images: PanelImage[];
};

const PANELS: Panel[] = [
    {
        id: 'snacks',
        href: '/chipsy',
        bgClass: 'bg-gradient-to-br from-brand-red-deep via-brand-red-deep to-brand-ink',
        glowClass: 'bg-brand-yellow/20',
        labelKey: 'lnd.shopSplit.snacks',
        images: [
            {
                src: '/catalog/png/كتالوج شركة سرايو مصر نهائي-82.png',
                alt: 'Cornice Mini Balls',
                className: 'left-[16%] top-[12%] h-[60%] w-[44%] -rotate-[10deg] z-[1]',
                delay: 0,
            },
            {
                src: '/catalog/png/كتالوج شركة سرايو مصر نهائي-90.png',
                alt: 'Cornice Crisps',
                className: 'right-[12%] top-[6%] h-[68%] w-[50%] rotate-[8deg] z-[2]',
                delay: 1.2,
            },
        ],
    },
    {
        id: 'wafer',
        href: '/wafer',
        bgClass: 'bg-gradient-to-br from-brand-red-soft via-brand-red to-brand-red-deep',
        glowClass: 'bg-white/15',
        labelKey: 'lnd.shopSplit.wafer',
        images: [
            {
                src: '/wafer-products/wafer-choco.png',
                alt: 'Choco Hazel wafer',
                className: 'left-[14%] top-[10%] h-[64%] w-[48%] -rotate-[9deg] z-[1]',
                delay: 0.6,
            },
            {
                src: '/wafer-products/wafer-choco-bun.png',
                alt: 'Chocolate wafer',
                className: 'right-[16%] top-[16%] h-[54%] w-[42%] rotate-[11deg] z-[2]',
                delay: 1.8,
            },
        ],
    },
];

export default function ShopSplit() {
    const { t } = useLanguage();

    return (
        <section className="relative py-24 sm:py-32">
            <div className="mx-auto mb-14 max-w-[1280px] px-5 text-center sm:px-8">
                <Chip variant="yellow" size="md" className="mb-5">{t('lnd.shopSplit.chip')}</Chip>
                <h2 className="landing-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] text-white">
                    {t('lnd.shopSplit.title')}
                </h2>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2">
                {PANELS.map((panel) => (
                    <Link
                        key={panel.id}
                        href={panel.href}
                        className={`group relative isolate flex h-[440px] flex-col items-center justify-end overflow-hidden pb-10 sm:h-[520px] ${panel.bgClass}`}
                    >
                        {/* decorative glow behind the packs */}
                        <div className={`pointer-events-none absolute left-1/2 top-1/3 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] ${panel.glowClass}`} />

                        {/* scattered decorative pills, echoing the Hero's motif */}
                        <Chip
                            variant="outline"
                            size="sm"
                            interactive={false}
                            float
                            delay={panel.id === 'snacks' ? 0 : 0.8}
                            className="pointer-events-none absolute left-[8%] top-[8%] -rotate-6 opacity-80"
                        >
                            {t(panel.id === 'snacks' ? 'lnd.word.crunchy' : 'lnd.word.friedCrisp') || ' '}
                        </Chip>

                        <div className="relative w-full flex-1">
                            {panel.images.map((img) => (
                                <div
                                    key={img.src}
                                    className={`absolute animate-float transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-0 ${img.className}`}
                                    style={{ animationDelay: `${img.delay}s` }}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        sizes="(max-width: 640px) 40vw, 24vw"
                                        className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.4)]"
                                    />
                                </div>
                            ))}
                        </div>

                        <span className="landing-display relative z-10 rounded-full bg-brand-yellow px-8 py-3 text-lg text-brand-red-deep shadow-lg transition-transform duration-300 group-hover:scale-105">
                            {t(panel.labelKey)}
                        </span>
                    </Link>
                ))}

                {/* diagonal sash marking the seam between the two sides */}
                <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-6 -translate-x-1/2 -skew-x-12 bg-brand-yellow shadow-[0_0_50px_rgba(250,178,19,0.55)] sm:block" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-red-deep shadow-2xl sm:grid">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
