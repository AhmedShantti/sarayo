'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor — a snappy dot with a larger ring that trails behind it and
 * swells over interactive elements. Desktop + motion only; otherwise the native
 * cursor stays. Reusable: pass a `rootSelector` (the element to hide the native
 * cursor on) and a `color`. Defaults match the landing site.
 */
export default function Cursor({
    rootSelector = '.landing-root',
    color = '#FFD400',
}: {
    rootSelector?: string;
    color?: string;
}) {
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
        const root = document.querySelector(rootSelector);
        root?.classList.add('app-cursor-active');

        const move = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
            const el = (e.target as HTMLElement | null)?.closest('a, button, [data-cursor="hover"]');
            scale.set(el ? 1.9 : 1);
        };

        window.addEventListener('mousemove', move);
        return () => {
            window.removeEventListener('mousemove', move);
            root?.classList.remove('app-cursor-active');
        };
    }, [x, y, scale, rootSelector]);

    if (!enabled) return null;

    return (
        <>
            <motion.div
                aria-hidden
                className="pointer-events-none fixed left-0 top-0 z-[150] rounded-full"
                style={{
                    x: ringX, y: ringY, scale: ringScale,
                    width: 42, height: 42, marginLeft: -21, marginTop: -21,
                    border: `1.5px solid ${color}`,
                }}
            />
            <motion.div
                aria-hidden
                className="pointer-events-none fixed left-0 top-0 z-[150] rounded-full"
                style={{
                    x: dotX, y: dotY,
                    width: 8, height: 8, marginLeft: -4, marginTop: -4,
                    background: color,
                }}
            />
        </>
    );
}
