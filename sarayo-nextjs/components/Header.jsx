'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {useCart} from '@/lib/CartContext';
import BrandLogo from './BrandLogo';

const NAV_LINKS = [
    {href: '/#products', label: 'shop', sectionId: 'products'},
    {href: '/#story', label: 'learn', sectionId: 'story'},
    {href: '#', label: 'subscribe', sectionId: 'subscribe'},
];

const PROMO_MESSAGES = [
    'Shop our NEW Variety Packs',
    'Free shipping on orders over 200 EGP',
    'Crispy. Bold. Sarayo.',
    'New flavors dropping soon',
];

export default function Header() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    const {count, hydrated} = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const navRef = useRef(null);
    const toggleRef = useRef(null);
    const badgeRef = useRef(null);
    const prevCountRef = useRef(0);

    // Animate the cart badge whenever count grows (Web Animations API, mirrors original)
    useEffect(() => {
        if (!hydrated) return;
        if (count > prevCountRef.current && badgeRef.current) {
            badgeRef.current.animate(
                [
                    {transform: 'scale(1)'},
                    {transform: 'scale(1.4)'},
                    {transform: 'scale(1)'},
                ],
                {duration: 400, easing: 'cubic-bezier(.4,0,.2,1)'}
            );
        }
        prevCountRef.current = count;
    }, [count, hydrated]);

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return;
        function onDocClick(e) {
            if (
                navRef.current &&
                !navRef.current.contains(e.target) &&
                toggleRef.current &&
                !toggleRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, [menuOpen]);

    // Active nav link based on scroll position (home page only)
    useEffect(() => {
        if (!isHomePage) return;
        function update() {
            const fromTop = window.scrollY + 140;
            let active = 'home';
            for (const {sectionId} of NAV_LINKS) {
                const el = document.getElementById(sectionId);
                if (el && el.offsetTop <= fromTop) active = sectionId;
            }
            setActiveSection(active);
        }
        update();
        window.addEventListener('scroll', update, {passive: true});
        return () => window.removeEventListener('scroll', update);
    }, [isHomePage]);

    function handleNavClick() {
        setMenuOpen(false);
    }

    return (
        <>
            {/* Top scrolling promo strip */}
            <div className="promo-strip" aria-label="Site promotions">
                <div className="promo-track">
                    {[...PROMO_MESSAGES, ...PROMO_MESSAGES].map((msg, i) => (
                        <span key={i}>{msg}</span>
                    ))}
                </div>
            </div>

        <header className="site-header">
            <div className="container header-inner">
                {/* Brand / Logo */}
                <Link href="/#home" className="brand" aria-label="Sarayo Alwadiya home">
                    <span className="brand-logo" aria-hidden="true">
                        <BrandLogo />
                    </span>
                </Link>

                {/* Primary Nav */}
                <nav
                    className={`main-nav${menuOpen ? ' is-open' : ''}`}
                    aria-label="Primary"
                    ref={navRef}
                >
                    <ul>
                        {NAV_LINKS.map(({href, label, sectionId}) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={
                                        'nav-link' +
                                        (isHomePage && activeSection === sectionId
                                            ? ' is-active'
                                            : '')
                                    }
                                    onClick={handleNavClick}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right side: account + cart + hamburger */}
                <div className="header-actions">
                    <a href="#" className="account-link" aria-label="Account">account</a>

                    <Link
                        href="/cart"
                        className={
                            'cart-btn' + (pathname === '/cart' ? ' is-active-page' : '')
                        }
                        aria-label="View cart"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                            <path
                                d="M3 4h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="10" cy="21" r="1.3" fill="currentColor" />
                            <circle cx="17" cy="21" r="1.3" fill="currentColor" />
                        </svg>
                        <span className="cart-badge" ref={badgeRef}>
                            {hydrated ? count : 0}
                        </span>
                    </Link>

                    <button
                        className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                        ref={toggleRef}
                        onClick={() => setMenuOpen((o) => !o)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

        </header>
        </>
    );
}
