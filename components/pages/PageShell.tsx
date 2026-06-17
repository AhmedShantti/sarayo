'use client';

import { motion } from 'framer-motion';
import Chip from '@/components/landing/Chip';
import Magnetic from '@/components/landing/Magnetic';

export function PageHero({ chip, headline, sub, locale }: {
    chip: string; headline: string; sub: string; locale?: string;
}) {
    return (
        <section className="relative flex min-h-[55vh] flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-16 text-center sm:px-8">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red-soft/30 blur-[120px]" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-3xl"
            >
                <Chip variant="yellow" size="md" className="mb-6">{chip}</Chip>
                <h1 className="landing-display text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.9] text-white mb-6">
                    {headline}
                </h1>
                <p className="text-base text-white/70 max-w-xl mx-auto leading-relaxed">{sub}</p>
            </motion.div>
        </section>
    );
}

export function SectionTitle({ chip, title, sub }: { chip?: string; title: string; sub?: string }) {
    return (
        <div className="mb-12">
            {chip && <Chip variant="yellow" size="md" className="mb-5">{chip}</Chip>}
            <h2 className="landing-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] text-white">{title}</h2>
            {sub && <p className="mt-4 text-white/70 max-w-lg">{sub}</p>}
        </div>
    );
}

const ICON_PATHS: Record<string, string> = {
    spark: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
    flame: 'M12 3c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.4-2-1-3 .2 1.5-.8 2-1.5 1.2C16.5 6.5 14 4.5 12 3Z',
    leaf:  'M4 20c0-8 6-14 16-14 0 10-6 16-16 14Zm3-3c4-5 7-7 10-8',
    globe: 'M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3Zm0 0c3 3 3 15 0 18M12 3c-3 3-3 15 0 18M3 12h18',
    map:   'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.22 12 19.79 19.79 0 0 1 1.15 3.18 2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z',
    mail:  'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2-8 5-8-5',
    clock: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5v5l4 2',
};

export function Icon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d={ICON_PATHS[name] || ICON_PATHS.spark} />
        </svg>
    );
}

export function CrunchCTA({ title, sub, btn1, btn1Href, btn2, btn2Href }: {
    title: string; sub: string; btn1: string; btn1Href: string; btn2?: string; btn2Href?: string;
}) {
    return (
        <section className="py-24 sm:py-32">
            <div className="mx-auto max-w-[900px] px-5 sm:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl border border-white/12 bg-brand-red-deep/60 px-8 py-16 backdrop-blur-sm"
                >
                    <h2 className="landing-display text-[clamp(2rem,5vw,3.5rem)] text-white mb-4">{title}</h2>
                    <p className="text-white/70 mb-8 max-w-lg mx-auto">{sub}</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Magnetic strength={0.4}>
                            <a href={btn1Href} className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-8 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep shadow-xl">
                                {btn1}
                            </a>
                        </Magnetic>
                        {btn2 && btn2Href && (
                            <Magnetic strength={0.3}>
                                <a href={btn2Href} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-white">
                                    {btn2}
                                </a>
                            </Magnetic>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
