'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import CartIcon from './CartIcon';
import LangToggle from '@/components/LangToggle';
import { useLandingCart } from '@/lib/LandingCart';
import { useLanguage } from '@/lib/LanguageContext';
import { NAV_LINKS } from '@/lib/landingData';

/* ─── Product data ─────────────────────────────────────────── */
// NOTE: mini-cornice and private-label reuse cornice.png as a stand-in —
// they still need their own artwork in /public/products-chipsy/.
const SNACK_PRODUCTS = [
    { name: 'Cornice',       nameAr: 'كورنايس',       href: '/products/cornice',       img: '/products-chipsy/cornice.png',    sub: 'Crisps',        subAr: 'شيبس' },
    { name: 'Mini Cornice',  nameAr: 'ميني كورنايس',  href: '/products/mini-cornice',  img: '/products-chipsy/cornice.png',    sub: 'Mini Crisps',   subAr: 'شيبس ميني' },
    { name: 'Pop Cornice',   nameAr: 'بوب كورنايس',   href: '/products/pop-cornice',   img: '/products-chipsy/popcornice.png', sub: 'Popcorn',       subAr: 'بوب كورن' },
    { name: 'Flipi Puffs',   nameAr: 'فلايبي بافس',   href: '/products/flipi-puffs',   img: '/products-chipsy/flipi.png',      sub: 'Puffs',         subAr: 'بافز' },
    { name: 'Taco',          nameAr: 'تاكو',          href: '/products/taco',          img: '/products-chipsy/taco.png',       sub: 'Tortilla',      subAr: 'تورتيلا' },
    { name: 'Private Label', nameAr: 'برايفت ليبيل',  href: '/products/private-label', img: '/products-chipsy/cornice.png',    sub: 'Contract Mfg.', subAr: 'تصنيع لدى الغير' },
];

// Sarayo's own wafer, plus the two private-label brands we produce.
// The sub-label carries the grouping, since the menu renders a flat card grid.
const WAFER_PRODUCTS = [
    { name: 'Sarayo Wafer',    nameAr: 'ويفر سرايو',     href: '/wafer',               img: '/wafer-products/wafer-choco.png',      sub: 'Our Brand',     subAr: 'علامتنا' },
    { name: 'Abu Auf Wafer',   nameAr: 'ويفر أبو عوف',   href: '/wafer/abu-auf',       img: '/wafer-products/wafer-lemon.png',      sub: 'Private Label', subAr: 'برايفت ليبيل' },
    { name: 'Americana Wafer', nameAr: 'ويفر أمريكانا',  href: '/wafer/americana',     img: '/wafer-products/wafer-strewberry.png', sub: 'Private Label', subAr: 'برايفت ليبيل' },
];

const MENUS = {
    snacks: {
        products : SNACK_PRODUCTS,
        label    : 'Snack Products',
        labelAr  : 'منتجات الوجبات الخفيفة',
        viewAll  : '/products',
        viewAllAr: 'عرض كل الوجبات الخفيفة ←',
        viewAllEn: 'View all Snacks →',
    },
    wafer: {
        products : WAFER_PRODUCTS,
        label    : 'Wafer Products',
        labelAr  : 'منتجات الويفر',
        viewAll  : '/wafer',
        viewAllAr: 'عرض كل الويفر ←',
        viewAllEn: 'View all Wafer →',
    },
} as const;

type MenuKey = keyof typeof MENUS | null;

const COMPANY_LINKS = NAV_LINKS.slice(2);

