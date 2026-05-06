import Link from 'next/link';
import CartView from '@/components/CartView';

export const metadata = {
    title: 'Your Cart — Sarayo Alwadiya',
    description: 'Your shopping cart — Sarayo Alwadiya',
};

export default function CartPage() {
    return (
        <main className="cart-page">
            <div className="container">
                <div className="cart-head">
                    <h1 className="cart-title">Your bag</h1>
                    <Link href="/#products" className="continue-link">
                        ← keep snacking
                    </Link>
                </div>

                <CartView />
            </div>
        </main>
    );
}
