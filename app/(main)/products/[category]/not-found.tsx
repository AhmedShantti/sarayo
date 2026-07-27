'use client';

import Link from 'next/link';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { useLanguage } from '@/lib/LanguageContext';

export default function CategoryNotFound() {
    const { locale } = useLanguage();
    const ar = locale === 'ar';

    return (
        <main>
            <LandingNav />
            <section className="px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
                <div className="mx-auto max-w-[1280px]">
                    <h1 className="landing-display text-[clamp(3rem,9vw,7rem)] leading-[0.88] text-white">
                        {ar ? 'القسم غير موجود' : 'Category not found'}
                    </h1>
                    <p className="mt-5 max-w-lg font-grotesk text-base text-white/75">
                        {ar
                            ? 'لا يوجد قسم بهذا الاسم. تصفح التشكيلة الكاملة.'
                            : 'We don’t have a category by that name. Browse the full lineup instead.'}
                    </p>
                    <Link
                        href="/products"
                        data-cursor="hover"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-9 py-4 font-grotesk text-sm font-bold uppercase tracking-wider text-brand-red-deep"
                    >
                        {ar ? 'كل المنتجات' : 'All products'}
                    </Link>
                </div>
            </section>
            <LandingFooter />
        </main>
    );
}
