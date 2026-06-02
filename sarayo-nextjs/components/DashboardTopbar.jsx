'use client';

import {usePathname} from 'next/navigation';
import {useLanguage} from '@/lib/LanguageContext';
import LangToggle from '@/components/LangToggle';

const TITLE_KEYS = {
    '/dashboard':            'dash.nav.overview',
    '/dashboard/orders':     'dash.nav.orders',
    '/dashboard/orders/new': 'dash.nav.newOrder',
    '/dashboard/products':   'dash.nav.products',
    '/dashboard/payments':   'dash.nav.payments',
    '/dashboard/users':      'dash.nav.users',
};

export default function DashboardTopbar() {
    const pathname = usePathname();
    const {t, locale} = useLanguage();
    const title = TITLE_KEYS[pathname] ? t(TITLE_KEYS[pathname]) : t('dash.title');
    const today = new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="bg-white border-b border-neutral-200">
            <div className="px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-medium">{t('dash.brand')}</span>
                    <span className="text-neutral-300">/</span>
                    <span className="text-ink font-medium">{title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 hidden sm:inline">{today}</span>
                    <LangToggle className="text-neutral-700 hover:text-ink" />
                </div>
            </div>
        </div>
    );
}
