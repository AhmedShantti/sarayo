'use client';

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

const STATS = [
    { to: 24, suffix: '', labelKey: 'lnd.stats.years' },
    { to: 6, suffix: '', labelKey: 'lnd.stats.flavors' },
    { to: 100, suffix: '%', labelKey: 'lnd.stats.loud' },
    { to: 1, suffix: 'M+', labelKey: 'lnd.stats.bags' },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const mv = useMotionValue(0);
    const text = useTransform(mv, (v) => Math.round(v).toString());

    useEffect(() => {
        if (!inView) return;
        const controls = animate(mv, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
        return () => controls.stop();
    }, [inView, to, mv]);

    return (
        <span ref={ref} className="inline-flex items-end">
            <motion.span>{text}</motion.span>
            <span className="text-brand-yellow">{suffix}</span>
        </span>
    );
}

export default function Stats() {
    const { t } = useLanguage();
    return (
        <section className="border-y border-white/12 bg-brand-red-deep/40 py-16 backdrop-blur-sm sm:py-20">
            <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-12 px-5 sm:px-8 lg:grid-cols-4">
                {STATS.map((s) => (
                    <motion.div
                        key={s.labelKey}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <div className="landing-display text-[clamp(3rem,7vw,5.5rem)] leading-none text-white">
                            <Counter to={s.to} suffix={s.suffix} />
                        </div>
                        <p className="mt-3 font-grotesk text-xs uppercase tracking-[0.25em] text-white/60">
                            {t(s.labelKey)}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
