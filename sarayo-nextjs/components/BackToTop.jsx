'use client';

import {useEffect, useState} from 'react';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function onScroll() {
            setVisible(window.scrollY > 600);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    function scrollUp() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return (
        <button
            className={`back-to-top${visible ? ' is-visible' : ''}`}
            aria-label="Back to top"
            onClick={scrollUp}
        >
            ↑
        </button>
    );
}
