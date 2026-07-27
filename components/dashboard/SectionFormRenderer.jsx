'use client';

import ImagePicker from '@/components/dashboard/ImagePicker';
import { SECTION_SCHEMAS } from '@/lib/sections/schema';

const input = 'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30';

const ICON_OPTIONS = ['spark', 'flame', 'leaf', 'globe', 'map', 'phone', 'mail', 'clock'];

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">{label}</label>
            {children}
        </div>
    );
}

function ScalarField({ field, value, onChange }) {
    if (field.type === 'boolean') {
        return (
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                <input type="checkbox" checked={value !== false} onChange={e => onChange(e.target.checked)} className="rounded" />
                {field.label}
            </label>
        );
    }
    if (field.type === 'icon') {
        return (
            <Field label={field.label}>
                <select className={input} value={value || 'spark'} onChange={e => onChange(e.target.value)}>
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
            </Field>
        );
    }
    if (field.type === 'image') {
        return (
            <Field label={field.label}>
                <ImagePicker value={value} onChange={onChange} />
            </Field>
        );
    }
    const Tag = field.multiline ? 'textarea' : 'input';
    return (
        <Field label={field.label}>
            <Tag className={input} dir={field.rtl ? 'rtl' : 'ltr'} rows={field.multiline ? 3 : undefined}
                value={value || ''} onChange={e => onChange(e.target.value)} />
        </Field>
    );
}

function ListField({ field, items, onChange }) {
    function setItem(i, key, value) {
        onChange(items.map((it, j) => j === i ? { ...it, [key]: value } : it));
    }
    function remove(i) { onChange(items.filter((_, j) => j !== i)); }
    function move(i, dir) {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    }
    function add() {
        const empty = {};
        field.itemFields.forEach(f => { empty[f.key] = f.type === 'boolean' ? true : ''; });
        onChange([...items, empty]);
    }

    return (
        <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">{field.label}</p>
            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {field.itemFields.map(f => (
                                <ScalarField key={f.key} field={f} value={item[f.key]} onChange={v => setItem(i, f.key, v)} />
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                                className="text-xs text-neutral-500 hover:text-ink disabled:opacity-30 transition-colors">↑</button>
                            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
                                className="text-xs text-neutral-500 hover:text-ink disabled:opacity-30 transition-colors">↓</button>
                            <button type="button" onClick={() => remove(i)}
                                className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors ml-auto">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <button type="button" onClick={add} className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">+ Add {field.label.toLowerCase()}</button>
        </div>
    );
}

export default function SectionFormRenderer({ type, props, onChange }) {
    const schema = SECTION_SCHEMAS[type];
    if (!schema) return <p className="text-sm text-rose-500">Unknown section type: {type}</p>;

    function set(key, value) {
        onChange({ ...props, [key]: value });
    }

    return (
        <div className="space-y-4">
            {schema.fields.map(field => {
                if (field.type === 'list') {
                    return <ListField key={field.key} field={field} items={props[field.key] || []} onChange={v => set(field.key, v)} />;
                }
                if (field.bi) {
                    return (
                        <div key={field.key} className="grid grid-cols-2 gap-3">
                            <Field label={`${field.label} (EN)`}>
                                {field.multiline
                                    ? <textarea className={input} rows={3} value={props[`${field.key}En`] || ''} onChange={e => set(`${field.key}En`, e.target.value)} />
                                    : <input className={input} value={props[`${field.key}En`] || ''} onChange={e => set(`${field.key}En`, e.target.value)} />}
                            </Field>
                            <Field label={`${field.label} (AR)`}>
                                {field.multiline
                                    ? <textarea className={input} dir="rtl" rows={3} value={props[`${field.key}Ar`] || ''} onChange={e => set(`${field.key}Ar`, e.target.value)} />
                                    : <input className={input} dir="rtl" value={props[`${field.key}Ar`] || ''} onChange={e => set(`${field.key}Ar`, e.target.value)} />}
                            </Field>
                        </div>
                    );
                }
                return <ScalarField key={field.key} field={field} value={props[field.key]} onChange={v => set(field.key, v)} />;
            })}
        </div>
    );
}
