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

export default function ExportEditor() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => { fetch('/api/content/pages/export').then(r => r.json()).then(setData); }, []);

    async function save() {
        setSaving(true);
        await fetch('/api/content/pages/export', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    }

    function set(path, value) {
        setData(d => {
            const parts = path.split('.'); const next = { ...d }; let cur = next;
            for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] = { ...cur[parts[i]] }; cur = cur[parts[i]]; }
            cur[parts[parts.length - 1]] = value; return next;
        });
    }

    function setMarket(i, k, v) { setData(d => { const m = [...d.markets]; m[i] = { ...m[i], [k]: v }; return { ...d, markets: m }; }); }
    function addMarket() { setData(d => ({ ...d, markets: [...(d.markets || []), { id: `mkt_${Date.now()}`, flag: '🌍', nameEn: '', nameAr: '', active: true }] })); }
    function removeMarket(i) { setData(d => ({ ...d, markets: d.markets.filter((_, j) => j !== i) })); }

    function setCert(i, k, v) { setData(d => { const c = [...d.certifications]; c[i] = { ...c[i], [k]: v }; return { ...d, certifications: c }; }); }
    function addCert() { setData(d => ({ ...d, certifications: [...(d.certifications || []), { id: `cert_${Date.now()}`, nameEn: '', nameAr: '', descEn: '', descAr: '' }] })); }
    function removeCert(i) { setData(d => ({ ...d, certifications: d.certifications.filter((_, j) => j !== i) })); }

    if (!data) return <div className="p-8 text-neutral-500">Loading…</div>;

    return (
        <div className="p-6 sm:p-8 max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
                <div><h1 className="text-xl font-bold text-neutral-900">Export</h1><p className="text-sm text-neutral-500 mt-0.5">Export page — markets, certifications, contact</p></div>
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

            {/* Markets */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Markets ({(data.markets || []).length})</p>
                    <button onClick={addMarket} className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50">+ Add market</button>
                </div>
                {(data.markets || []).map((m, i) => (
                    <div key={m.id || i} className="rounded-xl border border-neutral-200 p-4 space-y-3">
                        <div className="flex items-center gap-3 justify-between">
                            <div className="flex items-center gap-3">
                                <input value={m.flag || ''} onChange={e => setMarket(i, 'flag', e.target.value)} placeholder="🌍"
                                    className="w-14 border border-neutral-200 rounded-lg px-2 py-1.5 text-xl text-center focus:outline-none" />
                                <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                                    <input type="checkbox" checked={m.active !== false} onChange={e => setMarket(i, 'active', e.target.checked)} className="rounded" />
                                    Active
                                </label>
                            </div>
                            <button onClick={() => removeMarket(i)} className="text-neutral-400 hover:text-red-500 text-lg">×</button>
                        </div>
                        <BiField label="Name" enVal={m.nameEn} arVal={m.nameAr} onEn={v => setMarket(i, 'nameEn', v)} onAr={v => setMarket(i, 'nameAr', v)} />
                    </div>
                ))}
            </section>

            {/* Certifications */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Certifications</p>
                    <button onClick={addCert} className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50">+ Add</button>
                </div>
                {(data.certifications || []).map((c, i) => (
                    <div key={c.id || i} className="rounded-xl border border-neutral-200 p-4 space-y-3">
                        <div className="flex justify-end"><button onClick={() => removeCert(i)} className="text-neutral-400 hover:text-red-500 text-lg">×</button></div>
                        <BiField label="Name" enVal={c.nameEn} arVal={c.nameAr} onEn={v => setCert(i, 'nameEn', v)} onAr={v => setCert(i, 'nameAr', v)} />
                        <BiField label="Desc" enVal={c.descEn} arVal={c.descAr} onEn={v => setCert(i, 'descEn', v)} onAr={v => setCert(i, 'descAr', v)} multiline />
                    </div>
                ))}
            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Export contact</p>
                {[['contact.emailEn', 'Email'], ['contact.phoneEn', 'Phone']].map(([k, l]) => (
                    <div key={k}><label className="block text-xs font-medium text-neutral-600 mb-1">{l}</label>
                        <input value={k.split('.').reduce((o, p) => o?.[p], data) || ''} onChange={e => set(k, e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                ))}
                <BiField label="CTA title" enVal={data.contact?.titleEn} arVal={data.contact?.titleAr} onEn={v => set('contact.titleEn', v)} onAr={v => set('contact.titleAr', v)} />
            </section>
        </div>
    );
}
