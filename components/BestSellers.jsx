'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {useCart} from '@/lib/CartContext';
import {useToast} from '@/lib/ToastContext';
import {useFlavor} from '@/lib/FlavorContext';
import {useLanguage} from '@/lib/LanguageContext';
import {fetchProducts} from '@/lib/api';

const FALLBACK_IMG = '/lays-cheddar.png';

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

    // Products now come from the live backend (Supabase) instead of a hardcoded list.
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let active = true;
        fetchProducts({limit: 50})
            .then((list) => {
                if (active) {
                    setProducts(list);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (active) {
                    setLoadError(true);
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    const visibleProducts = useMemo(() => {
        if (selectedFlavor === 'all') return products;
        return products.filter((p) => p.flavor === selectedFlavor);
    }, [products, selectedFlavor]);

    const flavorLabel = t(`flavor.${selectedFlavor}`);
    const isFiltered = selectedFlavor !== 'all';
    const packLabel = locale === 'ar' ? PACK_LABEL_AR : PACK_LABEL_EN;
    const sizeLabel = locale === 'ar' ? SIZE_LABEL_AR : SIZE_LABEL_EN;
    const productName = t('product.name');

    const nameFor = (p) => (locale === 'ar' && p.nameAr ? p.nameAr : p.name);

    function scroll(direction) {
        const target = scrollRef.current;
        if (!target) return;
        const page = target.clientWidth;
        target.scrollBy({left: direction === 'prev' ? -page : page, behavior: 'smooth'});
    }

    function handleAdd(product) {
        const label = nameFor(product);
        addItem({
            id: product.id,
            sku: product.sku,
            name: label,
            price: product.price,
            image: (product.images && product.images[0]) || FALLBACK_IMG,
        });
        showToast(t('bs.added', {name: label}));
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

        const timer = setTimeout(() => {
            cards.forEach((c) => c.classList.add('is-revealed'));
        }, 1500);

        return () => {
            clearTimeout(timer);
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

                {loading ? (
                    <div className="products-empty">
                        <p>{t('bs.loading') || 'Loading products…'}</p>
                    </div>
                ) : loadError ? (
                    <div className="products-empty">
                        <p>{t('bs.error') || 'Could not load products. Please try again.'}</p>
                    </div>
                ) : visibleProducts.length === 0 ? (
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
                            const label = nameFor(p);
                            const img = (p.images && p.images[0]) || FALLBACK_IMG;
                            const outOfStock = p.status === 'out' || p.stock <= 0;
                            return (
                                <article key={p.id} className="product-card">
                                    <div className="product-image">
                                        <span className="pack-badge">{packLabel}</span>
                                        {p.isFeatured && (
                                            <span className="best-seller-ribbon">{t('bs.ribbon')}</span>
                                        )}
                                        <img
                                            className="product-photo"
                                            src={img}
                                            alt={label}
                                            onError={(e) => {
                                                if (e.currentTarget.src.indexOf(FALLBACK_IMG) === -1) {
                                                    e.currentTarget.src = FALLBACK_IMG;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name">{productName}</h3>
                                        <p className="product-flavor">{label}</p>
                                        <div className="product-row">
                                            <span className="product-meta">{sizeLabel}</span>
                                            <span className="product-price">{p.price} {locale === 'ar' ? 'جنيه' : 'EGP'}</span>
                                            <button
                                                className="add-cart-btn"
                                                aria-label={t('bs.addAria', {name: label})}
                                                onClick={() => handleAdd(p)}
                                                disabled={outOfStock}
                                                title={outOfStock ? (t('bs.outOfStock') || 'Out of stock') : undefined}
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
