'use client';

import { CrunchCTA } from '@/components/pages/PageShell';
import { useLanguage } from '@/lib/LanguageContext';

export default function CtaBannerSection({ props }: { props: any }) {
    const { locale } = useLanguage();
    const ar = locale === 'ar';
    return (
        <CrunchCTA
            title={ar ? props.titleAr : props.titleEn}
            sub={ar ? props.subAr : props.subEn}
            btn1={ar ? props.btn1Ar : props.btn1En}
            btn1Href={props.btn1Href}
            btn2={ar ? props.btn2Ar : props.btn2En}
            btn2Href={props.btn2Href}
        />
    );
}
