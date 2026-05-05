'use client';

import {useEffect, useState} from 'react';

const SLIDES = [
    {
        title: ['FLAVOR', 'YOUR MIND'],
        lede: 'Changing snacking one chip at a time.',
    },
    {
        title: ['SNACK', 'BOLDLY'],
        lede: 'Crispy, crave-able and made for the curious.',
    },
    {
        title: ['CRUNCH', 'WITH PURPOSE'],
        lede: 'Real ingredients. Real flavor. No compromise.',
    },
];

const BAG_IMAGES = [
    '/lays-cheddar.png',
    '/lays-classic.png',
    '/lays-salt-vinegar.png',
    '/lays-wavy.png',
    '/lays-indian.png',
];
const BAG_COUNT = 9;

export default function Hero() {
    const [slideIdx, setSlideIdx] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setSlideIdx((i) => (i + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(id);
    }, []);

    const slide = SLIDES[slideIdx];

    return (
        <section className="hero" id="home">
            <div className="container hero-grid">
                <div className="hero-copy">
                    <h1 className="hero-title">
                        <span className="line-2">{slide.title[0]}</span>
                        <span className="line-3">{slide.title[1]}</span>
                    </h1>
                    <p className="hero-lede">{slide.lede}</p>
                    <a href="#products" className="btn btn-primary btn-pill">
                        shop Sarayo
                        <span className="btn-arrow">→</span>
                    </a>

                    <div
                        className="hero-dots"
                        role="tablist"
                        aria-label="Hero slides"
                    >
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                className={'dot' + (i === slideIdx ? ' is-active' : '')}
                                aria-label={`Slide ${i + 1}`}
                                onClick={() => setSlideIdx(i)}
                            />
                        ))}
                    </div>
                </div>

                <div className="hero-visual">
                    {Array.from({length: BAG_COUNT}).map((_, i) => (
                        <div className="hero-bag" key={i}>
                            <img
                                src={BAG_IMAGES[i % BAG_IMAGES.length]}
                                alt=""
                                aria-hidden="true"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
