import { readContent } from '@/lib/contentStore';
import ContactPage from '@/components/pages/ContactPage';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const data = readContent('pages/contact');
    return {
        title: data.meta?.titleEn || 'Contact Us — Sarayo Alwadiya',
        description: data.meta?.descEn || '',
    };
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
