'use client';

import { useState, useEffect, useRef } from 'react';

const TONE_OPTIONS = ['deep', 'cream', 'yellow'];

export default function WaferEditor() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(null);
    const fileRef = useRef(null);
    const [uploadTarget, setUploadTarget] = useState(null);

    useEffect(() => {
        fetch('/api/content/wafer')
            .then(async r => { if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `Load failed (${r.status})`); return r.json(); })
            .then(setData)
            .catch(e => setError(e.message));
    }, []);

    async function save() {
        if (!data) { setError('Content not loaded yet — nothing to save.'); return; }
        setSaving(true); setError(null);
        try {
            const res = await fetch('/api/content/wafer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Save failed (${res.status})`);
            setSaved(true); setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function uploadImage(e, productIndex) {
        const file = e.target.files?.[0]; if (!file) return;
        setUploading(productIndex);
        const fd = new FormData(); fd.append('file', file);
        const res = await fetch('/api/content/media', { method: 'POST', body: fd });
        const { url } = await res.json();
        setData(d => { const p = [...d.products]; p[productIndex] = { ...p[productIndex], src: url }; return { ...d, products: p }; });
        setUploading(null);
    }

    function set(path, value) {
        setData(d => {
            const parts = path.split('.'); const next = { ...d }; let cur = next;
            for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] = { ...cur[parts[i]] }; cur = cur[parts[i]]; }
            cur[parts[parts.length - 1]] = value; return next;
        });
    }

    function setProduct(i, k, v) { setData(d => { const p = [...d.products]; p[i] = { ...p[i], [k]: v }; return { ...d, products: p }; }); }
    function addProduct() {
        setData(d => ({
            ...d, products: [...(d.products || []), {
                id: `wafer_${Date.now()}`, active: true, tone: 'cream',
                nameEn: '', nameAr: '', subEn: '', subAr: '',
                flavorEn: '', flavorAr: '', tagEn: '', tagAr: '',
                price: '', priceValue: 0, src: '/placeholder.png'
            }]
        }));
    }
    function removeProduct(i) { setData(d => ({ ...d, products: d.products.filter((_, j) => j !== i) })); }

    if (!data) return <div className="p-8 text-neutral-500">Loading…</div>;

    return (
        <div className="p-6 sm:p-8 max-w-3xl space-y-8">
            <input type="file" accept="image/*" ref={fileRef} onChange={e => uploadImage(e, uploadTarget)} className="hidden" />

            <div className="flex items-center justify-between">
                <div><h1 className="text-xl font-bold text-neutral-900">Wafer Products</h1><p className="text-sm text-neutral-500 mt-0.5">Wafer catalog page products</p></div>
                <button onClick={save} disabled={saving} className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-neutral-800 transition-colors">
                    {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Hero */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Hero</p>
                {[['hero.chipEn','hero.chipAr','Chip'],['hero.headlineEn','hero.headlineAr','Headline'],['hero.subEn','hero.subAr','Sub']].map(([en,ar,label]) => (
                    <div key={en} className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium text-neutral-600 mb-1">{label} (EN)</label>
                            <input value={en.split('.').reduce((o,k)=>o?.[k],data)||''} onChange={e=>set(en,e.target.value)}
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                        <div><label className="block text-xs font-medium text-neutral-600 mb-1">{label} (AR)</label>
                            <input value={ar.split('.').reduce((o,k)=>o?.[k],data)||''} onChange={e=>set(ar,e.target.value)} dir="rtl"
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                    </div>
                ))}
            </section>

            {/* Products */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Products ({(data.products||[]).length})</p>
                    <button onClick={addProduct} className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50">+ Add product</button>
                </div>
                {(data.products || []).map((p, i) => (
                    <div key={p.id || i} className="rounded-xl border border-neutral-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative cursor-pointer" onClick={() => { setUploadTarget(i); fileRef.current?.click(); }}>
                                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center overflow-hidden">
                                        {p.src ? <img src={p.src} alt="" className="w-full h-full object-contain p-1" /> : <span className="text-xs text-neutral-400">+</span>}
                                    </div>
                                    {uploading === i && <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center"><span className="text-xs">…</span></div>}
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900">{p.nameEn || 'Untitled'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer">
                                            <input type="checkbox" checked={p.active !== false} onChange={e => setProduct(i, 'active', e.target.checked)} className="rounded" />
                                            Active
                                        </label>
                                        <select value={p.tone || 'cream'} onChange={e => setProduct(i, 'tone', e.target.value)}
                                            className="text-xs border border-neutral-200 rounded-md px-2 py-0.5">
                                            {TONE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => removeProduct(i)} className="text-neutral-400 hover:text-red-500 text-lg shrink-0">×</button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[['nameEn','Name (EN)'],['nameAr','Name (AR)'],['subEn','Sub (EN)'],['subAr','Sub (AR)'],['flavorEn','Flavor (EN)'],['flavorAr','Flavor (AR)'],['tagEn','Tag (EN)'],['tagAr','Tag (AR)']].map(([k,l]) => (
                                <div key={k}><label className="block text-xs font-medium text-neutral-600 mb-1">{l}</label>
                                    <input value={p[k]||''} onChange={e=>setProduct(i,k,e.target.value)} dir={k.endsWith('Ar')?'rtl':'ltr'}
                                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                            ))}
                            <div><label className="block text-xs font-medium text-neutral-600 mb-1">Price display</label>
                                <input value={p.price||''} onChange={e=>setProduct(i,'price',e.target.value)} placeholder="e.g. 2.99 LYD"
                                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                            <div><label className="block text-xs font-medium text-neutral-600 mb-1">Price value (numeric)</label>
                                <input type="number" step="0.01" value={p.priceValue||0} onChange={e=>setProduct(i,'priceValue',parseFloat(e.target.value)||0)}
                                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
