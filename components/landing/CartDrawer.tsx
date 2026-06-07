'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLandingCart } from '@/lib/LandingCart';
import { useLanguage } from '@/lib/LanguageContext';
import { PRODUCTS, localizeProduct, formatPrice } from '@/lib/landingData';
import CartIcon from './CartIcon';
import Chip from './Chip';

export default function CartDrawer() {
    const { items, count, subtotal, isOpen, close, inc, dec, remove, clear } = useLandingCart();
    const { t, locale } = useLanguage();
    const [done, setDone] = useState(false);

    // Cart lines are keyed by the English product name; map back to the catalog
    // so names/flavors render in the active locale.
    const lineText = (name: string, fallbackFlavor: string) => {
        const prod = PRODUCTS.find((p) => p.name === name);
        const l = prod ? localizeProduct(prod, locale) : null;
        return { name: l ? l.name : name, flavor: l ? l.flavor : fallbackFlavor };
    };

    const checkout = () => {
        if (!items.length) return;
        setDone(true); // success screen is shown based on `done`, so clearing now is safe
        clear();
    };
    const keepShopping = () => {
        setDone(false);
        close();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={keepShopping}
                        className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm"
                    />
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                        className="fixed right-0 top-0 z-[130] flex h-full w-full max-w-md flex-col border-l border-white/15 bg-brand-red text-white"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/15 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <CartIcon className="h-5 w-5 text-brand-yellow" />
                                <h2 className="landing-display text-2xl">{t('lnd.cart.title')}</h2>
                                {count > 0 && <Chip variant="yellow" size="sm" interactive={false}>{count}</Chip>}
                            </div>
                            <button
                                onClick={keepShopping}
                                aria-label={t('lnd.cart.close')}
                                data-cursor="hover"
                                className="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-brand-red"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Success */}
                        {done ? (
                            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                                <motion.span
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                                    className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-yellow text-brand-red-deep"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.span>
                                <h3 className="landing-display text-3xl">{t('lnd.cart.placed')}</h3>
                                <p className="mt-3 max-w-xs font-grotesk text-sm text-white/75">
                                    {t('lnd.cart.placedBody')}
                                </p>
                                <button
                                    onClick={keepShopping}
                                    data-cursor="hover"
                                    className="mt-8 rounded-full bg-brand-yellow px-8 py-3.5 font-grotesk text-xs font-bold uppercase tracking-wider text-brand-red-deep transition-transform hover:scale-105"
                                >
                                    {t('lnd.cart.keep')}
                                </button>
                            </div>
                        ) : items.length === 0 ? (
                            /* Empty state */
                            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                                <span className="mb-6 grid h-20 w-20 place-items-center rounded-full border border-white/20 text-white/50">
                                    <CartIcon className="h-9 w-9" />
                                </span>
                                <h3 className="landing-display text-3xl">{t('lnd.cart.empty')}</h3>
                                <p className="mt-3 max-w-xs font-grotesk text-sm text-white/70">
                                    {t('lnd.cart.emptyBody')}
                                </p>
                                <a
                                    href="/products"
                                    onClick={keepShopping}
                                    data-cursor="hover"
                                    className="mt-8 rounded-full bg-brand-yellow px-8 py-3.5 font-grotesk text-xs font-bold uppercase tracking-wider text-brand-red-deep transition-transform hover:scale-105"
                                >
                                    {t('lnd.cart.browse')}
                                </a>
                            </div>
                        ) : (
                            <>
                                {/* Items */}
                                <div className="flex-1 overflow-y-auto px-6 py-5">
                                    <AnimatePresence initial={false}>
                                        {items.map((l) => (
                                            <motion.div
                                                key={l.name}
                                                layout
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-4 border-b border-white/10 py-4"
                                            >
                                                <span className="relative h-16 w-14 shrink-0 rounded-xl bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.18),transparent_70%)]">
                                                    <Image src={l.src} alt={lineText(l.name, l.flavor).name} fill sizes="56px" className="object-contain p-1" />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="landing-display text-lg leading-none">{lineText(l.name, l.flavor).name}</h4>
                                                    <p className="mt-1 text-xs text-white/60">{lineText(l.name, l.flavor).flavor}</p>
                                                    <div className="mt-2 inline-flex items-center gap-3 rounded-full border border-white/20 px-2 py-1">
                                                        <button onClick={() => dec(l.name)} data-cursor="hover" aria-label={t('lnd.cart.dec')} className="text-base leading-none text-white/80 hover:text-brand-yellow">−</button>
                                                        <span className="min-w-4 text-center font-grotesk text-sm font-semibold">{l.qty}</span>
                                                        <button onClick={() => inc(l.name)} data-cursor="hover" aria-label={t('lnd.cart.inc')} className="text-base leading-none text-white/80 hover:text-brand-yellow">+</button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="landing-display text-lg text-brand-yellow">{formatPrice(l.qty * l.price, locale)}</span>
                                                    <button onClick={() => remove(l.name)} data-cursor="hover" className="text-[11px] uppercase tracking-wider text-white/50 hover:text-white">{t('lnd.cart.remove')}</button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-white/15 px-6 py-5">
                                    <div className="mb-4 flex items-baseline justify-between">
                                        <span className="font-grotesk text-sm uppercase tracking-wider text-white/70">{t('lnd.cart.subtotal')}</span>
                                        <span className="landing-display text-3xl text-white">{formatPrice(subtotal, locale)}</span>
                                    </div>
                                    <button
                                        onClick={checkout}
                                        data-cursor="hover"
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep transition-transform hover:scale-[1.02] active:scale-95"
                                    >
                                        <CartIcon className="h-4 w-4" />
                                        {t('lnd.cart.checkout')} · {formatPrice(subtotal, locale)}
                                    </button>
                                    <p className="mt-3 text-center text-[11px] text-white/45">{t('lnd.cart.freeDelivery')}</p>
                                </div>
                            </>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
