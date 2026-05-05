'use client';

import {useEffect} from 'react';

// Hook into all <a href="#..."> clicks for smooth scroll with header offset.
// Mirrors the behavior in the original script.js.
export default function SmoothScroll() {
    useEffect(() => {
        function onClick(e) {
            const anchor = e.target.closest('a[href^="/#"], a[href^="#"]');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            // Only intercept on-page anchors (e.g. "#home" or "/#home" while on the home page)
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return;

            const id = href.slice(hashIndex + 1);
            if (!id) return;

            // For "/#home"-style links, only intercept if we're actually on the home page
            // — otherwise let Next.js handle the route change.
            if (href.startsWith('/#') && window.location.pathname !== '/') return;

            const target = document.getElementById(id);
            if (!target) return;

            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({top, behavior: 'smooth'});

            // Update the URL hash without jumping
            history.replaceState(null, '', '#' + id);
        }

        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    return null;
}
