'use client';

import { useState, useEffect } from 'react';

function BiField({ label, enVal, arVal, onEn, onAr, multiline }) {
    const Tag = multiline ? 'textarea' : 'input';
    const base = 'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20';
    return (
        <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-neutral-600 mb-1">{label} (EN)</label>
                <Tag value={enVal || ''} onChange={e => onEn(e.target.value)} rows={multiline ? 3 : undefined} className={base + (multiline ? ' resize-none' : '')} /></div>
            <div><label className="block text-xs font-medium text-neutral-600 mb-1">{label} (AR)</label>
                <Tag value={arVal || ''} onChange={e => onAr(e.target.value)} rows={multiline ? 3 : undefined} dir="rtl" className={base + (multiline ? ' resize-none' : '')} /></div>
        </div>
    );
}

export default function CareersEditor() {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/content/pages/careers')
            .then(async r => { if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `Load failed (${r.status})`); return r.json(); })
            .then(setData)
            .catch(e => setError(e.message));
    }, []);

    async function save() {
        if (!data) { setError('Content not loaded yet — nothing to save.'); return; }
        setSaving(true); setError(null);
        try {
            const res = await fetch('/api/content/pages/careers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Save failed (${res.status})`);
            setSaved(true); setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    function set(path, value) {
        setData(d => {
            const parts = path.split('.'); const next = { ...d }; let cur = next;
            for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] = { ...cur[parts[i]] }; cur = cur[parts[i]]; }
            cur[parts[parts.length - 1]] = value; return next;
        });
    }

    function setJob(i, k, v) { setData(d => { const j = [...d.jobs]; j[i] = { ...j[i], [k]: v }; return { ...d, jobs: j }; }); }
    function addJob() {
        setData(d => ({
            ...d, jobs: [...(d.jobs || []), {
                id: `job_${Date.now()}`, active: true,
                titleEn: '', titleAr: '', deptEn: '', deptAr: '',
                locationEn: 'Libya', locationAr: 'ليبيا',
                typeEn: 'Full-time', typeAr: 'دوام كامل',
                descEn: '', descAr: '', applyUrl: 'mailto:jobs@sarayo.com'
            }]
        }));
    }
    function removeJob(i) { setData(d => ({ ...d, jobs: d.jobs.filter((_, j) => j !== i) })); }

    if (!data) return <div className="p-8 text-neutral-500">Loading…</div>;

    return (
        <div className="p-6 sm:p-8 max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
                <div><h1 className="text-xl font-bold text-neutral-900">Careers</h1><p className="text-sm text-neutral-500 mt-0.5">Jobs page content & listings</p></div>
                <button onClick={save} disabled={saving} className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-neutral-800 transition-colors">
                    {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Hero</p>
                <BiField label="Chip" enVal={data.hero?.chipEn} arVal={data.hero?.chipAr} onEn={v => set('hero.chipEn', v)} onAr={v => set('hero.chipAr', v)} />
                <BiField label="Headline" enVal={data.hero?.headlineEn} arVal={data.hero?.headlineAr} onEn={v => set('hero.headlineEn', v)} onAr={v => set('hero.headlineAr', v)} />
                <BiField label="Sub" enVal={data.hero?.subEn} arVal={data.hero?.subAr} onEn={v => set('hero.subEn', v)} onAr={v => set('hero.subAr', v)} multiline />
            </section>

            {/* Jobs */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Job listings ({(data.jobs || []).length})</p>
                    <button onClick={addJob} className="text-xs text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-50">+ Add job</button>
                </div>
                {(data.jobs || []).map((job, i) => (
                    <div key={job.id || i} className="rounded-xl border border-neutral-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                                    <input type="checkbox" checked={job.active !== false} onChange={e => setJob(i, 'active', e.target.checked)} className="rounded" />
                                    Active
                                </label>
                            </div>
                            <button onClick={() => removeJob(i)} className="text-neutral-400 hover:text-red-500 text-lg">×</button>
                        </div>
                        <BiField label="Title" enVal={job.titleEn} arVal={job.titleAr} onEn={v => setJob(i, 'titleEn', v)} onAr={v => setJob(i, 'titleAr', v)} />
                        <BiField label="Dept" enVal={job.deptEn} arVal={job.deptAr} onEn={v => setJob(i, 'deptEn', v)} onAr={v => setJob(i, 'deptAr', v)} />
                        <BiField label="Location" enVal={job.locationEn} arVal={job.locationAr} onEn={v => setJob(i, 'locationEn', v)} onAr={v => setJob(i, 'locationAr', v)} />
                        <BiField label="Type" enVal={job.typeEn} arVal={job.typeAr} onEn={v => setJob(i, 'typeEn', v)} onAr={v => setJob(i, 'typeAr', v)} />
                        <BiField label="Description" enVal={job.descEn} arVal={job.descAr} onEn={v => setJob(i, 'descEn', v)} onAr={v => setJob(i, 'descAr', v)} multiline />
                        <div><label className="block text-xs font-medium text-neutral-600 mb-1">Apply URL</label>
                            <input value={job.applyUrl || ''} onChange={e => setJob(i, 'applyUrl', e.target.value)}
                                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                    </div>
                ))}
            </section>

            {/* No-jobs message */}
            <section className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">When no jobs available</p>
                <BiField label="Title" enVal={data.noJobs?.titleEn} arVal={data.noJobs?.titleAr} onEn={v => set('noJobs.titleEn', v)} onAr={v => set('noJobs.titleAr', v)} />
                <BiField label="Sub" enVal={data.noJobs?.subEn} arVal={data.noJobs?.subAr} onEn={v => set('noJobs.subEn', v)} onAr={v => set('noJobs.subAr', v)} multiline />
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-medium text-neutral-600 mb-1">Email (EN)</label>
                        <input value={data.noJobs?.emailEn || ''} onChange={e => set('noJobs.emailEn', e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                    <div><label className="block text-xs font-medium text-neutral-600 mb-1">Email (AR)</label>
                        <input value={data.noJobs?.emailAr || ''} onChange={e => set('noJobs.emailAr', e.target.value)} dir="rtl"
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none" /></div>
                </div>
            </section>
        </div>
    );
}
