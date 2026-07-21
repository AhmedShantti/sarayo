'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Chip from '@/components/landing/Chip';
import { PageHero, SectionTitle } from './PageShell';
import { useLanguage } from '@/lib/LanguageContext';
import { useLandingCart } from '@/lib/LandingCart';

const TONE_CLASSES: Record<string, string> = {
    deep:   'bg-brand-red-deep border border-white/12 text-white',
    cream:  'bg-brand-cream text-brand-red-deep',
    yellow: 'bg-brand-yellow text-brand-red-deep',
};

export default function ProductCatalog({ data, section }: { data: any; section: 'chipsy' | 'wafer' }) {
    const { locale } = useLanguage();
    const { add } = useLandingCart();
    const ar = locale === 'ar';
    const [added, setAdded] = useState<string | null>(null);

    const hero = data.hero;
    const products = (data.products || []).filter((p: any) => p.active !== false);

    function handleAdd(p: any) {
        add({
            name: ar ? p.nameAr : p.nameEn,
            src: p.src,
            priceValue: p.priceValue || 0,
            flavor: ar ? p.flavorAr : p.flavorEn,
        });
        setAdded(p.id);
        setTimeout(() => setAdded(null), 1800);
    }

    return (
        <>
            <PageHero
                chip={ar ? hero.chipAr : hero.chipEn}
                headline={ar ? hero.headlineAr : hero.headlineEn}
                sub={ar ? hero.subAr : hero.subEn}
            />

            <section className="py-20 sm:py-28">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((p: any, i: number) => {
                            const tone = p.tone || 'deep';
                            const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.deep;
                            const isAdded = added === p.id;

                            return (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                                    className={`relative flex flex-col overflow-hidden rounded-3xl ${toneClass} p-6`}>

                                    <div className="flex items-center justify-between mb-4">
                                        <Chip variant={tone === 'deep' ? 'outline' : 'red'} size="sm">
                                            {ar ? p.tagAr || p.tagEn : p.tagEn || p.tagAr}
                                        </Chip>
                                        <span className="font-grotesk text-xs uppercase tracking-widest opacity-40">
                                            {String(i + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <div className="relative flex-1 flex items-center justify-center min-h-[220px] my-2">
                                        <Image src={p.src} alt={ar ? p.nameAr : p.nameEn} fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]" />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-current">{ar ? p.subAr || p.subEn : p.subEn || p.subAr}</p>
                                        <p className="landing-display text-[2.2rem] leading-none mt-0.5 mb-1">
                                            {ar ? p.nameAr : p.nameEn}
                                        </p>
                                        <p className="text-sm opacity-65">{ar ? p.flavorAr : p.flavorEn}</p>

                                        {p.descEn && (
                                            <p className="text-xs opacity-55 mt-2 leading-relaxed">
                                                {ar ? p.descAr : p.descEn}
                                            </p>
                                        )}

                                        <button onClick={() => handleAdd(p)}
                                            className={`mt-5 w-full rounded-full py-3 font-grotesk text-xs font-bold uppercase tracking-wider transition-all ${
                                                tone === 'deep'
                                                    ? 'bg-brand-yellow text-brand-red-deep hover:bg-brand-yellow/90'
                                                    : 'bg-brand-red-deep text-white hover:bg-brand-red-deep/80'
                                            } ${isAdded ? 'scale-95' : ''}`}>
                                            {isAdded ? (ar ? 'تمت الإضافة ✓' : 'Added ✓') : (ar ? 'أضف للسلة' : 'Add to bag')}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
