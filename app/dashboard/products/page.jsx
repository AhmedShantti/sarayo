'use client';

import {useEffect, useState} from 'react';
import {useLanguage} from '@/lib/LanguageContext';
import {
    getProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
} from '@/lib/adminApi';

function StockBadge({status, stock}) {
    const {t} = useLanguage();
    if (status === 'out')
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset bg-rose-50 text-rose-700 ring-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {t('dash.products.out')}
            </span>
        );
    if (status === 'low')
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset bg-amber-50 text-amber-800 ring-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {t('dash.products.low', {n: stock})}
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset bg-emerald-50 text-emerald-700 ring-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {t('dash.products.inStock', {n: stock})}
        </span>
    );
}

const EMPTY_FORM = {
    sku: '', name: '', nameAr: '', price: '', stock: '', categoryId: '',
    flavor: '', weight: '', imageUrl: '', description: '', isActive: true, isFeatured: false,
};

export default function ProductsPage() {
    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const {t, locale} = useLanguage();
    const currency = locale === 'ar' ? 'جنيه' : 'EGP';

    async function load() {
        const [prods, cats] = await Promise.all([
            getProducts().catch(() => []),
            getCategories().catch(() => []),
        ]);
        setProducts(prods);
        setCategories(cats);
    }

    useEffect(() => {
        load();
    }, []);

    function openCreate() {
        setEditingId(null);
        setForm({...EMPTY_FORM, categoryId: categories[0]?.id || ''});
        setError('');
        setModalOpen(true);
    }

    function openEdit(p) {
        setEditingId(p.id);
        setForm({
            sku: p.sku || '',
            name: p.name || '',
            nameAr: p.nameAr || '',
            price: String(p.price ?? ''),
            stock: String(p.stock ?? ''),
            categoryId: p.categoryId || p.category?.id || '',
            flavor: p.flavor || '',
            weight: p.weight || '',
            imageUrl: (p.images && p.images[0]) || '',
            description: p.description || '',
            isActive: p.isActive !== false,
            isFeatured: !!p.isFeatured,
        });
        setError('');
        setModalOpen(true);
    }

    function setField(k, v) {
        setForm((f) => ({...f, [k]: v}));
    }

    async function submit(e) {
        e.preventDefault();
        setError('');
        if (!form.sku.trim() || !form.name.trim()) { setError('SKU and name are required'); return; }
        if (!form.categoryId) { setError('Please choose a category'); return; }
        const price = Number(form.price);
        const stock = parseInt(form.stock, 10);
        if (!Number.isFinite(price) || price < 0) { setError('Enter a valid price'); return; }
        if (!Number.isFinite(stock) || stock < 0) { setError('Enter a valid stock quantity'); return; }

        const payload = {
            sku: form.sku.trim(),
            name: form.name.trim(),
            nameAr: form.nameAr.trim() || undefined,
            price,
            stock,
            categoryId: form.categoryId,
            flavor: form.flavor.trim() || undefined,
            weight: form.weight.trim() || undefined,
            description: form.description.trim() || undefined,
            images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
            isActive: form.isActive,
            isFeatured: form.isFeatured,
        };

        setSaving(true);
        try {
            if (editingId) await updateProduct(editingId, payload);
            else await createProduct(payload);
            setModalOpen(false);
            await load();
        } catch (err) {
            setError(err.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    }

    async function remove(p) {
        if (!confirm(`Delete "${p.name}"? It will be hidden from the store.`)) return;
        try {
            await deleteProduct(p.id);
            await load();
        } catch (err) {
            alert(err.message || 'Failed to delete');
        }
    }

    const inputCls = 'px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink focus:outline-none focus:border-ink transition-colors';

    return (
        <>
            <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">{t('dash.products.title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {products === null ? t('dash.ov.loading') : t('dash.products.count', {n: products.length})}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 5V19M5 12H19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    Add product
                </button>
            </div>

            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                                <th className="py-2.5 px-5 font-semibold">{t('dash.products.col.sku')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.products.col.name')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.products.col.price')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.products.col.stock')}</th>
                                <th className="py-2.5 px-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products === null && (
                                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-neutral-500">{t('dash.ov.loading')}</td></tr>
                            )}
                            {products && products.length === 0 && (
                                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-neutral-500">No products yet. Add your first one.</td></tr>
                            )}
                            {products && products.map((p) => (
                                <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                                    <td className="py-3 px-5 font-mono text-xs text-ink">{p.sku}</td>
                                    <td className="py-3 px-2 text-ink font-medium">{locale === 'ar' ? (p.nameAr || p.name) : p.name}</td>
                                    <td className="py-3 px-2 text-ink">{p.price} {currency}</td>
                                    <td className="py-3 px-2"><StockBadge status={p.status} stock={p.stock} /></td>
                                    <td className="py-3 px-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(p)} className="px-2.5 py-1 rounded-md border border-neutral-300 text-xs font-medium text-ink hover:border-ink transition-colors">Edit</button>
                                            <button onClick={() => remove(p)} className="px-2.5 py-1 rounded-md border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModalOpen(false)}>
                    <form
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={submit}
                        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto flex flex-col gap-4"
                    >
                        <h2 className="text-lg font-semibold text-ink">{editingId ? 'Edit product' : 'Add product'}</h2>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">SKU</span>
                                <input className={inputCls} value={form.sku} onChange={(e) => setField('sku', e.target.value)} placeholder="SAR-021" required />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</span>
                                <select className={inputCls + ' bg-white'} value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)} required>
                                    <option value="">Select…</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Name (EN)</span>
                                <input className={inputCls} value={form.name} onChange={(e) => setField('name', e.target.value)} required />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Name (AR)</span>
                                <input className={inputCls} value={form.nameAr} onChange={(e) => setField('nameAr', e.target.value)} dir="rtl" />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Price ({currency})</span>
                                <input className={inputCls} type="number" step="0.01" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} required />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Stock</span>
                                <input className={inputCls} type="number" min="0" value={form.stock} onChange={(e) => setField('stock', e.target.value)} required />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Flavor tag</span>
                                <input className={inputCls} value={form.flavor} onChange={(e) => setField('flavor', e.target.value)} placeholder="cheese / bbq / chili" />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Weight</span>
                                <input className={inputCls} value={form.weight} onChange={(e) => setField('weight', e.target.value)} placeholder="113g" />
                            </label>
                        </div>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Image URL</span>
                            <input className={inputCls} value={form.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} placeholder="/lays-classic.png" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Description</span>
                            <textarea className={inputCls} rows={2} value={form.description} onChange={(e) => setField('description', e.target.value)} />
                        </label>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm text-ink">
                                <input type="checkbox" checked={form.isActive} onChange={(e) => setField('isActive', e.target.checked)} />
                                Active
                            </label>
                            <label className="flex items-center gap-2 text-sm text-ink">
                                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setField('isFeatured', e.target.checked)} />
                                Featured
                            </label>
                        </div>

                        {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

                        <div className="flex gap-3 pt-1">
                            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60">
                                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create product'}
                            </button>
                            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-lg border border-neutral-300 text-ink text-sm font-medium hover:border-ink transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
