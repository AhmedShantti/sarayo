import CartView from '@/components/CartView';
import CartHeader from '@/components/CartHeader';

export const metadata = {
    title: 'Your Cart — Sarayo Alwadiya',
    description: 'Your shopping cart — Sarayo Alwadiya',
};

export default function CartPage() {
    return (
        <main className="cart-page">
            <div className="container">
                <CartHeader />
                <CartView />
            </div>
        </main>
    );
}
