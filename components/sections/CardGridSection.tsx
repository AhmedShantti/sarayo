'use client';

import { motion } from 'framer-motion';
import { SectionTitle, Icon } from '@/components/pages/PageShell';
import { useLanguage } from '@/lib/LanguageContext';

export default function CardGridSection({ props }: { props: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    const cards: { icon: string; titleEn: string; titleAr: string; textEn: string; textAr: string }[] = props.cards || [];

    return (
        <section className="py-20 sm:py-28 border-t border-white/8">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                <SectionTitle chip={ar ? props.chipAr : props.chipEn} title={ar ? props.titleAr || props.titleEn : props.titleEn} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {cards.map((c, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }} className="rounded-3xl border border-white/12 bg-brand-red-deep/60 p-7 backdrop-blur-sm">
                            <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-white/20 text-brand-yellow">
                                <Icon name={c.icon} />
                            </span>
                            <p className="font-semibold text-white mb-2">{ar ? c.titleAr : c.titleEn}</p>
                            <p className="text-sm text-white/65 leading-relaxed">{ar ? c.textAr : c.textEn}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
