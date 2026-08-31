import { readContent } from '@/lib/contentStore';
import { buildPageMetadata } from '@/lib/seo';
import AboutPage from '@/components/pages/AboutPage';
import LandingNav from '@/components/landing/LandingNavServer';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = readContent('pages/about');
    return buildPageMetadata(data.meta, { title: 'About Us — Sarayo Alwadiya', description: '' });
}

export default async function AboutRoute() {
    const data = await readContent('pages/about');
    return (
        <main>
            <LandingNav />
            <AboutPage data={data} />
            <LandingFooter />
        </main>
    );
}