/* ─── Component ────────────────────────────────────────────── */
export default function LandingNav() {
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

    const currentMenu = activeMenu ? MENUS[activeMenu] : null;

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

                        {/* Logo */}
                        <a href="/" aria-label="Sarayo home" className="flex flex-shrink-0 items-center">
                            <motion.span
                                whileHover={{ rotate: -3, scale: 1.06 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 13 }}
                                className="block flex-shrink-0"
                            >
                                {/* Badge lockup already carries the wordmark — no separate text label. */}
                                <Image
                                    src="/sarayo-logo.png"
                                    alt="Sarayo"
                                    width={900}
                                    height={514}
                                    className="h-[46px] w-auto object-contain sm:h-[64px] lg:h-[72px]"
                                    priority
                                />
                            </motion.span>
                        </a>

                        {/* Desktop links */}
                        <ul className="hidden items-center gap-0.5 xl:flex">

                            {/* Chipsy */}
                            <motion.li initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                       transition={{ delay: 0.12, duration: 0.4 }}
                                       onMouseEnter={() => enterMenu('snacks')}>
                                <a href="/products" className="group flex items-center gap-1 px-4 py-2.5">
                                    <span className="landing-display text-[17px] text-brand-red-deep transition-colors group-hover:text-brand-red">
                                        {locale === 'ar' ? NAV_LINKS[0].labelAr : NAV_LINKS[0].label}
                                    </span>
                                    <motion.span animate={{ rotate: activeMenu === 'snacks' ? 180 : 0 }}
                                                 transition={{ duration: 0.2 }}
                                                 className="mt-0.5 text-[9px] text-brand-red-deep/50 group-hover:text-brand-red">▾</motion.span>
                                </a>
                            </motion.li>

                            {/* Wafer */}
                            <motion.li initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                       transition={{ delay: 0.17, duration: 0.4 }}
                                       onMouseEnter={() => enterMenu('wafer')}>
                                <a href="/wafer" className="group flex items-center gap-1 px-4 py-2.5">
                                    <span className="landing-display text-[17px] text-brand-red-deep transition-colors group-hover:text-brand-red">
                                        {locale === 'ar' ? NAV_LINKS[1].labelAr : NAV_LINKS[1].label}
                                    </span>
                                    <motion.span animate={{ rotate: activeMenu === 'wafer' ? 180 : 0 }}
                                                 transition={{ duration: 0.2 }}
                                                 className="mt-0.5 text-[9px] text-brand-red-deep/50 group-hover:text-brand-red">▾</motion.span>
                                </a>
                            </motion.li>

                            {/* Separator */}
                            <li className="mx-2 h-4 w-px bg-brand-ink/15" />

                            {/* Company links */}
                            {COMPANY_LINKS.map((link, i) => (
                                <motion.li key={link.href}
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
                            {/* Visibility is controlled by this wrapper: `.lang-toggle` hard-sets
                                `display: inline-flex`, so `hidden`/`sm:inline-flex` on the button
                                itself would be ignored. Colour is always brand red — never white. */}
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

                    {/* ══ MEGA-MENU — expands the pill downward ══ */}
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
                                                {locale === 'ar' ? currentMenu.labelAr : currentMenu.label}
                                            </span>
                                        </div>
                                        <a href={currentMenu.viewAll}
                                           className="font-grotesk text-[10px] font-bold uppercase tracking-[1.5px] text-brand-ink/45 transition-colors hover:text-brand-red">
                                            {locale === 'ar' ? currentMenu.viewAllAr : currentMenu.viewAllEn}
                                        </a>
                                    </div>

                                    {/* 4 landscape cards */}
                                    {/* Exactly 4 items fill one row; everything else sits 3 per row. */}
                                    <div className={`grid gap-3 ${currentMenu.products.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                                        {currentMenu.products.map((p, i) => (
                                            <motion.a
                                                key={p.href}
                                                href={p.href}
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0  }}
                                                transition={{ delay: i * 0.07, duration: 0.3 }}
                                                className="group relative overflow-hidden rounded-xl"
                                            >
                                                <div className="relative aspect-[16/10] w-full">
                                                    <Image
                                                        src={p.img}
                                                        alt={p.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        sizes="(max-width:1280px) 33vw, 390px"
                                                    />
                                                    {/* gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-all duration-300 group-hover:from-brand-red-deep/90" />
                                                    {/* yellow left bar */}
                                                    <div className="absolute inset-y-0 left-0 w-[4px] origin-bottom scale-y-0 rounded-r bg-brand-yellow transition-transform duration-300 group-hover:scale-y-100" />
                                                    {/* text */}
                                                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3">
                                                        <div>
                                                            <p className="landing-display text-[20px] text-white leading-none"
                                                               style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                                                                {locale === 'ar' ? p.nameAr : p.name}
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
                        {/* Content starts below the fixed header bar. The burger itself
                            morphs into an ✕, so no second close button is needed here. */}
                        <div className="flex flex-1 flex-col px-5 pb-12 pt-[92px] sm:px-6 sm:pt-[112px]">

                            {/* PRODUCTS label */}
                            <p className="mb-5 font-grotesk text-[10px] font-bold uppercase tracking-[3px] text-white/35">
                                {locale === 'ar' ? 'المنتجات' : 'Products'}
                            </p>

                            {/* ── Chipsy accordion ── */}
                            <MobileAccordion
                                label={locale === 'ar' ? NAV_LINKS[0].labelAr : NAV_LINKS[0].label}
                                isOpen={mobileExpanded === 'snacks'}
                                onToggle={() => toggleMobile('snacks')}
                                products={SNACK_PRODUCTS}
                                locale={locale}
                                onClose={() => setMobileOpen(false)}
                                delay={0.06}
                            />

                            {/* ── Wafer accordion ── */}
                            <MobileAccordion
                                label={locale === 'ar' ? NAV_LINKS[1].labelAr : NAV_LINKS[1].label}
                                isOpen={mobileExpanded === 'wafer'}
                                onToggle={() => toggleMobile('wafer')}
                                products={WAFER_PRODUCTS}
                                locale={locale}
                                onClose={() => setMobileOpen(false)}
                                delay={0.12}
                            />

                            {/* COMPANY label */}
                            <p className="mb-4 mt-8 font-grotesk text-[10px] font-bold uppercase tracking-[3px] text-white/30">
                                {locale === 'ar' ? 'الشركة' : 'Company'}
                            </p>

                            <ul>
                                {COMPANY_LINKS.map((link, i) => (
                                    <motion.li key={link.href}
                                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.06 }}>
                                        <a href={link.href} onClick={() => setMobileOpen(false)}
                                           className="group flex items-center justify-between border-b border-white/8 py-3">
                                            <span className="landing-display text-[1.55rem] text-white/45 transition-colors group-hover:text-white sm:text-[2.1rem]">
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
    products: typeof SNACK_PRODUCTS;
    locale: string;
    onClose: () => void;
    delay: number;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
            <button type="button" onClick={onToggle}
                className="group flex w-full items-center justify-between border-b border-white/10 pb-4">
                <span className="landing-display text-[2.3rem] leading-none text-white sm:text-[3.2rem]"
                      style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.2)' }}>
                    {label}
                </span>
                <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}
                             className="landing-display text-[1.7rem] text-brand-yellow/50 sm:text-[2.2rem]">›</motion.span>
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
                                <motion.a key={p.href} href={p.href} onClick={onClose}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="group relative overflow-hidden rounded-xl">
                                    <div className="relative aspect-[4/3] w-full">
                                        <Image src={p.img} alt={p.name} fill
                                               className="object-cover transition-transform duration-500 group-hover:scale-105"
                                               sizes="180px" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-red-deep/90 via-black/10 to-transparent" />
                                        <div className="absolute inset-y-0 left-0 w-[4px] origin-bottom scale-y-0 rounded-r bg-brand-yellow transition-transform duration-300 group-hover:scale-y-100" />
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <p className="landing-display text-[17px] text-white leading-none"
                                               style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}>
                                                {locale === 'ar' ? p.nameAr : p.name}
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
