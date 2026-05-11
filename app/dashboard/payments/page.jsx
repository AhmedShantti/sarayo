'use client';

import {useEffect, useMemo, useState} from 'react';
import {useLanguage} from '@/lib/LanguageContext';

const STATUS_STYLES = {
    succeeded: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    pending:   'bg-amber-50 text-amber-800 ring-amber-200',
    refunded:  'bg-stone-100 text-stone-700 ring-stone-200',
    failed:    'bg-rose-50 text-rose-700 ring-rose-200',
};

const METHOD_LABEL_KEYS = {
    card:   'dash.payments.method.card',
    cod:    'dash.payments.method.cod',
    wallet: 'dash.payments.method.wallet',
};

function StatusPill({status}) {
    const {t} = useLanguage();
    return (
        <span className={'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ' + (STATUS_STYLES[status] || 'bg-neutral-100 text-neutral-600 ring-neutral-200')}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {t(`status.${status}`) || status}
        </span>
    );
}

const STATUS_CHIPS = ['all', 'succeeded', 'pending', 'refunded', 'failed'];
const METHOD_CHIPS = ['all', 'card', 'cod', 'wallet'];

export default function PaymentsPage() {
    const [data, setData] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [query, setQuery] = useState('');
    const {t, locale} = useLanguage();
    const currency = locale === 'ar' ? 'جنيه' : 'EGP';

    useEffect(() => {
        fetch('/api/payments').then((r) => r.json()).then(setData);
    }, []);

    const payments = data?.payments || [];
    const stats = data?.stats || {};

    const filtered = useMemo(() => {
        return payments.filter((p) => {
            if (statusFilter !== 'all' && p.status !== statusFilter) return false;
            if (methodFilter !== 'all' && p.method !== methodFilter) return false;
            if (query) {
                const q = query.toLowerCase();
                if (
                    !p.id.toLowerCase().includes(q) &&
                    !(p.orderId || '').toLowerCase().includes(q) &&
                    !p.customer.toLowerCase().includes(q)
                ) return false;
            }
            return true;
        });
    }, [payments, statusFilter, methodFilter, query]);

    const cards = [
        {labelKey: 'dash.payments.kpi.received', value: (stats.totalReceived || 0).toLocaleString() + ' ' + currency, tint: 'emerald'},
        {labelKey: 'dash.payments.kpi.pending',  value: (stats.pending       || 0).toLocaleString() + ' ' + currency, tint: 'amber'},
        {labelKey: 'dash.payments.kpi.refunded', value: (stats.refunded      || 0).toLocaleString() + ' ' + currency, tint: 'stone'},
        {labelKey: 'dash.payments.kpi.failed',   value: stats.failedCount    || 0,                                    tint: 'rose'},
    ];

    const tintRing = {
        emerald: 'bg-emerald-50 text-emerald-700',
        amber:   'bg-amber-50 text-amber-700',
        stone:   'bg-stone-100 text-stone-700',
        rose:    'bg-rose-50 text-rose-700',
    };

    const methodTotals = stats.byMethod || {};
    const methodMax = Math.max(1, ...Object.values(methodTotals));
    const chipLabel = (s, kind) => {
        if (s === 'all') return t('status.all');
        if (kind === 'method') return t(METHOD_LABEL_KEYS[s] || `status.${s}`);
        return t(`status.${s}`);
    };

    return (
        <>
            <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">{t('dash.payments.title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {data ? t('dash.payments.totalCount', {n: payments.length}) : t('dash.ov.loading')}
                    </p>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {cards.map((c) => (
                    <div
                        key={c.labelKey}
                        className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col gap-3 hover:border-neutral-300 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                                {t(c.labelKey)}
                            </span>
                            <span className={'inline-flex w-8 h-8 rounded-md items-center justify-center ' + tintRing[c.tint]}>
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M3 7 H21 V17 H3 Z M3 11 H21 M7 15 H10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <span className="text-[26px] font-semibold tracking-tight text-ink leading-none">
                            {c.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* By method breakdown */}
            <section className="bg-white border border-neutral-200 rounded-xl p-5 mb-6">
                <header className="mb-4">
                    <h2 className="text-sm font-semibold text-ink">{t('dash.payments.byMethod')}</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">{t('dash.payments.byMethodSub')}</p>
                </header>
                <ul className="flex flex-col gap-3">
                    {Object.keys(METHOD_LABEL_KEYS).map((m) => {
                        const v = methodTotals[m] || 0;
                        return (
                            <li key={m} className="flex flex-col gap-1.5">
                                <div className="flex items-baseline justify-between text-sm">
                                    <span className="text-ink font-medium">{t(METHOD_LABEL_KEYS[m])}</span>
                                    <span className="text-ink tabular-nums">{v.toLocaleString()} {currency}</span>
                                </div>
                                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <span
                                        className="block h-full bg-gradient-to-r from-ink to-neutral-700 rounded-full transition-all"
                                        style={{width: `${(v / methodMax) * 100}%`}}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* Payments table */}
            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-neutral-100 flex flex-wrap items-center gap-3">
                    <input
                        type="search"
                        placeholder={t('dash.payments.search')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 min-w-[200px] max-w-sm px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-ink placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-ink transition-colors"
                    />
                    <div className="flex flex-wrap gap-1.5">
                        {STATUS_CHIPS.map((s) => {
                            const active = statusFilter === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatusFilter(s)}
                                    className={
                                        'px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ' +
                                        (active ? 'bg-ink text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')
                                    }
                                >
                                    {chipLabel(s, 'status')}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {METHOD_CHIPS.map((s) => {
                            const active = methodFilter === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setMethodFilter(s)}
                                    className={
                                        'px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ring-1 ring-inset ' +
                                        (active ? 'bg-ink text-white ring-ink' : 'bg-white text-neutral-600 ring-neutral-200 hover:bg-neutral-100')
                                    }
                                >
                                    {chipLabel(s, 'method')}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                                <th className="py-2.5 px-5 font-semibold">{t('dash.payments.col.payment')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.payments.col.order')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.payments.col.customer')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.payments.col.method')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.payments.col.amount')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.payments.col.status')}</th>
                                <th className="py-2.5 px-5 font-semibold">{t('dash.payments.col.date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data === null && (
                                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-neutral-500">{t('dash.ov.loading')}</td></tr>
                            )}
                            {data !== null && filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-neutral-500">{t('dash.payments.empty')}</td></tr>
                            )}
                            {filtered.map((p) => (
                                <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                                    <td className="py-3 px-5 font-mono text-xs text-ink">{p.id}</td>
                                    <td className="py-3 px-2 font-mono text-xs text-neutral-600">{p.orderId || '—'}</td>
                                    <td className="py-3 px-2 text-ink font-medium">{locale === 'ar' ? (p.customerAr || p.customer) : p.customer}</td>
                                    <td className="py-3 px-2 text-neutral-700">
                                        {t(METHOD_LABEL_KEYS[p.method]) || p.method}
                                        {p.last4 && <span className="text-neutral-400"> · ••••{p.last4}</span>}
                                    </td>
                                    <td className="py-3 px-2 text-ink font-medium tabular-nums">{p.amount.toLocaleString()} {currency}</td>
                                    <td className="py-3 px-2"><StatusPill status={p.status} /></td>
                                    <td className="py-3 px-5 text-neutral-500 text-xs">{p.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
