'use client';

import { useState, useEffect } from 'react';

function BiField({ label, enVal, arVal, onEn, onAr, multiline }) {
    const Tag = multiline ? 'textarea' : 'input';
    const baseClass = 'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20';
    return (
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">{label} (EN)</label>
                <Tag value={enVal || ''} onChange={e => onEn(e.target.value)} rows={multiline ? 3 : undefined} className={baseClass + (multiline ? ' resize-none' : '')} />
            </div>
            <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">{label} (AR)</label>
                <Tag value={arVal || ''} onChange={e => onAr(e.target.value)} rows={multiline ? 3 : undefined} dir="rtl" className={baseClass + (multiline ? ' resize-none' : '')} />
            </div>
        </div>
    );
}

export default function AboutEditor() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/content/pages/about').then(r => r.json()).then(setData);
    }, []);

    async function save() {
        setSaving(true);
        await fetch('/api/content/pages/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    }

    function set(path, value) {
        setData(d => {
            const parts = path.split('.');
            const next = { ...d };
            let cur = next;
            for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] = { ...cur[parts[i]] }; cur = cur[parts[i]]; }
            cur[parts[parts.length - 1]] = value;
            return next;
        });
    }

    function setParagraphs(lang, list) { set(`story.paragraphs${lang === 'en' ? 'En' : 'Ar'}`, list); }

    if (!data) return <div className="p-8 text-neutral-500">Loading…</div>;

    return (
        <div className="p-6 sm:p-8 max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
                <div><h1 className="text-xl font-bold text-neutral-900">About Us</h1><p className="text-sm text-neutral-500 mt-0.5">Edit the About page content</p></div>
                <button onClick={save} disabled={saving} className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-neutral-800 transition-colors">
                    {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
                </button>
            </div>

            {/* Hero */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Hero</p>
                <BiField label="Chip" enVal={data.hero?.chipEn} arVal={data.hero?.chipAr} onEn={v => set('hero.chipEn', v)} onAr={v => set('hero.chipAr', v)} />
                <BiField label="Headline" enVal={data.hero?.headlineEn} arVal={data.hero?.headlineAr} onEn={v => set('hero.headlineEn', v)} onAr={v => set('hero.headlineAr', v)} />
                <BiField label="Sub" enVal={data.hero?.subEn} arVal={data.hero?.subAr} onEn={v => set('hero.subEn', v)} onAr={v => set('hero.subAr', v)} multiline />
            </section>

            {/* Story */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Story</p>
                <BiField label="Section title" enVal={data.story?.titleEn} arVal={data.story?.titleAr} onEn={v => set('story.titleEn', v)} onAr={v => set('story.titleAr', v)} />
                <div className="space-y-3">
                    <p className="text-xs font-medium text-neutral-600">Paragraphs (EN)</p>
                    {(data.story?.paragraphsEn || []).map((p, i) => (
                        <div key={i} className="flex gap-2">
                            <textarea value={p} rows={2} onChange={e => { const arr = [...data.story.paragraphsEn]; arr[i] = e.target.value; setParagraphs('en', arr); }}
                                className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none resize-none" />
                            <button onClick={() => setParagraphs('en', data.story.paragraphsEn.filter((_, j) => j !== i))}
                                className="text-neutral-400 hover:text-red-500 text-lg font-light self-start mt-1">×</button>
                        </div>
                    ))}
                    <button onClick={() => setParagraphs('en', [...(data.story?.paragraphsEn || []), ''])}
                        className="text-xs text-neutral-500 hover:text-neutral-900 border border-dashed border-neutral-300 rounded-lg px-3 py-2 w-full">+ Add paragraph (EN)</button>
                </div>
                <div className="space-y-3">
                    <p className="text-xs font-medium text-neutral-600">Paragraphs (AR)</p>
                    {(data.story?.paragraphsAr || []).map((p, i) => (
                        <div key={i} className="flex gap-2">
                            <textarea value={p} rows={2} dir="rtl" onChange={e => { const arr = [...data.story.paragraphsAr]; arr[i] = e.target.value; setParagraphs('ar', arr); }}
                                className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none resize-none" />
                            <button onClick={() => setParagraphs('ar', data.story.paragraphsAr.filter((_, j) => j !== i))}
                                className="text-neutral-400 hover:text-red-500 text-lg font-light self-start mt-1">×</button>
                        </div>
                    ))}
                    <button onClick={() => setParagraphs('ar', [...(data.story?.paragraphsAr || []), ''])}
                        className="text-xs text-neutral-500 hover:text-neutral-900 border border-dashed border-neutral-300 rounded-lg px-3 py-2 w-full">+ Add paragraph (AR)</button>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Vision &amp; Mission</p>
                <BiField label="Vision title" enVal={data.vision?.titleEn} arVal={data.vision?.titleAr}
                    onEn={v => set('vision.titleEn', v)} onAr={v => set('vision.titleAr', v)} />
                <BiField label="Vision text" enVal={data.vision?.textEn} arVal={data.vision?.textAr}
                    onEn={v => set('vision.textEn', v)} onAr={v => set('vision.textAr', v)} multiline />
                <BiField label="Mission title" enVal={data.mission?.titleEn} arVal={data.mission?.titleAr}
                    onEn={v => set('mission.titleEn', v)} onAr={v => set('mission.titleAr', v)} />
                <BiField label="Mission text" enVal={data.mission?.textEn} arVal={data.mission?.textAr}
                    onEn={v => set('mission.textEn', v)} onAr={v => set('mission.textAr', v)} multiline />
            </section>

            {/* CTA */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">CTA</p>
                <BiField label="Title" enVal={data.cta?.titleEn} arVal={data.cta?.titleAr} onEn={v => set('cta.titleEn', v)} onAr={v => set('cta.titleAr', v)} />
                <BiField label="Sub" enVal={data.cta?.subEn} arVal={data.cta?.subAr} onEn={v => set('cta.subEn', v)} onAr={v => set('cta.subAr', v)} multiline />
                <div className="grid grid-cols-2 gap-3">
                    {[['btn1En', 'Button 1 (EN)'], ['btn1Ar', 'Button 1 (AR)'], ['btn1Href', 'Button 1 URL'], ['btn2En', 'Button 2 (EN)'], ['btn2Ar', 'Button 2 (AR)'], ['btn2Href', 'Button 2 URL']].map(([k, l]) => (
                        <div key={k}><label className="block text-xs font-medium text-neutral-600 mb-1">{l}</label>
                            <input value={data.cta?.[k] || ''} onChange={e => set(`cta.${k}`, e.target.value)} dir={k.endsWith('Ar') ? 'rtl' : 'ltr'}
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20" /></div>
                    ))}
                </div>
            </section>
        </div>
    );
}
