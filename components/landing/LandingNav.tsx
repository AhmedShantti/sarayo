'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import CartIcon from './CartIcon';
import LangToggle from '@/components/LangToggle';
import { useLandingCart } from '@/lib/LandingCart';
import { useLanguage } from '@/lib/LanguageContext';
import type { NavItem } from '@/lib/landingData';

type MenuKey = string | null;

/* ─── Component ────────────────────────────────────────────── */
export default function LandingNav({ nav }: { nav: { items: NavItem[] } }) {
    const menuItems  = nav.items.filter(i => i.children && i.children.length > 0);
    const plainItems = nav.items.filter(i => !i.children || i.children.length === 0);

    const [mobileOpen, setMobileOpen]       = useState(false);
    const [activeMenu, setActiveMenu]       = useState<MenuKey>(null);
    const [mobileExpanded, setMobileExpanded] = useState<MenuKey>(null);
    const closeTimer                        = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const { count, open: openCart }         = useLandingCart();
    const { t, locale }                     = useLanguage();

    // No scroll listener by design: the bar must look identical at every scroll
    // position — no height change, no shadow change, no reflow.

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const enterMenu = (key: MenuKey) => { clearTimeout(closeTimer.current); setActiveMenu(key); };
    const leaveMenu = ()             => { closeTimer.current = setTimeout(() => setActiveMenu(null), 100); };

    const toggleMobile = (key: MenuKey) =>
        setMobileExpanded(prev => (prev === key ? null : key));

    const currentMenu = activeMenu ? menuItems.find(i => i.id === activeMenu) ?? null : null;

    return (
        <>
            {/* ═══════════════════════════════════════════
                NAV BAR
            ═══════════════════════════════════════════ */}
            <motion.header
                initial={{ y: -90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-0 top-0 z-50"
            >
                {/* Solid full-width bar, flush to the top edge. Constant height and
                    styling at every scroll position — nothing animates on scroll. */}
                <div
                    onMouseLeave={leaveMenu}
                    className="relative flex w-full flex-col border-b-[3px] border-brand-yellow bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
                >
                    {/* ── Top row ── */}
                    <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between px-4 sm:h-[84px] sm:px-6 lg:h-[92px]">

                        {/* Logo — icon only, sized up now that it no longer shares the lockup with a wordmark. */}
                        <a href="/" aria-label="Sarayo home" className="flex flex-shrink-0 items-center">
                            <motion.span
                                whileHover={{ rotate: -10, scale: 1.12 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 13 }}
                                className="block h-24 w-24 flex-shrink-0 sm:h-32 sm:w-32 lg:h-[140px] lg:w-[140px]"
                            >
                                <Image src="/sarayo-icon.png" alt="Sarayo" width={144} height={144} className="h-full w-full object-contain" priority />
                            </motion.span>
                        </a>

                        {/* Desktop links */}
                        <ul className="hidden items-center gap-0.5 xl:flex">

                            {/* Dropdown/mega-menu items */}
                            {menuItems.map((item, i) => (
                                <motion.li key={item.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                           transition={{ delay: 0.12 + i * 0.05, duration: 0.4 }}
                                           onMouseEnter={() => enterMenu(item.id)}>
                                    <a href={item.href} className="group flex items-center gap-1 px-4 py-2.5">
                                        <span className="landing-display text-[16px] text-brand-red-deep transition-colors group-hover:text-brand-red">
                                            {locale === 'ar' ? item.labelAr : item.label}
                                        </span>
                                        <motion.span animate={{ rotate: activeMenu === item.id ? 180 : 0 }}
                                                     transition={{ duration: 0.2 }}
                                                     className="mt-0.5 text-[9px] text-brand-red-deep/50 group-hover:text-brand-red">▾</motion.span>
                                    </a>
                                </motion.li>
                            ))}

                            {/* Separator */}
                            {menuItems.length > 0 && plainItems.length > 0 && (
                                <li className="mx-2 h-4 w-px bg-brand-ink/15" />
                            )}

                            {/* Company links */}
                            {plainItems.map((link, i) => (
                                <motion.li key={link.id}
                                           initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                           transition={{ delay: 0.22 + i * 0.055, duration: 0.4 }}
                                           onMouseEnter={() => enterMenu(null)}>
                                    <a href={link.href} className="group relative block px-3.5 py-2.5">
                                        <span className="font-grotesk text-[11px] font-bold uppercase tracking-[1.4px] text-brand-ink/60 transition-colors group-hover:text-brand-red">
                                            {locale === 'ar' ? link.labelAr : link.label}
                                        </span>
                                        <span className="absolute bottom-1 left-3.5 right-3.5 h-px origin-left scale-x-0 bg-brand-red/50 transition-transform duration-300 group-hover:scale-x-100" />
                                    </a>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:block">
                                <LangToggle className="text-brand-red hover:text-brand-red-deep" />
                            </span>

                            {/* Cart */}
                            <motion.button type="button" onClick={openCart}
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                                aria-label={t('lnd.nav.cartAria', { n: count })}
                                className="relative grid h-9 w-9 place-items-center rounded-xl border border-brand-ink/15 text-brand-ink hover:bg-brand-ink/5">
                                <CartIcon className="h-[18px] w-[18px]" />
                                <AnimatePresence>
                                    {count > 0 && (
                                        <motion.span key="badge"
                                            initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                                            className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-yellow px-1 font-grotesk text-[9px] font-bold text-brand-red-deep">
                                            {count}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* CTA */}
                            <motion.a href="/products"
                                whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
                                className="hidden rounded-xl bg-brand-red px-5 py-2.5 shadow-[0_3px_0_#A80A12] sm:block">
                                <span className="landing-display text-[14px] text-white">{t('lnd.nav.cta')}</span>
                            </motion.a>

                            {/* Burger */}
                            <button type="button" onClick={() => setMobileOpen(v => !v)}
                                aria-label={t('lnd.nav.menuAria')} aria-expanded={mobileOpen}
                                className="grid h-9 w-9 place-items-center rounded-xl border border-brand-ink/15 text-brand-ink hover:bg-brand-ink/5 xl:hidden">
                                <span className="relative block h-[13px] w-5">
                                    <motion.span animate={mobileOpen ? { top: '5px', rotate: 45 }  : { top: 0,      rotate: 0  }} transition={{ duration: 0.22 }} className="absolute left-0 h-[2px] w-5 rounded-full bg-brand-ink" />
                                    <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 }   : { opacity: 1, scaleX: 1  }} transition={{ duration: 0.15 }} className="absolute left-0 top-[5px] h-[2px] w-5 rounded-full bg-brand-ink" />
                                    <motion.span animate={mobileOpen ? { top: '5px', rotate: -45 } : { top: '11px', rotate: 0  }} transition={{ duration: 0.22 }} className="absolute left-0 h-[2px] w-5 rounded-full bg-brand-ink" />
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* ══ MEGA-MENU — expands the bar downward ══ */}
                    <AnimatePresence mode="wait">
                        {currentMenu && (
                            <motion.div
                                key={activeMenu}
                                initial={{ opacity: 0, scaleY: 0.88, y: -8 }}
                                animate={{ opacity: 1, scaleY: 1,    y: 0  }}
                                exit={{    opacity: 0, scaleY: 0.92, y: -4 }}
                                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                style={{ transformOrigin: 'top center' }}
                                onMouseEnter={() => enterMenu(activeMenu)}
                                className="w-full border-t border-brand-ink/10"
                            >
                                <div className="mx-auto w-full max-w-[1240px] px-4 pb-5 pt-4 sm:px-6">
                                    {/* Header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-brand-red" />
                                            <span className="landing-display text-[13px] text-brand-red">
                                                {locale === 'ar' ? (currentMenu.menuLabelAr ?? currentMenu.labelAr) : (currentMenu.menuLabel ?? currentMenu.label)}
                                            </span>
                                        </div>
                                        <a href={currentMenu.href}
                                           className="font-grotesk text-[10px] font-bold uppercase tracking-[1.5px] text-brand-ink/45 transition-colors hover:text-brand-red">
                                            {locale === 'ar' ? currentMenu.viewAllLabelAr : currentMenu.viewAllLabel}
                                        </a>
                                    </div>

                                    {/* Landscape cards — exactly 4 items fill one row; everything else sits 3 per row. */}
                                    <div className={`grid gap-3 ${(currentMenu.children ?? []).length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                                        {(currentMenu.children ?? []).map((p, i) => (
                                            <motion.a
                                                key={p.id}
                                                href={p.href}
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0  }}
                                                transition={{ delay: i * 0.07, duration: 0.3 }}
                                                className="group relative overflow-hidden rounded-xl"
                                            >
                                                <div className="relative aspect-[16/10] w-full">
                                                    <Image
                                                        src={p.img ?? ''}
                                                        alt={p.label}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        sizes="(max-width:1280px) 25vw, 290px"
                                                    />
                                                    {/* gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-all duration-300 group-hover:from-brand-red-deep/90" />
                                                    {/* yellow left bar */}
                                                    <div className="absolute inset-y-0 left-0 w-[4px] origin-bottom scale-y-0 rounded-r bg-brand-yellow transition-transform duration-300 group-hover:scale-y-100" />
                                                    {/* private-label stamp */}
                                                    {(locale === 'ar' ? p.badgeAr : p.badge) && (
                                                        <span className="landing-display absolute right-2 top-2 rotate-[-4deg] rounded-full bg-brand-yellow px-2.5 py-1 text-[10px] text-brand-red-deep shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
                                                            {locale === 'ar' ? p.badgeAr : p.badge}
                                                        </span>
                                                    )}
                                                    {/* text */}
                                                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3">
                                                        <div>
                                                            <p className="landing-display text-[20px] text-white leading-none"
                                                               style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                                                                {locale === 'ar' ? p.labelAr : p.label}
                                                            </p>
                                                            <p className="mt-0.5 font-grotesk text-[9px] uppercase tracking-[1.5px] text-brand-yellow/70 transition-colors group-hover:text-brand-yellow">
                                                                {locale === 'ar' ? p.subAr : p.sub}
                                                            </p>
                                                        </div>
                                                        <span className="font-grotesk text-lg text-white/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-yellow">→</span>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.header>

            {/* ═══════════════════════════════════════════
                MOBILE FULL-SCREEN MENU
            ═══════════════════════════════════════════ */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile"
                        initial={{ opacity: 0, y: -24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-brand-red xl:hidden"
                    >
                        {/* Yellow ribbon */}
                        <div className="h-[4px] w-full flex-shrink-0 bg-brand-yellow" />

                        {/* Header */}
                        <div className="flex flex-shrink-0 items-center justify-between px-6 pt-5">
                            <span className="landing-display text-[18px] text-white/35">Menu</span>
                            <button type="button" onClick={() => setMobileOpen(false)}
                                className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 text-white">
                                <span className="font-grotesk text-xl leading-none">✕</span>
                            </button>
                        </div>

                        <div className="flex flex-1 flex-col px-6 pb-12 pt-8">

                            {/* PRODUCTS label */}
                            <p className="mb-5 font-grotesk text-[10px] font-bold uppercase tracking-[3px] text-white/35">
                                {locale === 'ar' ? 'المنتجات' : 'Products'}
                            </p>

                            {/* ── Dropdown item accordions ── */}
                            {menuItems.map((item, i) => (
                                <MobileAccordion
                                    key={item.id}
                                    label={locale === 'ar' ? item.labelAr : item.label}
                                    isOpen={mobileExpanded === item.id}
                                    onToggle={() => toggleMobile(item.id)}
                                    products={item.children ?? []}
                                    locale={locale}
                                    onClose={() => setMobileOpen(false)}
                                    delay={0.06 + i * 0.06}
                                />
                            ))}

                            {/* COMPANY label */}
                            <p className="mb-4 mt-8 font-grotesk text-[10px] font-bold uppercase tracking-[3px] text-white/30">
                                {locale === 'ar' ? 'الشركة' : 'Company'}
                            </p>

                            <ul>
                                {plainItems.map((link, i) => (
                                    <motion.li key={link.id}
                                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.06 }}>
                                        <a href={link.href} onClick={() => setMobileOpen(false)}
                                           className="group flex items-center justify-between border-b border-white/8 py-3">
                                            <span className="landing-display text-[2.1rem] text-white/45 transition-colors group-hover:text-white">
                                                {locale === 'ar' ? link.labelAr : link.label}
                                            </span>
                                            <span className="font-grotesk text-xl text-white/15 group-hover:text-white/40">›</span>
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* CTA + Lang */}
                            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.44 }}
                                className="mt-auto flex items-center gap-4 pt-10">
                                <a href="/products" onClick={() => setMobileOpen(false)}
                                   className="flex-1 rounded-xl bg-brand-yellow py-4 text-center shadow-[0_5px_0_rgba(0,0,0,0.3)]">
                                    <span className="landing-display text-[16px] text-brand-red-deep">{t('lnd.nav.cta')}</span>
                                </a>
                                <LangToggle className="text-white/45 hover:text-white" />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ─── Mobile accordion row ─────────────────────────────────── */
function MobileAccordion({
    label, isOpen, onToggle, products, locale, onClose, delay,
}: {
    label: string;
    isOpen: boolean;
    onToggle: () => void;
    products: NavItem[];
    locale: string;
    onClose: () => void;
    delay: number;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
            <button type="button" onClick={onToggle}
                className="group flex w-full items-center justify-between border-b border-white/10 pb-4">
                <span className="landing-display text-[3.2rem] text-white leading-none"
                      style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.2)' }}>
                    {label}
                </span>
                <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}
                             className="landing-display text-[2.2rem] text-brand-yellow/50">›</motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-2 gap-3 py-4">
                            {products.map((p, i) => (
                                <motion.a key={p.id} href={p.href} onClick={onClose}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="group relative overflow-hidden rounded-xl">
                                    <div className="relative aspect-[4/3] w-full">
                                        <Image src={p.img ?? ''} alt={p.label} fill
                                               className="object-cover transition-transform duration-500 group-hover:scale-105"
                                               sizes="180px" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-red-deep/90 via-black/10 to-transparent" />
                                        <div className="absolute inset-y-0 left-0 w-[4px] origin-bottom scale-y-0 rounded-r bg-brand-yellow transition-transform duration-300 group-hover:scale-y-100" />
                                        {(locale === 'ar' ? p.badgeAr : p.badge) && (
                                            <span className="landing-display absolute right-2 top-2 rotate-[-4deg] rounded-full bg-brand-yellow px-2 py-0.5 text-[9px] text-brand-red-deep shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                                                {locale === 'ar' ? p.badgeAr : p.badge}
                                            </span>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <p className="landing-display text-[17px] text-white leading-none"
                                               style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}>
                                                {locale === 'ar' ? p.labelAr : p.label}
                                            </p>
                                            <p className="mt-0.5 font-grotesk text-[9px] uppercase tracking-wider text-brand-yellow/60">
                                                {locale === 'ar' ? p.subAr : p.sub}
                                            </p>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
