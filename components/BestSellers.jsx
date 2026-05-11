'use client';

import {useEffect, useMemo, useRef} from 'react';
import {useCart} from '@/lib/CartContext';
import {useToast} from '@/lib/ToastContext';
import {useFlavor} from '@/lib/FlavorContext';
import {useLanguage} from '@/lib/LanguageContext';

const FALLBACK_IMG = '/lays-cheddar.png';

// Product flavor strings are stored as translation keys; the live label comes
// from t(`product.<id>`) so they switch with the locale.
const PRODUCTS = [
    {id: 'cheddar-sour-cream',  price: 18, bestSeller: true,  image: '/lays-cheddar.png',      tags: ['cheese', 'sour-cream']},
    {id: 'classic-salted',      price: 18, bestSeller: false, image: '/lays-classic.png',      tags: ['salt-vinegar']},
    {id: 'salt-vinegar',        price: 18, bestSeller: true,  image: '/lays-salt-vinegar.png', tags: ['salt-vinegar']},
    {id: 'wavy',                price: 18, bestSeller: false, image: '/lays-wavy.png',         tags: ['salt-vinegar']},
    {id: 'indian-spice',        price: 18, bestSeller: false, image: '/lays-indian.png',       tags: ['chili', 'pepper', 'sweet-chili']},
    {id: 'cheddar-classic',     price: 18, bestSeller: true,  image: '/lays-cheddar.png',      tags: ['cheese']},
    {id: 'wavy-bbq',            price: 18, bestSeller: false, image: '/lays-wavy.png',         tags: ['bbq']},
    {id: 'classic-large',       price: 18, bestSeller: false, image: '/lays-classic.png',      tags: ['salt-vinegar']},
    {id: 'spicy-masala',        price: 18, bestSeller: false, image: '/lays-indian.png',       tags: ['chili', 'pepper']},
    {id: 'salt-vinegar-twist',  price: 18, bestSeller: true,  image: '/lays-salt-vinegar.png', tags: ['salt-vinegar']},
    {id: 'wavy-cheddar',        price: 18, bestSeller: false, image: '/lays-wavy.png',         tags: ['cheese', 'ranch']},
    {id: 'sour-cream-classic',  price: 18, bestSeller: false, image: '/lays-cheddar.png',      tags: ['sour-cream', 'onion']},
    {id: 'classic-original',    price: 18, bestSeller: true,  image: '/lays-classic.png',      tags: ['salt-vinegar']},
    {id: 'wavy-bbq-deluxe',     price: 18, bestSeller: false, image: '/lays-wavy.png',         tags: ['bbq']},
    {id: 'indian-tandoori',     price: 18, bestSeller: false, image: '/lays-indian.png',       tags: ['chili', 'tomato']},
];

const PACK_LABEL_EN = '6 pack';
const PACK_LABEL_AR = 'علبة ٦ قطع';
const SIZE_LABEL_EN = '4oz bags';
const SIZE_LABEL_AR = 'أكياس ١١٣ جم';

const CartIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
        <path
            d="M3 4h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="10" cy="21" r="1.5" fill="#fff" />
        <circle cx="17" cy="21" r="1.5" fill="#fff" />
    </svg>
);

