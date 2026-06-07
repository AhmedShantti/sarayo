'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Chip from './Chip';
import CartIcon from './CartIcon';
import LangToggle from '@/components/LangToggle';
import { useLandingCart } from '@/lib/LandingCart';
import { useLanguage } from '@/lib/LanguageContext';
import { NAV_LINKS } from '@/lib/landingData';

export default function LandingNav() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { count, open: openCart } = useLandingCart();
    const { t, locale } = useLanguage();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                scrolled
                    ? 'bg-brand-red/80 backdrop-blur-md border-b border-white/10'
                    : 'bg-transparent'
            }`}
        >
            <nav className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 sm:px-8">
                {/* Logo */}
                <a href="/" className="flex items-center gap-3" aria-label={t('lnd.nav.homeAria')}>
                    <span className="grid h-12 w-12 place-items-center sm:h-14 sm:w-14">
                        <Image
                            src="/images.png"
                            alt="Sarayo Alwadiya logo"
                            width={56}
                            height={56}
                            className="h-full w-full object-contain"
                            priority
                        />
                    </span>
                    <span className="landing-display hidden text-lg leading-none text-white sm:block">
                        Sarayo
                    </span>
                </a>

                {/* Desktop links */}
                <ul className="hidden items-center gap-2 md:flex">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} className="group block px-1">
                                <Chip variant="outline" size="md" className="transition-colors group-hover:bg-white group-hover:text-brand-red">
                                    {locale === 'ar' ? link.labelAr : link.label}
                                </Chip>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* CTA + burger */}
                <div className="flex items-center gap-3">
                    <LangToggle className="hidden text-white/90 hover:text-white sm:inline-flex" />
                    <button
                        type="button"
                        onClick={openCart}
                        aria-label={t('lnd.nav.cartAria', { n: count })}
                        className="relative grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-brand-red"
                    >
                        <CartIcon className="h-5 w-5" />
                        {count > 0 && (
                            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-yellow px-1 font-grotesk text-[10px] font-bold text-brand-red-deep">
                                {count}
                            </span>
                        )}
                    </button>
                    <a href="/products" className="hidden sm:block">
                        <Chip variant="yellow" size="md">{t('lnd.nav.cta')}</Chip>
                    </a>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label={t('lnd.nav.menuAria')}
                        aria-expanded={open}
                        className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white md:hidden"
                    >
                        <span className="relative block h-3 w-5">
                            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
                            <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-white transition-transform duration-300 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-white/10 bg-brand-red-deep/95 backdrop-blur-md md:hidden"
                    >
                        <ul className="flex flex-col gap-3 px-6 py-6">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="landing-display block text-2xl text-white/90"
                                    >
                                        {locale === 'ar' ? link.labelAr : link.label}
                                    </a>
                                </li>
                            ))}
                            <li className="flex items-center gap-3 pt-2">
                                <a href="/products" onClick={() => setOpen(false)}>
                                    <Chip variant="yellow" size="lg">{t('lnd.nav.cta')}</Chip>
                                </a>
                                <LangToggle className="text-white/90 hover:text-white" />
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
