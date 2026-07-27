'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chip from '@/components/landing/Chip';
import { SectionTitle } from '@/components/pages/PageShell';
import { useLanguage } from '@/lib/LanguageContext';

export default function JobListingsSection({ props }: { props: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    const [open, setOpen] = useState<string | null>(null);
    const jobs = (props.jobs || []).filter((j: any) => j.active !== false);

    return (
        <section className="py-20 sm:py-28 border-t border-white/8">
            <div className="mx-auto max-w-[900px] px-5 sm:px-8">
                {(props.titleEn || props.titleAr) && <SectionTitle title={ar ? props.titleAr || props.titleEn : props.titleEn} />}

                {jobs.length === 0 ? (
                    <div className="rounded-2xl border border-white/12 bg-brand-red-deep/60 p-8 text-center">
                        <p className="text-sm text-white/60">{ar ? props.noJobsAr : props.noJobsEn}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job: any, i: number) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }} className="rounded-2xl border border-white/12 bg-brand-red-deep/60 overflow-hidden">
                                <button onClick={() => setOpen(open === String(i) ? null : String(i))}
                                    className="w-full flex items-start justify-between gap-4 p-6 text-left">
                                    <div>
                                        <p className="font-semibold text-white">{ar ? job.titleAr : job.titleEn}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Chip variant="outline" size="sm">{ar ? job.deptAr : job.deptEn}</Chip>
                                            <Chip variant="outline" size="sm">{ar ? job.locationAr : job.locationEn}</Chip>
                                            <Chip variant="outline" size="sm">{ar ? job.typeAr : job.typeEn}</Chip>
                                        </div>
                                    </div>
                                    <span className="text-white/40 shrink-0 mt-1 text-lg transition-transform" style={{ transform: open === String(i) ? 'rotate(45deg)' : 'none' }}>+</span>
                                </button>
                                <AnimatePresence>
                                    {open === String(i) && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                                            <div className="px-6 pb-6 border-t border-white/10 pt-5">
                                                <p className="text-sm text-white/70 leading-relaxed mb-5">{ar ? job.descAr : job.descEn}</p>
                                                <a href={job.applyUrl} className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 font-grotesk text-xs font-bold uppercase tracking-wider text-brand-red-deep hover:bg-brand-yellow/90 transition-colors">
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
        </section>
    );
}
