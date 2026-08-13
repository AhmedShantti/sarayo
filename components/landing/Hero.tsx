'use client';

import Image from 'next/image';
import { type Product } from '@/lib/landingData';
import { useLanguage } from '@/lib/LanguageContext';

type Tile = {
    /** catalog page number */
    number: number;
    /** how far the pack spills past its grid cell — drives the overlap */
    scale: number;
    /** small per-pack tilt on top of the lattice's tilt */
    rotate: number;
    z: number;
};

/**
 * The bags sit on a brick-staggered lattice that the field tilts as a whole,
 * so the rows rise to the right and the packs read as one continuous wall.
 */
const MOSAIC: Tile[][] = [
    [
        { number: 30, scale: 1.22, rotate: -3, z: 4 },
        { number: 87, scale: 1.26, rotate: 2, z: 6 },
        { number: 82, scale: 1.46, rotate: -4, z: 12 },
        { number: 31, scale: 1.24, rotate: 3, z: 7 },
        { number: 73, scale: 1.22, rotate: -2, z: 5 },
    ],
    [
        { number: 90, scale: 1.26, rotate: 3, z: 9 },
        { number: 103, scale: 1.22, rotate: -2, z: 8 },
        { number: 86, scale: 1.28, rotate: 2, z: 10 },
        { number: 106, scale: 1.24, rotate: -3, z: 9 },
        { number: 78, scale: 1.46, rotate: 5, z: 13 },
    ],
    [
        { number: 80, scale: 1.46, rotate: -5, z: 14 },
        { number: 99, scale: 1.24, rotate: 3, z: 10 },
        { number: 76, scale: 1.28, rotate: -2, z: 12 },
        { number: 93, scale: 1.22, rotate: 3, z: 11 },
        { number: 101, scale: 1.26, rotate: -3, z: 12 },
    ],
    [
        { number: 89, scale: 1.24, rotate: 2, z: 6 },
        { number: 72, scale: 1.22, rotate: -3, z: 7 },
        { number: 105, scale: 1.26, rotate: 3, z: 8 },
        { number: 77, scale: 1.24, rotate: -2, z: 7 },
        { number: 92, scale: 1.28, rotate: 3, z: 9 },
    ],
];

/**
 * Horizontal brick offset per row, in % of a row's width. Kept at or above 0
 * so no row reaches back past the field's left edge and over the headline.
 */
const ROW_SHIFT = [0, 4, 1, 5];

function getImageSrc(num: number) {
    return `/catalog/png/كتالوج شركة سرايو مصر نهائي-${num}.png`;
}

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
            {/* LIGHT RED ORGANIC SHAPE — sits BEHIND the packs so they overlap
                it, the way the reference layout reads */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -left-[18%]
                    top-[4%]
                    z-[5]
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
                    z-[6]
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
                    z-[6]
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
                    z-[6]
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
                    z-[10]

                    max-lg:top-[20%]

                    max-md:left-[5%]
                    max-md:top-[15%]
                "
            >
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
                    <span className="block">{t('lnd.hero.welcome1')}</span>
                    <span className="block">{t('lnd.hero.welcome2')}</span>
                </h1>
            </div>

            {/* PRODUCT FIELD

                Row height comes from the cell's aspect ratio, not from a share
                of the hero's height — otherwise the cells stretch on tall
                viewports (iPad portrait) and the packs no longer fill them.
                The field is therefore always ~1.1x its own width tall, and we
                only have to place it:
                  - phone / tablet: full-bleed across the bottom, headline above
                  - desktop:        vertically centred on the right */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    bottom-[-16%]
                    z-[20]
                    flex
                    w-[160%]
                    -translate-x-1/2
                    -rotate-[13deg]
                    flex-col

                    md:bottom-[-15%]
                    md:w-[105%]

                    lg:left-auto
                    lg:bottom-auto
                    lg:top-1/2
                    lg:-right-[14%]
                    lg:w-[78%]
                    lg:-translate-y-1/2
                    lg:translate-x-0
                "
            >
                {MOSAIC.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        /* the 4th row only fits on desktop, where the field is
                           tall enough to show it */
                        className={
                            rowIndex === 3
                                ? 'hidden w-full lg:flex'
                                : 'flex w-full'
                        }
                        style={{
                            transform: `translateX(${ROW_SHIFT[rowIndex]}%)`,
                            marginTop: rowIndex === 0 ? 0 : '-2.5%',
                        }}
                    >
                        {row.map((tile) => (
                            <div
                                key={`${rowIndex}-${tile.number}`}
                                className="relative aspect-[0.7] flex-1"
                                style={{ zIndex: tile.z }}
                            >
                                <Image
                                    src={getImageSrc(tile.number)}
                                    alt={`Sarayo product ${tile.number}`}
                                    width={900}
                                    height={900}
                                    priority={rowIndex < 2}
                                    loading={rowIndex < 2 ? undefined : 'lazy'}
                                    sizes="
                                        (max-width: 768px) 30vw,
                                        (max-width: 1024px) 20vw,
                                        17vw
                                    "
                                    style={{
                                        transform: `rotate(${tile.rotate}deg) scale(${tile.scale})`,
                                    }}
                                    className="
                                        absolute
                                        inset-0
                                        h-full
                                        w-full
                                        select-none
                                        object-contain
                                        drop-shadow-[0_18px_30px_rgba(0,0,0,0.38)]
                                    "
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
