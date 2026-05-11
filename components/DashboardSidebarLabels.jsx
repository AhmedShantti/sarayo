'use client';

import Link from 'next/link';
import {useLanguage} from '@/lib/LanguageContext';

export default function DashboardSidebarLabels({children}) {
    const {t} = useLanguage();
    return (
        <>
            <Link
                href="/"
                className="flex items-center gap-3 px-5 py-5 border-b border-neutral-200 group"
            >
                <span className="inline-flex w-9 h-9 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-50 items-center justify-center ring-1 ring-neutral-200 group-hover:ring-ink transition-all">
                    <img src="/images.png" alt={t('a11y.brandShort')} className="w-7 h-7 object-contain" />
                </span>
                <div className="leading-tight">
                    <span className="block text-sm font-semibold tracking-tight">{t('dash.brand')}</span>
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-neutral-500 mt-0.5">{t('dash.admin')}</span>
                </div>
            </Link>

            <div className="flex-1 px-3 py-4 overflow-y-auto">
                <span className="block px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    {t('dash.workspace')}
                </span>
                {children}
            </div>

            <div className="border-t border-neutral-200 px-5 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 hover:text-ink transition-colors inline-flex items-center gap-1.5"
                >
                    {t('dash.backToSite')}
                </Link>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t('dash.live')}
                </span>
            </div>
        </>
    );
}
