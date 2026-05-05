import Hero from '@/components/Hero';
import FlavorCategories from '@/components/FlavorCategories';
import BestSellers from '@/components/BestSellers';
import OurStory from '@/components/OurStory';
import Features from '@/components/Features';
import Newsletter from '@/components/Newsletter';

export default function Home() {
    return (
        <>
            <Hero />
            <FlavorCategories />
            <BestSellers />
            <OurStory />
            <Features />
            <Newsletter />
        </>
    );
}
