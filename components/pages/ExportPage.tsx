'use client';

import { motion } from 'framer-motion';
import Chip from '@/components/landing/Chip';
import { PageHero, SectionTitle, Icon, CrunchCTA } from './PageShell';
import { useLanguage } from '@/lib/LanguageContext';

const ICON_PATHS: Record<string, string> = {
    spark: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
    flame: 'M12 3c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.4-2-1-3 .2 1.5-.8 2-1.5 1.2C16.5 6.5 14 4.5 12 3Z',
    leaf:  'M4 20c0-8 6-14 16-14 0 10-6 16-16 14Zm3-3c4-5 7-7 10-8',
    globe: 'M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3Zm0 0c3 3 3 15 0 18M12 3c-3 3-3 15 0 18M3 12h18',
};

export default function ExportPage({ data }: { data: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';

    const hero = data.hero;
    const markets = data.markets || [];
    const whyUs = data.whyUs;
    const certs = data.certifications || [];
    const contact = data.contact;

    const activeMarkets = markets.filter((m: any) => m.active);
    const comingMarkets = markets.filter((m: any) => !m.active);

    return (
        <>
            <PageHero
                chip={ar ? hero.chipAr : hero.chipEn}
                headline={ar ? hero.headlineAr : hero.headlineEn}
                sub={ar ? hero.subAr : hero.subEn}
            />

            {/* Markets */}
            <section className="py-20 sm:py-28">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                    <SectionTitle chip={ar ? 'أسواقنا' : 'Our Markets'} title={ar ? 'نصل إليك' : 'Where We Ship'} />
                    <div className="flex flex-wrap gap-3 mb-8">
                        {activeMarkets.map((m: any, i: number) => (
                            <motion.div key={m.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}
                                className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-brand-red-deep/60 px-5 py-3">
                                <span className="text-2xl">{m.flag}</span>
                                <span className="text-white font-medium">{ar ? m.nameAr : m.nameEn}</span>
                                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" />
                            </motion.div>
                        ))}
                        {comingMarkets.map((m: any, i: number) => (
                            <motion.div key={m.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (activeMarkets.length + i) * 0.06, duration: 0.4 }}
                                className="flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/4 px-5 py-3 opacity-50">
                                <span className="text-2xl">{m.flag}</span>
                                <span className="text-white/60 font-medium">{ar ? m.nameAr : m.nameEn}</span>
                                <Chip variant="outline" size="sm">{ar ? 'قريباً' : 'Soon'}</Chip>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why us */}
            <section className="py-20 sm:py-28 border-t border-white/8">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                    <SectionTitle title={ar ? whyUs.titleAr || whyUs.titleEn : whyUs.titleEn} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {(whyUs.items || []).map((item: any, i: number) => (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="rounded-3xl border border-white/12 bg-brand-red-deep/60 p-7 backdrop-blur-sm">
                                <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-white/20 text-brand-yellow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                        <path d={ICON_PATHS[item.icon] || ICON_PATHS.spark} />
                                    </svg>
                                </span>
                                <p className="font-semibold text-white mb-2">{ar ? item.titleAr : item.titleEn}</p>
                                <p className="text-sm text-white/65 leading-relaxed">{ar ? item.textAr : item.textEn}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications */}
            {certs.length > 0 && (
                <section className="py-16 border-t border-white/8">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">{ar ? 'الشهادات' : 'Certifications'}</p>
                        <div className="flex flex-wrap gap-4">
                            {certs.map((c: any) => (
                                <div key={c.id} className="rounded-2xl border border-white/15 bg-brand-red-deep/40 px-6 py-4">
                                    <p className="font-bold text-white">{ar ? c.nameAr : c.nameEn}</p>
                                    <p className="text-xs text-white/50 mt-0.5">{ar ? c.descAr : c.descEn}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CrunchCTA
                title={ar ? contact.titleAr || contact.titleEn : contact.titleEn}
                sub={ar ? contact.subAr || contact.subEn : contact.subEn}
                btn1={ar ? 'راسلنا' : 'Email Export Team'}
                btn1Href={`mailto:${contact.emailEn}`}
                btn2={ar ? 'اتصل بنا' : `Call ${contact.phoneEn}`}
                btn2Href={`tel:${contact.phoneEn.replace(/\s/g, '')}`}
            />
        </>
    );
}