export default function BestSellers() {
    const scrollRef = useRef(null);
    const sectionRef = useRef(null);
    const {addItem} = useCart();
    const {showToast} = useToast();
    const {selectedFlavor, selectFlavor} = useFlavor();
    const {t, locale} = useLanguage();

    const visibleProducts = useMemo(() => {
        if (selectedFlavor === 'all') return PRODUCTS;
        return PRODUCTS.filter((p) => p.tags && p.tags.includes(selectedFlavor));
    }, [selectedFlavor]);

    const flavorLabel = t(`flavor.${selectedFlavor}`);
    const isFiltered = selectedFlavor !== 'all';
    const packLabel = locale === 'ar' ? PACK_LABEL_AR : PACK_LABEL_EN;
    const sizeLabel = locale === 'ar' ? SIZE_LABEL_AR : SIZE_LABEL_EN;
    const productName = t('product.name');

    function scroll(direction) {
        const target = scrollRef.current;
        if (!target) return;
        const page = target.clientWidth;
        target.scrollBy({left: direction === 'prev' ? -page : page, behavior: 'smooth'});
    }

    function handleAdd(product) {
        const flavorText = t(`product.${product.id}`);
        addItem({id: product.id, name: productName, price: product.price, flavor: flavorText});
        showToast(t('bs.added', {name: flavorText}));
    }

    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;
        const cards = root.querySelectorAll('.product-card');
        cards.forEach((c) => c.classList.add('reveal'));

        if (!('IntersectionObserver' in window)) {
            cards.forEach((c) => c.classList.add('is-revealed'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        io.unobserve(entry.target);
                    }
                });
            },
            {threshold: 0.05, rootMargin: '0px 0px 80px 0px'}
        );
        cards.forEach((c) => io.observe(c));

        const t = setTimeout(() => {
            cards.forEach((c) => c.classList.add('is-revealed'));
        }, 1500);

        return () => {
            clearTimeout(t);
            io.disconnect();
        };
    }, [visibleProducts]);

    return (
        <section
            className="best-sellers"
            id="products"
            aria-labelledby="bestSellersHeading"
            ref={sectionRef}
        >
            <div className="container">
                <div className="section-head">
                    <h2 id="bestSellersHeading" className="section-title">
                        {isFiltered ? t('bs.title.filtered', {flavor: flavorLabel}) : t('bs.title')}
                    </h2>
                    {isFiltered ? (
                        <button
                            type="button"
                            className="view-all"
                            onClick={() => selectFlavor('all')}
                        >
                            {t('bs.tasteAll')}
                        </button>
                    ) : (
                        <a href="#flavors" className="view-all">
                            {t('bs.pickFlavor')}
                        </a>
                    )}
                </div>

                {visibleProducts.length === 0 ? (
                    <div className="products-empty">
                        <p>{t('bs.empty')}</p>
                        <button
                            type="button"
                            className="btn btn-pill btn-primary"
                            onClick={() => selectFlavor('all')}
                        >
                            {t('bs.tasteAll')}
                        </button>
                    </div>
                ) : (
                <div className="products-wrap">
                    <button
                        className="carousel-arrow arrow-prev"
                        aria-label={t('bs.prev')}
                        onClick={() => scroll('prev')}
                    >
                        ‹
                    </button>

                    <div className="products-scroll" ref={scrollRef}>
                        {visibleProducts.map((p) => {
                            const flavorText = t(`product.${p.id}`);
                            return (
                                <article key={p.id} className="product-card">
                                    <div className="product-image">
                                        <span className="pack-badge">{packLabel}</span>
                                        {p.bestSeller && (
                                            <span className="best-seller-ribbon">{t('bs.ribbon')}</span>
                                        )}
                                        <img
                                            className="product-photo"
                                            src={p.image || FALLBACK_IMG}
                                            alt={flavorText}
                                            onError={(e) => {
                                                if (e.currentTarget.src.indexOf(FALLBACK_IMG) === -1) {
                                                    e.currentTarget.src = FALLBACK_IMG;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name">{productName}</h3>
                                        <p className="product-flavor">{flavorText}</p>
                                        <div className="product-row">
                                            <span className="product-meta">{sizeLabel}</span>
                                            <span className="product-price">{p.price} {locale === 'ar' ? 'جنيه' : 'EGP'}</span>
                                            <button
                                                className="add-cart-btn"
                                                aria-label={t('bs.addAria', {name: flavorText})}
                                                onClick={() => handleAdd(p)}
                                            >
                                                <CartIcon />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <button
                        className="carousel-arrow arrow-next"
                        aria-label={t('bs.next')}
                        onClick={() => scroll('next')}
                    >
                        ›
                    </button>
                </div>
                )}
            </div>
        </section>
    );
}
