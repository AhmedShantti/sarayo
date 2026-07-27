import { readContent } from '@/lib/contentStore';
import { buildPageMetadata } from '@/lib/seo';
import ContactPage from '@/components/pages/ContactPage';
import LandingNav from '@/components/landing/LandingNavServer';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = readContent('pages/contact');
    return buildPageMetadata(data.meta, { title: 'Contact Us — Sarayo Alwadiya', description: '' });
}

export default function ContactRoute() {
    const data = readContent('pages/contact');
    return (
        <main>
            <LandingNav />
            <ContactPage data={data} />
            <LandingFooter />
        </main>
    );
}
