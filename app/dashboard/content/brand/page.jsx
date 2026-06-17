'use client';

import { useState, useEffect, useRef } from 'react';

export default function BrandEditor() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        fetch('/api/content/brand')
            .then(async r => { if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `Load failed (${r.status})`); return r.json(); })
            .then(setData)
            .catch(e => setError(e.message));
    }, []);

    async function save() {
        if (!data) { setError('Content not loaded yet — nothing to save.'); return; }
        setSaving(true); setError(null);
        try {
            const res = await fetch('/api/content/brand', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Save failed (${res.status})`);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function uploadLogo(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/content/media', { method: 'POST', body: fd });
        const { url } = await res.json();
        setData(d => ({ ...d, logo: { ...d.logo, src: url } }));
        setUploading(false);
    }

    function set(path, value) {
        setData(d => {
            const parts = path.split('.');
            const next = { ...d };
            let cur = next;
            for (let i = 0; i < parts.length - 1; i++) {
                cur[parts[i]] = { ...cur[parts[i]] };
                cur = cur[parts[i]];
            }
            cur[parts[parts.length - 1]] = value;
            return next;
        });
    }

    if (!data) return <div className="p-8 text-neutral-500">Loading…</div>;

    return (
        <div className="p-6 sm:p-8 max-w-2xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-neutral-900">Brand & Logo</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">Site identity, logo, and brand colours</p>
                </div>
                <button onClick={save} disabled={saving}
                    className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-neutral-800 transition-colors">
                    {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Logo preview */}
            <div className="rounded-2xl border border-neutral-200 p-6 mb-6 bg-neutral-50">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Logo</p>
                <div className="flex items-center gap-6">
                    {data.logo?.src && (
                        <div className="w-24 h-24 rounded-xl border border-neutral-200 bg-white flex items-center justify-center overflow-hidden p-3">
                            <img src={data.logo.src} alt="logo" className="max-w-full max-h-full object-contain" />
                        </div>
                    )}
                    <div>
                        <input type="file" accept="image/*" ref={fileRef} onChange={uploadLogo} className="hidden" />
                        <button onClick={() => fileRef.current?.click()} disabled={uploading}
                            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                            {uploading ? 'Uploading…' : 'Upload logo'}
                        </button>
                        <p className="text-xs text-neutral-400 mt-2">PNG, SVG, or WebP recommended</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                        { label: 'Alt text (EN)', path: 'logo.altEn' },
                        { label: 'Alt text (AR)', path: 'logo.altAr' },
                    ].map(f => (
                        <div key={f.path}>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">{f.label}</label>
                            <input value={f.path.split('.').reduce((o, k) => o?.[k], data) || ''}
                                onChange={e => set(f.path, e.target.value)}
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Site info */}
            <div className="rounded-2xl border border-neutral-200 p-6 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Site info</p>
                <div className="space-y-3">
                    {[
                        { label: 'Site name (EN)', path: 'siteNameEn' },
                        { label: 'Site name (AR)', path: 'siteNameAr' },
                        { label: 'Tagline (EN)', path: 'taglineEn' },
                        { label: 'Tagline (AR)', path: 'taglineAr' },
                        { label: 'Founded (year)', path: 'since' },
                    ].map(f => (
                        <div key={f.path}>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">{f.label}</label>
                            <input value={f.path.split('.').reduce((o, k) => o?.[k], data) || ''}
                                onChange={e => set(f.path, e.target.value)}
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Colours */}
            <div className="rounded-2xl border border-neutral-200 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Brand colours</p>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Primary (red)', path: 'primaryColor' },
                        { label: 'Accent (yellow)', path: 'accentColor' },
                    ].map(f => {
                        const val = data[f.path] || '#000000';
                        return (
                            <div key={f.path} className="flex items-center gap-3">
                                <input type="color" value={val} onChange={e => set(f.path, e.target.value)}
                                    className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer p-1 bg-white" />
                                <div>
                                    <p className="text-xs font-medium text-neutral-600">{f.label}</p>
                                    <p className="text-xs text-neutral-400 font-mono">{val}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
