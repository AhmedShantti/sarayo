'use client';

import { PageHero } from '@/components/pages/PageShell';
import { useLanguage } from '@/lib/LanguageContext';

export default function HeroSection({ props }: { props: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    return (
        <PageHero
            chip={ar ? props.chipAr : props.chipEn}
            headline={ar ? props.headlineAr : props.headlineEn}
            sub={ar ? props.subAr : props.subEn}
        />
    );
}
