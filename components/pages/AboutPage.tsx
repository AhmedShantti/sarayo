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

export default function AboutPage({ data }: { data: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';

    const hero = data.hero;
    const story = data.story;
    const vision = data.vision;
    const mission = data.mission;
    const pillars = data.pillars || [];
    const values = data.values || [];
    const cta = data.cta;

    return (
        <>
            <PageHero
                chip={ar ? hero.chipAr : hero.chipEn}
                headline={ar ? hero.headlineAr : hero.headlineEn}
                sub={ar ? hero.subAr : hero.subEn}
            />

            {/* Story */}
            <section className="py-20 sm:py-28">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <SectionTitle title={ar ? story.titleAr || story.titleEn : story.titleEn} />
                            <div className="space-y-5">
                                {(ar ? story.paragraphsAr : story.paragraphsEn).map((p: string, i: number) => (
                                    <motion.p key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="text-white/75 leading-relaxed">
                                        {p}
                                    </motion.p>
                                ))}
                            </div>
                        </div>

                        {/* Vision + Mission */}
                        <div className="space-y-5">
                            {[vision, mission].filter(Boolean).map((block: any, i: number) => (
                                <motion.div key={block.titleEn} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}
                                    className="rounded-3xl border border-white/12 bg-brand-red-deep/60 p-7 backdrop-blur-sm">
                                    <span className="font-grotesk text-xs uppercase tracking-[0.2em] text-brand-yellow">
                                        {ar ? block.titleAr : block.titleEn}
                                    </span>
                                    <p className="mt-3 text-white/80 leading-relaxed">{ar ? block.textAr : block.textEn}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic direction / quality / future */}
            {pillars.length > 0 && (
                <section className="py-20 sm:py-28 border-t border-white/8">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {pillars.map((p: any, i: number) => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className="rounded-3xl border border-white/12 bg-brand-red-deep/40 p-7 backdrop-blur-sm">
                                    <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-white/20 text-brand-yellow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                            <path d={ICON_PATHS[p.icon] || ICON_PATHS.spark} />
                                        </svg>
                                    </span>
                                    <p className="landing-display text-2xl text-white mb-3">{ar ? p.titleAr : p.titleEn}</p>
                                    <div className="space-y-3">
                                        {(ar ? p.paragraphsAr : p.paragraphsEn).map((txt: string, j: number) => (
                                            <p key={j} className="text-sm text-white/70 leading-relaxed">{txt}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Values */}
            <section className="py-20 sm:py-28 border-t border-white/8">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                    <SectionTitle chip={ar ? 'قيمنا' : 'Our Values'} title={ar ? 'ما نؤمن به' : 'What We Stand For'} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map((v: any, i: number) => (
                            <motion.div key={v.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="rounded-3xl border border-white/12 bg-brand-red-deep/60 p-7 backdrop-blur-sm">
                                <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-white/20 text-brand-yellow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                        <path d={ICON_PATHS[v.icon] || ICON_PATHS.spark} />
                                    </svg>
                                </span>
                                <p className="font-semibold text-white mb-2">{ar ? v.titleAr : v.titleEn}</p>
                                <p className="text-sm text-white/65 leading-relaxed">{ar ? v.textAr : v.textEn}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CrunchCTA
                title={ar ? cta.titleAr : cta.titleEn}
                sub={ar ? cta.subAr : cta.subEn}
                btn1={ar ? cta.btn1Ar : cta.btn1En}
                btn1Href={cta.btn1Href}
                btn2={ar ? cta.btn2Ar : cta.btn2En}
                btn2Href={cta.btn2Href}
            />
        </>
    );
}
