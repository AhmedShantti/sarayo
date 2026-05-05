'use client';

import {useEffect, useRef} from 'react';
import {useCart} from '@/lib/CartContext';
import {useToast} from '@/lib/ToastContext';

const FALLBACK_IMG = '/lays-cheddar.png';

const PRODUCTS = [
    {
        id: 'cheddar-sour-cream',
        name: 'lay’s',
        flavor: 'cheddar & sour cream',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: true,
        image: '/lays-cheddar.png',
    },
    {
        id: 'classic-salted',
        name: 'lay’s',
        flavor: 'classic salted',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-classic.png',
    },
    {
        id: 'salt-vinegar',
        name: 'lay’s',
        flavor: 'salt & vinegar',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: true,
        image: '/lays-salt-vinegar.png',
    },
    {
        id: 'wavy',
        name: 'lay’s',
        flavor: 'wavy original',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-wavy.png',
    },
    {
        id: 'indian-spice',
        name: 'lay’s',
        flavor: 'indian magic masala',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-indian.png',
    },
    {
        id: 'cheddar-classic',
        name: 'lay’s',
        flavor: 'cheddar classic',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: true,
        image: '/lays-cheddar.png',
    },
    {
        id: 'wavy-bbq',
        name: 'lay’s',
        flavor: 'wavy bbq',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-wavy.png',
    },
    {
        id: 'classic-large',
        name: 'lay’s',
        flavor: 'classic family pack',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-classic.png',
    },
    {
        id: 'spicy-masala',
        name: 'lay’s',
        flavor: 'spicy masala',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-indian.png',
    },
    {
        id: 'salt-vinegar-twist',
        name: 'lay’s',
        flavor: 'tangy salt & vinegar',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: true,
        image: '/lays-salt-vinegar.png',
    },
    {
        id: 'wavy-cheddar',
        name: 'lay’s',
        flavor: 'wavy cheddar ranch',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-wavy.png',
    },
    {
        id: 'sour-cream-classic',
        name: 'lay’s',
        flavor: 'sour cream & onion',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-cheddar.png',
    },
    {
        id: 'classic-original',
        name: 'lay’s',
        flavor: 'original',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: true,
        image: '/lays-classic.png',
    },
    {
        id: 'wavy-bbq-deluxe',
        name: 'lay’s',
        flavor: 'smoky bbq deluxe',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-wavy.png',
    },
    {
        id: 'indian-tandoori',
        name: 'lay’s',
        flavor: 'tandoori twist',
        price: 18,
        pack: '6 pack',
        size: '4oz bags',
        bestSeller: false,
        image: '/lays-indian.png',
    },
];

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

    function scroll(direction) {
        const target = scrollRef.current;
        if (!target) return;
        // Advance by a full page-worth of cards (whatever fits in the visible
        // viewport), so each click of the arrow reveals the next batch.
        const page = target.clientWidth;
        target.scrollBy({
            left: direction === 'prev' ? -page : page,
            behavior: 'smooth',
        });
    }

    function handleAdd(product) {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            flavor: product.flavor,
        });
        showToast(`Added ${product.flavor} to cart`);
    }

    // Reveal-on-scroll for product cards
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

        // Failsafe: reveal anything left after 1.5s
        const t = setTimeout(() => {
            cards.forEach((c) => c.classList.add('is-revealed'));
        }, 1500);

        return () => {
            clearTimeout(t);
            io.disconnect();
        };
    }, []);

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
                        CHIPS JUST GOT HIP
                    </h2>
                    <a href="#" className="view-all">
                        view all <span>→</span>
                    </a>
                </div>

                <div className="products-wrap">
                    <button
                        className="carousel-arrow arrow-prev"
                        aria-label="Previous products"
                        onClick={() => scroll('prev')}
                    >
                        ‹
                    </button>

                    <div className="products-scroll" ref={scrollRef}>
                        {PRODUCTS.map((p) => (
                            <article
                                key={p.id}
                                className="product-card"
                            >
                                <div className="product-image">
                                    <span className="pack-badge">{p.pack}</span>
                                    {p.bestSeller && (
                                        <span className="best-seller-ribbon">best seller</span>
                                    )}
                                    <img
                                        className="product-photo"
                                        src={p.image || FALLBACK_IMG}
                                        alt={p.flavor}
                                        onError={(e) => {
                                            if (e.currentTarget.src.indexOf(FALLBACK_IMG) === -1) {
                                                e.currentTarget.src = FALLBACK_IMG;
                                            }
                                        }}
                                    />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{p.name}</h3>
                                    <p className="product-flavor">{p.flavor}</p>
                                    <div className="product-row">
                                        <span className="product-meta">{p.size}</span>
                                        <span className="product-price">{p.price} EGP</span>
                                        <button
                                            className="add-cart-btn"
                                            aria-label={`Add ${p.flavor} to cart`}
                                            onClick={() => handleAdd(p)}
                                        >
                                            <CartIcon />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <button
                        className="carousel-arrow arrow-next"
                        aria-label="Next products"
                        onClick={() => scroll('next')}
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}
