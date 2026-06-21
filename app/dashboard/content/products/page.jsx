'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/adminApi';

const TONES = ['deep', 'cream', 'yellow'];
// Fallback list used only if the managed categories can't be loaded.
const CATEGORIES = ['Classic', 'Cheesy', 'Spicy', 'Tangy'];
const ICONS = ['spark', 'flame', 'leaf', 'globe'];

const EMPTY = {
    id: '', src: '', name: '', nameAr: '', flavor: '', flavorAr: '',
    tag: '', tagAr: '', tone: 'deep', category: 'Classic',
    price: '', priceValue: 0, description: '', descriptionAr: '',
};

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">{label}</label>
            {children}
        </div>
    );
}

const input = 'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30';
const textarea = `${input} resize-none`;

function ProductForm({ product, onSave, onCancel, isNew, categoryOptions }) {
    const [form, setForm] = useState(product);
    const [saving, setSaving] = useState(false);
    const [imgPreview, setImgPreview] = useState(product.src);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    // Always include the product's current category so a legacy value isn't lost.
    const catOptions = form.category && !categoryOptions.includes(form.category)
        ? [form.category, ...categoryOptions]
        : categoryOptions;

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/content/media', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) {
            set('src', data.url);
            setImgPreview(data.url);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        await onSave({ ...form, priceValue: Number(form.priceValue) });
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <Field label="Product Image">
                        <div className="flex items-center gap-4">
                            {imgPreview && (
                                <div className="w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden flex items-center justify-center border border-neutral-200">
                                    <img src={imgPreview} alt="" className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div className="flex flex-col gap-1.5">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-neutral-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-neutral-100 file:text-ink hover:file:bg-neutral-200 cursor-pointer" />
                                <span className="text-[11px] text-neutral-400">or paste a URL below</span>
                                <input className={input} value={form.src} onChange={e => { set('src', e.target.value); setImgPreview(e.target.value); }} placeholder="/lays-classic.png" />
                            </div>
                        </div>
                    </Field>
                </div>

                <Field label="Name (English)">
                    <input className={input} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Classic" />
                </Field>
                <Field label="Name (Arabic)">
                    <input className={input} dir="rtl" required value={form.nameAr} onChange={e => set('nameAr', e.target.value)} placeholder="كلاسيك" />
                </Field>

                <Field label="Flavor (English)">
                    <input className={input} required value={form.flavor} onChange={e => set('flavor', e.target.value)} placeholder="Salted & Golden" />
                </Field>
                <Field label="Flavor (Arabic)">
                    <input className={input} dir="rtl" required value={form.flavorAr} onChange={e => set('flavorAr', e.target.value)} placeholder="مملّح وذهبي" />
                </Field>

                <Field label="Tag (English)">
                    <input className={input} value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Best seller" />
                </Field>
                <Field label="Tag (Arabic)">
                    <input className={input} dir="rtl" value={form.tagAr} onChange={e => set('tagAr', e.target.value)} placeholder="الأكثر مبيعًا" />
                </Field>

                <Field label="Price (EGP)">
                    <input className={input} type="number" required value={form.priceValue} onChange={e => { set('priceValue', e.target.value); set('price', `${e.target.value} EGP`); }} placeholder="25" />
                </Field>

                <Field label="Category">
                    <select className={input} value={form.category} onChange={e => set('category', e.target.value)}>
                        {catOptions.map(c => <option key={c}>{c}</option>)}
                    </select>
                </Field>

                <Field label="Tone (background)">
                    <select className={input} value={form.tone} onChange={e => set('tone', e.target.value)}>
                        {TONES.map(t => <option key={t}>{t}</option>)}
                    </select>
                </Field>

                <Field label="Product ID (slug)">
                    <input className={input} required value={form.id} onChange={e => set('id', e.target.value)} placeholder="classic" />
                </Field>

                <div className="md:col-span-2">
                    <Field label="Description (English)">
                        <textarea className={textarea} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="The original golden crunch…" />
                    </Field>
                </div>
                <div className="md:col-span-2">
                    <Field label="Description (Arabic)">
                        <textarea className={textarea} dir="rtl" rows={3} value={form.descriptionAr} onChange={e => set('descriptionAr', e.target.value)} placeholder="القرمشة الذهبية…" />
                    </Field>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : (isNew ? 'Add product' : 'Save changes')}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default function ProductsContentPage() {
    const [products, setProducts] = useState(null);
    const [editing, setEditing] = useState(null);
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [categoryOptions, setCategoryOptions] = useState(CATEGORIES);

    useEffect(() => { load(); }, []);

    // Pull the managed categories so the dropdown matches the store. Falls back
    // to the static list if the backend is unreachable or returns nothing.
    useEffect(() => {
        let alive = true;
        getCategories()
            .then(cats => {
                if (!alive) return;
                const names = (Array.isArray(cats) ? cats : []).map(c => c.name).filter(Boolean);
                if (names.length) setCategoryOptions(names);
            })
            .catch(() => {});
        return () => { alive = false; };
    }, []);

    async function load() {
        const r = await fetch('/api/content/products');
        if (!r.ok) { showToast(`Load failed (${r.status})`); return; }
        setProducts(await r.json());
    }

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    }

    async function save(updated) {
        if (!products) { showToast('Content not loaded yet — nothing to save.'); return; }
        setSaving(true);
        const next = editing !== null
            ? products.map((p, i) => i === editing ? updated : p)
            : [...products, updated];
        try {
            const res = await fetch('/api/content/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Save failed (${res.status})`);
            setProducts(next);
            setEditing(null);
            setAdding(false);
            showToast('Saved! Reload the site to see changes.');
        } catch (e) {
            showToast(`Save failed: ${e.message}`);
        } finally {
            setSaving(false);
        }
    }

    async function remove(i) {
        if (!confirm('Delete this product?')) return;
        const next = products.filter((_, j) => j !== i);
        try {
            const res = await fetch('/api/content/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Delete failed (${res.status})`);
            setProducts(next);
            showToast('Product deleted.');
        } catch (e) {
            showToast(`Delete failed: ${e.message}`);
        }
    }

    return (
        <>
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
                    {toast}
                </div>
            )}

            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                        <Link href="/dashboard/content" className="hover:text-ink transition-colors">Content</Link>
                        <span>/</span>
                        <span className="text-ink">Products</span>
                    </div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">Products</h1>
                    <p className="text-sm text-neutral-500 mt-1">{products ? `${products.length} products` : 'Loading…'}</p>
                </div>
                {!adding && editing === null && (
                    <button onClick={() => setAdding(true)} className="shrink-0 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 transition-colors">
                        + Add product
                    </button>
                )}
            </div>

            {adding && (
                <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-6">
                    <p className="text-sm font-semibold text-ink mb-5">New product</p>
                    <ProductForm product={EMPTY} onSave={save} onCancel={() => setAdding(false)} isNew categoryOptions={categoryOptions} />
                </div>
            )}

            <div className="space-y-3">
                {products === null && (
                    <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center text-sm text-neutral-400">Loading…</div>
                )}
                {products && products.map((p, i) => (
                    <div key={p.id || i} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                        {editing === i ? (
                            <div className="p-6">
                                <p className="text-sm font-semibold text-ink mb-5">Editing: {p.name}</p>
                                <ProductForm product={p} onSave={save} onCancel={() => setEditing(null)} categoryOptions={categoryOptions} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 px-5 py-3.5">
                                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-100">
                                    {p.src && <img src={p.src} alt={p.name} className="w-full h-full object-contain" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-ink text-sm">{p.name} <span className="text-neutral-400 font-normal">/ {p.nameAr}</span></p>
                                    <p className="text-xs text-neutral-500 truncate">{p.flavor} · {p.category} · {p.price}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => setEditing(i)} className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">Edit</button>
                                    <button onClick={() => remove(i)} className="px-3 py-1.5 text-xs font-medium rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors">Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
