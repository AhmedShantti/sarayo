import { readContent } from '@/lib/contentStore';
import ProductCatalog from '@/components/pages/ProductCatalog';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = await readContent('wafer');
    return {
        title: data.meta?.titleEn || 'Wafer — Sarayo Alwadiya',
        description: data.meta?.descEn || '',
    };
}

export default async function WaferRoute() {
    const data = await readContent('wafer');
    return (
        <main>
            <LandingNav />
            <ProductCatalog data={data} section="wafer" />
            <LandingFooter />
        </main>
    );
}
