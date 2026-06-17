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

export default function StatsContentPage() {
    const [stats, setStats] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const r = await fetch('/api/content/stats');
        setStats(await r.json());
    }

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    function set(i, k, v) {
        setStats(prev => prev.map((s, j) => j === i ? { ...s, [k]: v } : s));
    }

    async function save() {
        setSaving(true);
        await fetch('/api/content/stats', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stats) });
        setSaving(false);
        showToast('Saved! Reload the site to see changes.');
    }

    return (
        <>
            {toast && <div className="fixed top-4 right-4 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">{toast}</div>}

            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                        <Link href="/dashboard/content" className="hover:text-ink transition-colors">Content</Link>
                        <span>/</span>
                        <span className="text-ink">Stats</span>
                    </div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">Stats Section</h1>
                    <p className="text-sm text-neutral-500 mt-1">The four animated stat counters on the homepage.</p>
                </div>
                <button onClick={save} disabled={saving} className="shrink-0 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : 'Save changes'}
                </button>
            </div>

            {stats === null ? (
                <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center text-sm text-neutral-400">Loading…</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.map((s, i) => (
                        <div key={s.id} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-ink tabular-nums">{s.value}{s.suffix}</span>
                                <span className="text-sm text-neutral-500">{s.labelEn}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Value">
                                    <input className={input} type="number" value={s.value} onChange={e => set(i, 'value', Number(e.target.value))} />
                                </Field>
                                <Field label="Suffix (e.g. %, +)">
                                    <input className={input} value={s.suffix} onChange={e => set(i, 'suffix', e.target.value)} placeholder="+" />
                                </Field>
                                <Field label="Label (English)">
                                    <input className={input} value={s.labelEn} onChange={e => set(i, 'labelEn', e.target.value)} />
                                </Field>
                                <Field label="Label (Arabic)">
                                    <input className={input} dir="rtl" value={s.labelAr} onChange={e => set(i, 'labelAr', e.target.value)} />
                                </Field>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
