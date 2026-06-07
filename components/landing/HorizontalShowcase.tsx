'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Chip from './Chip';
import { PRODUCTS, localizeProduct, type Product } from '@/lib/landingData';
import { useLanguage } from '@/lib/LanguageContext';

const TONE: Record<Product['tone'], string> = {
    deep: 'bg-brand-red-deep border border-white/12 text-white',
    cream: 'bg-brand-cream text-brand-red-deep',
    yellow: 'bg-brand-yellow text-brand-red-deep',
};

// Home shows a curated 4; the full lineup lives on /products.
const SHOWCASE = PRODUCTS.slice(0, 4);

function Panel({ p, index }: { p: Product; index: number }) {
    const { locale } = useLanguage();
    const pl = localizeProduct(p, locale);
    return (
        <article
            className={`relative flex h-full w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] p-6 sm:w-[60vw] sm:p-8 lg:w-[42vw] ${TONE[p.tone]}`}
            data-cursor="hover"
        >
            <span className="landing-display absolute right-5 top-3 text-[4.5rem] leading-none opacity-10 sm:text-[7rem]">
                {String(index + 1).padStart(2, '0')}
            </span>

            <div className="relative z-10 flex items-center justify-between">
                <Chip variant={p.tone === 'deep' ? 'outline' : 'red'} size="sm">{pl.tag}</Chip>
                <span className="font-grotesk text-xs uppercase tracking-[0.2em] opacity-50">
                    {String(index + 1).padStart(2, '0')} / {String(SHOWCASE.length).padStart(2, '0')}
                </span>
            </div>

            <div className="relative my-4 h-[34vh] w-full sm:h-[46vh]">
                <Image
                    src={p.src}
                    alt={`Sarayo Alwadiya ${pl.name} — ${pl.flavor}`}
                    fill
                    sizes="(max-width: 1024px) 70vw, 42vw"
                    className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.4)]"
                />
            </div>

            <div className="relative z-10">
                <h3 className="landing-display text-[clamp(2rem,5vw,3.5rem)] leading-none">{pl.name}</h3>
                <p className="mt-2 text-sm opacity-70">{pl.flavor}</p>
            </div>
        </article>
    );
}

export default function HorizontalShowcase() {
    const { t } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [maxX, setMaxX] = useState(0);
    const [vh, setVh] = useState(0);
    const [reduce, setReduce] = useState(false);

    useEffect(() => {
        setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        const measure = () => {
            const track = trackRef.current;
            if (!track) return;
            setVh(window.innerHeight);
            setMaxX(Math.max(0, track.scrollWidth - window.innerWidth));
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });
    const xRaw = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
    const x = useSpring(xRaw, { stiffness: 120, damping: 30, mass: 0.5 });

    const heading = (
        <div className="mb-2 flex flex-wrap items-end justify-between gap-6">
            <div>
                <Chip variant="yellow" size="md" className="mb-5">{t('lnd.showcase.chip')}</Chip>
                <h2 className="landing-display text-[clamp(2.5rem,6vw,5rem)] text-white">{t('lnd.showcase.title')}</h2>
            </div>
            <p className="max-w-xs font-grotesk text-sm text-white/70">
                {reduce ? t('lnd.showcase.subSwipe') : t('lnd.showcase.subScroll')}
            </p>
        </div>
    );

    // Reduced-motion / fallback: a normal swipeable row.
    if (reduce) {
        return (
            <section id="showcase" className="py-24 sm:py-32">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8">{heading}</div>
                {/* Keep the flavor track left-to-right even in Arabic so the
                    horizontal reveal works exactly as it does in English. */}
                <div dir="ltr" className="mt-8 flex snap-x gap-6 overflow-x-auto px-5 pb-6 sm:px-8" style={{ height: '80vh' }}>
                    {SHOWCASE.map((p, i) => (
                        <div key={p.name} className="snap-center">
                            <Panel p={p} index={i} />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section
            id="showcase"
            ref={sectionRef}
            style={{ height: `${maxX + vh}px` }}
            className="relative"
        >
            <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
                <div className="mx-auto mb-6 w-full max-w-[1280px] px-5 sm:px-8">{heading}</div>
                {/* dir=ltr keeps the scroll-driven reveal identical in Arabic. */}
                <motion.div ref={trackRef} dir="ltr" style={{ x }} className="flex h-[68vh] gap-6 px-5 sm:px-8">
                    {SHOWCASE.map((p, i) => (
                        <Panel key={p.name} p={p} index={i} />
                    ))}
                    <a
                        href="/products"
                        data-cursor="hover"
                        className="group flex h-full w-[82vw] shrink-0 flex-col items-start justify-center gap-5 rounded-[2rem] border border-white/15 bg-brand-red-deep p-6 transition-colors hover:border-brand-yellow/50 sm:w-[48vw] sm:p-10 lg:w-[34vw]"
                    >
                        <span className="landing-display text-[clamp(5rem,12vw,8rem)] text-brand-yellow" style={{ lineHeight: 1 }}>
                            {PRODUCTS.length}
                        </span>
                        <span className="landing-display text-[clamp(1.75rem,3.5vw,2.75rem)] text-white" style={{ lineHeight: 1.15 }}>
                            {t('lnd.showcase.fullLineup')}
                        </span>
                        <Chip variant="yellow" size="lg" className="transition-transform group-hover:scale-105">
                            {t('lnd.showcase.openShop')}
                        </Chip>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
