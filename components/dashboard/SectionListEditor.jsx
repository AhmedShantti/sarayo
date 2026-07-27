'use client';

import { useState } from 'react';
import SectionFormRenderer from '@/components/dashboard/SectionFormRenderer';
import { SECTION_LABELS, defaultPropsFor } from '@/lib/sections/schema';

function newId() {
    return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `sec-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function SectionListEditor({ sections, onChange }) {
    const [collapsed, setCollapsed] = useState({});
    const [showPalette, setShowPalette] = useState(false);

    function setSection(i, next) {
        onChange(sections.map((s, j) => j === i ? next : s));
    }
    function remove(i) {
        onChange(sections.filter((_, j) => j !== i));
    }
    function move(i, dir) {
        const j = i + dir;
        if (j < 0 || j >= sections.length) return;
        const next = [...sections];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    }
    function addSection(type) {
        const id = newId();
        onChange([...sections, { id, type, props: defaultPropsFor(type) }]);
        setShowPalette(false);
        setCollapsed(c => ({ ...c, [id]: false }));
    }

    return (
        <div className="space-y-3">
            {sections.map((section, i) => (
                <div key={section.id} className="border border-neutral-200 rounded-xl bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                        <button type="button" onClick={() => setCollapsed(c => ({ ...c, [section.id]: !c[section.id] }))}
                            className="flex items-center gap-2 text-sm font-medium text-ink">
                            <span className="text-neutral-400 text-xs">{collapsed[section.id] ? '▸' : '▾'}</span>
                            {SECTION_LABELS[section.type] || section.type}
                        </button>
                        <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                                className="w-7 h-7 rounded-md border border-neutral-200 text-neutral-500 hover:text-ink hover:bg-white disabled:opacity-30 flex items-center justify-center text-xs transition-colors">↑</button>
                            <button type="button" onClick={() => move(i, 1)} disabled={i === sections.length - 1}
                                className="w-7 h-7 rounded-md border border-neutral-200 text-neutral-500 hover:text-ink hover:bg-white disabled:opacity-30 flex items-center justify-center text-xs transition-colors">↓</button>
                            <button type="button" onClick={() => remove(i)}
                                className="w-7 h-7 rounded-md border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center text-xs transition-colors">×</button>
                        </div>
                    </div>
                    {!collapsed[section.id] && (
                        <div className="p-4">
                            <SectionFormRenderer type={section.type} props={section.props} onChange={next => setSection(i, { ...section, props: next })} />
                        </div>
                    )}
                </div>
            ))}

            {sections.length === 0 && (
                <div className="border border-dashed border-neutral-300 rounded-xl p-8 text-center text-sm text-neutral-400">
                    No sections yet — add one below to start building this page.
                </div>
            )}

            <div className="relative">
                <button type="button" onClick={() => setShowPalette(v => !v)}
                    className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">
                    + Add section
                </button>
                {showPalette && (
                    <div className="absolute z-10 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 w-64">
                        {Object.entries(SECTION_LABELS).map(([type, label]) => (
                            <button key={type} type="button" onClick={() => addSection(type)}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
