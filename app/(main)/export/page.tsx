import { readContent } from '@/lib/contentStore';
import { buildPageMetadata } from '@/lib/seo';
import ExportPage from '@/components/pages/ExportPage';
import LandingNav from '@/components/landing/LandingNavServer';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = await readContent('pages/export');
    return buildPageMetadata(data.meta, { title: 'Export — Sarayo Alwadiya', description: '' });
}

export default async function ExportRoute() {
    const data = await readContent('pages/export');
    return (
        <main>
            <LandingNav />
            <ExportPage data={data} />
            <LandingFooter />
        </main>
    );
}
