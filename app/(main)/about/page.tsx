import { readContent } from '@/lib/contentStore';
import AboutPage from '@/components/pages/AboutPage';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = readContent('pages/about');
    return {
        title: data.meta?.titleEn || 'About Us — Sarayo Alwadiya',
        description: data.meta?.descEn || '',
    };
}

export default function AboutRoute() {
    const data = readContent('pages/about');
    return (
        <main>
            <LandingNav />
            <AboutPage data={data} />
            <LandingFooter />
        </main>
    );
}
