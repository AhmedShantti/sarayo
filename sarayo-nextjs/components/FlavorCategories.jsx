'use client';

import {useRef} from 'react';

const FLAVORS = [
    {
        name: 'All Flavors',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <rect x="5" y="5" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="18" y="5" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="5" y="18" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="18" y="18" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
    },
    {
        name: 'Chili',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M10 6 Q12 4 15 5 Q19 6 22 12 Q25 19 22 24 Q19 28 14 26 Q9 23 8 17 Q7 11 10 6 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M14 5 Q15 3 17 3 Q18 4 17 6" fill="none" stroke="#2b8a3e" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: 'Cheese',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M5 14 Q5 8 11 7 L22 7 Q27 8 27 14 L27 22 Q27 26 22 26 L11 26 Q5 26 5 22 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="11" cy="14" r="1.5" fill="currentColor" />
                <circle cx="17" cy="19" r="1.5" fill="currentColor" />
                <circle cx="22" cy="13" r="1.5" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'BBQ',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M6 18 L26 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 18 Q8 24 16 24 Q24 24 24 18" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M11 13 Q11 9 12 7 M16 13 Q16 8 15 5 M21 13 Q21 9 22 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: 'Ketchup',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M13 5 L19 5 L19 9 Q22 10 22 13 L22 26 Q22 28 20 28 L12 28 Q10 28 10 26 L10 13 Q10 10 13 9 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="14" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: 'Vegetable',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M6 18 Q5 12 10 11 Q14 16 13 21 Q9 22 6 18 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="9" cy="16" r="1.4" fill="currentColor" />
                <circle cx="11" cy="19" r="1.2" fill="currentColor" />
                <path d="M15 21 Q15 14 21 13 Q24 17 23 22 Q19 24 15 21 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="19" cy="18" r="1.4" fill="currentColor" />
                <circle cx="20" cy="20" r="1.1" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'Tomato',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="19" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M14 11 Q15 7 19 6 Q19 9 17 11" fill="none" stroke="#2b8a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        name: 'Sour Cream',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9 11 L23 11 L21 27 Q21 28 20 28 L12 28 Q11 28 11 27 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <ellipse cx="16" cy="11" rx="7" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M13 17 Q16 14 19 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: 'Salt & Vinegar',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M11 6 L21 6 L20 12 Q23 14 23 18 L23 25 Q23 27 21 27 L11 27 Q9 27 9 25 L9 18 Q9 14 12 12 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="14" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="22" r="1" fill="currentColor" />
                <circle cx="16" cy="17" r="1" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'Onion',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 8 Q22 10 22 18 Q22 26 16 27 Q10 26 10 18 Q10 10 16 8 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M14 8 Q15 11 14 14 M18 8 Q17 11 18 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 5 Q15 7 16 8 Q17 7 18 5" fill="none" stroke="#2b8a3e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        name: 'Garlic',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 6 Q12 9 11 16 Q10 24 16 27 Q22 24 21 16 Q20 9 16 6 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M16 8 L16 25 M13 12 Q15 16 13 22 M19 12 Q17 16 19 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: 'Lime',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M16 6 L16 26 M6 16 L26 16 M9 9 L23 23 M23 9 L9 23" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: 'Pepper',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 9 Q12 9 11 13 L11 22 Q11 27 16 27 Q21 27 21 22 L21 13 Q20 9 16 9 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M14 9 Q15 6 17 5 Q18 6 18 9" fill="none" stroke="#2b8a3e" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="17" r="1.2" fill="currentColor" />
                <circle cx="18" cy="20" r="1.2" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'Ranch',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M10 8 L22 8 L22 12 L10 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M9 12 L23 12 L21 27 Q21 28 20 28 L12 28 Q11 28 11 27 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M14 18 Q16 16 18 18 Q16 20 14 18 Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'Honey',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M11 8 L21 8 L21 14 Q24 16 24 22 Q24 27 16 27 Q8 27 8 22 Q8 16 11 14 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M16 16 L18 19 L16 22 L14 19 Z" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'Sweet Chili',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9 7 Q11 5 14 6 Q19 7 23 14 Q26 22 22 26 Q17 28 13 25 Q8 21 7 13 Q6 9 9 7 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M13 6 Q15 4 18 4 Q19 6 17 7" fill="none" stroke="#2b8a3e" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 11 Q16 13 18 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: 'Pizza',
        icon: (
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 5 L27 25 Q22 28 16 28 Q10 28 5 25 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="14" cy="16" r="1.4" fill="currentColor" />
                <circle cx="19" cy="18" r="1.4" fill="currentColor" />
                <circle cx="16" cy="22" r="1.2" fill="currentColor" />
            </svg>
        ),
    },
];

export default function FlavorCategories() {
    const scrollRef = useRef(null);

    function scroll(direction) {
        const target = scrollRef.current;
        if (!target) return;
        // Advance by one full viewport-worth — same pagination as the
        // products row so every swipe reveals the next batch.
        const page = target.clientWidth;
        target.scrollBy({
            left: direction === 'prev' ? -page : page,
            behavior: 'smooth',
        });
    }

    return (
        <section className="flavors" aria-labelledby="flavorsHeading">
            <h2 id="flavorsHeading" className="visually-hidden">
                Browse by flavor
            </h2>

            <div className="container flavors-row">
                <button
                    className="carousel-arrow arrow-prev"
                    aria-label="Previous flavors"
                    onClick={() => scroll('prev')}
                >
                    ‹
                </button>

                <div className="flavors-scroll" ref={scrollRef}>
                    {FLAVORS.map((f) => (
                        <button key={f.name} className="flavor-item">
                            <span className="flavor-icon">{f.icon}</span>
                            <span className="flavor-name">{f.name}</span>
                        </button>
                    ))}
                </div>

                <button
                    className="carousel-arrow arrow-next"
                    aria-label="Next flavors"
                    onClick={() => scroll('next')}
                >
                    ›
                </button>
            </div>
        </section>
    );
}
