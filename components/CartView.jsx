'use client';

import Link from 'next/link';
import {useCart} from '@/lib/CartContext';
import {useToast} from '@/lib/ToastContext';

export default function CartView() {
    const {cart, hydrated, count, subtotal, incItem, decItem, removeItem, clear} = useCart();
    const {showToast} = useToast();

    if (!hydrated) {
        return <div className="cart-body" />;
    }

    if (cart.length === 0) {
        return (
            <div className="cart-body">
                <div className="cart-empty">
                    <h2>Nothing in the bag yet</h2>
                    <p>Pick a flavor or three and start snacking the right way.</p>
                    <Link href="/#products" className="btn btn-primary btn-pill">
                        start snacking
                    </Link>
                </div>
            </div>
        );
    }

    function handleCheckout() {
        showToast('Order placed successfully');
        clear();
    }

    function handleClear() {
        if (confirm('Clear all items from your cart?')) {
            clear();
            showToast('Cart cleared');
        }
    }

    const shipping = 0;
    const total = subtotal + shipping;

    return (
        <div className="cart-body">
            <div className="cart-grid">
                <section className="cart-items" aria-label="Items in cart">
                    <div className="cart-items-head">
                        <span>Item</span>
                        <span>Quantity</span>
                        <span>Price</span>
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
                                <p className="cart-item-meta">{it.price} EGP each</p>
                            </div>
                            <div className="qty-control" role="group" aria-label="Quantity">
                                <button
                                    type="button"
                                    className="qty-btn"
                                    aria-label="Decrease"
                                    onClick={() => decItem(it.id)}
                                >
                                    −
                                </button>
                                <span className="qty-value">{it.qty}</span>
                                <button
                                    type="button"
                                    className="qty-btn"
                                    aria-label="Increase"
                                    onClick={() => incItem(it.id)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="cart-item-price">
                                {(it.price * it.qty).toFixed(0)} EGP
                            </div>
                            <button
                                type="button"
                                className="remove-btn"
                                aria-label={`Remove ${it.name}`}
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

                <aside className="cart-summary" aria-label="Order summary">
                    <h2>Summary</h2>
                    <div className="summary-row">
                        <span>Items ({count})</span>
                        <span>{subtotal.toFixed(0)} EGP</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span className="shipping-free">Free</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row summary-total">
                        <span>Total</span>
                        <span>{total.toFixed(0)} EGP</span>
                    </div>

                    <button
                        className="btn btn-primary btn-pill btn-checkout"
                        onClick={handleCheckout}
                    >
                        place order
                    </button>
                    <button className="btn-clear" onClick={handleClear}>
                        Empty the bag
                    </button>
                </aside>
            </div>
        </div>
    );
}
