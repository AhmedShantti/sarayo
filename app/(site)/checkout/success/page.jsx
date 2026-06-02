import CheckoutSuccess from '@/components/CheckoutSuccess';

export const metadata = {
    title: 'Order placed — Sarayo Alwadiya',
};

export default function CheckoutSuccessPage({searchParams}) {
    const orderId = searchParams?.order || '';
    return (
        <main className="cart-page">
            <div className="container">
                <CheckoutSuccess orderId={orderId} />
            </div>
        </main>
    );
}
