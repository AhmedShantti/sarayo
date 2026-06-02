'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from 'framer-motion';
import Chip from './Chip';
import Magnetic from './Magnetic';
import { PRODUCTS } from '@/lib/landingData';

const FLAVORS = PRODUCTS;

// Short brand "items" the eyebrow chip rotates through every 3s.
const CHIP_ITEMS = ['Crunchy', 'Flavorful', 'Irresistible', 'Cut Thick', 'Fried Crisp', 'Loud Flavor'];

export default function Hero() {
    const [i, setI] = useState(0);
    const [paused, setPaused] = useState(false);
    const [chip, setChip] = useState(0);

    // Auto-cycle the hero bag through the Lay's lineup (5s).
    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setI((p) => (p + 1) % FLAVORS.length), 5000);
        return () => clearInterval(id);
    }, [paused]);

    // Rotate the eyebrow chip's item every 3s.
    useEffect(() => {
        const id = setInterval(() => setChip((c) => (c + 1) % CHIP_ITEMS.length), 3000);
        return () => clearInterval(id);
    }, []);

    // Subtle mouse parallax.
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 120, damping: 20 });
    const sy = useSpring(py, { stiffness: 120, damping: 20 });
    const bagX = useTransform(sx, [-1, 1], [-18, 18]);
    const bagY = useTransform(sy, [-1, 1], [-14, 14]);
    const ghostX = useTransform(sx, [-1, 1], [30, -30]);

    const onMove = (e: React.MouseEvent<HTMLElement>) => {
        px.set((e.clientX / window.innerWidth - 0.5) * 2);
        py.set((e.clientY / window.innerHeight - 0.5) * 2);
    };

    const active = FLAVORS[i];

    return (
        <section
            id="top"
            onMouseMove={onMove}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-12 text-center sm:px-8 sm:pt-32 sm:pb-16"
        >
            {/* Ghost wordmark */}
            <motion.div style={{ x: ghostX }} className="pointer-events-none absolute inset-x-0 top-[18%] z-0 flex justify-center">
                <span className="hero-ghost text-[22vw] leading-none">Sarayo</span>
            </motion.div>

            {/* Glow that follows the active flavor */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red-soft/40 blur-[130px]" />

            {/* Eyebrow */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative z-10 mb-6 flex flex-wrap items-center justify-center gap-2"
            >
                <Chip variant="yellow" size="md">Since 2002</Chip>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={CHIP_ITEMS[chip]}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Chip variant="outline" size="md">{CHIP_ITEMS[chip]}</Chip>
                    </motion.span>
                </AnimatePresence>
            </motion.div>

            {/* Headline + flavor stage */}
            <div className="relative z-10 flex w-full max-w-[1100px] flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="landing-display text-[clamp(3rem,10vw,8.5rem)] leading-[0.85] text-white"
                >
                    Crunch in
                </motion.h1>

                {/* Stage: outline word behind, cycling bag in front */}
                <div
                    className="relative my-2 flex h-[34vh] min-h-[220px] w-full items-center justify-center sm:h-[46vh]"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <span
                        aria-hidden
                        className="landing-display pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(3rem,10vw,8.5rem)] leading-none"
                        style={{ color: 'transparent', WebkitTextStroke: '2px #FFD400' }}
                    >
                        Style
                    </span>

                    <motion.div style={{ x: bagX, y: bagY }} className="relative z-10 h-full w-[60%] max-w-[320px]">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={active.src}
                                initial={{ opacity: 0, x: 70, rotate: 8 }}
                                animate={{ opacity: 1, x: 0, rotate: -3 }}
                                exit={{ opacity: 0, x: -70, rotate: -10 }}
                                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={active.src}
                                    alt={`Sarayo Alwadiya ${active.name} — ${active.flavor}`}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 60vw, 320px"
                                    className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.5)]"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* floating flavor label */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active.name}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.35 }}
                                className="absolute -right-2 top-2 flex flex-col items-end gap-1.5 sm:right-0"
                            >
                                <Chip variant="white" size="sm" interactive={false}>{active.flavor}</Chip>
                                <Chip variant="yellow" size="sm" interactive={false}>{active.price}</Chip>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Flavor switcher dots */}
                <div className="relative z-10 mb-1 flex items-center gap-3">
                    {FLAVORS.map((f, idx) => (
                        <button
                            key={f.name}
                            onClick={() => setI(idx)}
                            aria-label={`Show ${f.name}`}
                            data-cursor="hover"
                            className="group flex flex-col items-center gap-2"
                        >
                            <span
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    idx === i ? 'w-8 bg-brand-yellow' : 'w-2 bg-white/30 group-hover:bg-white/60'
                                }`}
                            />
                        </button>
                    ))}
                </div>
                <p className="relative z-10 mt-3 font-grotesk text-xs uppercase tracking-[0.3em] text-white/60">
                    {active.name} · <span className="text-brand-yellow">{active.price}</span>
                </p>
            </div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
            >
                <Magnetic strength={0.5}>
                    <a
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-8 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep shadow-xl shadow-black/20"
                    >
                        Shop the flavors
                    </a>
                </Magnetic>
                <Magnetic strength={0.4}>
                    <a
                        href="#features"
                        className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-white"
                    >
                        Our crunch
                    </a>
                </Magnetic>
            </motion.div>
        </section>
    );
}
