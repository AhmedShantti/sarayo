import type { Metadata } from 'next';
import LandingNav from '@/components/landing/LandingNavServer';
import ProductsView from '@/components/landing/ProductsView';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Shop — Sarayo Alwadiya',
    description: 'The full Lay’s lineup by Sarayo Alwadiya. Cut thick, fried crisp, seasoned loud.',
};

export default function ProductsPage() {
    return (
        <main>
            <LandingNav />
            <ProductsView />
            <LandingFooter />
        </main>
    );
}
