'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';

const STATUS_STYLES = {
    paid:     {pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500'},
    shipped:  {pill: 'bg-sky-50 text-sky-700 ring-sky-200',             dot: 'bg-sky-500'},
    pending:  {pill: 'bg-amber-50 text-amber-800 ring-amber-200',       dot: 'bg-amber-500'},
    refunded: {pill: 'bg-stone-100 text-stone-700 ring-stone-200',      dot: 'bg-stone-400'},
};

function StatusPill({status}) {
    const s = STATUS_STYLES[status] || {pill: 'bg-neutral-100 text-neutral-600 ring-neutral-200', dot: 'bg-neutral-400'};
    return (
        <span className={'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ' + s.pill}>
            <span className={'w-1.5 h-1.5 rounded-full ' + s.dot} />
            {status}
        </span>
    );
}

function Delta({value}) {
    if (!value) return <span className="text-[11px] font-medium text-neutral-400">—</span>;
    const positive = value > 0;
    return (
        <span
            className={
                'inline-flex items-center gap-0.5 text-[11px] font-semibold ' +
                (positive ? 'text-emerald-600' : 'text-rose-600')
            }
        >
            <span aria-hidden="true">{positive ? '↑' : '↓'}</span>
            {Math.abs(value).toFixed(1)}%
        </span>
    );
}

const STAT_ICONS = {
    Revenue:  'M12 2 V22 M6 7 H17 a3 3 0 0 1 0 6 H7 a3 3 0 0 0 0 6 H18',
    Orders:   'M5 6 H19 L17 19 H7 Z M9 9 V13 M15 9 V13',
    Products: 'M4 7 L12 3 L20 7 V17 L12 21 L4 17 Z M4 7 L12 11 L20 7 M12 11 V21',
    Users:    'M9 11 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 M5 20 c0-3 3-5 7-5 s7 2 7 5',
};

const RING_COLORS = {
    paid:     '#10b981',
    shipped:  '#0ea5e9',
    pending:  '#f59e0b',
    refunded: '#a8a29e',
};

function StatusRing({breakdown}) {
    const entries = Object.entries(breakdown || {});
    const total = entries.reduce((s, [, n]) => s + n, 0);
    if (!total) return null;

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    const segments = entries.map(([status, count]) => {
        const fraction = count / total;
        const length = circumference * fraction;
        const seg = {
            status,
            count,
            fraction,
            length,
            offset,
            color: RING_COLORS[status] || '#a3a3a3',
        };
        offset += length;
        return seg;
    });

    return (
        <div className="flex items-center gap-5">
            <svg viewBox="0 0 96 96" width="96" height="96" className="shrink-0 -rotate-90">
                <circle cx="48" cy="48" r={radius} fill="none" stroke="#f5f5f5" strokeWidth="10" />
                {segments.map((s) => (
                    <circle
                        key={s.status}
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="10"
                        strokeDasharray={`${s.length} ${circumference}`}
                        strokeDashoffset={-s.offset}
                        strokeLinecap="butt"
                    />
                ))}
            </svg>
            <ul className="flex flex-col gap-2 text-sm flex-1">
                {segments.map((s) => (
                    <li key={s.status} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-neutral-700 capitalize">
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{backgroundColor: s.color}}
                            />
                            {s.status}
                        </span>
                        <span className="text-ink font-medium tabular-nums">{s.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const QUICK_ACTIONS = [
    {
        href: '/dashboard/orders/new',
        title: 'New order',
        sub: 'Create a manual order',
        icon: 'M12 5 V19 M5 12 H19',
    },
    {
        href: '/dashboard/products',
        title: 'Products',
        sub: 'Stock & SKUs',
        icon: 'M4 7 L12 3 L20 7 V17 L12 21 L4 17 Z M4 7 L12 11 L20 7 M12 11 V21',
    },
    {
        href: '/dashboard/users',
        title: 'Users',
        sub: 'Customer directory',
        icon: 'M9 11 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 M5 20 c0-3 3-5 7-5 s7 2 7 5',
    },
];

export default function DashboardOverview() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch('/api/stats').then((r) => r.json()),
            fetch('/api/orders').then((r) => r.json()),
        ]).then(([s, o]) => {
            setStats(s);
            setOrders(o.orders || []);
        });
    }, []);

    const recent = orders.slice(0, 6);
    const top = stats?.topProducts || [];
    const maxRevenue = top.length ? Math.max(...top.map((p) => p.revenue)) : 1;
    const deltas = stats?.deltas || {};

    const cards = stats
        ? [
              {label: 'Revenue',  value: stats.revenue.toLocaleString() + ' EGP', delta: deltas.revenue},
              {label: 'Orders',   value: stats.orders,                            delta: deltas.orders},
              {label: 'Products', value: stats.products,                          delta: deltas.products},
              {label: 'Users',    value: stats.users,                             delta: deltas.users},
          ]
        : [
              {label: 'Revenue',  value: '—'},
              {label: 'Orders',   value: '—'},
              {label: 'Products', value: '—'},
              {label: 'Users',    value: '—'},
          ];

    return (
        <>
            <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">Overview</h1>
                    <p className="text-sm text-neutral-500 mt-1">Live snapshot of your store</p>
                </div>
                <Link
                    href="/dashboard/orders/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path d="M12 5 V19 M5 12 H19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    New order
                </Link>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {cards.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col gap-3 hover:border-neutral-300 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                                {s.label}
                            </span>
                            <span className="inline-flex w-8 h-8 rounded-md bg-neutral-100 items-center justify-center text-neutral-600">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path
                                        d={STAT_ICONS[s.label]}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </div>
                        <span className="text-[26px] font-semibold tracking-tight text-ink leading-none">
                            {s.value}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Delta value={s.delta} />
                            <span className="text-[11px] text-neutral-400">vs last 30d</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status ring + quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <section className="bg-white border border-neutral-200 rounded-xl p-5">
                    <header className="mb-4">
                        <h2 className="text-sm font-semibold text-ink">Order status</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Breakdown across all orders</p>
                    </header>
                    {stats?.statusBreakdown
                        ? <StatusRing breakdown={stats.statusBreakdown} />
                        : <p className="text-sm text-neutral-500">Loading…</p>}
                </section>

                <section className="bg-white border border-neutral-200 rounded-xl p-5 lg:col-span-2">
                    <header className="mb-4">
                        <h2 className="text-sm font-semibold text-ink">Quick actions</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Jump straight in</p>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {QUICK_ACTIONS.map((a) => (
                            <Link
                                key={a.href}
                                href={a.href}
                                className="group flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:border-ink hover:bg-neutral-50 transition-all"
                            >
                                <span className="inline-flex w-9 h-9 rounded-md bg-neutral-100 group-hover:bg-ink group-hover:text-white items-center justify-center text-neutral-600 transition-colors shrink-0">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path
                                            d={a.icon}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <div className="leading-tight">
                                    <span className="block text-sm font-semibold text-ink">{a.title}</span>
                                    <span className="block text-xs text-neutral-500 mt-0.5">{a.sub}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* Recent orders + top sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <section className="bg-white border border-neutral-200 rounded-xl lg:col-span-2 overflow-hidden">
                    <header className="flex items-baseline justify-between px-5 py-4 border-b border-neutral-100">
                        <h2 className="text-sm font-semibold text-ink">Recent orders</h2>
                        <Link
                            href="/dashboard/orders"
                            className="text-xs font-medium text-neutral-500 hover:text-ink transition-colors"
                        >
                            View all →
                        </Link>
                    </header>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50">
                                <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                                    <th className="py-2.5 px-5 font-semibold">Order</th>
                                    <th className="py-2.5 px-2 font-semibold">Customer</th>
                                    <th className="py-2.5 px-2 font-semibold">Items</th>
                                    <th className="py-2.5 px-2 font-semibold">Total</th>
                                    <th className="py-2.5 px-2 font-semibold">Status</th>
                                    <th className="py-2.5 px-5 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-500">Loading orders…</td>
                                    </tr>
                                )}
                                {recent.map((o) => (
                                    <tr key={o.id} className="border-t border-neutral-100 hover:bg-neutral-50 transition-colors">
                                        <td className="py-3 px-5 font-mono text-xs text-ink">{o.id}</td>
                                        <td className="py-3 px-2 text-ink font-medium">{o.customer}</td>
                                        <td className="py-3 px-2 text-neutral-600">{o.items}</td>
                                        <td className="py-3 px-2 text-ink font-medium tabular-nums">{o.total} EGP</td>
                                        <td className="py-3 px-2"><StatusPill status={o.status} /></td>
                                        <td className="py-3 px-5 text-neutral-500 text-xs">{o.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="bg-white border border-neutral-200 rounded-xl p-5">
                    <header className="flex items-baseline justify-between mb-5">
                        <h2 className="text-sm font-semibold text-ink">Top sellers</h2>
                        <span className="text-[11px] uppercase tracking-[0.1em] text-neutral-500">by revenue</span>
                    </header>
                    <ul className="flex flex-col gap-4">
                        {top.length === 0 && (
                            <li className="text-sm text-neutral-500">Loading…</li>
                        )}
                        {top.map((p, idx) => (
                            <li key={p.name} className="flex flex-col gap-2">
                                <div className="flex items-baseline justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm text-ink truncate">
                                        <span className="text-[10px] font-semibold text-neutral-400 w-4 tabular-nums">
                                            {idx + 1}
                                        </span>
                                        <span className="font-medium truncate">{p.name}</span>
                                    </span>
                                    <span className="text-xs font-semibold text-ink shrink-0 tabular-nums">
                                        {p.revenue.toLocaleString()} EGP
                                    </span>
                                </div>
                                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <span
                                        className="block h-full bg-gradient-to-r from-ink to-neutral-700 rounded-full transition-all"
                                        style={{width: `${(p.revenue / maxRevenue) * 100}%`}}
                                    />
                                </div>
                                <span className="text-[11px] text-neutral-500">{p.sold} sold</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </>
    );
}
