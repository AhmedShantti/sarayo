import { readContent } from '@/lib/contentStore';
import ProductCatalog from '@/components/pages/ProductCatalog';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = await readContent('chipsy');
    return {
        title: data.meta?.titleEn || 'Chipsy — Sarayo Alwadiya',
        description: data.meta?.descEn || '',
    };
}

export default async function ChipsyRoute() {
    const data = await readContent('chipsy');
    return (
        <main>
            <LandingNav />
            <ProductCatalog data={data} section="chipsy" />
            <LandingFooter />
        </main>
    );
}
