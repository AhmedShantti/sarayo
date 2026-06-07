'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Magnetic — pulls its child toward the cursor on hover, then springs back.
 * Wrap buttons or chips for a tactile, high-end micro-interaction.
 */
export default function Magnetic({
    children,
    strength = 0.4,
    className = '',
}: {
    children: ReactNode;
    strength?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={reset}
            style={{ x: sx, y: sy }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
}
