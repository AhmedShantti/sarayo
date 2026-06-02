import Loader from '@/components/landing/Loader';
import Cursor from '@/components/landing/Cursor';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import Marquee from '@/components/landing/Marquee';
import Stats from '@/components/landing/Stats';
import Features from '@/components/landing/Features';
import HorizontalShowcase from '@/components/landing/HorizontalShowcase';
import CTA from '@/components/landing/CTA';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
    return (
        <main>
            <Loader />
            <Cursor />
            <LandingNav />
            <Hero />
            <Marquee />
            <Stats />
            <Features />
            <HorizontalShowcase />
            <CTA />
            <LandingFooter />
        </main>
    );
}
