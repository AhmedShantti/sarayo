'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Chip from './Chip';
import Magnetic from './Magnetic';
import TextReveal from './TextReveal';
import CartIcon from './CartIcon';

export default function CTA() {
    return (
        <section id="cta" className="relative px-5 py-24 sm:px-8 sm:py-32">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[2.5rem] border border-white/15 bg-brand-red-deep px-6 py-20 text-center sm:px-12"
            >
                {/* animated conic shine */}
                <motion.div
                    aria-hidden
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
                    style={{ background: 'conic-gradient(from 0deg, transparent, #FFD400, transparent 30%)' }}
                />
                <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-yellow/20 blur-[100px]" />

                <Chip variant="yellow" size="sm" float delay={0} interactive={false} className="absolute left-8 top-10 rotate-[-10deg] hidden sm:flex">Crunchy</Chip>
                <Chip variant="white" size="sm" float delay={0.7} interactive={false} className="absolute right-10 top-16 rotate-[8deg] hidden sm:flex">Flavorful</Chip>
                <Chip variant="outline" size="sm" float delay={1.2} interactive={false} className="absolute bottom-12 left-16 rotate-[6deg] hidden sm:flex">Irresistible</Chip>

                <span className="relative mx-auto mb-8 grid h-24 w-24 place-items-center">
                    <Image src="/images.png" alt="Sarayo Alwadiya logo" width={96} height={96} className="h-full w-full object-contain" />
                </span>

                <h2 className="landing-display relative text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.9] text-white">
                    <TextReveal text="Hungry yet?" />
                </h2>
                <p className="relative mx-auto mt-5 max-w-md text-base text-white/80">
                    Grab a bag of Sarayo Alwadiya and find out what the crunch is about.
                </p>

                <div className="relative mt-10 flex justify-center">
                    <Magnetic strength={0.6}>
                        <a
                            href="/products"
                            className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-10 py-5 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep shadow-2xl shadow-black/30"
                        >
                            <CartIcon className="h-4 w-4" />
                            Grab a bag
                        </a>
                    </Magnetic>
                </div>
            </motion.div>
        </section>
    );
}
