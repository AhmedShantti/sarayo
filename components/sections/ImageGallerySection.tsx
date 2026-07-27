'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/pages/PageShell';
import { useLanguage } from '@/lib/LanguageContext';

export default function ImageGallerySection({ props }: { props: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    const images: { src: string; altEn: string; altAr: string }[] = props.images || [];

    return (
        <section className="py-20 sm:py-28 border-t border-white/8">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                {(props.titleEn || props.titleAr) && <SectionTitle title={ar ? props.titleAr || props.titleEn : props.titleEn} />}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.5 }} className="relative aspect-square rounded-2xl overflow-hidden border border-white/12 bg-brand-red-deep/60">
                            <Image src={img.src} alt={(ar ? img.altAr : img.altEn) || ''} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
