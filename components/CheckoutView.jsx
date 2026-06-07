'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useCart} from '@/lib/CartContext';
import {useToast} from '@/lib/ToastContext';
import {useLanguage} from '@/lib/LanguageContext';
import {placeGuestOrder} from '@/lib/api';

const METHODS = [
    {id: 'card',   tKey: 'checkout.method.card'},
    {id: 'cod',    tKey: 'checkout.method.cod'},
    {id: 'wallet', tKey: 'checkout.method.wallet'},
];

function formatCardNumber(raw) {
    return raw.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
}

export default function CheckoutView() {
    const {cart, hydrated, count, subtotal, clear} = useCart();
    const {showToast} = useToast();
    const {t, locale} = useLanguage();
    const router = useRouter();
    const currency = locale === 'ar' ? 'جنيه' : 'EGP';

    const [customer, setCustomer] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [method, setMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!hydrated) return <div className="cart-body" />;

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

    const shipping = 0;
    const total = subtotal + shipping;

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!customer.trim()) { setError(t('checkout.err.name')); return; }
        if (method === 'card') {
            const digits = cardNumber.replace(/\s/g, '');
            if (digits.length < 12) { setError(t('checkout.err.card')); return; }
            if (!/^\d{2}\s*\/\s*\d{2}$/.test(cardExpiry)) { setError(t('checkout.err.expiry')); return; }
            if (!/^\d{3,4}$/.test(cardCvc)) { setError(t('checkout.err.cvc')); return; }
        }

        setSubmitting(true);
        try {
            // Real guest checkout against the backend — saves the order to the
            // database so it shows up in the admin dashboard.
            const order = await placeGuestOrder({
                customer: customer.trim(),
                email: email.trim() || undefined,
                address: address.trim() || undefined,
                method,
                items: cart.map((it) => ({
                    productId: it.id,
                    quantity: it.qty,
                })),
            });
            clear();
            showToast(method === 'cod' ? t('checkout.toast.cod') : t('checkout.toast.paid'));
            const ref = order.orderNumber || order.id;
            router.push(`/checkout/success?order=${encodeURIComponent(ref)}`);
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    }

    return (
        <div className="cart-body">
            <div className="cart-grid">
                <section className="cart-items" aria-label={t('checkout.aria')}>
                    <form id="checkout-form" onSubmit={handleSubmit} className="checkout-form">
                        <fieldset className="checkout-fieldset">
                            <legend>{t('checkout.contact')}</legend>
                            <label className="checkout-field">
                                <span>{t('checkout.fullName')}</span>
                                <input
                                    type="text"
                                    value={customer}
                                    onChange={(e) => setCustomer(e.target.value)}
                                    required
                                />
                            </label>
                            <label className="checkout-field">
                                <span>{t('checkout.email')}</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                            <label className="checkout-field">
                                <span>{t('checkout.address')}</span>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={2}
                                />
                            </label>
                        </fieldset>

                        <fieldset className="checkout-fieldset">
                            <legend>{t('checkout.payment')}</legend>
                            <div className="method-grid">
                                {METHODS.map((m) => (
                                    <label
                                        key={m.id}
                                        className={'method-option' + (method === m.id ? ' is-selected' : '')}
                                    >
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            value={m.id}
                                            checked={method === m.id}
                                            onChange={() => setMethod(m.id)}
                                        />
                                        <span>{t(m.tKey)}</span>
                                    </label>
                                ))}
                            </div>

                            {method === 'card' && (
                                <div className="card-fields">
                                    <label className="checkout-field">
                                        <span>{t('checkout.cardNumber')}</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            placeholder="4242 4242 4242 4242"
                                            autoComplete="cc-number"
                                            dir="ltr"
                                        />
                                    </label>
                                    <div className="card-row">
                                        <label className="checkout-field">
                                            <span>{t('checkout.expiry')}</span>
                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                                placeholder="MM/YY"
                                                autoComplete="cc-exp"
                                                dir="ltr"
                                            />
                                        </label>
                                        <label className="checkout-field">
                                            <span>{t('checkout.cvc')}</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={cardCvc}
                                                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                placeholder="123"
                                                autoComplete="cc-csc"
                                                dir="ltr"
                                            />
                                        </label>
                                    </div>
                                    <p className="card-hint">
                                        {t('checkout.cardHint')}
                                    </p>
                                </div>
                            )}
                            {method === 'cod' && (
                                <p className="card-hint">{t('checkout.cod.note')}</p>
                            )}
                            {method === 'wallet' && (
                                <p className="card-hint">{t('checkout.wallet.note')}</p>
                            )}
                        </fieldset>

                        {error && <p className="checkout-error">{error}</p>}
                    </form>
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

                    <button
                        type="submit"
                        form="checkout-form"
                        className="btn btn-primary btn-pill btn-checkout"
                        disabled={submitting}
                    >
                        {submitting ? t('checkout.processing') : `${t('checkout.pay')} ${total.toFixed(0)} ${currency}`}
                    </button>
                    <Link href="/cart" className="btn-clear" style={{textAlign: 'center', display: 'block'}}>
                        {t('checkout.editBag')}
                    </Link>
                </aside>
            </div>
        </div>
    );
}
