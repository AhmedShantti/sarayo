'use client';

import { useEffect, useState } from 'react';

const input = 'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30';

export default function ImagePicker({ value, onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState(null);

    useEffect(() => {
        if (open && images === null) {
            fetch('/api/content/media').then(r => r.json()).then(d => setImages(d.images || []));
        }
    }, [open, images]);

    function choose(url) {
        onChange(url);
        setOpen(false);
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input className={input} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || '/uploads/...'} />
                <button type="button" onClick={() => setOpen(true)}
                    className="shrink-0 px-3 py-2 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-600 hover:text-ink hover:bg-neutral-50 transition-colors">
                    Choose
                </button>
            </div>
            {value && (
                <img src={value} alt="" className="h-16 w-24 object-cover rounded-lg border border-neutral-200 bg-neutral-50" />
            )}

            {open && (
                <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-6" onClick={() => setOpen(false)}>
                    <div className="bg-white rounded-2xl p-5 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-semibold text-ink">Choose an image</p>
                            <button type="button" onClick={() => setOpen(false)} className="text-neutral-400 hover:text-ink text-lg leading-none">×</button>
                        </div>
                        {images === null && <div className="text-center text-sm text-neutral-400 py-10">Loading…</div>}
                        {images && images.length === 0 && (
                            <p className="text-sm text-neutral-500 text-center py-10">No uploaded images yet — upload some from the Media Library first.</p>
                        )}
                        {images && images.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {images.map(img => (
                                    <button key={img.url} type="button" onClick={() => choose(img.url)}
                                        className="group relative aspect-square rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 hover:border-ink/30 hover:shadow-sm transition-all">
                                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center">
                                            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
