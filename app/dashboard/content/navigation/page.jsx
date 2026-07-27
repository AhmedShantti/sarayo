'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavTreeEditor from '@/components/dashboard/NavTreeEditor';

function SectionCard({ title, desc, children }) {
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="mb-5">
                <p className="text-sm font-semibold text-ink">{title}</p>
                {desc && <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>}
            </div>
            {children}
        </div>
    );
}

export default function NavigationContentPage() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const r = await fetch('/api/content/navigation');
        setData(await r.json());
    }

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    async function save() {
        setSaving(true);
        await fetch('/api/content/navigation', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setSaving(false);
        showToast('Saved! Reload the site to see changes.');
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
                        <span className="text-ink">Navigation</span>
                    </div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">Navigation</h1>
                    <p className="text-sm text-neutral-500 mt-1">Top nav links and dropdown menus. Reorder, add, or remove items — changes go live on save.</p>
                </div>
                <button onClick={save} disabled={saving} className="shrink-0 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : 'Save changes'}
                </button>
            </div>

            <div className="space-y-5">
                <SectionCard title="Menu Items" desc="Top-level nav items. Items with dropdown items become mega-menus; items without become plain links.">
                    <NavTreeEditor items={data.items} onChange={v => setData(d => ({ ...d, items: v }))} />
                </SectionCard>
            </div>
        </>
    );
}
