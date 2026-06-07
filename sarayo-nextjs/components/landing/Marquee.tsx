'use client';

import { useRef } from 'react';
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
    wrap,
} from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

const WORD_KEYS = [
    'lnd.word.crunchy', 'lnd.word.flavorful', 'lnd.word.irresistible',
    'lnd.word.cutThick', 'lnd.word.friedCrisp', 'lnd.since',
];

function Row({ baseVelocity, reverse = false }: { baseVelocity: number; reverse?: boolean }) {
    const { t } = useLanguage();
    const WORDS = WORD_KEYS.map((k) => t(k));
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });

    // Wrap keeps the strip seamless as it loops.
    const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
    const dir = useRef(reverse ? -1 : 1);

    useAnimationFrame((_, delta) => {
        let moveBy = dir.current * baseVelocity * (delta / 1000);
        if (factor.get() < 0) dir.current = -1;
        else if (factor.get() > 0) dir.current = 1;
        moveBy += dir.current * moveBy * factor.get();
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="flex overflow-hidden">
            <motion.div className="flex whitespace-nowrap" style={{ x }}>
                {[...WORDS, ...WORDS, ...WORDS, ...WORDS].map((word, i) => (
                    <span key={i} className="flex items-center">
                        <span className="landing-display px-6 text-3xl text-brand-cream sm:text-5xl">{word}</span>
                        <span aria-hidden className="text-brand-yellow">✦</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

export default function Marquee() {
    return (
        <div className="relative border-y-2 border-brand-yellow bg-brand-red-deep py-5">
            <Row baseVelocity={3} />
        </div>
    );
}
