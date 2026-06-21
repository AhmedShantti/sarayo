'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useLanguage} from '@/lib/LanguageContext';

const ITEMS = [
    {href: '/dashboard',              tKey: 'dash.nav.overview', icon: 'M3 12 L12 4 L21 12 M5 10 V20 H19 V10'},
    {href: '/dashboard/orders',       tKey: 'dash.nav.orders',   icon: 'M5 6 H19 L17 19 H7 Z M9 9 V13 M15 9 V13'},
    {href: '/dashboard/orders/new',   tKey: 'dash.nav.newOrder', icon: 'M12 5 V19 M5 12 H19'},
    {href: '/dashboard/products',     tKey: 'dash.nav.products', icon: 'M4 7 L12 3 L20 7 V17 L12 21 L4 17 Z M4 7 L12 11 L20 7 M12 11 V21'},
    {href: '/dashboard/categories',   tKey: 'dash.nav.categories', icon: 'M4 5 H10 V11 H4 Z M14 5 H20 V11 H14 Z M4 15 H10 V21 H4 Z M14 15 H20 V21 H14 Z'},
    {href: '/dashboard/payments',     tKey: 'dash.nav.payments', icon: 'M3 7 H21 V17 H3 Z M3 11 H21 M7 15 H10'},
    {href: '/dashboard/users',        tKey: 'dash.nav.users',    icon: 'M9 11 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 M5 20 c0-3 3-5 7-5 s7 2 7 5'},
    {href: '/dashboard/content',      tKey: 'dash.nav.content',  icon: 'M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z', divider: true},
];

export default function DashboardNav() {
    const pathname = usePathname();
    const {t} = useLanguage();
    return (
        <nav aria-label={t('dash.navAria')} className="flex-1">
            <ul className="flex flex-col gap-0.5">
                {ITEMS.map(({href, tKey, icon, divider}) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                    return (
                        <li key={href}>
                            {divider && <div className="my-1.5 mx-3 border-t border-neutral-100" />}
                            <Link
                                href={href}
                                className={
                                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ' +
                                    (active
                                        ? 'bg-ink text-white'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-ink')
                                }
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                    <path d={icon} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {t(tKey)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
