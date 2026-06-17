'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHero, Icon } from './PageShell';
import { useLanguage } from '@/lib/LanguageContext';

const SOCIAL_ICONS: Record<string, string> = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
    facebook:  'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    tiktok:    'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.3a8.16 8.16 0 0 0 4.77 1.52V7.37a4.85 4.85 0 0 1-1-.68z',
    x:         'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.722-8.836L2.25 2.25h6.756l4.281 5.655 4.957-5.655z',
};

export default function ContactPage({ data }: { data: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const hero = data.hero;
    const cards = data.cards || [];
    const social = data.social || [];
    const f = data.form;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        window.location.href = `mailto:${f.emailLabelEn || 'hello@sarayo.com'}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
        setSent(true);
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Left: contact cards + social */}
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                {cards.map((c: any, i: number) => (
                                    <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                                        {c.href ? (
                                            <a href={c.href} className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-brand-red-deep/60 p-6 hover:border-brand-yellow/40 transition-colors group">
                                                <span className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-red-deep transition-colors">
                                                    <Icon name={c.icon} className="w-5 h-5" />
                                                </span>
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">{ar ? c.labelAr : c.labelEn}</p>
                                                    <p className="text-white font-medium">{ar ? c.valueAr : c.valueEn}</p>
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-brand-red-deep/60 p-6">
                                                <span className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-brand-yellow">
                                                    <Icon name={c.icon} className="w-5 h-5" />
                                                </span>
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">{ar ? c.labelAr : c.labelEn}</p>
                                                    <p className="text-white font-medium">{ar ? c.valueAr : c.valueEn}</p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {social.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">{ar ? 'تابعنا' : 'Follow Us'}</p>
                                    <div className="flex gap-3">
                                        {social.map((s: any) => (
                                            <a key={s.id} href={s.href} aria-label={s.label}
                                                className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-white/60 hover:text-brand-yellow hover:border-brand-yellow/40 transition-colors">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                                    <path d={SOCIAL_ICONS[s.id] || SOCIAL_ICONS.x} />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: contact form */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="rounded-3xl border border-white/12 bg-brand-red-deep/60 p-8 backdrop-blur-sm">
                            <p className="font-semibold text-white text-lg mb-1">{ar ? f.titleAr : f.titleEn}</p>
                            <p className="text-sm text-white/60 mb-6">{ar ? f.subAr : f.subEn}</p>

                            {sent ? (
                                <div className="text-center py-8">
                                    <span className="text-4xl mb-4 block">✓</span>
                                    <p className="text-white font-medium">{ar ? f.successAr : f.successEn}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {[
                                        { key: 'name', labelEn: f.nameLabelEn, labelAr: f.nameLabelAr, type: 'text', required: true },
                                        { key: 'email', labelEn: f.emailLabelEn, labelAr: f.emailLabelAr, type: 'email', required: true },
                                        { key: 'subject', labelEn: f.subjectLabelEn, labelAr: f.subjectLabelAr, type: 'text', required: false },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">
                                                {ar ? field.labelAr : field.labelEn}
                                            </label>
                                            <input
                                                type={field.type}
                                                required={field.required}
                                                value={(form as any)[field.key]}
                                                onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                                                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-yellow/60 transition-colors"
                                                dir={ar ? 'rtl' : 'ltr'}
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">
                                            {ar ? f.messageLabelAr : f.messageLabelEn}
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={form.message}
                                            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-yellow/60 transition-colors resize-none"
                                            dir={ar ? 'rtl' : 'ltr'}
                                        />
                                    </div>
                                    <button type="submit" className="w-full rounded-full bg-brand-yellow py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep hover:bg-brand-yellow/90 transition-colors">
                                        {ar ? f.submitAr : f.submitEn}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
