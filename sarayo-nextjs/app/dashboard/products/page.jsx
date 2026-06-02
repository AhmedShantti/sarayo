'use client';

import {useEffect, useState} from 'react';
import {useLanguage} from '@/lib/LanguageContext';

function StockBadge({status, stock}) {
    const {t} = useLanguage();
    if (status === 'out')
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset bg-rose-50 text-rose-700 ring-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {t('dash.products.out')}
            </span>
        );
    if (status === 'low')
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset bg-amber-50 text-amber-800 ring-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {t('dash.products.low', {n: stock})}
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset bg-emerald-50 text-emerald-700 ring-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {t('dash.products.inStock', {n: stock})}
        </span>
    );
}

export default function ProductsPage() {
    const [products, setProducts] = useState(null);
    const {t, locale} = useLanguage();
    const currency = locale === 'ar' ? 'جنيه' : 'EGP';

    useEffect(() => {
        fetch('/api/products')
            .then((r) => r.json())
            .then((d) => setProducts(d.products || []));
    }, []);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-[26px] font-semibold tracking-tight text-ink">{t('dash.products.title')}</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {products === null ? t('dash.ov.loading') : t('dash.products.count', {n: products.length})}
                </p>
            </div>

            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                                <th className="py-2.5 px-5 font-semibold">{t('dash.products.col.sku')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.products.col.name')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.products.col.price')}</th>
                                <th className="py-2.5 px-5 font-semibold">{t('dash.products.col.stock')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products === null && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-neutral-500">{t('dash.ov.loading')}</td>
                                </tr>
                            )}
                            {products && products.map((p) => (
                                <tr key={p.sku} className="border-t border-neutral-100 hover:bg-neutral-50">
                                    <td className="py-3 px-5 font-mono text-xs text-ink">{p.sku}</td>
                                    <td className="py-3 px-2 text-ink font-medium">{locale === 'ar' ? (p.nameAr || p.name) : p.name}</td>
                                    <td className="py-3 px-2 text-ink">{p.price} {currency}</td>
                                    <td className="py-3 px-5"><StockBadge status={p.status} stock={p.stock} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
