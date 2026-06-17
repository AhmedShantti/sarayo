import { readContent } from '@/lib/contentStore';
import CareersPage from '@/components/pages/CareersPage';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = await readContent('pages/careers');
    return {
        title: data.meta?.titleEn || 'Careers — Sarayo Alwadiya',
        description: data.meta?.descEn || '',
    };
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
