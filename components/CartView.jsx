'use client';

import Link from 'next/link';
import {useCart} from '@/lib/CartContext';
import {useToast} from '@/lib/ToastContext';
import {useLanguage} from '@/lib/LanguageContext';

export default function CartView() {
    const {cart, hydrated, count, subtotal, incItem, decItem, removeItem, clear} = useCart();
    const {showToast} = useToast();
    const {t, locale} = useLanguage();
    const currency = locale === 'ar' ? 'جنيه' : 'EGP';

    if (!hydrated) {
        return <div className="cart-body" />;
    }

    if (cart.length === 0) {
        return (
            <div className="cart-body">
                <div className="cart-empty">
                    <h2>{t('cart.empty.title')}</h2>
                    <p>{t('cart.empty.body')}</p>
                    <Link href="/#products" className="btn btn-primary btn-pill">
                        {t('cart.empty.cta')}
                    </Link>
                </div>
            </div>
        );
    }

    function handleClear() {
        if (confirm(t('cart.confirmClear'))) {
            clear();
            showToast(t('cart.cleared'));
        }
    }

    const shipping = 0;
    const total = subtotal + shipping;

    return (
        <div className="cart-body">
            <div className="cart-grid">
                <section className="cart-items" aria-label={t('cart.itemsAria')}>
                    <div className="cart-items-head">
                        <span>{t('cart.col.item')}</span>
                        <span>{t('cart.col.qty')}</span>
                        <span>{t('cart.col.price')}</span>
                    </div>
                    {cart.map((it) => (
                        <article key={it.id} className="cart-item">
                            <div className="cart-item-image">
                                <img
                                    className="cart-item-photo"
                                    src="/lays-cheddar.png"
                                    alt={it.name}
                                />
                            </div>
                            <div className="cart-item-info">
                                <h3>{it.name}</h3>
                                <p className="cart-item-meta">{t('cart.priceEach', {price: it.price})}</p>
                            </div>
                            <div className="qty-control" role="group" aria-label={t('cart.qtyAria')}>
                                <button
                                    type="button"
                                    className="qty-btn"
                                    aria-label={t('cart.decAria')}
                                    onClick={() => decItem(it.id)}
                                >
                                    −
                                </button>
                                <span className="qty-value">{it.qty}</span>
                                <button
                                    type="button"
                                    className="qty-btn"
                                    aria-label={t('cart.incAria')}
                                    onClick={() => incItem(it.id)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="cart-item-price">
                                {(it.price * it.qty).toFixed(0)} {currency}
                            </div>
                            <button
                                type="button"
                                className="remove-btn"
                                aria-label={t('cart.removeAria', {name: it.name})}
                                onClick={() => removeItem(it.id)}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14">
                                    <path
                                        d="M6 6 L18 18 M18 6 L6 18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </article>
                    ))}
                </section>

                <aside className="cart-summary" aria-label={t('cart.summaryAria')}>
                    <h2>{t('cart.summary')}</h2>
                    <div className="summary-row">
                        <span>{t('cart.items')} ({count})</span>
                        <span>{subtotal.toFixed(0)} {currency}</span>
                    </div>
                    <div className="summary-row">
                        <span>{t('cart.shipping')}</span>
                        <span className="shipping-free">{t('cart.shipping.free')}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row summary-total">
                        <span>{t('cart.total')}</span>
                        <span>{total.toFixed(0)} {currency}</span>
                    </div>

                    <Link
                        href="/checkout"
                        className="btn btn-primary btn-pill btn-checkout"
                    >
                        {t('cart.checkout')}
                    </Link>
                    <button className="btn-clear" onClick={handleClear}>
                        {t('cart.empty.bag')}
                    </button>
                </aside>
            </div>
        </div>
    );
}
