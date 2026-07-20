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

// `products` is still accepted so the page-level call site stays unchanged, but the
// hero now shows one combined product banner instead of cycling individual packs.
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
    const bagX = useTransform(sx, [-1, 1], [-18, 18]);
    const bagY = useTransform(sy, [-1, 1], [-14, 14]);
    const ghostX = useTransform(sx, [-1, 1], [30, -30]);

    const onMove = (e: React.MouseEvent<HTMLElement>) => {
        px.set((e.clientX / window.innerWidth - 0.5) * 2);
        py.set((e.clientY / window.innerHeight - 0.5) * 2);
    };

    const chipLabel = t(CHIP_KEYS[chip]);

    return (
        <section
            id="top"
            onMouseMove={onMove}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-12 text-center sm:px-8 sm:pt-36 sm:pb-16"
        >
            {/* Ghost wordmark */}
            <motion.div style={{ x: ghostX }} className="pointer-events-none absolute inset-x-0 top-[18%] z-0 flex justify-center">
                <span className="hero-ghost text-[22vw] leading-none">Sarayo</span>
            </motion.div>

            {/* Glow that follows the active flavor */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red-soft/40 blur-[130px]" />

            {/* Eyebrow */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative z-10 mb-6 flex flex-wrap items-center justify-center gap-2"
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

            {/* Headline + flavor stage */}
            <div className="relative z-10 flex w-full max-w-[1100px] flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="landing-display text-[clamp(3rem,10vw,8.5rem)] leading-[0.85] text-white"
                >
                    {t('lnd.hero.line1')}
                </motion.h1>

                {/* Stage: outline word behind, cycling bag in front */}
                <div className="relative my-2 flex min-h-[200px] w-full items-center justify-center sm:min-h-[280px]">
                    <span
                        aria-hidden
                        className="landing-display pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(3rem,10vw,8.5rem)] leading-none"
                        style={{ color: 'transparent', WebkitTextStroke: '2px #FFD400' }}
                    >
                        {t('lnd.hero.line2')}
                    </span>

                    {/* One combined banner of the full range, in place of the old per-pack carousel. */}
                    <motion.div
                        style={{ x: bagX, y: bagY }}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-[980px]"
                    >
                        <Image
                            src="/products-banner.png"
                            alt="Sarayo Alwadiya product range"
                            width={2347}
                            height={467}
                            priority
                            sizes="(max-width: 768px) 95vw, 980px"
                            className="h-auto w-full object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.45)]"
                        />
                    </motion.div>
                </div>
            </div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
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
        </section>
    );
}
