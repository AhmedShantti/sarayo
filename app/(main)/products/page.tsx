import type { Metadata } from 'next';
import { readContent } from '@/lib/contentStore';
import LandingNav from '@/components/landing/LandingNavServer';
import ProductsView from '@/components/landing/ProductsView';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Shop — Sarayo Alwadiya',
    description: 'Cornice crisps and our wafer range — made in Egypt.',
};

export default function ProductsPage() {
    const products = readContent('products');
    return (
        <main>
            <LandingNav />
            <ProductsView products={products} />
            <LandingFooter />
        </main>
    );
}
