import { readContent } from '@/lib/contentStore';
import ExportPage from '@/components/pages/ExportPage';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = readContent('pages/export');
    return {
        title: data.meta?.titleEn || 'Export — Sarayo Alwadiya',
        description: data.meta?.descEn || '',
    };
}

export default function ExportRoute() {
    const data = readContent('pages/export');
    return (
        <main>
            <LandingNav />
            <ExportPage data={data} />
            <LandingFooter />
        </main>
    );
}
