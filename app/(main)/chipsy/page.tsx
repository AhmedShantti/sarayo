import { readContent } from '@/lib/contentStore';
import { buildPageMetadata } from '@/lib/seo';
import ProductCatalog from '@/components/pages/ProductCatalog';
import LandingNav from '@/components/landing/LandingNavServer';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = readContent('chipsy');
    return buildPageMetadata(data.meta, { title: 'Chipsy — Sarayo Alwadiya', description: '' });
}

export default function ChipsyRoute() {
    const data = readContent('chipsy');
    return (
        <main>
            <LandingNav />
            <ProductCatalog data={data} section="chipsy" />
            <LandingFooter />
        </main>
    );
}
