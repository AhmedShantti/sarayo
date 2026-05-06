'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const ITEMS = [
    {href: '/dashboard',            label: 'Overview',  icon: 'M3 12 L12 4 L21 12 M5 10 V20 H19 V10'},
    {href: '/dashboard/orders',     label: 'Orders',    icon: 'M5 6 H19 L17 19 H7 Z M9 9 V13 M15 9 V13'},
    {href: '/dashboard/orders/new', label: 'New order', icon: 'M12 5 V19 M5 12 H19'},
    {href: '/dashboard/products',   label: 'Products',  icon: 'M4 7 L12 3 L20 7 V17 L12 21 L4 17 Z M4 7 L12 11 L20 7 M12 11 V21'},
    {href: '/dashboard/users',      label: 'Users',     icon: 'M9 11 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 M5 20 c0-3 3-5 7-5 s7 2 7 5'},
];

export default function DashboardNav() {
    const pathname = usePathname();
    return (
        <nav aria-label="Dashboard navigation" className="flex-1">
            <ul className="flex flex-col gap-0.5">
                {ITEMS.map(({href, label, icon}) => {
                    const active = pathname === href;
                    return (
                        <li key={href}>
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
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
