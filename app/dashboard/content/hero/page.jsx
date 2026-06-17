'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const input = 'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30';

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">{label}</label>
            {children}
        </div>
    );
}

function SectionCard({ title, children }) {
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-sm font-semibold text-ink mb-5">{title}</p>
            {children}
        </div>
    );
}

export default function HeroContentPage() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const r = await fetch('/api/content/hero');
        if (!r.ok) { showToast(`Load failed (${r.status})`); return; }
        setData(await r.json());
    }

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    function set(path, value) {
        setData(prev => {
            const next = structuredClone(prev);
            const keys = path.split('.');
            let obj = next;
            for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
            obj[keys[keys.length - 1]] = value;
            return next;
        });
    }

    function setWord(locale, i, value) {
        setData(prev => {
            const next = structuredClone(prev);
            next.words[locale][i] = value;
            return next;
        });
    }

    function addWord(locale) {
        setData(prev => {
            const next = structuredClone(prev);
            next.words[locale] = [...next.words[locale], ''];
            return next;
        });
    }

    function removeWord(locale, i) {
        setData(prev => {
            const next = structuredClone(prev);
            next.words[locale] = next.words[locale].filter((_, j) => j !== i);
            return next;
        });
    }

    async function save() {
        if (!data) { showToast('Content not loaded yet — nothing to save.'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/content/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Save failed (${res.status})`);
            showToast('Saved! Reload the site to see changes.');
        } catch (e) {
            showToast(`Save failed: ${e.message}`);
        } finally {
            setSaving(false);
        }
    }

    if (!data) return <div className="p-10 text-center text-sm text-neutral-400">Loading…</div>;

    return (
        <>
            {toast && <div className="fixed top-4 right-4 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">{toast}</div>}

            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                        <Link href="/dashboard/content" className="hover:text-ink transition-colors">Content</Link>
                        <span>/</span>
                        <span className="text-ink">Hero</span>
                    </div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">Hero Section</h1>
                    <p className="text-sm text-neutral-500 mt-1">Main headline, CTAs and rotating brand words.</p>
                </div>
                <button onClick={save} disabled={saving} className="shrink-0 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : 'Save changes'}
                </button>
            </div>

            <div className="space-y-5">
                <SectionCard title="Headline">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Line 1 (English)">
                            <input className={input} value={data.line1.en} onChange={e => set('line1.en', e.target.value)} placeholder="Crunch in" />
                        </Field>
                        <Field label="Line 1 (Arabic)">
                            <input className={input} dir="rtl" value={data.line1.ar} onChange={e => set('line1.ar', e.target.value)} placeholder="قرمشة" />
                        </Field>
                        <Field label="Line 2 (English)">
                            <input className={input} value={data.line2.en} onChange={e => set('line2.en', e.target.value)} placeholder="Style" />
                        </Field>
                        <Field label="Line 2 (Arabic)">
                            <input className={input} dir="rtl" value={data.line2.ar} onChange={e => set('line2.ar', e.target.value)} placeholder="بأناقة" />
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard title="Call to Action Buttons">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Primary CTA (English)">
                            <input className={input} value={data.cta1.en} onChange={e => set('cta1.en', e.target.value)} placeholder="Shop the flavors" />
                        </Field>
                        <Field label="Primary CTA (Arabic)">
                            <input className={input} dir="rtl" value={data.cta1.ar} onChange={e => set('cta1.ar', e.target.value)} placeholder="تسوّق النكهات" />
                        </Field>
                        <Field label="Secondary CTA (English)">
                            <input className={input} value={data.cta2.en} onChange={e => set('cta2.en', e.target.value)} placeholder="Our crunch" />
                        </Field>
                        <Field label="Secondary CTA (Arabic)">
                            <input className={input} dir="rtl" value={data.cta2.ar} onChange={e => set('cta2.ar', e.target.value)} placeholder="قرمشتنا" />
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard title="Rotating Brand Words">
                    <p className="text-xs text-neutral-500 mb-4">These words cycle in the animated chip above the headline.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500 mb-3">English</p>
                            <div className="space-y-2">
                                {data.words.en.map((w, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input className={input} value={w} onChange={e => setWord('en', i, e.target.value)} />
                                        <button onClick={() => removeWord('en', i)} className="shrink-0 w-9 h-9 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center text-lg transition-colors">×</button>
                                    </div>
                                ))}
                                <button onClick={() => addWord('en')} className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">+ Add word</button>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500 mb-3">Arabic</p>
                            <div className="space-y-2">
                                {data.words.ar.map((w, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input className={input} dir="rtl" value={w} onChange={e => setWord('ar', i, e.target.value)} />
                                        <button onClick={() => removeWord('ar', i)} className="shrink-0 w-9 h-9 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center text-lg transition-colors">×</button>
                                    </div>
                                ))}
                                <button onClick={() => addWord('ar')} className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">+ Add word</button>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>
        </>
    );
}
