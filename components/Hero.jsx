'use client';

import {useEffect, useState} from 'react';
import {useLanguage} from '@/lib/LanguageContext';

const SLIDE_KEYS = [
    {keys: ['hero.slide.flavor.0', 'hero.slide.flavor.1'], ledeKey: 'hero.slide.flavor.lede'},
    {keys: ['hero.slide.snack.0',  'hero.slide.snack.1'],  ledeKey: 'hero.slide.snack.lede'},
    {keys: ['hero.slide.crunch.0', 'hero.slide.crunch.1'], ledeKey: 'hero.slide.crunch.lede'},
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
    const {t} = useLanguage();

    useEffect(() => {
        const id = setInterval(() => {
            setSlideIdx((i) => (i + 1) % SLIDE_KEYS.length);
        }, 6000);
        return () => clearInterval(id);
    }, []);

    const slide = SLIDE_KEYS[slideIdx];

    return (
        <section className="hero" id="home">
            <div className="container hero-grid">
                <div className="hero-copy">
                    <h1 className="hero-title">
                        <span className="line-2">{t(slide.keys[0])}</span>
                        <span className="line-3">{t(slide.keys[1])}</span>
                    </h1>
                    <p className="hero-lede">{t(slide.ledeKey)}</p>
                    <a href="#products" className="btn btn-primary btn-pill">
                        {t('hero.cta')}
                    </a>

                    <div
                        className="hero-dots"
                        role="tablist"
                        aria-label={t('hero.slides.aria')}
                    >
                        {SLIDE_KEYS.map((_, i) => (
                            <button
                                key={i}
                                className={'dot' + (i === slideIdx ? ' is-active' : '')}
                                aria-label={`${t('hero.slide.aria')} ${i + 1}`}
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
