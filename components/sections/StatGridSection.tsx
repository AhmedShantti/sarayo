'use client';

import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/pages/PageShell';
import { useLanguage } from '@/lib/LanguageContext';

export default function StatGridSection({ props }: { props: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    const stats: { value: string; labelEn: string; labelAr: string }[] = props.stats || [];

    return (
        <section className="border-y border-white/12 bg-brand-red-deep/40 py-16 backdrop-blur-sm sm:py-20">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                {(props.titleEn || props.titleAr) && <SectionTitle title={ar ? props.titleAr || props.titleEn : props.titleEn} />}
                <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
                    {stats.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }}
                            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="text-center">
                            <div className="landing-display text-[clamp(3rem,7vw,5.5rem)] leading-none text-white">{s.value}</div>
                            <p className="mt-3 font-grotesk text-xs uppercase tracking-[0.25em] text-white/60">{ar ? s.labelAr : s.labelEn}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
