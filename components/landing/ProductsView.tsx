'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Chip from './Chip';
import Magnetic from './Magnetic';
import TextReveal from './TextReveal';
import CartIcon from './CartIcon';
import { useLandingCart } from '@/lib/LandingCart';
import { CATEGORIES, PRODUCTS, localizeProduct, type Product } from '@/lib/landingData';
import { useLanguage } from '@/lib/LanguageContext';

const TONE: Record<Product['tone'], string> = {
    deep: 'bg-brand-red-deep/70 border border-white/12 text-white',
    cream: 'bg-brand-cream text-brand-red-deep',
    yellow: 'bg-brand-yellow text-brand-red-deep',
};

function Card({ p }: { p: Product }) {
    const { add } = useLandingCart();
    const { t, locale } = useLanguage();
    const pl = localizeProduct(p, locale);
    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            data-cursor="hover"
            className={`group relative flex flex-col overflow-hidden rounded-3xl p-5 ${TONE[p.tone]}`}
        >
            <div className="absolute right-4 top-4 z-10">
                <Chip variant={p.tone === 'deep' ? 'outline' : 'red'} size="sm">{pl.tag}</Chip>
            </div>

            <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.16),transparent_70%)]">
                <motion.div whileHover={{ scale: 1.08, rotate: -3 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="absolute inset-0">
                    <Image
                        src={p.src}
                        alt={`Sarayo Alwadiya ${pl.name} — ${pl.flavor}`}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
                        className="object-contain p-2 drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]"
                    />
                </motion.div>
            </div>

            {/* Prices are intentionally not shown on the storefront for now. */}
            <div className="mt-5">
                <h3 className="landing-display text-2xl leading-none">{pl.name}</h3>
                <p className="mt-1.5 text-sm opacity-70">{pl.flavor}</p>
            </div>

            <p className="mt-3 text-sm leading-relaxed opacity-65">{pl.description}</p>

            <button
                type="button"
                data-cursor="hover"
                onClick={() => add({ name: p.name, src: p.src, flavor: p.flavor, priceValue: p.priceValue })}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow py-3 font-grotesk text-xs font-bold uppercase tracking-wider text-brand-red-deep transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            >
                <CartIcon className="h-4 w-4" />
                {t('lnd.products.add')}
            </button>
        </motion.article>
    );
}

export default function ProductsView() {
    const { t } = useLanguage();
    const [cat, setCat] = useState<string>('All');
    const list = cat === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

    return (
        <section className="px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
            <div className="mx-auto max-w-[1280px]">
                {/* Header */}
                <div className="mb-10">
                    <Chip variant="yellow" size="md" className="mb-5">{t('lnd.products.chip')}</Chip>
                    <h1 className="landing-display text-[clamp(3rem,9vw,7rem)] leading-[0.88] text-white">
                        <TextReveal text={t('lnd.products.title')} />
                    </h1>
                    <p className="mt-5 max-w-lg font-grotesk text-base text-white/75">
                        {t('lnd.products.sub')}
                    </p>
                </div>

                {/* Filter chips */}
                <div className="mb-10 flex flex-wrap gap-2.5">
                    {CATEGORIES.map((c) => (
                        <button key={c} onClick={() => setCat(c)} data-cursor="hover" aria-pressed={cat === c}>
                            <Chip variant={cat === c ? 'yellow' : 'outline'} size="md">{t('lnd.cat.' + c)}</Chip>
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {list.map((p) => (
                            <Card key={p.name} p={p} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Closing strip */}
            <div className="mx-auto mt-20 max-w-[1280px]">
                <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/15 bg-brand-red-deep px-8 py-12 text-center sm:flex-row sm:text-left">
                    <div>
                        <h2 className="landing-display text-3xl text-white sm:text-4xl">{t('lnd.products.cantDecide')}</h2>
                        <p className="mt-2 font-grotesk text-sm text-white/70">{t('lnd.products.cantSub')}</p>
                    </div>
                    <Magnetic strength={0.5}>
                        <a href="/#cta" className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-9 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep">
                            <CartIcon className="h-4 w-4" />
                            {t('lnd.products.bundle')}
                        </a>
                    </Magnetic>
                </div>
            </div>
        </section>
    );
}
