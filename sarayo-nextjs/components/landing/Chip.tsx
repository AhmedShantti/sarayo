'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

/**
 * Chip — the signature pill motif of the Sarayo landing.
 * Used as tags, categories, micro-labels and scattered decorative accents.
 *
 * Variants:
 *  - red     (default) deep-red tonal pill — reads on light OR red surfaces
 *  - yellow  the rare highlight / key action
 *  - white   solid white pill
 *  - outline white/outlined ghost pill (for use over red)
 */
export type ChipVariant = 'red' | 'yellow' | 'white' | 'outline';
export type ChipSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ChipVariant, string> = {
    red:     'bg-brand-red-deep text-brand-cream shadow-sm shadow-black/20',
    yellow:  'bg-brand-yellow text-brand-red-deep',
    white:   'bg-white text-brand-red',
    outline: 'border border-white/40 text-white bg-white/5 backdrop-blur-sm',
};

const SIZES: Record<ChipSize, string> = {
    sm: 'text-[10px] px-3 py-1 gap-1',
    md: 'text-xs px-4 py-1.5 gap-1.5',
    lg: 'text-sm px-5 py-2.5 gap-2',
};

export interface ChipProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
    children: ReactNode;
    variant?: ChipVariant;
    size?: ChipSize;
    /** Continuous gentle floating bob (for decorative scattered chips). */
    float?: boolean;
    /** Hover scale + tilt micro-interaction. */
    interactive?: boolean;
    /** Animation delay (seconds) — used to stagger floats. */
    delay?: number;
}

export default function Chip({
    children,
    variant = 'red',
    size = 'md',
    float = false,
    interactive = true,
    delay = 0,
    className = '',
    ...rest
}: ChipProps) {
    return (
        <motion.span
            className={`inline-flex items-center justify-center rounded-full font-grotesk font-semibold uppercase tracking-wider whitespace-nowrap select-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
            animate={float ? { y: [0, -12, 0] } : undefined}
            transition={
                float
                    ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }
                    : { type: 'spring', stiffness: 380, damping: 16 }
            }
            whileHover={interactive ? { scale: 1.08, rotate: -3 } : undefined}
            {...rest}
        >
            {children}
        </motion.span>
    );
}
