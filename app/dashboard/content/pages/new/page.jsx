'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPagePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    async function create() {
        setCreating(true);
        setError('');
        const res = await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || 'Something went wrong');
            setCreating(false);
            return;
        }
        router.push(`/dashboard/content/pages/${data.slug}`);
    }

    return (
        <div className="max-w-lg">
            <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                <Link href="/dashboard/content" className="hover:text-ink transition-colors">Content</Link>
                <span>/</span>
                <span className="text-ink">New Page</span>
            </div>
            <h1 className="text-[26px] font-semibold tracking-tight text-ink mb-1">New Page</h1>
            <p className="text-sm text-neutral-500 mb-6">Give it a title — you'll build out the content on the next screen.</p>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                <div>
                    <label className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">Page title</label>
                    <input
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Our Suppliers"
                        onKeyDown={e => e.key === 'Enter' && title.trim() && create()}
                    />
                </div>
                {error && <p className="text-xs text-rose-500">{error}</p>}
                <button onClick={create} disabled={creating || !title.trim()}
                    className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 disabled:opacity-50 transition-colors">
                    {creating ? 'Creating…' : 'Create page'}
                </button>
            </div>
        </div>
    );
}
