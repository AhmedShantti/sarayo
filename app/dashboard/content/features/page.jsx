'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ICONS = ['spark', 'flame', 'leaf', 'globe'];

const input = 'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30';
const textarea = `${input} resize-none`;

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">{label}</label>
            {children}
        </div>
    );
}

export default function FeaturesContentPage() {
    const [features, setFeatures] = useState(null);
    const [editing, setEditing] = useState(null);
    const [draft, setDraft] = useState(null);
    const [toast, setToast] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const r = await fetch('/api/content/features');
        if (!r.ok) { showToast(`Load failed (${r.status})`); return; }
        setFeatures(await r.json());
    }

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    function startEdit(i) { setEditing(i); setDraft({ ...features[i] }); }

    const setD = (k, v) => setDraft(d => ({ ...d, [k]: v }));

    async function save() {
        if (!features) { showToast('Content not loaded yet — nothing to save.'); return; }
        const next = features.map((f, i) => i === editing ? draft : f);
        try {
            const res = await fetch('/api/content/features', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Save failed (${res.status})`);
            setFeatures(next);
            setEditing(null);
            showToast('Saved! Reload the site to see changes.');
        } catch (e) {
            showToast(`Save failed: ${e.message}`);
        }
    }

    const ICON_PATHS = {
        spark: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
        flame: 'M12 3c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.4-2-1-3 .2 1.5-.8 2-1.5 1.2C16.5 6.5 14 4.5 12 3Z',
        leaf: 'M4 20c0-8 6-14 16-14 0 10-6 16-16 14Zm3-3c4-5 7-7 10-8',
        globe: 'M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3Zm0 0c3 3 3 15 0 18M12 3c-3 3-3 15 0 18M3 12h18',
    };

    return (
        <>
            {toast && <div className="fixed top-4 right-4 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">{toast}</div>}

            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                    <Link href="/dashboard/content" className="hover:text-ink transition-colors">Content</Link>
                    <span>/</span>
                    <span className="text-ink">Features</span>
                </div>
                <h1 className="text-[26px] font-semibold tracking-tight text-ink">Features</h1>
                <p className="text-sm text-neutral-500 mt-1">The four feature cards on the homepage.</p>
            </div>

            <div className="space-y-4">
                {features === null && <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center text-sm text-neutral-400">Loading…</div>}

                {features && features.map((f, i) => (
                    <div key={f.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                        {editing === i ? (
                            <div className="p-6 space-y-5">
                                <p className="text-sm font-semibold text-ink">Editing: {f.title}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field label="Title (English)">
                                        <input className={input} value={draft.title} onChange={e => setD('title', e.target.value)} />
                                    </Field>
                                    <Field label="Title (Arabic)">
                                        <input className={input} dir="rtl" value={draft.titleAr} onChange={e => setD('titleAr', e.target.value)} />
                                    </Field>
                                    <Field label="Body (English)">
                                        <textarea className={textarea} rows={3} value={draft.text} onChange={e => setD('text', e.target.value)} />
                                    </Field>
                                    <Field label="Body (Arabic)">
                                        <textarea className={textarea} dir="rtl" rows={3} value={draft.textAr} onChange={e => setD('textAr', e.target.value)} />
                                    </Field>
                                    <Field label="Chip Label (English)">
                                        <input className={input} value={draft.chip} onChange={e => setD('chip', e.target.value)} />
                                    </Field>
                                    <Field label="Chip Label (Arabic)">
                                        <input className={input} dir="rtl" value={draft.chipAr} onChange={e => setD('chipAr', e.target.value)} />
                                    </Field>
                                    <Field label="Icon">
                                        <div className="flex gap-3">
                                            {ICONS.map(ic => (
                                                <button key={ic} type="button" onClick={() => setD('icon', ic)}
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-colors ${draft.icon === ic ? 'border-ink bg-ink/5' : 'border-neutral-200 hover:border-neutral-300'}`}>
                                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d={ICON_PATHS[ic]} />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </Field>
                                </div>

                                <div className="flex gap-3 pt-2 border-t border-neutral-100">
                                    <button onClick={save} className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 transition-colors">Save changes</button>
                                    <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                                        <path d={ICON_PATHS[f.icon] || ICON_PATHS.spark} />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-ink text-sm">{f.title} <span className="text-neutral-400 font-normal">/ {f.titleAr}</span></p>
                                    <p className="text-xs text-neutral-500 truncate mt-0.5">{f.text}</p>
                                </div>
                                <button onClick={() => startEdit(i)} className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">Edit</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
