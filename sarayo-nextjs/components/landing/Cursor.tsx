'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor — a snappy yellow dot with a larger ring that trails behind it
 * and swells over interactive elements. Desktop + motion only; otherwise the
 * native cursor stays.
 */
export default function Cursor() {
    const [enabled, setEnabled] = useState(false);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const scale = useMotionValue(1);

    // Dot leads (stiff), ring trails (loose) — gives the elastic follow effect.
    const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.2 });
    const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.2 });
    const ringX = useSpring(x, { stiffness: 150, damping: 18, mass: 0.5 });
    const ringY = useSpring(y, { stiffness: 150, damping: 18, mass: 0.5 });
    const ringScale = useSpring(scale, { stiffness: 300, damping: 20 });

    useEffect(() => {
        const fine = window.matchMedia('(pointer: fine)').matches;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!fine || reduce) return;

        setEnabled(true);
        const root = document.querySelector('.landing-root');
        root?.classList.add('cursor-none');

        const move = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
            const el = (e.target as HTMLElement | null)?.closest('a, button, [data-cursor="hover"]');
            scale.set(el ? 1.9 : 1);
        };

        window.addEventListener('mousemove', move);
        return () => {
            window.removeEventListener('mousemove', move);
            root?.classList.remove('cursor-none');
        };
    }, [x, y, scale]);

    if (!enabled) return null;

    return (
        <>
            <motion.div
                aria-hidden
                className="landing-cursor-ring pointer-events-none fixed left-0 top-0 z-[150]"
                style={{ x: ringX, y: ringY, scale: ringScale }}
            />
            <motion.div
                aria-hidden
                className="landing-cursor-dot pointer-events-none fixed left-0 top-0 z-[150]"
                style={{ x: dotX, y: dotY }}
            />
        </>
    );
}
