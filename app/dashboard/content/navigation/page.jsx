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

function LinkListEditor({ items, onChange, showImg }) {
    function set(i, k, v) {
        onChange(items.map((it, j) => j === i ? { ...it, [k]: v } : it));
    }
    function remove(i) { onChange(items.filter((_, j) => j !== i)); }
    function add() {
        onChange([...items, showImg
            ? { name: '', nameAr: '', href: '', img: '', sub: '', subAr: '' }
            : { label: '', labelAr: '', href: '' }]);
    }

    return (
        <div className="space-y-3">
            {items.map((it, i) => (
                <div key={i} className="border border-neutral-100 rounded-lg p-4 space-y-3 bg-neutral-50">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label={showImg ? 'Name (EN)' : 'Label (EN)'}>
                            <input className={input} value={showImg ? it.name : it.label} onChange={e => set(i, showImg ? 'name' : 'label', e.target.value)} />
                        </Field>
                        <Field label={showImg ? 'Name (AR)' : 'Label (AR)'}>
                            <input className={input} dir="rtl" value={showImg ? it.nameAr : it.labelAr} onChange={e => set(i, showImg ? 'nameAr' : 'labelAr', e.target.value)} />
                        </Field>
                        <Field label="URL / href">
                            <input className={input} value={it.href} onChange={e => set(i, 'href', e.target.value)} placeholder="/products" />
                        </Field>
                        {showImg && (
                            <>
                                <Field label="Image path">
                                    <input className={input} value={it.img} onChange={e => set(i, 'img', e.target.value)} placeholder="/products-chipsy/cornice.png" />
                                </Field>
                                <Field label="Subtitle (EN)">
                                    <input className={input} value={it.sub} onChange={e => set(i, 'sub', e.target.value)} />
                                </Field>
                                <Field label="Subtitle (AR)">
                                    <input className={input} dir="rtl" value={it.subAr} onChange={e => set(i, 'subAr', e.target.value)} />
                                </Field>
                            </>
                        )}
                    </div>
                    <button onClick={() => remove(i)} className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors">Remove</button>
                </div>
            ))}
            <button onClick={add} className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">+ Add link</button>
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
                    <p className="text-sm text-neutral-500 mt-1">Top nav links and product sub-menus.</p>
                </div>
                <button onClick={save} disabled={saving} className="shrink-0 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : 'Save changes'}
                </button>
            </div>

            <div className="space-y-5">
                <SectionCard title="Main Nav Links" desc="The top-level links in the header navigation.">
                    <LinkListEditor items={data.navLinks} onChange={v => setData(d => ({ ...d, navLinks: v }))} />
                </SectionCard>

                <SectionCard title="Chipsy Products Sub-menu" desc="Products shown in the Chipsy dropdown menu.">
                    <LinkListEditor items={data.chipsyProducts} onChange={v => setData(d => ({ ...d, chipsyProducts: v }))} showImg />
                </SectionCard>

                <SectionCard title="Wafer Products Sub-menu" desc="Products shown in the Wafer dropdown menu.">
                    <LinkListEditor items={data.waferProducts} onChange={v => setData(d => ({ ...d, waferProducts: v }))} showImg />
                </SectionCard>
            </div>
        </>
    );
}
