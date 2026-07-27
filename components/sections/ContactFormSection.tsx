'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function ContactFormSection({ props }: { props: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const recipient = props.recipient || 'hello@sarayo.com';
        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(form.subject || 'Website inquiry')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
        setSent(true);
    }

    return (
        <section className="py-20 sm:py-28">
            <div className="mx-auto max-w-[640px] px-5 sm:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="rounded-3xl border border-white/12 bg-brand-red-deep/60 p-8 backdrop-blur-sm">
                    {(props.titleEn || props.titleAr) && <p className="font-semibold text-white text-lg mb-1">{ar ? props.titleAr : props.titleEn}</p>}
                    {(props.subEn || props.subAr) && <p className="text-sm text-white/60 mb-6">{ar ? props.subAr : props.subEn}</p>}

                    {sent ? (
                        <div className="text-center py-8">
                            <span className="text-4xl mb-4 block">✓</span>
                            <p className="text-white font-medium">{ar ? props.successAr : props.successEn}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { key: 'name', label: ar ? 'الاسم' : 'Name', type: 'text', required: true },
                                { key: 'email', label: ar ? 'البريد الإلكتروني' : 'Email', type: 'email', required: true },
                                { key: 'subject', label: ar ? 'الموضوع' : 'Subject', type: 'text', required: false },
                            ].map(field => (
                                <div key={field.key}>
                                    <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">{field.label}</label>
                                    <input type={field.type} required={field.required} value={(form as any)[field.key]}
                                        onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                                        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-yellow/60 transition-colors"
                                        dir={ar ? 'rtl' : 'ltr'} />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">{ar ? 'الرسالة' : 'Message'}</label>
                                <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                    className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-yellow/60 transition-colors resize-none"
                                    dir={ar ? 'rtl' : 'ltr'} />
                            </div>
                            <button type="submit" className="w-full rounded-full bg-brand-yellow py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep hover:bg-brand-yellow/90 transition-colors">
                                {ar ? props.submitAr : props.submitEn}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
