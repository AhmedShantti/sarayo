'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';

export default function NewOrderPage() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [customer, setCustomer] = useState('');
    const [email, setEmail] = useState('');
    const [sku, setSku] = useState('');
    const [qty, setQty] = useState(1);
    const [status, setStatus] = useState('pending');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/products')
            .then((r) => r.json())
            .then((d) => {
                const list = d.products || [];
                setProducts(list);
                if (list[0]) setSku(list[0].sku);
            });
    }, []);

    const product = useMemo(() => products.find((p) => p.sku === sku), [products, sku]);
    const total = product ? product.price * qty : 0;

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!customer.trim()) { setError('Customer name is required.'); return; }
        if (!sku) { setError('Pick a product.'); return; }
        if (qty < 1) { setError('Quantity must be at least 1.'); return; }

        setSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    customer: customer.trim(),
                    email: email.trim() || null,
                    sku,
                    items: qty,
                    total,
                    status,
                }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || 'Failed to create order');
            }
            router.push('/dashboard/orders');
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="text-[26px] font-semibold tracking-tight text-ink">New order</h1>
                <p className="text-sm text-neutral-500 mt-1">Place an order on a customer’s behalf.</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white border border-neutral-200 rounded-xl p-6 max-w-2xl flex flex-col gap-5"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Customer name</span>
                        <input
                            type="text"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            placeholder="Mariam Hassan"
                            className="px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Email (optional)</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="customer@example.com"
                            className="px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                        />
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Product</span>
                        <select
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink bg-white focus:outline-none focus:border-ink transition-colors"
                            disabled={products.length === 0}
                        >
                            {products.length === 0 && <option>Loading…</option>}
                            {products.map((p) => (
                                <option key={p.sku} value={p.sku}>
                                    {p.name} — {p.price} EGP
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Quantity</span>
                        <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-1.5 max-w-xs">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Status</span>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink bg-white focus:outline-none focus:border-ink transition-colors"
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                    </select>
                </label>

                <div className="flex items-center justify-between border-t border-neutral-200 pt-4 mt-1">
                    <span className="text-sm text-neutral-500">Total</span>
                    <span className="text-lg font-semibold text-ink">{total} EGP</span>
                </div>

                {error && (
                    <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60"
                    >
                        {submitting ? 'Saving…' : 'Place order'}
                    </button>
                    <Link
                        href="/dashboard/orders"
                        className="px-5 py-2 rounded-lg border border-neutral-300 text-ink text-sm font-medium hover:border-ink transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </>
    );
}
