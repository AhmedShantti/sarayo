'use client';

import { motion, type Variants } from 'framer-motion';
import Chip from './Chip';
import TextReveal from './TextReveal';
import { FEATURES, localizeFeature, type Feature } from '@/lib/landingData';
import { useLanguage } from '@/lib/LanguageContext';

const ICONS: Record<Feature['icon'], React.ReactNode> = {
    spark: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeWidth="1.6" strokeLinejoin="round" />,
    flame: <path d="M12 3c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.4-2-1-3 .2 1.5-.8 2-1.5 1.2C16.5 6.5 14 4.5 12 3Zm-2 9a3 3 0 0 0 4 3" strokeWidth="1.6" strokeLinejoin="round" />,
    leaf: <path d="M4 20c0-8 6-14 16-14 0 10-6 16-16 14Zm3-3c4-5 7-7 10-8" strokeWidth="1.6" strokeLinejoin="round" />,
    globe: (
        <>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
            <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" strokeWidth="1.6" />
        </>
    ),
};

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const card: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function spotlight(e: React.MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export default function Features({ features: featuresProp }: { features?: Feature[] }) {
    const FEATURES_DATA = featuresProp || FEATURES;
    const { t, locale } = useLanguage();
    return (
        <section id="features" className="relative py-24 sm:py-32">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                <div className="mb-14 max-w-2xl">
                    <Chip variant="yellow" size="md" className="mb-5">{t('lnd.features.chip')}</Chip>
                    <h2 className="landing-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-white">
                        <TextReveal text={t('lnd.features.title')} />
                    </h2>
                    <p className="mt-5 max-w-lg text-base text-white/75">
                        {t('lnd.features.sub')}
                    </p>
                </div>

                <motion.div
                    variants={grid}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {FEATURES_DATA.map((f) => {
                        const fl = localizeFeature(f, locale);
                        return (
                        <motion.article
                            key={f.title}
                            variants={card}
                            whileHover={{ y: -8 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            onMouseMove={spotlight}
                            data-cursor="hover"
                            className="feature-card group relative flex flex-col overflow-hidden rounded-3xl border border-white/12 bg-brand-red-deep/60 p-7 backdrop-blur-sm"
                        >
                            <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-white/25 text-brand-yellow transition-colors duration-300 group-hover:bg-brand-yellow group-hover:text-brand-red-deep">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-7 w-7">
                                    {ICONS[f.icon]}
                                </svg>
                            </span>
                            <Chip variant="outline" size="sm" className="mb-4 self-start">{fl.chip}</Chip>
                            <h3 className="landing-display mb-3 text-2xl leading-tight text-white">{fl.title}</h3>
                            <p className="text-sm leading-relaxed text-white/70">{fl.text}</p>
                        </motion.article>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
