'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from 'framer-motion';
import Chip from './Chip';
import Magnetic from './Magnetic';
import { type Product } from '@/lib/landingData';
import { useLanguage } from '@/lib/LanguageContext';

// Short brand "items" the eyebrow chip rotates through every 3s (i18n keys).
const CHIP_KEYS = [
    'lnd.word.crunchy', 'lnd.word.flavorful', 'lnd.word.irresistible',
    'lnd.word.cutThick', 'lnd.word.friedCrisp', 'lnd.word.loudFlavor',
];

// Real Sarayo packs cut out for the hero collage (no stock/placeholder art).
// Position/size is expressed as % of the collage box so it holds up across breakpoints.
const COLLAGE_ITEMS = [
    {
        src: '/uploads/1783218621522-cornice_chili_and_lemon_flavor_10_L.E-Photoroom.png',
        width: 2000, height: 2000,
        alt: 'Sarayo Cornice Chili & Limon crisps',
        posClass: 'left-[8%] top-0 w-[36%]',
        rotate: -10, z: 30, floatDelay: 0, floatDuration: 4.2,
    },
    {
        src: '/wafer-products/wafer-lemon.png',
        width: 2282, height: 1556,
        alt: 'Sarayo Wafer Lemon Cream',
        posClass: 'right-0 top-[8%] w-[42%]',
        rotate: 12, z: 20, floatDelay: 0.6, floatDuration: 4.6,
    },
    {
        src: '/uploads/1781697285378-____________________________-97.png',
        width: 4288, height: 4216,
        alt: 'Sarayo Cornice Mexican Chili crisps',
        posClass: 'left-0 top-[36%] w-[40%]',
        rotate: -15, z: 25, floatDelay: 1.1, floatDuration: 5,
    },
    {
        src: '/wafer-products/wafer-choco.png',
        width: 2282, height: 1556,
        alt: 'Sarayo Wafer Chocolate Cream',
        posClass: 'right-[2%] top-[42%] w-[42%]',
        rotate: 8, z: 30, floatDelay: 0.3, floatDuration: 4.4,
    },
    {
        src: '/wafer-products/wafer-strewberry.png',
        width: 2282, height: 1556,
        alt: 'Sarayo Wafer Strawberry Cream',
        posClass: 'left-[22%] bottom-0 w-[40%]',
        rotate: -6, z: 15, floatDelay: 1.6, floatDuration: 4.8,
    },
] as const;

export default function Hero(_props: { products?: Product[] }) {
    const { t } = useLanguage();
    const [chip, setChip] = useState(0);

    // Rotate the eyebrow chip's item every 3s.
    useEffect(() => {
        const id = setInterval(() => setChip((c) => (c + 1) % CHIP_KEYS.length), 3000);
        return () => clearInterval(id);
    }, []);

    // Subtle mouse parallax.
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 120, damping: 20 });
    const sy = useSpring(py, { stiffness: 120, damping: 20 });
    const collageX = useTransform(sx, [-1, 1], [-16, 16]);
    const collageY = useTransform(sy, [-1, 1], [-12, 12]);
    const ghostX = useTransform(sx, [-1, 1], [24, -24]);

    const onMove = (e: React.MouseEvent<HTMLElement>) => {
        px.set((e.clientX / window.innerWidth - 0.5) * 2);
        py.set((e.clientY / window.innerHeight - 0.5) * 2);
    };

    const chipLabel = t(CHIP_KEYS[chip]);

    return (
        <section
            id="top"
            onMouseMove={onMove}
            className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-16 sm:px-8 lg:flex-row lg:items-center lg:justify-center lg:gap-4 lg:px-16 xl:px-24"
        >
            {/* Ghost wordmark */}
            <motion.div style={{ x: ghostX }} className="pointer-events-none absolute inset-x-0 top-[12%] z-0 flex justify-center">
                <span className="hero-ghost text-[22vw] leading-none lg:text-[15vw]">Sarayo</span>
            </motion.div>

            {/* Glow */}
            <div className="pointer-events-none absolute right-[10%] top-1/2 h-[55vmin] w-[55vmin] -translate-y-1/2 rounded-full bg-brand-red-soft/40 blur-[130px] lg:right-[8%]" />

            <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-6">

                {/* Text column — slides in from the left as the hero lands. */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex w-full max-w-[600px] flex-col items-center text-center lg:items-start lg:text-start"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
                    >
                        <Chip variant="yellow" size="md">{t('lnd.since')}</Chip>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={chipLabel}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Chip variant="outline" size="md">{chipLabel}</Chip>
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="landing-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.85] text-white"
                    >
                        {t('lnd.hero.line1')}
                    </motion.h1>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="landing-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.85]"
                        style={{ color: 'transparent', WebkitTextStroke: '2px #FFD400' }}
                    >
                        {t('lnd.hero.line2')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="mt-6 max-w-[440px] font-grotesk text-[15px] leading-relaxed text-white/70"
                    >
                        {t('lnd.hero.sub')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
                    >
                        <Magnetic strength={0.5}>
                            <a
                                href="/products"
                                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-8 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep shadow-xl shadow-black/20"
                            >
                                {t('lnd.hero.cta1')}
                            </a>
                        </Magnetic>
                        <Magnetic strength={0.4}>
                            <a
                                href="#features"
                                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-white"
                            >
                                {t('lnd.hero.cta2')}
                            </a>
                        </Magnetic>
                    </motion.div>
                </motion.div>

                {/* Collage column — slides in from the right as the hero lands, then
                    settles into its continuous mouse-parallax drift. */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-[340px] w-full max-w-[440px] shrink-0 sm:h-[420px] lg:h-[560px] lg:w-[46%] lg:max-w-[560px] xl:h-[600px]"
                >
                    <motion.div style={{ x: collageX, y: collageY }} className="absolute inset-0">
                        {/* Organic blob backdrop */}
                        <div className="absolute inset-[6%] rounded-[48%_52%_58%_42%/55%_42%_58%_45%] bg-brand-yellow/10 blur-2xl" />
                        <div className="absolute inset-[18%] rounded-[42%_58%_45%_55%/58%_45%_55%_42%] bg-brand-cream/5" />

                        {COLLAGE_ITEMS.map((item, i) => (
                            <motion.div
                                key={item.src}
                                initial={{ opacity: 0, y: 40, scale: 0.85, rotate: item.rotate * 1.4 }}
                                animate={{ opacity: 1, y: 0, scale: 1, rotate: item.rotate }}
                                transition={{ duration: 0.7, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className={`absolute ${item.posClass}`}
                                style={{ zIndex: item.z }}
                            >
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: item.floatDuration, repeat: Infinity, ease: 'easeInOut', delay: item.floatDelay }}
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        width={item.width}
                                        height={item.height}
                                        priority={i < 2}
                                        sizes="(max-width: 1024px) 40vw, 260px"
                                        className="h-auto w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
