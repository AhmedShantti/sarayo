import type { Metadata } from 'next';
import Cursor from '@/components/landing/Cursor';
import LandingNav from '@/components/landing/LandingNav';
import ProductsView from '@/components/landing/ProductsView';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
    title: 'Shop — Sarayo Alwadiya',
    description: 'The full Lay’s lineup by Sarayo Alwadiya. Cut thick, fried crisp, seasoned loud.',
};

export default function ProductsPage() {
    return (
        <main>
            <Cursor />
            <LandingNav />
            <ProductsView />
            <LandingFooter />
        </main>
    );
}
