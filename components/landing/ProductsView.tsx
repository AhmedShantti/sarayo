'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Chip from './Chip';
import Magnetic from './Magnetic';
import TextReveal from './TextReveal';
import CartIcon from './CartIcon';
import { useLandingCart } from '@/lib/LandingCart';
<<<<<<< HEAD
import { formatPrice } from '@/lib/landingData';
import { fetchProducts, fetchCategories } from '@/lib/api';
=======
import { CATEGORIES, PRODUCTS, localizeProduct, type Product } from '@/lib/landingData';
>>>>>>> upstream/main
import { useLanguage } from '@/lib/LanguageContext';

const FALLBACK_IMG = '/lays-cheddar.png';
const TONE_CYCLE = ['deep', 'cream', 'yellow'] as const;

const TONE: Record<string, string> = {
    deep: 'bg-brand-red-deep/70 border border-white/12 text-white',
    cream: 'bg-brand-cream text-brand-red-deep',
    yellow: 'bg-brand-yellow text-brand-red-deep',
};

// Backend product (subset of the fields the API returns).
interface ApiProduct {
    id: string;
    sku?: string;
    name: string;
    nameAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    price: number;
    images?: string[];
    flavor?: string | null;
    isFeatured?: boolean;
    sellingUnit?: string;
    packageSize?: number;
    packagePrice?: number | null;
    category?: { id: string; name: string; slug: string } | null;
}

interface ApiCategory {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
}

const isPackage = (p: ApiProduct) => p.sellingUnit === 'package';
const pkgSize = (p: ApiProduct) => p.packageSize || 12;
const effPrice = (p: ApiProduct) =>
    isPackage(p) ? (p.packagePrice != null ? p.packagePrice : p.price * pkgSize(p)) : p.price;

function Card({ p, tone }: { p: ApiProduct; tone: string }) {
    const { add } = useLandingCart();
    const { t, locale } = useLanguage();

    const name = locale === 'ar' && p.nameAr ? p.nameAr : p.name;
    const description = locale === 'ar' && p.descriptionAr ? p.descriptionAr : p.description;
    const flavor = (p.flavor || '').replace(/-/g, ' ');
    const img = (p.images && p.images[0]) || FALLBACK_IMG;
    const price = effPrice(p);
    const pkg = isPackage(p);

    const chipText = p.isFeatured
        ? (locale === 'ar' ? 'الأكثر مبيعًا' : 'Best seller')
        : flavor;
    const ctaText = pkg
        ? (locale === 'ar' ? 'اطلب العبوة' : 'Order Package')
        : t('lnd.products.add');

    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            data-cursor="hover"
            className={`group relative flex flex-col overflow-hidden rounded-3xl p-5 ${TONE[tone]}`}
        >
            {chipText && (
                <div className="absolute right-4 top-4 z-10">
                    <Chip variant={tone === 'deep' ? 'outline' : 'red'} size="sm">{chipText}</Chip>
                </div>
            )}

            <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.16),transparent_70%)]">
                <motion.div whileHover={{ scale: 1.08, rotate: -3 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="absolute inset-0">
                    <Image
                        src={img}
                        alt={`Sarayo Alwadiya ${name}${flavor ? ` — ${flavor}` : ''}`}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
                        className="object-contain p-2 drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]"
                    />
                </motion.div>
            </div>

<<<<<<< HEAD
            <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                    <h3 className="landing-display text-2xl leading-none">{name}</h3>
                    {flavor && <p className="mt-1.5 text-sm capitalize opacity-70">{flavor}</p>}
                </div>
                <div className="flex flex-col items-end text-right">
                    <span className="landing-display whitespace-nowrap text-xl">{formatPrice(price, locale)}</span>
                    {pkg && (
                        <>
                            <span className="text-[11px] leading-tight opacity-70">
                                {locale === 'ar' ? `عبوة من ${pkgSize(p)} كيس` : `per package of ${pkgSize(p)} bags`}
                            </span>
                            <span className="text-[10px] leading-tight opacity-50">
                                {locale === 'ar' ? `(~${p.price} جنيه / كيس)` : `(~${p.price} EGP / bag)`}
                            </span>
                        </>
                    )}
                </div>
=======
            {/* Prices are intentionally not shown on the storefront for now. */}
            <div className="mt-5">
                <h3 className="landing-display text-2xl leading-none">{pl.name}</h3>
                <p className="mt-1.5 text-sm opacity-70">{pl.flavor}</p>
>>>>>>> upstream/main
            </div>

            {description && <p className="mt-3 text-sm leading-relaxed opacity-65">{description}</p>}

            {pkg && (
                <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-black/10 px-2.5 py-1 text-[11px] font-semibold">
                    📦 {pkgSize(p)} {locale === 'ar' ? 'كيس بالعبوة' : 'bags per package'}
                </span>
            )}

            <button
                type="button"
                data-cursor="hover"
                onClick={() => add({ name, src: img, flavor: flavor || name, priceValue: price })}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow py-3 font-grotesk text-xs font-bold uppercase tracking-wider text-brand-red-deep transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            >
                <CartIcon className="h-4 w-4" />
                {ctaText}
            </button>
        </motion.article>
    );
}

