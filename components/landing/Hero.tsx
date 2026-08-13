'use client';

import Image from 'next/image';
import { type Product } from '@/lib/landingData';

type Tile = {
    /** catalog page number */
    number: number;
    /** how far the pack spills past its grid cell — drives the overlap */
    scale: number;
    /** small per-pack tilt on top of the mosaic's global tilt */
    rotate: number;
    z: number;
};

/**
 * Packs are laid out on a tilted, brick-staggered grid so they read as one
 * continuous wall of product instead of a row of floating bags. Slim bars and
 * stick packs are seeded between the big bags to break up the rhythm.
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
 * so no row reaches back past the mosaic's left edge and over the headline.
 */
const ROW_SHIFT = [0, 4, 1, 5];

function getImageSrc(num: number) {
    return `/catalog/png/كتالوج شركة سرايو مصر نهائي-${num}.png`;
}

export default function Hero(_props: { products?: Product[] }) {
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
            "
        >
            {/* LIGHT RED ORGANIC SHAPE — sits BEHIND the mosaic so the packs
                overlap it, the way the reference layout reads */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -left-[18%]
                    top-[4%]
                    z-[5]
                    h-[120%]
                    w-[58%]
                    -rotate-[7deg]
                    rounded-[48%_52%_60%_40%/40%_38%_62%_60%]
                    bg-brand-red-soft
                "
            />

            {/* DECORATIVE SHAPES */}
            <div
                className="
                    pointer-events-none
                    absolute
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

                    max-md:left-[5%]
                    max-md:top-[18%]
                "
            >
                <h1
                    className="
                        font-grotesk
                        text-[clamp(38px,4vw,62px)]
                        font-extrabold
                        leading-[1.04]
                        tracking-[-0.04em]
                        text-white

                        max-md:text-[42px]
                    "
                >
                    <span className="block">Welcome</span>
                    <span className="block">to Sarayo</span>
                </h1>
            </div>

            {/* TILTED PRODUCT MOSAIC */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -right-[14%]
                    -top-[28%]
                    z-[20]
                    flex
                    h-[170%]
                    w-[78%]
                    -rotate-[13deg]
                    flex-col

                    max-lg:-right-[22%]
                    max-lg:w-[86%]

                    max-md:-right-[45%]
                    max-md:top-[30%]
                    max-md:h-[105%]
                    max-md:w-[150%]
                "
            >
                {MOSAIC.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex w-full flex-1"
                        style={{
                            transform: `translateX(${ROW_SHIFT[rowIndex]}%)`,
                            marginTop: rowIndex === 0 ? 0 : '-2.5%',
                        }}
                    >
                        {row.map((tile) => (
                            <div
                                key={`${rowIndex}-${tile.number}`}
                                className="relative flex-1"
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