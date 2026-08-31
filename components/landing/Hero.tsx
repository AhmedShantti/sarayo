'use client';

import Image from 'next/image';
import Chip from './Chip';
import { type Product } from '@/lib/landingData';
import { useLanguage } from '@/lib/LanguageContext';

export default function Hero(_props: { products?: Product[] }) {
    const { t } = useLanguage();

    return (
        <section
            id="top"
            className="
                relative
                h-[calc(100svh-90px)]
                min-h-[620px]
                max-h-[880px]
                w-full
                overflow-hidden
                bg-brand-red-deep

                lg:aspect-[2.1]
                lg:h-auto
                lg:max-h-[calc(100svh-90px)]
                lg:min-h-[540px]
            "
        >
            {/* PRODUCT SHOT — one pre-composed lineup image (client-provided),
                full-bleed across the entire hero, sitting BEHIND the
                blob + headline */}
            <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
                <Image
                    src="/hero-sarayo.png"
                    alt="Sarayo product lineup — Cornice, Pop Cornice and Flipi"
                    fill
                    priority
                    quality={100}
                    sizes="100vw"
                    className="object-cover object-right"
                />
            </div>

            {/* ORGANIC BLOB — sits ABOVE the product image so the headline
                has a solid backdrop */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -left-[18%]
                    top-[4%]
                    z-[10]
                    h-[120%]
                    w-[64%]
                    -rotate-[7deg]
                    rounded-[48%_52%_60%_40%/40%_38%_62%_60%]
                    bg-brand-red-soft

                    max-lg:-left-[24%]
                    max-lg:-top-[2%]
                    max-lg:h-[95%]
                    max-lg:w-[95%]

                    max-md:-left-[26%]
                    max-md:-top-[10%]
                    max-md:h-[66%]
                    max-md:w-[112%]
                "
            />

            {/* DECORATIVE SHAPES */}
            <div
                className="
                    pointer-events-none
                    absolute
                    max-md:hidden
                    left-[36%]
                    top-[8%]
                    z-[12]
                    h-[38px]
                    w-[95px]
                    rotate-[8deg]
                    rounded-[60%]
                    bg-brand-red-soft
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    max-md:hidden
                    left-[43%]
                    top-[13%]
                    z-[12]
                    h-[55px]
                    w-[65px]
                    -rotate-[25deg]
                    rounded-[16px]
                    bg-brand-red-soft
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    max-md:hidden
                    left-[40%]
                    top-[22%]
                    z-[12]
                    h-[32px]
                    w-[45px]
                    -rotate-[20deg]
                    rounded-[12px]
                    bg-brand-red-soft
                "
            />

            {/* TEXT */}
            <div
                className="
                    absolute
                    left-[5.5%]
                    top-[30%]
                    z-[20]

                    max-lg:top-[20%]

                    max-md:left-[5%]
                    max-md:top-[15%]
                "
            >
                <Chip variant="yellow" size="md" interactive={false} className="mb-4">
                    {t('lnd.tagline')}
                </Chip>
                <h1
                    className="
                        hero-welcome
                        font-grotesk
                        text-[clamp(44px,5.4vw,86px)]
                        font-extrabold
                        leading-[1.04]
                        tracking-[-0.04em]
                        text-white

                        max-lg:text-[clamp(44px,7vw,68px)]

                        max-md:text-[clamp(38px,13vw,58px)]
                    "
                >
                    <span className="block"></span>
                    <span className="block"></span>
                </h1>
            </div>
        </section>
    );
}
