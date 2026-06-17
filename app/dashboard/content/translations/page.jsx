'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

const input = 'w-full px-2.5 py-1.5 rounded-md border border-neutral-200 text-xs text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30';

const GROUPS = [
    { key: 'lnd', label: 'Landing site (lnd.*)' },
    { key: 'nav', label: 'Navigation (nav.*)' },
    { key: 'hero', label: 'Hero section (hero.*)' },
    { key: 'cart', label: 'Cart & Checkout (cart.*, checkout.*)' },
    { key: 'dash', label: 'Dashboard (dash.*)' },
    { key: 'feat', label: 'Features & Story (feat.*, story.*)' },
    { key: 'footer', label: 'Footer (footer.*)' },
    { key: 'other', label: 'Other' },
];

function groupKey(key) {
    for (const g of GROUPS) {
        if (g.key === 'other') continue;
        if (key.startsWith(g.key + '.') || key.startsWith('checkout.') && g.key === 'cart') return g.key;
    }
    return 'other';
}

export default function TranslationsContentPage() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [activeGroup, setActiveGroup] = useState('lnd');
    const [search, setSearch] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const r = await fetch('/api/content/translations');
        if (!r.ok) { showToast(`Load failed (${r.status})`); return; }
        setData(await r.json());
    }

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    function setVal(locale, key, value) {
        setData(prev => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }));
    }

    async function save() {
        if (!data) { showToast('Content not loaded yet — nothing to save.'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/content/translations', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Save failed (${res.status})`);
            showToast('Saved! Translations update on next page load.');
        } catch (e) {
            showToast(`Save failed: ${e.message}`);
        } finally {
            setSaving(false);
        }
    }

    const keys = useMemo(() => {
        if (!data) return [];
        const allKeys = Object.keys(data.en);
        const filtered = search
            ? allKeys.filter(k => k.includes(search) || data.en[k]?.toLowerCase().includes(search.toLowerCase()) || data.ar[k]?.includes(search))
            : allKeys.filter(k => groupKey(k) === activeGroup);
        return filtered;
    }, [data, activeGroup, search]);

    if (!data) return <div className="p-10 text-center text-sm text-neutral-400">Loading…</div>;

    return (
        <>
            {toast && <div className="fixed top-4 right-4 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">{toast}</div>}

            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                        <Link href="/dashboard/content" className="hover:text-ink transition-colors">Content</Link>
                        <span>/</span>
                        <span className="text-ink">Translations</span>
                    </div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">Translations</h1>
                    <p className="text-sm text-neutral-500 mt-1">{Object.keys(data.en).length} strings — English and Arabic side by side.</p>
                </div>
                <button onClick={save} disabled={saving} className="shrink-0 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : 'Save all'}
                </button>
            </div>

            <div className="flex gap-1 mb-5 flex-wrap">
                {GROUPS.map(g => (
                    <button key={g.key} onClick={() => { setActiveGroup(g.key); setSearch(''); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeGroup === g.key && !search ? 'bg-ink text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        {g.label}
                    </button>
                ))}
            </div>

            <div className="mb-4">
                <input
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30"
                    placeholder="Search keys or values…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[220px_1fr_1fr] text-[11px] uppercase tracking-widest font-semibold text-neutral-500 bg-neutral-50 px-5 py-2.5 border-b border-neutral-100">
                    <span>Key</span>
                    <span>English</span>
                    <span>Arabic</span>
                </div>
                <div className="divide-y divide-neutral-100">
                    {keys.length === 0 && (
                        <div className="px-5 py-10 text-center text-sm text-neutral-400">No strings in this group.</div>
                    )}
                    {keys.map(k => (
                        <div key={k} className="grid grid-cols-[220px_1fr_1fr] gap-3 px-5 py-2.5 items-center hover:bg-neutral-50">
                            <span className="font-mono text-[11px] text-neutral-500 truncate">{k}</span>
                            <input
                                className={input}
                                value={data.en[k] || ''}
                                onChange={e => setVal('en', k, e.target.value)}
                            />
                            <input
                                className={input}
                                dir="rtl"
                                value={data.ar[k] || ''}
                                onChange={e => setVal('ar', k, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