export default function ProductsView() {
    const { t, locale } = useLanguage();
    const [products, setProducts] = useState<ApiProduct[] | null>(null);
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [error, setError] = useState(false);
    const [cat, setCat] = useState<string>('all'); // category slug, or 'all'

    useEffect(() => {
        let active = true;
        Promise.all([fetchProducts({ limit: 100 }), fetchCategories().catch(() => [])])
            .then(([prods, cats]) => {
                if (!active) return;
                setProducts(prods);
                setCategories(cats);
            })
            .catch(() => {
                if (active) {
                    setError(true);
                    setProducts([]);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    const list = useMemo(() => {
        if (!products) return [];
        return cat === 'all' ? products : products.filter((p) => p.category?.slug === cat);
    }, [products, cat]);

    const anyPackage = useMemo(() => (products || []).some(isPackage), [products]);
    const catLabel = (c: ApiCategory) => (locale === 'ar' && c.nameAr ? c.nameAr : c.name);

    return (
        <section className="px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
            <div className="mx-auto max-w-[1280px]">
                {/* Header */}
                <div className="mb-10">
                    <Chip variant="yellow" size="md" className="mb-5">{t('lnd.products.chip')}</Chip>
                    <h1 className="landing-display text-[clamp(3rem,9vw,7rem)] leading-[0.88] text-white">
                        <TextReveal text={t('lnd.products.title')} />
                    </h1>
                    <p className="mt-5 max-w-lg font-grotesk text-base text-white/75">
                        {t('lnd.products.sub')}
                    </p>
                    {anyPackage && (
                        <p className="mt-2 font-grotesk text-sm text-white/40">
                            {locale === 'ar'
                                ? 'كل المنتجات تُباع بالعبوة — مثالية للبيع بالتجزئة والجملة.'
                                : 'All products are sold by the package. Ideal for retail and wholesale orders.'}
                        </p>
                    )}
                </div>

                {/* Filter chips */}
                {categories.length > 0 && (
                    <div className="mb-10 flex flex-wrap gap-2.5">
                        <button onClick={() => setCat('all')} data-cursor="hover" aria-pressed={cat === 'all'}>
                            <Chip variant={cat === 'all' ? 'yellow' : 'outline'} size="md">{t('lnd.cat.All')}</Chip>
                        </button>
                        {categories.map((c) => (
                            <button key={c.id} onClick={() => setCat(c.slug)} data-cursor="hover" aria-pressed={cat === c.slug}>
                                <Chip variant={cat === c.slug ? 'yellow' : 'outline'} size="md">{catLabel(c)}</Chip>
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid / states */}
                {products === null ? (
                    <p className="font-grotesk text-white/60">{t('bs.loading') || 'Loading products…'}</p>
                ) : error ? (
                    <p className="font-grotesk text-white/60">{t('bs.error') || 'Could not load products. Please try again.'}</p>
                ) : list.length === 0 ? (
                    <p className="font-grotesk text-white/60">{t('bs.empty') || 'No products found.'}</p>
                ) : (
                    <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {list.map((p, i) => (
                                <Card key={p.id} p={p} tone={TONE_CYCLE[i % TONE_CYCLE.length]} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Closing strip */}
            <div className="mx-auto mt-20 max-w-[1280px]">
                <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/15 bg-brand-red-deep px-8 py-12 text-center sm:flex-row sm:text-left">
                    <div>
                        <h2 className="landing-display text-3xl text-white sm:text-4xl">{t('lnd.products.cantDecide')}</h2>
                        <p className="mt-2 font-grotesk text-sm text-white/70">{t('lnd.products.cantSub')}</p>
                    </div>
                    <Magnetic strength={0.5}>
                        <a href="/#cta" className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-9 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep">
                            <CartIcon className="h-4 w-4" />
                            {t('lnd.products.bundle')}
                        </a>
                    </Magnetic>
                </div>
            </div>
        </section>
    );
}
