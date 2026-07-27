'use client';

const input = 'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30';

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">{label}</label>
            {children}
        </div>
    );
}

function newId() {
    return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emptyItem(depth) {
    return depth === 0
        ? { id: newId(), label: '', labelAr: '', href: '', children: [] }
        : { id: newId(), label: '', labelAr: '', href: '', img: '', sub: '', subAr: '' };
}

function IconButton({ onClick, disabled, title, children }) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} title={title}
            className="w-7 h-7 rounded-md border border-neutral-200 text-neutral-500 hover:text-ink hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs transition-colors">
            {children}
        </button>
    );
}

function NavItemRow({ item, index, total, depth, onChange, onRemove, onMove }) {
    function set(key, value) {
        onChange({ ...item, [key]: value });
    }

    function setChild(i, next) {
        const children = item.children.map((c, j) => j === i ? next : c);
        onChange({ ...item, children });
    }

    function removeChild(i) {
        onChange({ ...item, children: item.children.filter((_, j) => j !== i) });
    }

    function moveChild(i, dir) {
        const children = [...item.children];
        const j = i + dir;
        if (j < 0 || j >= children.length) return;
        [children[i], children[j]] = [children[j], children[i]];
        onChange({ ...item, children });
    }

    function addChild() {
        onChange({ ...item, children: [...(item.children || []), emptyItem(depth + 1)] });
    }

    const isTopLevel = depth === 0;
    const hasChildren = Array.isArray(item.children);

    return (
        <div className="border border-neutral-200 rounded-lg p-4 space-y-3 bg-white">
            <div className="flex items-start gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                    <Field label="Label (EN)">
                        <input className={input} value={item.label} onChange={e => set('label', e.target.value)} />
                    </Field>
                    <Field label="Label (AR)">
                        <input className={input} dir="rtl" value={item.labelAr} onChange={e => set('labelAr', e.target.value)} />
                    </Field>
                    <Field label="URL / href">
                        <input className={input} value={item.href} onChange={e => set('href', e.target.value)} placeholder="/products" />
                    </Field>
                    {!isTopLevel && (
                        <Field label="Image path">
                            <input className={input} value={item.img || ''} onChange={e => set('img', e.target.value)} placeholder="/products-chipsy/cornice.png" />
                        </Field>
                    )}
                    {!isTopLevel && (
                        <>
                            <Field label="Subtitle (EN)">
                                <input className={input} value={item.sub || ''} onChange={e => set('sub', e.target.value)} />
                            </Field>
                            <Field label="Subtitle (AR)">
                                <input className={input} dir="rtl" value={item.subAr || ''} onChange={e => set('subAr', e.target.value)} />
                            </Field>
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0 pt-1">
                    <IconButton onClick={() => onMove(-1)} disabled={index === 0} title="Move up">↑</IconButton>
                    <IconButton onClick={() => onMove(1)} disabled={index === total - 1} title="Move down">↓</IconButton>
                    <IconButton onClick={onRemove} title="Remove">×</IconButton>
                </div>
            </div>

            {isTopLevel && (
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-neutral-100 pt-3">
                    <Field label="Dropdown header (EN)">
                        <input className={input} value={item.menuLabel || ''} onChange={e => set('menuLabel', e.target.value)} placeholder="Chipsy Products" />
                    </Field>
                    <Field label="Dropdown header (AR)">
                        <input className={input} dir="rtl" value={item.menuLabelAr || ''} onChange={e => set('menuLabelAr', e.target.value)} />
                    </Field>
                    <Field label="'View all' label (EN)">
                        <input className={input} value={item.viewAllLabel || ''} onChange={e => set('viewAllLabel', e.target.value)} placeholder="View all Chipsy →" />
                    </Field>
                    <Field label="'View all' label (AR)">
                        <input className={input} dir="rtl" value={item.viewAllLabelAr || ''} onChange={e => set('viewAllLabelAr', e.target.value)} />
                    </Field>
                </div>
            )}

            {hasChildren && item.children.length > 0 && (
                <div className="pl-5 border-l-2 border-neutral-100 space-y-3">
                    {item.children.map((child, i) => (
                        <NavItemRow
                            key={child.id}
                            item={child}
                            index={i}
                            total={item.children.length}
                            depth={depth + 1}
                            onChange={next => setChild(i, next)}
                            onRemove={() => removeChild(i)}
                            onMove={dir => moveChild(i, dir)}
                        />
                    ))}
                </div>
            )}

            {isTopLevel && (
                <button type="button" onClick={addChild} className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">
                    + Add dropdown item
                </button>
            )}
        </div>
    );
}

export default function NavTreeEditor({ items, onChange }) {
    function setItem(i, next) {
        onChange(items.map((it, j) => j === i ? next : it));
    }
    function removeItem(i) {
        onChange(items.filter((_, j) => j !== i));
    }
    function moveItem(i, dir) {
        const next = [...items];
        const j = i + dir;
        if (j < 0 || j >= next.length) return;
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    }
    function addItem() {
        onChange([...items, emptyItem(0)]);
    }

    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <NavItemRow
                    key={item.id}
                    item={item}
                    index={i}
                    total={items.length}
                    depth={0}
                    onChange={next => setItem(i, next)}
                    onRemove={() => removeItem(i)}
                    onMove={dir => moveItem(i, dir)}
                />
            ))}
            <button type="button" onClick={addItem} className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors">
                + Add top-level item
            </button>
        </div>
    );
}
