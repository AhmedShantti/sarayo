'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function MediaLibraryPage() {
    const [images, setImages] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState('');
    const [toast, setToast] = useState('');
    const fileRef = useRef(null);

    useEffect(() => { load(); }, []);

    async function load() {
        const r = await fetch('/api/content/media');
        const d = await r.json();
        setImages(d.images || []);
    }

    function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

    async function handleUpload(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        for (const file of files) {
            const fd = new FormData();
            fd.append('file', file);
            await fetch('/api/content/media', { method: 'POST', body: fd });
        }
        await load();
        setUploading(false);
        showToast(`${files.length} file${files.length > 1 ? 's' : ''} uploaded.`);
        e.target.value = '';
    }

    function copyUrl(url) {
        navigator.clipboard.writeText(url);
        setCopied(url);
        setTimeout(() => setCopied(''), 2000);
    }

    return (
        <>
            {toast && <div className="fixed top-4 right-4 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">{toast}</div>}

            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                        <Link href="/dashboard/content" className="hover:text-ink transition-colors">Content</Link>
                        <span>/</span>
                        <span className="text-ink">Media</span>
                    </div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">Media Library</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {images === null ? 'Loading…' : `${images.length} uploaded files · Click any image to copy its URL`}
                    </p>
                </div>
                <div>
                    <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                        className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                        {uploading ? 'Uploading…' : '↑ Upload images'}
                    </button>
                </div>
            </div>

            <div
                className="border-2 border-dashed border-neutral-200 rounded-xl p-6 mb-6 text-center text-sm text-neutral-400 hover:border-neutral-300 transition-colors cursor-pointer"
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={async e => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                    if (!files.length) return;
                    setUploading(true);
                    for (const file of files) {
                        const fd = new FormData();
                        fd.append('file', file);
                        await fetch('/api/content/media', { method: 'POST', body: fd });
                    }
                    await load();
                    setUploading(false);
                    showToast('Files uploaded.');
                }}
            >
                Drag & drop images here, or click to select
            </div>

            {images === null && (
                <div className="text-center text-sm text-neutral-400 py-10">Loading…</div>
            )}

            {images && images.length === 0 && (
                <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center">
                    <p className="text-sm text-neutral-500">No uploaded images yet.</p>
                    <p className="text-xs text-neutral-400 mt-1">Upload images above to use them in products, hero, and other sections.</p>
                </div>
            )}

            {images && images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {images.map(img => (
                        <button key={img.url} onClick={() => copyUrl(img.url)}
                            className="group relative aspect-square rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 hover:border-ink/30 hover:shadow-sm transition-all">
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center">
                                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center leading-tight">
                                    {copied === img.url ? '✓ Copied!' : 'Copy URL'}
                                </span>
                            </div>
                            {copied === img.url && (
                                <div className="absolute inset-0 ring-2 ring-emerald-400 rounded-xl pointer-events-none" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            <p className="mt-6 text-xs text-neutral-400">
                Uploaded images are saved to <code className="font-mono bg-neutral-100 px-1 rounded">/public/uploads/</code> and are available at <code className="font-mono bg-neutral-100 px-1 rounded">/uploads/filename.ext</code>
            </p>
        </>
    );
}
