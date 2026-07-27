'use client';

import { useState, useEffect } from 'react';
import ImagePicker from '@/components/dashboard/ImagePicker';

function BiField({ label, enVal, arVal, onEn, onAr, multiline }) {
    const Tag = multiline ? 'textarea' : 'input';
    const base = 'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20';
    return (
        <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-neutral-600 mb-1">{label} (EN)</label>
                <Tag value={enVal || ''} onChange={e => onEn(e.target.value)} rows={multiline ? 3 : undefined} className={base + (multiline ? ' resize-none' : '')} /></div>
            <div><label className="block text-xs font-medium text-neutral-600 mb-1">{label} (AR)</label>
                <Tag value={arVal || ''} onChange={e => onAr(e.target.value)} rows={multiline ? 3 : undefined} dir="rtl" className={base + (multiline ? ' resize-none' : '')} /></div>
        </div>
    );
}

const ICONS = ['phone', 'mail', 'map', 'clock', 'globe'];

export default function ContactEditor() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => { fetch('/api/content/pages/contact').then(r => r.json()).then(setData); }, []);

    async function save() {
        setSaving(true);
        await fetch('/api/content/pages/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    }

    function set(path, value) {
        setData(d => {
            const parts = path.split('.'); const next = { ...d }; let cur = next;
            for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] = { ...cur[parts[i]] }; cur = cur[parts[i]]; }
            cur[parts[parts.length - 1]] = value; return next;
        });
    }

    function setCard(i, k, v) { setData(d => { const c = [...d.cards]; c[i] = { ...c[i], [k]: v }; return { ...d, cards: c }; }); }
    function addCard() { setData(d => ({ ...d, cards: [...(d.cards || []), { id: `card_${Date.now()}`, icon: 'phone', labelEn: '', labelAr: '', valueEn: '', valueAr: '', href: '' }] })); }
    function removeCard(i) { setData(d => ({ ...d, cards: d.cards.filter((_, j) => j !== i) })); }

    if (!data) return <div className="p-8 text-neutral-500">Loading…</div>;

    return (
        <div className="p-6 sm:p-8 max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
                <div><h1 className="text-xl font-bold text-neutral-900">Contact Us</h1><p className="text-sm text-neutral-500 mt-0.5">Contact page content & form labels</p></div>
                <button onClick={save} disabled={saving} className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-neutral-800 transition-colors">
                    {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
                </button>
            </div>

            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">SEO</p>
                <BiField label="Meta title" enVal={data.meta?.titleEn} arVal={data.meta?.titleAr} onEn={v => set('meta.titleEn', v)} onAr={v => set('meta.titleAr', v)} />
                <BiField label="Meta description" enVal={data.meta?.descEn} arVal={data.meta?.descAr} onEn={v => set('meta.descEn', v)} onAr={v => set('meta.descAr', v)} multiline />
                <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Social share image (og:image)</label>
                    <ImagePicker value={data.meta?.ogImage} onChange={v => set('meta.ogImage', v)} />
                </div>
            </section>

            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Hero</p>
                <BiField label="Chip" enVal={data.hero?.chipEn} arVal={data.hero?.chipAr} onEn={v => set('hero.chipEn', v)} onAr={v => set('hero.chipAr', v)} />
                <BiField label="Headline" enVal={data.hero?.headlineEn} arVal={data.hero?.headlineAr} onEn={v => set('hero.headlineEn', v)} onAr={v => set('hero.headlineAr', v)} />
                <BiField label="Sub" enVal={data.hero?.subEn} arVal={data.hero?.subAr} onEn={v => set('hero.subEn', v)} onAr={v => set('hero.subAr', v)} multiline />
            </section>

            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Contact cards</p>
                    <button onClick={addCard} className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50">+ Add</button>
                </div>
                {(data.cards || []).map((c, i) => (
                    <div key={c.id || i} className="rounded-xl border border-neutral-200 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <select value={c.icon} onChange={e => setCard(i, 'icon', e.target.value)} className="border border-neutral-200 rounded-lg px-2 py-1.5 text-sm">
                                    {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                                <input value={c.href || ''} onChange={e => setCard(i, 'href', e.target.value)} placeholder="href (optional)"
                                    className="flex-1 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm text-neutral-900 focus:outline-none" />
                            </div>
                            <button onClick={() => removeCard(i)} className="text-neutral-400 hover:text-red-500 text-lg shrink-0">×</button>
                        </div>
                        <BiField label="Label" enVal={c.labelEn} arVal={c.labelAr} onEn={v => setCard(i, 'labelEn', v)} onAr={v => setCard(i, 'labelAr', v)} />
                        <BiField label="Value" enVal={c.valueEn} arVal={c.valueAr} onEn={v => setCard(i, 'valueEn', v)} onAr={v => setCard(i, 'valueAr', v)} />
                    </div>
                ))}
            </section>

            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Form labels</p>
                {[
                    ['form.titleEn', 'form.titleAr', 'Title'],
                    ['form.subEn', 'form.subAr', 'Sub'],
                    ['form.nameLabelEn', 'form.nameLabelAr', 'Name label'],
                    ['form.emailLabelEn', 'form.emailLabelAr', 'Email label'],
                    ['form.subjectLabelEn', 'form.subjectLabelAr', 'Subject label'],
                    ['form.messageLabelEn', 'form.messageLabelAr', 'Message label'],
                    ['form.submitEn', 'form.submitAr', 'Submit button'],
                    ['form.successEn', 'form.successAr', 'Success message'],
                ].map(([enPath, arPath, label]) => {
                    const enVal = enPath.split('.').reduce((o, k) => o?.[k], data) || '';
                    const arVal = arPath.split('.').reduce((o, k) => o?.[k], data) || '';
                    return <BiField key={enPath} label={label} enVal={enVal} arVal={arVal} onEn={v => set(enPath, v)} onAr={v => set(arPath, v)} />;
                })}
            </section>
        </div>
    );
}
