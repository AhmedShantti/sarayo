'use client';

import { motion, type Variants } from 'framer-motion';

/**
 * TextReveal — splits text into words and reveals them with an upward mask
 * wipe as they scroll into view. The signature kinetic-type move.
 */
const container: Variants = {
    hidden: {},
    show: (delay: number = 0) => ({
        transition: { staggerChildren: 0.07, delayChildren: delay },
    }),
};
const word: Variants = {
    hidden: { y: '115%' },
    show: { y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

export default function TextReveal({
    text,
    className = '',
    delay = 0,
    once = true,
}: {
    text: string;
    className?: string;
    delay?: number;
    once?: boolean;
}) {
    const words = text.split(' ');
    return (
        <motion.span
            className={`inline ${className}`}
            variants={container}
            custom={delay}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount: 0.6 }}
        >
            {words.map((w, i) => (
                <span
                    key={i}
                    style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
                >
                    <motion.span variants={word} style={{ display: 'inline-block', willChange: 'transform' }}>
                        {w}
                        {i < words.length - 1 ? ' ' : ''}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}
