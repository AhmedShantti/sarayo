import Loader from '@/components/landing/Loader';
import LandingNav from '@/components/landing/LandingNavServer';
import Hero from '@/components/landing/Hero';
import Marquee from '@/components/landing/Marquee';
import Stats from '@/components/landing/Stats';
import Features from '@/components/landing/Features';
import ShopSplit from '@/components/landing/ShopSplit';
import HorizontalShowcase from '@/components/landing/HorizontalShowcase';
import CTA from '@/components/landing/CTA';
import LandingFooter from '@/components/landing/LandingFooter';
import { readContent } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
    // Read live content from the store — reflects CMS edits immediately on next load.
    const products = await readContent('products');
    const features = await readContent('features');

    return (
        <main>
            <Loader />
            <LandingNav />
            <Hero products={products} />
            <Marquee />
            <Stats />
            <Features features={features} />
            <ShopSplit />
            <HorizontalShowcase products={products} />
            <CTA />
            <LandingFooter />
        </main>
    );
}
