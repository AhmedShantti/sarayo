import { readContent } from '@/lib/contentStore';
import { buildPageMetadata } from '@/lib/seo';
import ProductCatalog from '@/components/pages/ProductCatalog';
import LandingNav from '@/components/landing/LandingNavServer';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = await readContent('wafer');
    return buildPageMetadata(data.meta, { title: 'Wafer — Sarayo Alwadiya', description: '' });
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
