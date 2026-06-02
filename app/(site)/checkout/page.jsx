import CheckoutView from '@/components/CheckoutView';
import CheckoutHeader from '@/components/CheckoutHeader';

export const metadata = {
    title: 'Checkout — Sarayo Alwadiya',
    description: 'Complete your order',
};

export default function CheckoutPage() {
    return (
        <main className="cart-page">
            <div className="container">
                <CheckoutHeader />
                <CheckoutView />
            </div>
        </main>
    );
}
