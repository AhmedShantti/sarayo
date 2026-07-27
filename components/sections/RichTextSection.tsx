'use client';

import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/pages/PageShell';
import { useLanguage } from '@/lib/LanguageContext';

export default function RichTextSection({ props }: { props: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    const paragraphs: { en: string; ar: string }[] = props.paragraphs || [];

    return (
        <section className="py-20 sm:py-28">
            <div className="mx-auto max-w-[900px] px-5 sm:px-8">
                {(props.titleEn || props.titleAr) && <SectionTitle title={ar ? props.titleAr || props.titleEn : props.titleEn} />}
                <div className="space-y-5">
                    {paragraphs.map((p, i) => (
                        <motion.p key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }} className="text-white/75 leading-relaxed">
                            {ar ? p.ar : p.en}
                        </motion.p>
                    ))}
                </div>
            </div>
        </section>
    );
}
