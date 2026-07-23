'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

/**
 * Cinematic intro — a count to 100 behind the logo, then the curtain wipes
 * up to reveal the page. Auto-dismisses (and shortens for reduced motion);
 * click to skip.
 */
export default function Loader() {
    const { t } = useLanguage();
    const [done, setDone] = useState(false);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v));

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const duration = reduce ? 0.4 : 1.7;
        document.body.style.overflow = 'hidden';
        const controls = animate(count, 100, {
            duration,
            ease: [0.22, 1, 0.36, 1],
            onComplete: () => setTimeout(() => setDone(true), 250),
        });
        // Safety net: rAF-driven animations can stall (throttled/background tabs,
        // dev-mode double-effects) and strand the curtain over the page forever.
        const fallback = setTimeout(() => setDone(true), duration * 1000 + 1500);
        return () => { controls.stop(); clearTimeout(fallback); };
    }, [count]);

    useEffect(() => {
        if (done) document.body.style.overflow = '';
    }, [done]);

    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    onClick={() => setDone(true)}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-red-deep"
                >
                    <motion.span
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 flex items-center justify-center"
                    >
                        {/* Height must sit on the image itself — a grid parent gives it no definite
                            height to resolve `h-full` against, so it fell back to intrinsic width. */}
                        <Image src="/sarayo-logo.png" alt="Sarayo Alwadiya" width={900} height={514} priority className="h-20 w-auto object-contain sm:h-24" />
                    </motion.span>

                    <div className="landing-display flex items-end gap-1 text-white">
                        <motion.span className="text-7xl leading-none sm:text-8xl">{rounded}</motion.span>
                        <span className="mb-2 text-2xl text-brand-yellow">%</span>
                    </div>

                    <span className="mt-6 font-grotesk text-[11px] uppercase tracking-[0.4em] text-white/50">
                        {t('lnd.tagline')}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
