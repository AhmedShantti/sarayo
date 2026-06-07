'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useLanguage} from '@/lib/LanguageContext';
import {getOrders} from '@/lib/adminApi';

const STATUS_STYLES = {
    paid:     'bg-emerald-50 text-emerald-700 ring-emerald-200',
    shipped:  'bg-sky-50 text-sky-700 ring-sky-200',
    pending:  'bg-amber-50 text-amber-800 ring-amber-200',
    refunded: 'bg-stone-100 text-stone-700 ring-stone-200',
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

const STATUS_CHIPS = ['all', 'paid', 'shipped', 'pending', 'refunded'];

export default function OrdersPage() {
    const [orders, setOrders] = useState(null);
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const {t, locale} = useLanguage();
    const router = useRouter();
    const currency = locale === 'ar' ? 'جنيه' : 'EGP';

    useEffect(() => {
        getOrders()
            .then(setOrders)
            .catch(() => setOrders([]));
    }, []);

    const filtered = orders
        ? orders.filter((o) => {
              if (statusFilter !== 'all' && o.status !== statusFilter) return false;
              if (!filter) return true;
              const q = filter.toLowerCase();
              return (
                  o.customer.toLowerCase().includes(q) ||
                  String(o.id).toLowerCase().includes(q)
              );
          })
        : [];

    return (
        <>
            <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-[26px] font-semibold tracking-tight text-ink">{t('dash.orders.title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {orders ? t('dash.orders.totalCount', {n: orders.length}) : t('dash.ov.loading')}
                    </p>
                </div>
                <Link
                    href="/dashboard/orders/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path d="M12 5 V19 M5 12 H19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {t('dash.nav.newOrder')}
                </Link>
            </div>

            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-neutral-100 flex flex-wrap items-center gap-3">
                    <input
                        type="search"
                        placeholder={t('dash.orders.search')}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
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
                                        (active
                                            ? 'bg-ink text-white'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')
                                    }
                                >
                                    {t(`status.${s}`)}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                                <th className="py-2.5 px-5 font-semibold">{t('dash.orders.col.order')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.orders.col.customer')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.orders.col.items')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.orders.col.total')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.orders.col.status')}</th>
                                <th className="py-2.5 px-5 font-semibold">{t('dash.orders.col.date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders === null && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-500">{t('dash.ov.loading')}</td>
                                </tr>
                            )}
                            {orders !== null && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-500">
                                        {t('dash.orders.empty')}
                                    </td>
                                </tr>
                            )}
                            {filtered.map((o) => (
                                <tr
                                    key={o.id}
                                    onClick={() => o._id && router.push(`/dashboard/orders/${o._id}`)}
                                    className="border-t border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                                >
                                    <td className="py-3 px-5 font-mono text-xs text-ink">{o.id}</td>
                                    <td className="py-3 px-2 text-ink font-medium">{locale === 'ar' ? (o.customerAr || o.customer) : o.customer}</td>
                                    <td className="py-3 px-2 text-neutral-600">{o.items}</td>
                                    <td className="py-3 px-2 text-ink font-medium">{o.total} {currency}</td>
                                    <td className="py-3 px-2"><StatusPill status={o.status} /></td>
                                    <td className="py-3 px-5 text-neutral-500 text-xs">
                                        <span className="inline-flex items-center gap-2">
                                            {o.date}
                                            <span className="text-neutral-300">→</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
