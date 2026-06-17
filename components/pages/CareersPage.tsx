'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chip from '@/components/landing/Chip';
import { PageHero, SectionTitle } from './PageShell';
import { useLanguage } from '@/lib/LanguageContext';

export default function CareersPage({ data }: { data: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    const [open, setOpen] = useState<string | null>(null);

    const hero = data.hero;
    const culture = data.culture;
    const jobs = (data.jobs || []).filter((j: any) => j.active);
    const noJobs = data.noJobs;
    const cta = data.cta;

    return (
        <>
            <PageHero
                chip={ar ? hero.chipAr : hero.chipEn}
                headline={ar ? hero.headlineAr : hero.headlineEn}
                sub={ar ? hero.subAr : hero.subEn}
            />

            {/* Culture */}
            <section className="py-20 sm:py-28">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <SectionTitle title={ar ? culture.titleAr || culture.titleEn : culture.titleEn} />
                            <ul className="space-y-3">
                                {(ar ? culture.itemsAr : culture.itemsEn).map((item: string, i: number) => (
                                    <motion.li key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                        className="flex items-start gap-3 text-white/80">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-yellow shrink-0" />
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Jobs */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
                                {jobs.length} {ar ? 'وظيفة شاغرة' : 'open role' + (jobs.length !== 1 ? 's' : '')}
                            </p>

                            {jobs.length === 0 ? (
                                <div className="rounded-2xl border border-white/12 bg-brand-red-deep/60 p-8 text-center">
                                    <p className="font-semibold text-white mb-2">{ar ? noJobs.titleAr : noJobs.titleEn}</p>
                                    <p className="text-sm text-white/60 mb-4">{ar ? noJobs.subAr : noJobs.subEn}</p>
                                    <a href={`mailto:${noJobs.emailEn}`} className="text-brand-yellow text-sm underline underline-offset-4">{ar ? noJobs.emailAr : noJobs.emailEn}</a>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {jobs.map((job: any, i: number) => (
                                        <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                                            className="rounded-2xl border border-white/12 bg-brand-red-deep/60 overflow-hidden">
                                            <button onClick={() => setOpen(open === job.id ? null : job.id)}
                                                className="w-full flex items-start justify-between gap-4 p-6 text-left">
                                                <div>
                                                    <p className="font-semibold text-white">{ar ? job.titleAr : job.titleEn}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <Chip variant="outline" size="sm">{ar ? job.deptAr : job.deptEn}</Chip>
                                                        <Chip variant="outline" size="sm">{ar ? job.locationAr : job.locationEn}</Chip>
                                                        <Chip variant="outline" size="sm">{ar ? job.typeAr : job.typeEn}</Chip>
                                                    </div>
                                                </div>
                                                <span className="text-white/40 shrink-0 mt-1 text-lg transition-transform" style={{ transform: open === job.id ? 'rotate(45deg)' : 'none' }}>+</span>
                                            </button>

                                            <AnimatePresence>
                                                {open === job.id && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                                                        <div className="px-6 pb-6 border-t border-white/10 pt-5">
                                                            <p className="text-sm text-white/70 leading-relaxed mb-5">{ar ? job.descAr : job.descEn}</p>
                                                            <a href={job.applyUrl}
                                                                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 font-grotesk text-xs font-bold uppercase tracking-wider text-brand-red-deep hover:bg-brand-yellow/90 transition-colors">
                                                                {ar ? 'قدّم الآن' : 'Apply now'}
                                                            </a>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 border-t border-white/8">
                <div className="mx-auto max-w-[900px] px-5 sm:px-8 text-center">
                    <p className="font-semibold text-white mb-2">{ar ? cta.titleAr : cta.titleEn}</p>
                    <p className="text-sm text-white/60">{ar ? cta.subAr : cta.subEn}</p>
                </div>
            </section>
        </>
    );
}
