'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ImagePicker from '@/components/dashboard/ImagePicker';
import SectionListEditor from '@/components/dashboard/SectionListEditor';

const input = 'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30';

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">{label}</label>
            {children}
        </div>
    );
}

export default function CustomPageEditor() {
    const router = useRouter();
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetch(`/api/content/pages/${slug}`).then(r => r.json()).then(setData);
    }, [slug]);

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    function set(path, value) {
        setData(d => {
            const parts = path.split('.');
            const next = { ...d };
            let cur = next;
            for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] = { ...cur[parts[i]] }; cur = cur[parts[i]]; }
            cur[parts[parts.length - 1]] = value;
            return next;
        });
    }

    async function save() {
        setSaving(true);
        await fetch(`/api/content/pages/${slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setSaving(false);
        showToast('Saved! View the live page to see changes.');
    }

    async function deletePage() {
        if (!confirm(`Delete "${data.meta?.titleEn || slug}"? This removes it from the site but keeps its content file.`)) return;
        setDeleting(true);
        await fetch('/api/pages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
        router.push('/dashboard/content');
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
                        <span className="text-ink">{data.meta?.titleEn || slug}</span>
                    </div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">{data.meta?.titleEn || slug}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Live at <a href={`/${slug}`} target="_blank" rel="noreferrer" className="underline hover:text-ink">/{slug}</a>
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={deletePage} disabled={deleting}
                        className="px-4 py-2 rounded-lg border border-rose-200 text-rose-500 text-sm font-medium hover:bg-rose-50 disabled:opacity-50 transition-colors">
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                    <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                    <p className="text-sm font-semibold text-ink">SEO</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Meta title (EN)">
                            <input className={input} value={data.meta?.titleEn || ''} onChange={e => set('meta.titleEn', e.target.value)} />
                        </Field>
                        <Field label="Meta title (AR)">
                            <input className={input} dir="rtl" value={data.meta?.titleAr || ''} onChange={e => set('meta.titleAr', e.target.value)} />
                        </Field>
                        <Field label="Meta description (EN)">
                            <textarea className={input} rows={2} value={data.meta?.descEn || ''} onChange={e => set('meta.descEn', e.target.value)} />
                        </Field>
                        <Field label="Meta description (AR)">
                            <textarea className={input} dir="rtl" rows={2} value={data.meta?.descAr || ''} onChange={e => set('meta.descAr', e.target.value)} />
                        </Field>
                    </div>
                    <Field label="Social share image (og:image)">
                        <ImagePicker value={data.meta?.ogImage} onChange={v => set('meta.ogImage', v)} />
                    </Field>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <p className="text-sm font-semibold text-ink mb-5">Page sections</p>
                    <SectionListEditor sections={data.sections || []} onChange={v => setData(d => ({ ...d, sections: v }))} />
                </div>
            </div>
        </>
    );
}
