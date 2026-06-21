'use client';

import {useEffect, useState} from 'react';
import {useLanguage} from '@/lib/LanguageContext';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@/lib/adminApi';

const EMPTY_FORM = {
    name: '', nameAr: '', slug: '', description: '', imageUrl: '', isActive: true,
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [loadError, setLoadError] = useState('');
    const {t, locale} = useLanguage();

    async function load() {
        try {
            const cats = await getCategories();
            setCategories(Array.isArray(cats) ? cats : []);
            setLoadError('');
        } catch (err) {
            setCategories([]);
            setLoadError(err.message || 'Failed to load categories');
        }
    }

    useEffect(() => {
        load();
    }, []);

    function openCreate() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError('');
        setModalOpen(true);
    }

    function openEdit(c) {
        setEditingId(c.id);
        setForm({
            name: c.name || '',
            nameAr: c.nameAr || '',
            slug: c.slug || '',
            description: c.description || '',
            imageUrl: c.imageUrl || '',
            isActive: c.isActive !== false,
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
        if (!form.name.trim() || form.name.trim().length < 2) {
            setError('Name is required (at least 2 characters)');
            return;
        }

        const payload = {
            name: form.name.trim(),
            nameAr: form.nameAr.trim() || undefined,
            slug: form.slug.trim() || undefined,
            description: form.description.trim() || undefined,
            imageUrl: form.imageUrl.trim() || undefined,
            isActive: form.isActive,
        };

        setSaving(true);
        try {
            if (editingId) await updateCategory(editingId, payload);
            else await createCategory(payload);
            setModalOpen(false);
            await load();
        } catch (err) {
            setError(err.message || 'Failed to save category');
        } finally {
            setSaving(false);
        }
    }

    async function remove(c) {
        if (c.productCount > 0) {
            alert(`"${c.name}" still has ${c.productCount} product(s). Reassign or remove them first.`);
            return;
        }
        if (!confirm(`Delete category "${c.name}"?`)) return;
        try {
            await deleteCategory(c.id);
            await load();
        } catch (err) {
            alert(err.message || 'Failed to delete category');
        }
    }

    const inputCls = 'px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink focus:outline-none focus:border-ink transition-colors';

    return (
        <>
            <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">{t('dash.nav.categories')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {categories === null
                            ? t('dash.ov.loading')
                            : `${categories.length} ${categories.length === 1 ? 'category' : 'categories'} · used across the store & product editors`}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 5V19M5 12H19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    Add category
                </button>
            </div>

            {loadError && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {loadError}. Make sure you are signed in as an admin and the backend is reachable.
                </div>
            )}

            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                                <th className="py-2.5 px-5 font-semibold">Name</th>
                                <th className="py-2.5 px-2 font-semibold">Arabic</th>
                                <th className="py-2.5 px-2 font-semibold">Slug</th>
                                <th className="py-2.5 px-2 font-semibold">Products</th>
                                <th className="py-2.5 px-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories === null && (
                                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-neutral-500">{t('dash.ov.loading')}</td></tr>
                            )}
                            {categories && categories.length === 0 && (
                                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-neutral-500">No categories yet. Add your first one.</td></tr>
                            )}
                            {categories && categories.map((c) => (
                                <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                                    <td className="py-3 px-5 text-ink font-medium">{c.name}</td>
                                    <td className="py-3 px-2 text-neutral-600" dir="rtl">{c.nameAr || '—'}</td>
                                    <td className="py-3 px-2 font-mono text-xs text-neutral-500">{c.slug}</td>
                                    <td className="py-3 px-2 text-neutral-600">{c.productCount ?? 0}</td>
                                    <td className="py-3 px-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(c)} className="px-2.5 py-1 rounded-md border border-neutral-300 text-xs font-medium text-ink hover:border-ink transition-colors">Edit</button>
                                            <button onClick={() => remove(c)} className="px-2.5 py-1 rounded-md border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors">Delete</button>
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
                        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto flex flex-col gap-4"
                    >
                        <h2 className="text-lg font-semibold text-ink">{editingId ? 'Edit category' : 'Add category'}</h2>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Name (EN)</span>
                                <input className={inputCls} value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Classic" required />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Name (AR)</span>
                                <input className={inputCls} value={form.nameAr} onChange={(e) => setField('nameAr', e.target.value)} placeholder="كلاسيك" dir="rtl" />
                            </label>
                        </div>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Slug <span className="normal-case text-neutral-400">(optional — auto from name)</span></span>
                            <input className={inputCls} value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="classic" />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Description</span>
                            <textarea className={inputCls} rows={2} value={form.description} onChange={(e) => setField('description', e.target.value)} />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Image URL</span>
                            <input className={inputCls} value={form.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} placeholder="/uploads/category.png" />
                        </label>

                        <label className="flex items-center gap-2 text-sm text-ink">
                            <input type="checkbox" checked={form.isActive} onChange={(e) => setField('isActive', e.target.checked)} />
                            Active <span className="text-neutral-400 text-xs">(inactive categories are hidden from the store)</span>
                        </label>

                        {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

                        <div className="flex gap-3 pt-1">
                            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60">
                                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create category'}
                            </button>
                            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-lg border border-neutral-300 text-ink text-sm font-medium hover:border-ink transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
