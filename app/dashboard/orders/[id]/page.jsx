'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Link from 'next/link';
import {useLanguage} from '@/lib/LanguageContext';
import {
    getOrderDetail,
    updateOrderStatus,
    STATUS_TRANSITIONS,
} from '@/lib/adminApi';

const STATUS_COLORS = {
    PENDING: 'bg-amber-50 text-amber-800 ring-amber-200',
    CONFIRMED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    PROCESSING: 'bg-sky-50 text-sky-700 ring-sky-200',
    SHIPPED: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    CANCELLED: 'bg-rose-50 text-rose-700 ring-rose-200',
    REFUNDED: 'bg-stone-100 text-stone-700 ring-stone-200',
};

const PAYMENT_COLORS = {
    PAID: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    PENDING: 'bg-amber-50 text-amber-800 ring-amber-200',
    FAILED: 'bg-rose-50 text-rose-700 ring-rose-200',
    REFUNDED: 'bg-stone-100 text-stone-700 ring-stone-200',
};

function Pill({label, cls}) {
    return (
        <span className={'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ' + (cls || 'bg-neutral-100 text-neutral-600 ring-neutral-200')}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {label}
        </span>
    );
}

export default function OrderDetailPage() {
    const {id} = useParams();
    const router = useRouter();
    const {locale} = useLanguage();
    const currency = locale === 'ar' ? 'جنيه' : 'EGP';

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nextStatus, setNextStatus] = useState('');
    const [saving, setSaving] = useState(false);

    async function load() {
        try {
            const data = await getOrderDetail(id);
            setOrder(data);
            setError('');
        } catch (e) {
            setError(e.message || 'Failed to load order');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function applyStatus() {
        if (!nextStatus) return;
        setSaving(true);
        try {
            await updateOrderStatus(id, nextStatus);
            setNextStatus('');
            await load();
        } catch (e) {
            setError(e.message || 'Failed to update status');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p className="text-sm text-neutral-500">Loading order…</p>;
    }
    if (error && !order) {
        return (
            <div className="space-y-4">
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
                <Link href="/dashboard/orders" className="text-sm text-neutral-500 hover:text-ink">← Back to orders</Link>
            </div>
        );
    }

    const addr = order.shippingAddress || {};
    const transitions = STATUS_TRANSITIONS[order.status] || [];

    return (
        <>
            {/* Header */}
            <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
                <div>
                    <Link href="/dashboard/orders" className="text-xs font-medium text-neutral-500 hover:text-ink">← Back to orders</Link>
                    <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-ink font-mono">{order.orderNumber}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Pill label={order.status} cls={STATUS_COLORS[order.status]} />
                    <Pill label={'Payment: ' + order.paymentStatus} cls={PAYMENT_COLORS[order.paymentStatus]} />
                </div>
            </div>

            {error && (
                <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Items + totals */}
                <section className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl overflow-hidden">
                    <header className="px-5 py-4 border-b border-neutral-100">
                        <h2 className="text-sm font-semibold text-ink">Items ({order.itemCount})</h2>
                    </header>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50">
                                <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                                    <th className="py-2.5 px-5 font-semibold">Product</th>
                                    <th className="py-2.5 px-2 font-semibold">Qty</th>
                                    <th className="py-2.5 px-2 font-semibold">Price</th>
                                    <th className="py-2.5 px-5 font-semibold text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(order.items || []).map((it) => (
                                    <tr key={it.id} className="border-t border-neutral-100">
                                        <td className="py-3 px-5">
                                            <div className="flex items-center gap-3">
                                                {it.productImage && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={it.productImage} alt={it.productName} className="w-9 h-9 rounded object-contain bg-neutral-50" />
                                                )}
                                                <span className="font-medium text-ink">{it.productName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-neutral-600">{it.quantity}</td>
                                        <td className="py-3 px-2 text-neutral-600 tabular-nums">{it.price} {currency}</td>
                                        <td className="py-3 px-5 text-ink font-medium tabular-nums text-right">{it.lineTotal} {currency}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-4 border-t border-neutral-100 flex flex-col gap-1.5 items-end text-sm">
                        <Row label="Subtotal" value={`${order.subtotal} ${currency}`} />
                        <Row label="Shipping" value={order.shippingCost ? `${order.shippingCost} ${currency}` : 'Free'} />
                        <Row label="Tax" value={`${order.tax} ${currency}`} />
                        <div className="w-56 border-t border-neutral-200 my-1" />
                        <Row label="Total" value={`${order.total} ${currency}`} bold />
                    </div>
                </section>

                {/* Customer + status */}
                <div className="flex flex-col gap-4">
                    <section className="bg-white border border-neutral-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-ink mb-3">Customer</h2>
                        <dl className="text-sm space-y-1.5">
                            <Field label="Name" value={addr.fullName || order.user?.name} />
                            <Field label="Email" value={addr.email || order.user?.email} />
                            <Field label="Phone" value={addr.phone || order.user?.phone} />
                            <Field label="Address" value={[addr.street, addr.city, addr.state, addr.country].filter((x) => x && x !== 'NA').join(', ')} />
                            <Field label="Payment method" value={(addr.method || '—').toUpperCase()} />
                            {order.notes && <Field label="Notes" value={order.notes} />}
                        </dl>
                    </section>

                    <section className="bg-white border border-neutral-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-ink mb-3">Update status</h2>
                        {transitions.length === 0 ? (
                            <p className="text-sm text-neutral-500">No further status changes allowed (order is {order.status.toLowerCase()}).</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <select
                                    value={nextStatus}
                                    onChange={(e) => setNextStatus(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink bg-white focus:outline-none focus:border-ink"
                                >
                                    <option value="">Select new status…</option>
                                    {transitions.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={applyStatus}
                                    disabled={!nextStatus || saving}
                                    className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Updating…' : 'Update status'}
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

function Row({label, value, bold}) {
    return (
        <div className="flex justify-between w-56">
            <span className="text-neutral-500">{label}</span>
            <span className={bold ? 'text-ink font-semibold' : 'text-ink'}>{value}</span>
        </div>
    );
}

function Field({label, value}) {
    return (
        <div className="flex flex-col">
            <dt className="text-[11px] uppercase tracking-wider text-neutral-400">{label}</dt>
            <dd className="text-ink">{value || '—'}</dd>
        </div>
    );
}
