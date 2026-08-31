import { readContent } from '@/lib/contentStore';
import { buildPageMetadata } from '@/lib/seo';
import CareersPage from '@/components/pages/CareersPage';
import LandingNav from '@/components/landing/LandingNavServer';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = readContent('pages/careers');
    return buildPageMetadata(data.meta, { title: 'Careers — Sarayo Alwadiya', description: '' });
}

export default async function CareersRoute() {
    const data = await readContent('pages/careers');
    return (
        <main>
            <LandingNav />
            <CareersPage data={data} />
            <LandingFooter />
        </main>
    );
}
