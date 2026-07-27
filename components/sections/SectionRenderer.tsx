'use client';

import HeroSection from './HeroSection';
import RichTextSection from './RichTextSection';
import StatGridSection from './StatGridSection';
import CardGridSection from './CardGridSection';
import ImageGallerySection from './ImageGallerySection';
import CtaBannerSection from './CtaBannerSection';
import ContactFormSection from './ContactFormSection';
import JobListingsSection from './JobListingsSection';

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ props: any }>> = {
    hero: HeroSection,
    richText: RichTextSection,
    statGrid: StatGridSection,
    cardGrid: CardGridSection,
    imageGallery: ImageGallerySection,
    ctaBanner: CtaBannerSection,
    contactForm: ContactFormSection,
    jobListings: JobListingsSection,
};

export default function SectionRenderer({ sections }: { sections: { id: string; type: string; props: any }[] }) {
    return (
        <>
            {sections.map(section => {
                const Component = SECTION_COMPONENTS[section.type];
                if (!Component) return null;
                return <Component key={section.id} props={section.props} />;
            })}
        </>
    );
}
