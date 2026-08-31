import { readContent } from '@/lib/contentStore';
import { buildPageMetadata } from '@/lib/seo';
import ContactPage from '@/components/pages/ContactPage';
import LandingNav from '@/components/landing/LandingNavServer';
import LandingFooter from '@/components/landing/LandingFooter';


export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = await readContent('pages/contact');
    return buildPageMetadata(data.meta, { title: 'Contact Us — Sarayo Alwadiya', description: '' });
}

export default async function ContactRoute() {
    const data = await readContent('pages/contact');
    return (
        <main>
            <LandingNav />
            <ContactPage data={data} />
            <LandingFooter />
        </main>
    );
}
