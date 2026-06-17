'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

function SectionCard({ title, children }) {
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-sm font-semibold text-ink mb-5">{title}</p>
            {children}
        </div>
    );
}

export default function FooterContentPage() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const r = await fetch('/api/content/footer');
        setData(await r.json());
    }

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    function set(path, value) {
        setData(prev => {
            const next = structuredClone(prev);
            const keys = path.split('.');
            let obj = next;
            for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
            obj[keys[keys.length - 1]] = value;
            return next;
        });
    }

    function setSocial(i, k, v) {
        setData(prev => {
            const next = structuredClone(prev);
            next.social[i][k] = v;
            return next;
        });
    }

    function addSocial() {
        setData(prev => ({ ...prev, social: [...prev.social, { id: '', label: '', href: '#' }] }));
    }

    function removeSocial(i) {
        setData(prev => ({ ...prev, social: prev.social.filter((_, j) => j !== i) }));
    }

    function setColumnLink(col, i, k, v) {
        setData(prev => {
            const next = structuredClone(prev);
            next.columns[col].links[i][k] = v;
            return next;
        });
    }

    function addColumnLink(col) {
        setData(prev => {
            const next = structuredClone(prev);
            next.columns[col].links.push({ labelEn: '', labelAr: '', href: '' });
            return next;
        });
    }

    function removeColumnLink(col, i) {
        setData(prev => {
            const next = structuredClone(prev);
            next.columns[col].links = next.columns[col].links.filter((_, j) => j !== i);
            return next;
        });
    }

    async function save() {
        setSaving(true);
        await fetch('/api/content/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
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
                        <span className="text-ink">Footer</span>
                    </div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">Footer</h1>
                    <p className="text-sm text-neutral-500 mt-1">All footer content — description, contact, links and social.</p>
                </div>
                <button onClick={save} disabled={saving} className="shrink-0 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : 'Save changes'}
                </button>
            </div>

            <div className="space-y-5">
                <SectionCard title="Brand Description">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Description (English)">
                            <textarea className={textarea} rows={3} value={data.desc.en} onChange={e => set('desc.en', e.target.value)} />
                        </Field>
                        <Field label="Description (Arabic)">
                            <textarea className={textarea} dir="rtl" rows={3} value={data.desc.ar} onChange={e => set('desc.ar', e.target.value)} />
                        </Field>
                        <Field label="Tagline (English)">
                            <input className={input} value={data.tagline.en} onChange={e => set('tagline.en', e.target.value)} />
                        </Field>
                        <Field label="Tagline (Arabic)">
                            <input className={input} dir="rtl" value={data.tagline.ar} onChange={e => set('tagline.ar', e.target.value)} />
                        </Field>
                        <Field label="Since (English)">
                            <input className={input} value={data.since.en} onChange={e => set('since.en', e.target.value)} />
                        </Field>
                        <Field label="Since (Arabic)">
                            <input className={input} dir="rtl" value={data.since.ar} onChange={e => set('since.ar', e.target.value)} />
                        </Field>
                        <Field label="Copyright (English)">
                            <input className={input} value={data.copyright.en} onChange={e => set('copyright.en', e.target.value)} />
                        </Field>
                        <Field label="Copyright (Arabic)">
                            <input className={input} dir="rtl" value={data.copyright.ar} onChange={e => set('copyright.ar', e.target.value)} />
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard title="Contact Info">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Location (English)">
                            <input className={input} value={data.contact.location.en} onChange={e => set('contact.location.en', e.target.value)} />
                        </Field>
                        <Field label="Location (Arabic)">
                            <input className={input} dir="rtl" value={data.contact.location.ar} onChange={e => set('contact.location.ar', e.target.value)} />
                        </Field>
                        <Field label="Phone">
                            <input className={input} value={data.contact.phone} onChange={e => set('contact.phone', e.target.value)} />
                        </Field>
                        <Field label="Email">
                            <input className={input} type="email" value={data.contact.email} onChange={e => set('contact.email', e.target.value)} />
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard title="Social Links">
                    <div className="space-y-3">
                        {data.social.map((s, i) => (
                            <div key={i} className="grid grid-cols-3 gap-3 border border-neutral-100 rounded-lg p-3 bg-neutral-50">
                                <Field label="Platform">
                                    <input className={input} value={s.label} onChange={e => setSocial(i, 'label', e.target.value)} placeholder="Instagram" />
                                </Field>
                                <Field label="URL">
                                    <input className={input} value={s.href} onChange={e => setSocial(i, 'href', e.target.value)} placeholder="https://instagram.com/..." />
                                </Field>
                                <div className="flex items-end">
                                    <button onClick={() => removeSocial(i)} className="px-3 py-2 text-xs font-medium rounded-md border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors">Remove</button>
                                </div>
                            </div>
                        ))}
                        <button onClick={addSocial} className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">+ Add social link</button>
                    </div>
                </SectionCard>

                {Object.entries(data.columns).map(([colKey, col]) => (
                    <SectionCard key={colKey} title={`${col.titleEn} Column`}>
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <Field label="Column Title (English)">
                                <input className={input} value={col.titleEn} onChange={e => set(`columns.${colKey}.titleEn`, e.target.value)} />
                            </Field>
                            <Field label="Column Title (Arabic)">
                                <input className={input} dir="rtl" value={col.titleAr} onChange={e => set(`columns.${colKey}.titleAr`, e.target.value)} />
                            </Field>
                        </div>
                        <p className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500 mb-3">Links</p>
                        <div className="space-y-3">
                            {col.links.map((lk, i) => (
                                <div key={i} className="grid grid-cols-3 gap-3 border border-neutral-100 rounded-lg p-3 bg-neutral-50">
                                    <Field label="Label (EN)">
                                        <input className={input} value={lk.labelEn} onChange={e => setColumnLink(colKey, i, 'labelEn', e.target.value)} />
                                    </Field>
                                    <Field label="Label (AR)">
                                        <input className={input} dir="rtl" value={lk.labelAr} onChange={e => setColumnLink(colKey, i, 'labelAr', e.target.value)} />
                                    </Field>
                                    <Field label="href">
                                        <div className="flex gap-2">
                                            <input className={input} value={lk.href} onChange={e => setColumnLink(colKey, i, 'href', e.target.value)} placeholder="/products" />
                                            <button onClick={() => removeColumnLink(colKey, i)} className="shrink-0 w-9 h-9 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center text-lg transition-colors">×</button>
                                        </div>
                                    </Field>
                                </div>
                            ))}
                            <button onClick={() => addColumnLink(colKey)} className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">+ Add link</button>
                        </div>
                    </SectionCard>
                ))}
            </div>
        </>
    );
}
